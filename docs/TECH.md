# 技术文档 — My Introduction 数字花园

> 版本：**v2.0** ｜ 更新日期：2026-10-29 ｜ 对应代码：`my-intruduction@0.1.0`
> 配套文档：[PRD.md](./PRD.md)（产品需求与验收标准）

---

## 1. 系统总览

前后端分离的个人站点：React SPA 负责展示与后台界面，Express 提供 JSON API，MySQL 持久化内容。

```
┌──────────────────────────────┐        ┌──────────────────────────────┐
│  浏览器（Vite / React SPA）  │        │   Node.js（Express 5）        │
│                              │  HTTP  │                              │
│  前台 5 路由  ───────────────┼───────►│  /api/login   JWT 签发        │
│  后台 5 路由  ───────────────┼───────►│  /api/projects /posts /...   │
│  axios 双实例（公开 / 带令牌）│        │  /api/guestbook /settings    │
└──────────────┬───────────────┘        └──────────────┬───────────────┘
               │ 静态资源                                │ mysql2 连接池
               ▼                                        ▼
        public/ 图片、光标                       MySQL 8 · my_garden（5 表）
```

| 运行部件 | 地址 | 启动方式 |
|---|---|---|
| 前端开发服务器 | `http://localhost:5173` | `npm run dev` |
| 后端 API | `http://localhost:3001` | `cd server && npm run dev` |
| 数据库 | `localhost:3306` | 手动安装 MySQL，执行 `server/init.sql` |

---

## 2. 技术栈

### 2.1 前端

| 类别 | 选型 | 版本 |
|---|---|---|
| 框架 | React | 18.3.1 |
| 语言 | TypeScript（`strict`、`noUnusedLocals`、`noUnusedParameters`） | 5.6.3 |
| 构建 | Vite | 5.4.11 |
| 路由 | react-router-dom | 7.18.5 |
| HTTP | axios | 1.21.0 |
| 样式 | CSS Modules + 全局 CSS 变量 | 原生 |
| 字体 | Google Fonts：Fraunces / Noto Serif SC / JetBrains Mono / Caveat | CDN |

### 2.2 后端

| 类别 | 选型 | 版本 |
|---|---|---|
| 运行时 | Node.js（CommonJS） | — |
| Web | Express | 5.3.0 |
| 数据库驱动 | mysql2/promise（连接池） | 3.24.6 |
| 密码哈希 | bcryptjs | 3.0.3 |
| 令牌 | jsonwebtoken | 9.0.3 |
| 跨域 | cors | 2.8.6 |
| 环境变量 | dotenv | 18.0.9 |

---

## 3. 工程结构与启动

### 3.1 目录

```
MyIntruduction/
├── index.html                 # 字体外链、#root
├── vite.config.ts             # React 插件 + CSS Modules 命名规则
├── tsconfig.app.json          # 严格模式
├── public/
│   ├── paper-bg.png           # 牛皮纸背景（2.8MB）
│   ├── cursors/               # quill.svg / gear.svg
│   └── images/
│       ├── profile.jpg        # Hero 肖像
│       └── carousel/          # plate-01~03.jpg（轮播，约 200–250KB/张）
├── docs/
│   ├── PRD.md                 # 需求文档
│   └── TECH.md                # 本文档
├── server/
│   ├── index.js               # Express 入口与全部路由
│   ├── db.js                  # mysql2 连接池
│   ├── init.sql               # 建库建表 + 种子数据
│   ├── .env.example           # 环境变量模板（.env 已被 gitignore）
│   └── package.json
└── src/
    ├── main.tsx               # 挂载 + 全局样式
    ├── App.tsx                # 路由装配（前台 / 后台）
    ├── App.module.css
    ├── api/index.ts           # axios 实例、类型、全部接口函数
    ├── styles/                # design-tokens.css / global.css
    ├── data/fragments.ts      # 生活碎片静态数据
    ├── pages/                 # Home / Works / Notes / Guestbook / About
    ├── components/            # 前台组件（见 §4.2）
    └── admin/                 # 后台组件（见 §4.2）
```

### 3.2 命令

