import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  clearToken,
  createPost,
  deletePost,
  getPosts,
  updatePost,
  type PostInput,
  type PostRow,
} from '../api';
import { ArchiveModal } from './ArchiveModal';
import shared from './admin.module.css';
import styles from './AdminTable.module.css';

function todayStamp() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}.${month}.${day}`;
}

function blankPost(): PostInput {
  return { date: todayStamp(), title: '', summary: '' };
}

export function AdminPosts() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PostRow | null>(null);
  const [form, setForm] = useState<PostInput>(blankPost);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
      setRows(await getPosts());
    } catch (err) {
      setLoadError(resolveError(err, '手记读取失败：请确认后端已在 3001 端口运行。'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRows();
  }, []);

  function setField(key: keyof PostInput, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openCreate() {
    setEditing(null);
    setForm(blankPost());
    setFormError(null);
    setNotice(null);
    setModalOpen(true);
  }

  function openEdit(row: PostRow) {
    setEditing(row);
    setForm({
      date: row.date,
      title: row.title,
      summary: row.summary ?? '',
    });
    setFormError(null);
    setNotice(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.date.trim() || !form.title.trim()) {
      setFormError('日期与标题均不可为空。');
      return;
    }

    setSaving(true);
    setFormError(null);
    const payload: PostInput = {
      date: form.date.trim(),
      title: form.title.trim(),
      summary: form.summary.trim(),
    };

    try {
      if (editing) {
        await updatePost(editing.id, payload);
        setNotice(`手记 No.${String(editing.id).padStart(3, '0')} 已更新`);
      } else {
        const result = await createPost(payload);
        setNotice(`新手记 No.${String(result.id).padStart(3, '0')} 已入库`);
      }
      setModalOpen(false);
      await fetchRows();
    } catch (err) {
      setFormError(resolveError(err, '归档失败：请确认后端已在 3001 端口运行。'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row: PostRow) {
    const confirmed = window.confirm(`确认销毁手记「${row.title}」？此操作不可撤销。`);
    if (!confirmed) return;

    setNotice(null);
    try {
      await deletePost(row.id);
      setNotice(`手记 No.${String(row.id).padStart(3, '0')} 已销毁`);
      await fetchRows();
    } catch (err) {
      setLoadError(resolveError(err, '销毁手记失败：请稍后重试。'));
    }
  }

  return (
    <div className={shared.page}>
      <header className={shared.header}>
        <p className={shared.kicker}>JOURNAL LEDGER · 手记账本</p>
        <h1 className={shared.title}>博客管理</h1>
        <p className={shared.desc}>
          登记、修订与销毁手记随笔。账本里的每一行都会同步到前台介绍页的手记目录。
        </p>
      </header>

      <div className={shared.rule} aria-hidden="true" />

      {notice && <p className={styles.notice}>{notice}</p>}

      <div className={styles.sheet}>
        <div className={styles.sheetHead}>
          <div>
            <p className={styles.sheetKicker}>LEDGER · 手记账本</p>
            <h2 className={styles.sheetTitle}>手记随笔</h2>
          </div>
          <div className={styles.headActions}>
            <p className={styles.count}>共 {rows.length} 篇</p>
            <button type="button" className={shared.stampButton} onClick={openCreate}>
              ＋ 新增手记
            </button>
          </div>
        </div>

        {loading && <p className={shared.status}>正在翻阅手记…</p>}
        {loadError && (
          <p className={`${shared.status} ${shared.statusError}`} role="alert">
            {loadError}
          </p>
        )}

        {!loading && !loadError && rows.length === 0 && (
          <p className={styles.empty}>账本尚空 · 点击右上角写下第一篇手记</p>
        )}

        {rows.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.ledger}>
              <thead>
                <tr>
                  <th>编号 / No.</th>
                  <th>日期 / Date</th>
                  <th>手记 / Journal</th>
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
                      <span className={styles.dateCell}>{row.date}</span>
                    </td>
                    <td>
                      <p className={styles.titleCell}>{row.title}</p>
                      {row.summary && <p className={styles.descCell}>{row.summary}</p>}
                    </td>
                    <td className={styles.actionsCell}>
                      <button type="button" className={styles.action} onClick={() => openEdit(row)}>
                        编辑
                      </button>
                      <button
                        type="button"
                        className={`${styles.action} ${styles.actionDanger}`}
                        onClick={() => handleDelete(row)}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <ArchiveModal
          tab={editing ? `FORM J-${String(editing.id).padStart(3, '0')}` : 'FORM J-NEW'}
          title={editing ? '编辑手记' : '新增手记'}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit}>
            <div className={styles.formFields}>
              <div className={styles.formGrid2}>
                <div className={shared.field}>
                  <label className={shared.label} htmlFor="post-date">
                    日期 <span className={shared.labelEn}>Date</span>
                  </label>
                  <input
                    id="post-date"
                    className={shared.input}
                    value={form.date}
                    onChange={(event) => setField('date', event.target.value)}
                    placeholder="2026.10.29"
                  />
                </div>

                <div className={shared.field}>
                  <label className={shared.label} htmlFor="post-title">
                    标题 <span className={shared.labelEn}>Title</span>
                  </label>
                  <input
                    id="post-title"
                    className={shared.input}
                    value={form.title}
                    onChange={(event) => setField('title', event.target.value)}
                    placeholder="手记的标题"
                    autoFocus
                  />
                </div>
              </div>

              <div className={shared.field}>
                <label className={shared.label} htmlFor="post-summary">
                  摘要 <span className={shared.labelEn}>Summary</span>
                </label>
                <textarea
                  id="post-summary"
                  className={shared.textarea}
                  rows={5}
                  value={form.summary}
                  onChange={(event) => setField('summary', event.target.value)}
                  placeholder="一两句话记下这篇手记的由来。"
                />
              </div>

              {formError && (
                <p className={styles.formError} role="alert">
                  {formError}
                </p>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={shared.ghostButton}
                onClick={closeModal}
                disabled={saving}
              >
                取消
              </button>
              <button type="submit" className={shared.stampButton} disabled={saving}>
                {saving ? '正在归档…' : '保存手记'}
              </button>
            </div>
          </form>
        </ArchiveModal>
      )}
    </div>
  );
}
