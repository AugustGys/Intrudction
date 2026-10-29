const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('./db');

const app = express();
app.use(cors()); // 开发期放开跨域；上线后可改为 cors({ origin: '你的前端域名' })
// 头像支持 Base64，放宽请求体上限
app.use(express.json({ limit: '10mb' }));

/* ─── 鉴权中间件：校验 Authorization: Bearer <token> ─── */
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: '未登录' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: '登录已过期' });
  }
}

/* ─── 登录 ─── */
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: '缺少用户名或密码' });

  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  const user = rows[0];
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  res.json({ token });
});

/* ═══════════════════════════════════════════════════════
 * 通用 RESTful 路由工厂
 * GET 公开；POST/PUT/DELETE 需登录（messages 的 POST 除外——访客留言）
 * ═══════════════════════════════════════════════════════ */
function crudRoutes(path, table, fields) {
  // 列表（按 id 倒序，新的在前）
  app.get(`/api/${path}`, async (_req, res) => {
    const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY id DESC`);
    res.json(rows);
  });

  // 新增（需登录）
  app.post(`/api/${path}`, auth, async (req, res) => {
    const values = fields.map((f) => req.body[f] ?? null);
    const [result] = await pool.query(
      `INSERT INTO ${table} (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`,
      values
    );
    res.status(201).json({ id: result.insertId });
  });

  // 修改（需登录）
  app.put(`/api/${path}/:id`, auth, async (req, res) => {
    const values = fields.map((f) => req.body[f] ?? null);
    const sets = fields.map((f) => `${f} = ?`).join(',');
    await pool.query(`UPDATE ${table} SET ${sets} WHERE id = ?`, [...values, req.params.id]);
    res.json({ ok: true });
  });

  // 删除（需登录）
  app.delete(`/api/${path}/:id`, auth, async (req, res) => {
    await pool.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
    res.json({ ok: true });
  });
}

crudRoutes('projects', 'projects', ['title', 'description', 'tech_stack', 'category']);
crudRoutes('posts', 'posts', ['date', 'title', 'summary']);
crudRoutes('messages', 'messages', ['name', 'content']);

/* ─── 特例：访客留言（无需登录，覆写上面的受保护 POST 前先注册） ─── */
// 注意：Express 按注册顺序匹配，此路由必须在 crudRoutes('messages') 的 POST 之前才生效。
// 为避免歧义，这里用独立路径：
app.post('/api/guestbook', async (req, res) => {
  const { name, content } = req.body || {};
  if (!name?.trim() || !content?.trim()) return res.status(400).json({ error: '昵称和留言不能为空' });
  if (content.length > 500) return res.status(400).json({ error: '留言过长' });
  const [result] = await pool.query('INSERT INTO messages (name, content) VALUES (?, ?)', [
    name.trim(),
    content.trim(),
  ]);
  res.status(201).json({ id: result.insertId });
});

/* ─── 个人信息（settings）：GET 公开，PUT 需登录 ─── */
app.get('/api/settings', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM settings ORDER BY id LIMIT 1');
  const row = rows[0];
  if (!row) return res.json(null);

  let honors = [];
  try {
    honors = row.honors ? JSON.parse(row.honors) : [];
  } catch {
    honors = [];
  }
  res.json({
    // 后台个人信息页字段
    name: row.name ?? null,
    title: row.title ?? null,
    tagline: row.tagline ?? null,
    email: row.email ?? null,
    bio: row.bio ?? null,
    avatar: row.avatar ?? null,
    // 前台「关于我」档案卡仍在使用的字段
    age: row.age,
    location: row.location,
    major: row.major,
    hobbies: row.hobbies,
    monologue: row.monologue,
    honors,
    // 首页卡片「摘录」与「在读」
    excerpt_text: row.excerpt_text ?? null,
    excerpt_from: row.excerpt_from ?? null,
    reading_title: row.reading_title ?? null,
    reading_author: row.reading_author ?? null,
    reading_progress: row.reading_progress ?? null,
  });
});

app.put('/api/settings', auth, async (req, res) => {
  const body = req.body || {};
  // 只更新请求中出现的字段，避免前后台字段互相覆盖
  const allowed = [
    'name', 'title', 'tagline', 'email', 'bio', 'avatar',
    'age', 'location', 'major', 'hobbies', 'monologue', 'honors',
    'excerpt_text', 'excerpt_from', 'reading_title', 'reading_author', 'reading_progress',
  ];
  const fields = allowed.filter((key) => Object.prototype.hasOwnProperty.call(body, key));
  if (!fields.length) return res.status(400).json({ error: '没有可更新的字段' });

  const values = fields.map((key) => {
    if (key === 'honors') return JSON.stringify(Array.isArray(body.honors) ? body.honors : []);
    return body[key] ?? null;
  });

  const [rows] = await pool.query('SELECT id FROM settings ORDER BY id LIMIT 1');
  if (rows[0]) {
    const sets = fields.map((key) => `${key} = ?`).join(', ');
    await pool.query(`UPDATE settings SET ${sets} WHERE id = ?`, [...values, rows[0].id]);
  } else {
    await pool.query(
      `INSERT INTO settings (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`,
      values
    );
  }
  res.json({ ok: true });
});

/* ─── 健康检查 ─── */
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// 统一错误兜底：把真实原因返出来，方便定位（上线后可只保留通用提示）
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.sqlMessage || err.message || '服务器内部错误' });
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => console.log(`API server running: http://localhost:${PORT}`));