```bash
# 前端
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build，产物 dist/
npm run preview    # 预览生产构建

# 后端
cd server
npm install
cp .env.example .env   # 填入 DB 与 JWT 配置
npm run dev            # node --watch index.js
npm start              # 生产启动
```

### 3.3 CSS Modules 命名

`vite.config.ts` 中：

```ts
css: {
  modules: {
    generateScopedName: '[name]__[local]__[hash:base64:5]',
  },
}
```

因此浏览器里类名形如 `HeroCarousel__stage__ab12c`，便于用 `[class*="stage"]` 在自动化脚本中定位。

---

## 4. 前端架构

### 4.1 路由装配（`src/App.tsx`）

```
<BrowserRouter>
  <ScrollToTop />                 // 路由变化时 scrollTo(0,0)
  <PaperBackground />             // 全局：fixed 纸纹(z0) + 暗角(z1)

  /admin                          AdminLogin（独立于前台外壳）
  /admin/dashboard/*              RequireAuth → AdminLayout → 各管理页
  其余路径                        PublicLayout
                                  ├─ EdgeDecorations（fixed，z2）
                                  └─ div.root（z-index:10）
                                     ├─ Nav（fixed，z100）
                                     ├─ main > Outlet
                                     └─ Footer
</BrowserRouter>
```

要点：

- `PaperBackground` 在路由之外，前台与后台共享同一张纸背景。
- 后台不渲染 `Nav / Footer / EdgeDecorations`，用 `AdminLayout` 的书脊侧栏替代。
- `*` 兜底路由回首页。

### 4.2 组件职责

| 组件 | 类型 | 职责 |
|---|---|---|
| `PaperBackground` | 全局 | fixed 纸纹 + 径向暗角 |
| `EdgeDecorations` | 全局 | 宽屏边缘 marginalia / 准星 / 装订孔 |
| `Nav` | 全局 | 5 路由导航，当前项高亮 |
| `Footer` | 全局 | 版权与社交链接 |
| `Hero` | 首页 | 水印、轮播、标题、简介、肖像拍立得 |
| `HeroCarousel` | 首页 | 全幅轮播 + 融合层 + 手工剪贴装饰 |
| `FillerCards` | 首页 | 时钟 / 摘录 / 月历 / 在读 / 天气 |
| `ProjectIndex` | 作品 | 工程档案列表（读 API） |
| `FragmentGrid` | 作品 | Bento 网格 + 加载错峰 |
| `FragmentCard` | 作品 | 单张碎片卡（滤镜图 / 印章 / 页码） |
| `BlogList` | 介绍 | 手记目录，原地展开（读 API） |
| `AboutMeCard` | 介绍 | 个人档案卡（读 settings） |
| `AboutSection` | 关于 | 静态手写信 + 邮戳 |
| `ScrollToTop` | 全局 | 路由回顶 |
| `AdminLogin` | 后台 | 通行证登录 |
| `AdminLayout` | 后台 | 书脊侧栏 + Outlet |
| `AdminDashboard` | 后台 | 数量统计 + 快捷入口 |
| `AdminProfile` | 后台 | 个人信息表单（含头像 Base64） |
| `AdminProjects` | 后台 | 项目 CRUD + 档案弹窗 |
| `AdminPosts` | 后台 | 手记 CRUD + 档案弹窗 |
| `AdminMessages` | 后台 | 留言列表 + 删除 |
| `ArchiveModal` | 后台 | 通用档案卡弹窗（Esc / 遮罩关闭） |
| `RequireAuth` | 后台 | 无令牌重定向 `/admin` |

### 4.3 样式体系

- **设计变量**：`design-tokens.css` 定义色板、间距、缓动、`--nav-height: 64px`。
- **全局样式**：`global.css` 负责 reset、字体栈、选中色、`prefers-reduced-motion`、自定义光标、`body::before/after` 水印。
- **组件样式**：每个组件一个 `*.module.css`，类名局部作用域；跨组件共享的排版零件放在 `admin/admin.module.css`（后台）。
- **不使用** Tailwind / CSS-in-JS / UI 组件库。

### 4.4 z-index 分层契约

