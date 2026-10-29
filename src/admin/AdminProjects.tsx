import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  clearToken,
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  type ProjectInput,
  type ProjectRow,
} from '../api';
import { ArchiveModal } from './ArchiveModal';
import shared from './admin.module.css';
import styles from './AdminTable.module.css';

const EMPTY_PROJECT: ProjectInput = {
  title: '',
  description: '',
  tech_stack: '',
  category: 'CODE',
};

function formatTech(value: string | null) {
  const parts = (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return parts.length ? parts.join(' · ') : '—';
}

export function AdminProjects() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [form, setForm] = useState<ProjectInput>(EMPTY_PROJECT);
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
      setRows(await getProjects());
    } catch (err) {
      setLoadError(resolveError(err, '工程档案读取失败：请确认后端已在 3001 端口运行。'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRows();
  }, []);

  function setField(key: keyof ProjectInput, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_PROJECT });
    setFormError(null);
    setNotice(null);
    setModalOpen(true);
  }

  function openEdit(row: ProjectRow) {
    setEditing(row);
    setForm({
      title: row.title,
      description: row.description ?? '',
      tech_stack: row.tech_stack ?? '',
      category: row.category ?? 'CODE',
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
    if (!form.title.trim()) {
      setFormError('档案标题不能为空。');
      return;
    }

    setSaving(true);
    setFormError(null);
    const payload: ProjectInput = {
      title: form.title.trim(),
      description: form.description.trim(),
      tech_stack: form.tech_stack.trim(),
      category: form.category,
    };

    try {
      if (editing) {
        await updateProject(editing.id, payload);
        setNotice(`档案 No.${String(editing.id).padStart(3, '0')} 已更新`);
      } else {
        const result = await createProject(payload);
        setNotice(`新档案 No.${String(result.id).padStart(3, '0')} 已入库`);
      }
      setModalOpen(false);
      await fetchRows();
    } catch (err) {
      setFormError(resolveError(err, '归档失败：请确认后端已在 3001 端口运行。'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row: ProjectRow) {
    const confirmed = window.confirm(`确认销毁档案「${row.title}」？此操作不可撤销。`);
    if (!confirmed) return;

    setNotice(null);
    try {
      await deleteProject(row.id);
      setNotice(`档案 No.${String(row.id).padStart(3, '0')} 已销毁`);
      await fetchRows();
    } catch (err) {
      setLoadError(resolveError(err, '销毁档案失败：请稍后重试。'));
    }
  }

  return (
    <div className={shared.page}>
      <header className={shared.header}>
        <p className={shared.kicker}>PROJECT LEDGER · 工程账本</p>
        <h1 className={shared.title}>项目管理</h1>
        <p className={shared.desc}>
          登记、修订与销毁工程档案。每一卷都会同步到前台作品页的活页索引卡。
        </p>
      </header>

      <div className={shared.rule} aria-hidden="true" />

      {notice && <p className={styles.notice}>{notice}</p>}

      <div className={styles.sheet}>
        <div className={styles.sheetHead}>
          <div>
            <p className={styles.sheetKicker}>LEDGER · 工程档案账本</p>
            <h2 className={styles.sheetTitle}>工程档案</h2>
          </div>
          <div className={styles.headActions}>
            <p className={styles.count}>共 {rows.length} 卷</p>
            <button type="button" className={shared.stampButton} onClick={openCreate}>
              ＋ 新增档案
            </button>
          </div>
        </div>

        {loading && <p className={shared.status}>正在清点档案…</p>}
        {loadError && (
          <p className={`${shared.status} ${shared.statusError}`} role="alert">
            {loadError}
          </p>
        )}

        {!loading && !loadError && rows.length === 0 && (
          <p className={styles.empty}>档案盒尚空 · 点击右上角新增第一份工程档案</p>
        )}

        {rows.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.ledger}>
              <thead>
                <tr>
                  <th>编号 / No.</th>
                  <th>工程档案 / Project</th>
                  <th>技术栈 / Stack</th>
                  <th>分类 / Type</th>
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
                      <p className={styles.titleCell}>{row.title}</p>
                      {row.description && <p className={styles.descCell}>{row.description}</p>}
                    </td>
                    <td>
                      <p className={styles.techCell}>{formatTech(row.tech_stack)}</p>
                    </td>
                    <td>
                      <span className={styles.categoryStamp}>{row.category ?? 'CODE'}</span>
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
          tab={editing ? `FORM P-${String(editing.id).padStart(3, '0')}` : 'FORM P-NEW'}
          title={editing ? '编辑工程档案' : '新增工程档案'}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit}>
            <div className={styles.formFields}>
              <div className={shared.field}>
                <label className={shared.label} htmlFor="project-title">
                  档案标题 <span className={shared.labelEn}>Title</span>
                </label>
                <input
                  id="project-title"
                  className={shared.input}
                  value={form.title}
                  onChange={(event) => setField('title', event.target.value)}
                  placeholder="例如：校园二手书交易平台"
                  autoFocus
                />
              </div>

              <div className={styles.formGrid2}>
                <div className={shared.field}>
                  <label className={shared.label} htmlFor="project-category">
                    分类 <span className={shared.labelEn}>Type</span>
                  </label>
                  <select
                    id="project-category"
                    className={`${shared.input} ${styles.select}`}
                    value={form.category}
                    onChange={(event) => setField('category', event.target.value)}
                  >
                    <option value="CODE">CODE · 代码工程</option>
                    <option value="HARDWARE">HARDWARE · 硬件工程</option>
                  </select>
                </div>

                <div className={shared.field}>
                  <label className={shared.label} htmlFor="project-tech">
                    技术栈 <span className={shared.labelEn}>Stack</span>
                  </label>
                  <input
                    id="project-tech"
                    className={shared.input}
                    value={form.tech_stack}
                    onChange={(event) => setField('tech_stack', event.target.value)}
                    placeholder="React,Node.js,MySQL"
                  />
                </div>
              </div>

              <div className={shared.field}>
                <label className={shared.label} htmlFor="project-desc">
                  档案描述 <span className={shared.labelEn}>Description</span>
                </label>
                <textarea
                  id="project-desc"
                  className={shared.textarea}
                  rows={5}
                  value={form.description}
                  onChange={(event) => setField('description', event.target.value)}
                  placeholder="简要说明项目做了什么、用了什么方案。"
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
                {saving ? '正在归档…' : '保存档案'}
              </button>
            </div>
          </form>
        </ArchiveModal>
      )}
    </div>
  );
}
