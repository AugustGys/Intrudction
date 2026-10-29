import { useEffect, useState } from 'react';
import { createGuestbookMessage, getMessages, type MessageRow } from '../api';
import pageStyles from './pages.module.css';
import styles from './Guestbook.module.css';

/** 把后端 DATETIME 格式化为 YYYY.MM.DD HH:mm */
function formatTime(raw: string): string {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function Guestbook() {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadMessages() {
    try {
      setMessages(await getMessages());
      setError(null);
    } catch {
      setError('留言读取失败：请确认后端已在 3001 端口运行。');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim() || submitting) return;
    setSubmitting(true);
    try {
      await createGuestbookMessage({ name: name.trim(), content: content.trim() });
      setName('');
      setContent('');
      await loadMessages();
    } catch {
      setError('留言投递失败，请稍后再试。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${pageStyles.page} ${pageStyles.pagePadded}`}>
      <section className={styles.board}>
        <p className={styles.stampLine}>GUESTBOOK · 留言</p>
        <h2 className={styles.heading}>投递信箱</h2>
        <p className={styles.hint}>写下一句吧，这张明信片会贴在我的花园墙上。</p>

        {/* ─── 明信片表单 ─── */}
        <form className={styles.postcard} onSubmit={handleSubmit}>
          {/* 右上角邮票装饰 */}
          <span className={styles.stamp} aria-hidden="true">邮</span>
          <div className={styles.fieldRow}>
            <label className={styles.label} htmlFor="gb-name">昵称</label>
            <input
              id="gb-name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="你的署名…"
              required
            />
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label} htmlFor="gb-content">留言</label>
            <textarea
              id="gb-content"
              className={styles.textarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={200}
              rows={4}
              placeholder="写点什么，200 字以内…"
              required
            />
          </div>
          {/* 盖邮戳式提交按钮 */}
          <button type="submit" className={styles.stampButton} disabled={submitting}>
            {submitting ? '正在投递' : '盖上邮戳'}
          </button>
        </form>

        {/* ─── 留言便签墙 ─── */}
        {loading && <p className={styles.hint}>正在取回明信片…</p>}
        {error && <p className={styles.hint}>{error}</p>}

        {!loading && !error && messages.length === 0 && (
          <p className={styles.hint}>信箱还空着，来做第一个留言的人吧。</p>
        )}

        <div className={styles.notes}>
          {messages.map((m, i) => (
            <article
              key={m.id}
              className={styles.note}
              style={{ transform: `rotate(${i % 2 === 0 ? '-' : ''}${(i % 3) * 0.6 + 0.8}deg)` }}
            >
              <span className={styles.noteStamp} aria-hidden="true" />
              <p className={styles.noteContent}>{m.content}</p>
              <footer className={styles.noteMeta}>
                <span className={styles.noteName}>{m.name}</span>
                <time className={styles.noteTime}>{formatTime(m.created_at)}</time>
              </footer>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