| 层 | z-index | 归属 | 约束 |
|---|---|---|---|
| 纸纹 | 0 | `PaperBackground.imgLayer` | fixed、`pointer-events:none` |
| 暗角 | 1 | `PaperBackground.vignette` | fixed、`pointer-events:none` |
| 边缘装饰 | 2 | `EdgeDecorations.layer` | fixed、`pointer-events:none` |
| 内容根 | 10 | `App.module.css .root`（后台 `.shell` 同值） | 盖住背景装饰 |
| 后台侧栏 | 20 | `AdminLayout.sidebar` | fixed |
| 导航 | 100 | `Nav.nav` | fixed |
| 轮播内部 | 1–6 | `viewport::after` / `paperTint` / `fade` / 箭头 / 页码 / `ornaments` | 全部在 `.stage` 内 |

**混合隔离注意**：`App .root` 的 `position: relative; z-index: 10` 会创建层叠上下文与混合隔离组，外部 fixed 纸纹无法被内部元素的 `mix-blend-mode` 采样。因此轮播的 multiply 作用在纸色叠印层（`.paperTint`）而非 `<img>` 上，与图片相乘后视觉等效。

新增 fixed/absolute 装饰必须遵循上表并加 `pointer-events: none`，否则会拦截点击。

### 4.5 数据获取与状态

`src/api/index.ts`：

- `api`：公开读取实例，`baseURL = http://localhost:3001/api`，超时 10s。
- `authedApi`：写操作实例，超时 15s，请求拦截器自动附加 `Authorization: Bearer <token>`。
- 令牌键：`localStorage.admin_token`；`getToken / setToken / clearToken`。
- 类型：`ProjectRow / PostRow / MessageRow / Settings / Honor / ProjectInput / PostInput`。
- 错误策略：
  - 公开读取失败 → 组件内展示「请确认后端已在 3001 端口运行」；
  - 后台写失败且 HTTP 401 → `clearToken()` + `navigate('/admin')`；
  - 其他错误优先取 `err.response.data.error`。
- 组件用 `alive` 布尔标记避免卸载后 setState；无状态管理库。

### 4.6 关键实现

#### 4.6.1 全幅轮播（`HeroCarousel`）

- 结构：

```
.band (relative, z1)
├─ .stage (relative, 100%, height clamp)
│  ├─ .viewport (role=region/tabindex=0)
│  │  ├─ .slide ×3（opacity 交叉淡入 + scale 1.035→1）
│  │  ├─ .arrowPrev / .arrowNext（z4）
│  │  └─ .dots（z5，role=tablist）
│  ├─ .paperTint（z2，multiply 叠印）
│  └─ .fade（z3，底边纸色渐变）
└─ .ornaments (absolute inset:0, z6, pointer-events:none)
   ├─ .tapeLeft / .tapeRight
   ├─ .figSlip（FIG 编号取 active）
   └─ .divider（两段渐隐线 + ◇）
```

- 轮播逻辑：`active` 状态 + `setInterval(5000)`；依赖 `[reduced, focused, tabHidden, active]`，每次切页重置计时。
- 暂停：`visibilitychange` 写 `tabHidden`；`focus` 时仅当 `target.matches(':focus-visible')` 才暂停（避免鼠标点击后永久暂停）；`useReducedMotion()` 监听媒体查询。
- 切换：`go(direction)` 取模；触摸 `touchStartX`（阈值 40px）；`onKeyDown` 左右键。
- 图片：显式 `width/height`、`loading="lazy"`、`decoding="async"`、`draggable={false}`、逐帧 `object-position`。
- 过渡：opacity 720ms、transform 1200ms，统一 `--ease-editorial`；减动效时关闭。

#### 4.6.2 装饰层的定位同步

分割线为了始终距 Hero 文字区约 40px，使用与 `Hero.module.css .inner` 相同的 clamp：

```css
/* Hero */
.inner { margin: clamp(56px, 9vh, 104px) auto 0; }

/* HeroCarousel */
.divider {
  position: absolute;
  bottom: calc(40px - clamp(56px, 9vh, 104px));
}
```

修改任一 clamp 时两处必须同步。

#### 4.6.3 复古融合滤镜

轮播：

