import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { clearToken, deleteMessage, getMessages, type MessageRow } from '../api';
import shared from './admin.module.css';
import styles from './AdminTable.module.css';

/** 把后端 DATETIME 格式化为 YYYY.MM.DD HH:mm */
function formatTime(raw: string): string {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AdminMessages() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function resolveError(err: unknown, fallback: string) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      clearToken();
      navigate('/admin', { replace: true });
      return '登录已过期，请重新签发通行证。';
    }
    const message = axios.isAxiosError(err)
      ? (err.response?.data as { error?: string } | undefined)?.error
      : undefined;
    return message || fallback;
  }

  async function fetchRows() {
    setLoading(true);
    setLoadError(null);
    try {
      setRows(await getMessages());
    } catch (err) {
      setLoadError(resolveError(err, '留言读取失败：请确认后端已在 3001 端口运行。'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRows();
  }, []);

  async function handleDelete(row: MessageRow) {
    const confirmed = window.confirm(`确认销毁来自「${row.name}」的留言？此操作不可撤销。`);
    if (!confirmed) return;

    setNotice(null);
    setDeletingId(row.id);
    try {
      await deleteMessage(row.id);
      setNotice(`留言 No.${String(row.id).padStart(3, '0')} 已销毁`);
      await fetchRows();
    } catch (err) {
      setLoadError(resolveError(err, '销毁留言失败：请稍后重试。'));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className={shared.page}>
      <header className={shared.header}>
        <p className={shared.kicker}>GUESTBOOK LEDGER · 访客留言簿</p>
        <h1 className={shared.title}>留言管理</h1>
        <p className={shared.desc}>
          查阅访客贴在信箱墙上的明信片。确认无需保留的留言可以在此销毁，前台会同步撤下。
        </p>
      </header>

      <div className={shared.rule} aria-hidden="true" />

      {notice && <p className={styles.notice}>{notice}</p>}

      <div className={styles.sheet}>
        <div className={styles.sheetHead}>
          <div>
            <p className={styles.sheetKicker}>LEDGER · 留言簿</p>
            <h2 className={styles.sheetTitle}>访客留言</h2>
          </div>
          <p className={styles.count}>共 {rows.length} 条</p>
        </div>

        {loading && <p className={shared.status}>正在翻阅留言簿…</p>}
        {loadError && (
          <p className={`${shared.status} ${shared.statusError}`} role="alert">
            {loadError}
          </p>
        )}

        {!loading && !loadError && rows.length === 0 && (
          <p className={styles.empty}>留言簿尚空 · 前台的明信片会归档到这里</p>
        )}

        {rows.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.ledger}>
              <thead>
                <tr>
                  <th>编号 / No.</th>
                  <th>署名 / Name</th>
                  <th>留言 / Message</th>
                  <th>时间 / Time</th>
                  <th>操作 / Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span className={styles.noCell}>No.{String(row.id).padStart(3, '0')}</span>
                    </td>
                    <td>
                      <p className={styles.titleCell}>{row.name}</p>
                    </td>
                    <td>
                      <p className={styles.descCell}>{row.content}</p>
                    </td>
                    <td>
                      <span className={styles.dateCell}>{formatTime(row.created_at)}</span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button
                        type="button"
                        className={`${styles.action} ${styles.actionDanger}`}
                        onClick={() => handleDelete(row)}
                        disabled={deletingId === row.id}
                      >
                        {deletingId === row.id ? '销毁中…' : '删除'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