```css
.image { filter: sepia(0.4) contrast(1.05) brightness(0.95); }
.paperTint {
  background-color: rgba(178, 151, 112, 0.4);
  mix-blend-mode: multiply;
}
```

碎片卡：

```css
.picture {
  filter: sepia(0.7) grayscale(0.4) contrast(1.1) brightness(0.9);
  mix-blend-mode: multiply;
  opacity: 0.9;
}
```

#### 4.6.4 首页卡片数据流

- `FillerCards` 挂载时 `getSettings()`：
  - `excerpt_text` 非空 → 替换摘录卡，`excerpt_from` 为空时用默认「— 摘录」；
  - `reading_title` 非空 → 替换在读卡，作者 / 进度可空；
  - 请求失败 → 保持默认文案，不显示错误。
- 时钟每秒更新；月历按 `new Date()` 计算首日偏移与当月天数。
- 天气为静态常量（`PLACEHOLDER`）。

#### 4.6.5 后台 CRUD 弹窗

- `AdminProjects / AdminPosts` 结构相同：列表状态 + `modalOpen` + `editing` + `form` + `formError` + `saving`。
- 编辑时把行数据灌入表单；新增使用空模板 / 当天日期。
- 提交后：成功关闭弹窗、`fetchRows()` 刷新、显示编号提示；失败留在弹窗内并展示错误。
- 删除使用 `window.confirm`（阻塞式），成功后刷新。
- `ArchiveModal` 监听 `Escape`，遮罩 `onMouseDown` 判断 `event.target === currentTarget` 关闭；保存中由父组件阻止关闭。

#### 4.6.6 头像上传

- `<input type="file" accept="image/*">` → 校验 `file.size > 2MB` 报错；
- `FileReader.readAsDataURL` 转为 Base64 data URI 存入 `form.avatar`；
- 保存时随 `PUT /api/settings` 提交，落到 `settings.avatar MEDIUMTEXT`；
- 后端 `express.json({ limit: '10mb' })` 支撑该体积；预览用同一 data URI。

#### 4.6.7 加载错峰动画

`FragmentGrid` 给每张卡注入内联变量：

```tsx
style={{ ['--load-delay']: `${index * 60}ms` }}
```

卡片 CSS 以 `animation-delay: var(--load-delay)` 消费，编排逻辑留在父组件。

---

## 5. 后端架构

### 5.1 入口与中间件（`server/index.js`）

```
express()
├─ cors()                                // 全开（开发用）
├─ express.json({ limit: '10mb' })       // 支持 Base64 头像
├─ auth(req,res,next)                    // Bearer JWT 校验，挂 req.user
├─ POST /api/login
├─ crudRoutes('projects' | 'posts' | 'messages')
├─ POST /api/guestbook                   // 公开留言
├─ GET/PUT /api/settings
├─ GET /api/health
└─ 统一错误处理中间件
```

### 5.2 鉴权

```js
const header = req.headers.authorization || '';
const token = header.startsWith('Bearer ') ? header.slice(7) : null;
req.user = jwt.verify(token, process.env.JWT_SECRET);
```

- 登录：`bcrypt.compareSync(password, user.password)`，成功后签发 `{ id, username }`，`expiresIn: '7d'`。
- 失败：缺参 400；账号或密码错误 401；令牌缺失 / 过期 401。

### 5.3 CRUD 路由工厂

```js
crudRoutes('projects', 'projects', ['title', 'description', 'tech_stack', 'category']);
crudRoutes('posts',    'posts',    ['date', 'title', 'summary']);
crudRoutes('messages', 'messages', ['name', 'content']);
```

| 方法 | 行为 |
|---|---|
| GET | `SELECT * FROM {table} ORDER BY id DESC`，公开 |
| POST | 按字段白名单取值，`req.body[f] ?? null`，需登录，返回 `201 { id }` |
| PUT | 按字段白名单**全量覆盖**（缺失字段写 NULL），需登录 |
| DELETE | 按 id 删除，需登录 |

**SQL 注入防护**：表名与字段名来自代码内硬编码字符串，值全部通过 `?` 占位符参数化，不存在用户可控的标识符。

### 5.4 settings 的读写

- 单行配置：`SELECT * FROM settings ORDER BY id LIMIT 1`。
- `honors` 以 JSON 字符串存储，读取时 `JSON.parse`，解析失败回退 `[]`。
- GET 返回所有已知列的显式映射（避免泄露未来新增的内部列）。
- PUT：
  - 白名单 `allowed`，只更新请求体中真实存在的字段（`hasOwnProperty`）；
  - `honors` 统一 `JSON.stringify(Array.isArray(...) ? ... : [])`；
  - 无字段 → 400；
  - 有记录则 UPDATE，无记录则 INSERT（部分列插入，其余取默认 NULL）。
  - 部分更新语义保证后台三组表单不会互相覆盖。

### 5.5 留言特例

- 公开写入走独立路径 `POST /api/guestbook`，而非 `POST /api/messages`。
- 校验：`name/content` 去空后非空、`content.length <= 500`。
- `POST /api/messages` 仍由工厂注册为受保护接口，但前端未使用。

### 5.6 错误处理

```js
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.sqlMessage || err.message || '服务器内部错误' });
});
```

开发期直接回传数据库错误原因，便于定位；上线前应改为通用提示并记录日志。

---

## 6. 数据库设计

### 6.1 表结构

数据库：`my_garden`，字符集 `utf8mb4 / utf8mb4_unicode_ci`。

```sql
users      (id PK AI, username VARCHAR(50) UNIQUE NOT NULL, password VARCHAR(100) NOT NULL)
projects   (id PK AI, title VARCHAR(100) NOT NULL, description TEXT,
            tech_stack VARCHAR(255), category VARCHAR(20) DEFAULT 'CODE')
posts      (id PK AI, date VARCHAR(20) NOT NULL, title VARCHAR(200) NOT NULL, summary TEXT)
messages   (id PK AI, name VARCHAR(50) NOT NULL, content VARCHAR(500) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP)
settings   (id PK AI, name, title, tagline, email, age, location, bio TEXT,
            avatar MEDIUMTEXT, major, hobbies, monologue TEXT, honors TEXT,
            excerpt_text, excerpt_from, reading_title, reading_author, reading_progress)
```

### 6.2 关系

- 无外键；`settings` 为单行配置表（取 id 最小的一行）。
- `projects / posts / messages` 相互独立，均按 `id DESC` 展示。
- `users` 仅用于后台登录，不与内容表关联。

### 6.3 初始化

```bash
mysql -u root -p < server/init.sql
```

脚本会：建库 → 建 5 表 → 插入管理员 `admin / 123456`（bcrypt）→ 插入 2 条项目、2 条手记、1 条 settings。

### 6.4 迁移说明（重要）

`init.sql` 使用 `CREATE TABLE IF NOT EXISTS`，**已存在的 `settings` 表不会自动新增列**。若数据库是旧版结构，需要手动补齐以下列（按实际缺失情况执行）：

```sql
ALTER TABLE settings
  ADD COLUMN name          VARCHAR(50)  NULL,
  ADD COLUMN title         VARCHAR(100) NULL,
  ADD COLUMN tagline       VARCHAR(255) NULL,
  ADD COLUMN email         VARCHAR(100) NULL,
  ADD COLUMN bio           TEXT         NULL,
  ADD COLUMN avatar        MEDIUMTEXT   NULL;

-- 若首页卡片字段也缺失：
ALTER TABLE settings
  ADD COLUMN excerpt_text    VARCHAR(255) NULL,
  ADD COLUMN excerpt_from    VARCHAR(100) NULL,
  ADD COLUMN reading_title   VARCHAR(120) NULL,
  ADD COLUMN reading_author  VARCHAR(120) NULL,
  ADD COLUMN reading_progress VARCHAR(50) NULL;
```

> 重复执行会报 `Duplicate column name`，可先 `SHOW COLUMNS FROM settings` 核对。

---

## 7. API 契约

所有响应为 JSON，根路径 `/api`。`鉴权` 列中「需要」表示必须携带 `Authorization: Bearer <token>`。

| 方法 | 路径 | 鉴权 | 请求体 | 成功响应 | 说明 |
|---|---|---|---|---|---|
| GET | `/api/health` | 否 | — | `{ ok: true }` | 健康检查 |
| POST | `/api/login` | 否 | `{ username, password }` | `200 { token }` | 缺参 400，凭证错误 401 |
| GET | `/api/projects` | 否 | — | `ProjectRow[]` | 按 id 倒序 |
| POST | `/api/projects` | 需要 | `{ title, description, tech_stack, category }` | `201 { id }` | 仅 `title` 有数据库非空约束 |
| PUT | `/api/projects/:id` | 需要 | 同上 | `{ ok: true }` | 全量覆盖，缺失字段置 NULL |
| DELETE | `/api/projects/:id` | 需要 | — | `{ ok: true }` | — |
| GET | `/api/posts` | 否 | — | `PostRow[]` | 按 id 倒序 |
| POST | `/api/posts` | 需要 | `{ date, title, summary }` | `201 { id }` | — |
| PUT | `/api/posts/:id` | 需要 | 同上 | `{ ok: true }` | 全量覆盖 |
| DELETE | `/api/posts/:id` | 需要 | — | `{ ok: true }` | — |
| GET | `/api/messages` | 否 | — | `MessageRow[]` | 按 id 倒序 |
| POST | `/api/messages` | 需要 | `{ name, content }` | `201 { id }` | 前端未使用 |
| PUT | `/api/messages/:id` | 需要 | `{ name, content }` | `{ ok: true }` | 前端未使用 |
| DELETE | `/api/messages/:id` | 需要 | — | `{ ok: true }` | 后台删除留言 |
| POST | `/api/guestbook` | 否 | `{ name, content }` | `201 { id }` | 公开留言；空值 400、超 500 字 400 |
| GET | `/api/settings` | 否 | — | `Settings \| null` | 无记录返回 `null` |
| PUT | `/api/settings` | 需要 | `Partial<Settings>` | `{ ok: true }` | 仅更新出现的字段；空请求 400 |

### 7.1 类型定义

```ts
interface ProjectRow { id: number; title: string; description: string | null;
  tech_stack: string | null; category: string | null; }

interface PostRow { id: number; date: string; title: string; summary: string | null; }

interface MessageRow { id: number; name: string; content: string; created_at: string; }

interface Honor { title: string; year: string; }

interface Settings {
  name: string | null; title: string | null; tagline: string | null;
  email: string | null; bio: string | null; avatar: string | null;
  age: string | null; location: string | null; major: string | null;
  hobbies: string | null; monologue: string | null; honors: Honor[];
  excerpt_text: string | null; excerpt_from: string | null;
  reading_title: string | null; reading_author: string | null;
  reading_progress: string | null;
}
```

### 7.2 调用示例

```ts
// 登录并保存令牌
const { token } = await login('admin', '123456');
setToken(token);

// 保存个人信息（部分字段）
await updateSettings({ bio: '……', honors: [{ title: '奖学金', year: '2026' }] });

// 访客留言
await createGuestbookMessage({ name: '路人', content: '你好' });
```

---

## 8. 构建、部署与运维

### 8.1 环境变量（`server/.env`）

```ini
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=my_garden
JWT_SECRET=change_me_to_a_random_string
PORT=3001
```

- `.env` 已加入 `.gitignore`，仓库只保留 `.env.example`。
- `JWT_SECRET` 必须替换为随机长字符串；更换后所有旧令牌立即失效。

### 8.2 生产构建

```bash
npm install && npm run build          # 产物 dist/
cd server && npm install --omit=dev && npm start
```

当前构建体积参考：

| 产物 | 大小 | gzip |
|---|---|---|
| `dist/assets/index-*.css` | 约 80.7 KB | 约 14.7 KB |
| `dist/assets/index-*.js` | 约 313 KB | 约 105 KB |

### 8.3 部署建议

1. `dist/` 交给 Nginx / 静态托管；SPA 需要 `try_files $uri /index.html` 兜底，否则 `/works` 等路由 404。
2. 后端常驻进程建议用 PM2 / systemd；端口由 `PORT` 控制。
3. **API 地址当前硬编码**为 `http://localhost:3001/api`（`src/api/index.ts`）。上线前二选一：
   - 改为同域反代：Nginx `location /api/ { proxy_pass http://127.0.0.1:3001; }`，同时把 `API_BASE` 改为 `/api`；
   - 或改为环境变量 `VITE_API_BASE` 并在构建时注入。
4. 后端 `cors()` 目前全开，生产应收紧为前端域名。
5. 若前后端分域部署，注意 Cookie / CORS / HTTPS 配置。

### 8.4 数据备份

- 内容全部集中在 `my_garden`，定期 `mysqldump my_garden > backup.sql`。
- 头像以 Base64 存在数据库内，备份即包含头像；注意 `MEDIUMTEXT` 会让单行体积增大。

---

## 9. 性能与资源

| 项 | 现状 | 说明 |
|---|---|---|
| 轮播图 | 3 张 JPEG，206–250KB，1040×588 / 1024×1365 / 1050×1402 | 已由原 PNG 压缩；`lazy` + `async` + 显式尺寸 |
| 背景图 | `paper-bg.png` 2.8MB | 首屏固定背景，建议后续压成 WebP/AVIF |
| 字体 | Google Fonts CDN 4 族 | 有 `preconnect`；中文 Noto Serif SC 体积较大 |
| 碎片图 | picsum 外链 | 固定 seed，刷新不变；可替换为本地图 |
| 头像 | Base64 ≤2MB 存库 | 每次 GET settings 都会传输整段 Base64 |
| 前端包 | 313KB JS | 无 UI 库，主要为 React + Router + axios |

优化建议：

1. 背景图压缩 / 分分辨率；轮播补 2x 图与 `srcset`。
2. 头像改为文件上传到静态目录，数据库只存 URL。
3. 对 `settings` 的公开读取加短缓存（如 60s）。
4. 长列表接口增加分页。

---

## 10. 安全评估

| 风险 | 现状 | 建议 |
|---|---|---|
| CORS 全开 | `app.use(cors())` | 生产限定 `origin` |
| JWT 存 localStorage | 易受 XSS 读取 | 改 httpOnly Cookie，或缩短有效期 + 刷新令牌 |
| 登录无限流 | 可被暴力尝试 | 加 IP 限流 / 失败锁定 / 验证码 |
| 错误信息泄漏 | 500 返回 `err.sqlMessage` | 生产只返回通用提示，详情写日志 |
| 输入校验不足 | projects/posts 仅依赖数据库约束 | 服务端补长度、枚举（category）校验 |
| 富文本 / HTML | 前台均以文本渲染，无 `dangerouslySetInnerHTML` | 保持现状；若引入 Markdown 需消毒 |
| 上传体积 | JSON 上限 10MB，前端限 2MB | 服务端也校验 Base64 大小与 MIME |
| 明文默认口令 | 初始化 `admin / 123456` | 首次部署后立即修改 |
| HTTPS | 未配置 | 生产强制 HTTPS |

---

## 11. 测试与验证

### 11.1 构建与类型

```bash
npm run build     # tsc -b（strict + noUnused*） + vite build
```

### 11.2 手工回归清单

1. 前后端同时启动，`/api/health` 返回 `{ ok: true }`。
2. 首页：轮播自动 / 手动 / 键盘 / 触摸；切后台暂停；装饰不遮挡点击。
3. 首页：断开后端后卡片仍显示默认文案。
4. 作品：新建项目后前台刷新即出现；技术栈 `,` 转 ` · `。
5. 介绍：手记展开 / 收起；档案卡显示 `bio`、荣誉；`bio` 为空时回退 `monologue`。
6. 留言：提交后即时出现；刷新仍在；超长内容被拒。
7. 后台：错误密码提示；正确登录进入概览；刷新后令牌仍有效。
8. 后台：修改个人信息 → 前台介绍页 / 首页卡片同步。
9. 后台：删除项目 / 手记 / 留言后前台同步撤下。
10. 过期令牌：接口 401 时自动清令牌并回登录页。
11. 响应式：1440 / 1024 / 768 / 390 无横向溢出；390 下轮播胶带隐藏、纸条与页码不重叠。
12. 减动效：系统开启 reduce 后轮播停止自动播放、过渡关闭。

### 11.3 自动化截图（可选）

项目验证曾使用 Chrome headless + CDP：

- Chrome 155 的 `--screenshot` CLI 参数不产出文件，必须通过 `Page.captureScreenshot`。
- Node 24 内置 `WebSocket`，可直连 `--remote-debugging-port` 的 `/json/list`。
- `Emulation.setDeviceMetricsOverride` 切换桌面 / 移动视口；`Runtime.evaluate` 读取 `getBoundingClientRect` 校验布局。
- Chrome 进程需与脚本在同一 Shell 生命周期内启动，临时 profile 必须放在项目目录外，避免 Vite 文件监听 `EBUSY`。

---

## 12. 已知问题与技术债

| 编号 | 问题 | 位置 | 影响 |
|---|---|---|---|
| T-01 | API 根地址硬编码 | `src/api/index.ts` | 无法多环境部署 |
| T-02 | `settings` 部分字段未被前台消费 | `Hero` / `Footer` | 后台改了不生效 |
| T-03 | `PUT` 为全量覆盖语义 | `crudRoutes` | 任何客户端漏传字段会被写成 NULL |
| T-04 | `POST/PUT /api/messages` 冗余 | `server/index.js` | 两套写入路径，易混淆 |
| T-05 | 无服务端字段校验 | projects / posts | 超长文本可绕过前端 |
| T-06 | 无分页 | projects / posts / messages | 数据量大时全量返回 |
| T-07 | 单行 settings 依赖 `LIMIT 1` | `server/index.js` | 多行时行为不确定 |
| T-08 | 头像 Base64 入 JSON | `AdminProfile` / `settings` | 请求体大、列表响应大 |
| T-09 | 背景图 2.8MB | `public/paper-bg.png` | 首屏流量 |
| T-10 | 轮播图最大宽度约 1050px | `public/images/carousel` | 超宽屏放大发虚 |
| T-11 | 移动端导航未适配 | `Nav.module.css` | 390px 下 logo / 菜单换行 |
| T-12 | `index.html` 标题不符 | `index.html` | SEO / 分享卡片 |
| T-13 | 关于页内容硬编码 | `AboutSection.tsx` | 更新需改代码 |
| T-14 | 碎片数据未入库 | `src/data/fragments.ts` | 后台不可维护 |
| T-15 | 无测试框架 | 全项目 | 回归依赖手工 |

---

## 13. 附录

### 13.1 设计变量速查

```
--color-canvas #B29770   --color-paper rgba(245,235,215,.4)
--color-nav-bg rgba(190,170,140,.7)
--color-ink #2B1D14      --color-muted #5E4B35      --color-accent #8B3A2E
--color-border rgba(43,29,20,.2)
--space-sm/md/lg/xl/2xl/3xl = 8/16/24/32/48/64
--ease-editorial cubic-bezier(.2,0,0,1)   --duration-base 240ms
--nav-height 64px       --radius-card 1px
```

### 13.2 图片资源

| 文件 | 尺寸 | 大小 | 用途 |
|---|---|---|---|
| `public/paper-bg.png` | — | 2.8MB | 全局纸背景 |
| `public/images/profile.jpg` | — | 424KB | Hero 肖像 |
| `public/images/carousel/plate-01.jpg` | 1040×588 | 206KB | 轮播 1 |
| `public/images/carousel/plate-02.jpg` | 1024×1365 | 249KB | 轮播 2（`center 38%`） |
| `public/images/carousel/plate-03.jpg` | 1050×1402 | 218KB | 轮播 3（`center 42%`） |

### 13.3 变更记录

| 版本 | 日期 | 内容 |
|---|---|---|
| v1.0 | — | 纯静态单页：Hero、工程档案、手记、碎片、关于、页脚，数据在前端文件 |
| v2.0 | 2026-10-29 | 路由化多页；Express + MySQL；后台登录与 5 个管理页；留言功能；Hero 全幅轮播（融合滤镜 / 边缘渐隐 / 胶带 / 打字机纸条 / 分割线）；本文档重写 |
