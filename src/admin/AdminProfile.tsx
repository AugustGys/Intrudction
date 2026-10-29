import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { clearToken, getSettings, updateSettings, type Honor } from '../api';
import shared from './admin.module.css';
import styles from './AdminProfile.module.css';

interface ProfileForm {
  name: string;
  title: string;
  tagline: string;
  email: string;
  location: string;
  bio: string;
  avatar: string;
  /* 前台「关于我」档案卡 */
  age: string;
  major: string;
  hobbies: string;
  /* 首页卡片 · 摘录与在读 */
  excerpt_text: string;
  excerpt_from: string;
  reading_title: string;
  reading_author: string;
  reading_progress: string;
}

const EMPTY_FORM: ProfileForm = {
  name: '',
  title: '',
  tagline: '',
  email: '',
  location: '',
  bio: '',
  avatar: '',
  age: '',
  major: '',
  hobbies: '',
  excerpt_text: '',
  excerpt_from: '',
  reading_title: '',
  reading_author: '',
  reading_progress: '',
};

type Status = { type: 'ok' | 'error'; text: string } | null;

export function AdminProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [honors, setHonors] = useState<Honor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    let alive = true;
    getSettings()
      .then((data) => {
        if (!alive || !data) return;
        setForm({
          name: data.name ?? '',
          title: data.title ?? '',
          tagline: data.tagline ?? '',
          email: data.email ?? '',
          location: data.location ?? '',
          bio: data.bio ?? '',
          avatar: data.avatar ?? '',
          age: data.age ?? '',
          major: data.major ?? '',
          hobbies: data.hobbies ?? '',
          excerpt_text: data.excerpt_text ?? '',
          excerpt_from: data.excerpt_from ?? '',
          reading_title: data.reading_title ?? '',
          reading_author: data.reading_author ?? '',
          reading_progress: data.reading_progress ?? '',
        });
        setHonors(Array.isArray(data.honors) ? data.honors : []);
      })
      .catch(() => {
        if (alive) {
          setStatus({ type: 'error', text: '个人档案读取失败：请确认后端已在 3001 端口运行。' });
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  function setField(key: keyof ProfileForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateHonor(index: number, key: keyof Honor, value: string) {
    setHonors((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }

  function addHonor() {
    setHonors((prev) => [...prev, { title: '', year: '' }]);
  }

  function removeHonor(index: number) {
    setHonors((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAvatarFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setStatus({ type: 'error', text: '相片过大：请选择小于 2MB 的图片。' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setField('avatar', String(reader.result || ''));
      setStatus(null);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const cleanHonors = honors
        .map((item) => ({ title: item.title.trim(), year: item.year.trim() }))
        .filter((item) => item.title);
      await updateSettings({
        name: form.name.trim(),
        title: form.title.trim(),
        tagline: form.tagline.trim(),
        email: form.email.trim(),
        location: form.location.trim(),
        bio: form.bio,
        avatar: form.avatar,
        age: form.age.trim(),
        major: form.major.trim(),
        hobbies: form.hobbies.trim(),
        honors: cleanHonors,
        excerpt_text: form.excerpt_text.trim(),
        excerpt_from: form.excerpt_from.trim(),
        reading_title: form.reading_title.trim(),
        reading_author: form.reading_author.trim(),
        reading_progress: form.reading_progress.trim(),
      });
      setStatus({ type: 'ok', text: '已归档 · 修改已写回馆藏，前台已同步' });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        clearToken();
        navigate('/admin', { replace: true });
        return;
      }
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error
        : undefined;
      setStatus({
        type: 'error',
        text: message || '归档失败：请确认后端已在 3001 端口运行，且 settings 表已补齐新字段。',
      });
    } finally {
      setSaving(false);
    }
  }

  const statusClass = status?.type === 'ok' ? shared.statusOk : shared.statusError;

  return (
    <div className={shared.page}>
      <header className={shared.header}>
        <p className={shared.kicker}>PERSONNEL FILE · 馆员档案</p>
        <h1 className={shared.title}>个人信息</h1>
        <p className={shared.desc}>
          在这里维护馆员的登记信息、前台「关于我」档案卡与首页随手卡片。保存后会立即写回档案库。
        </p>
      </header>

      <div className={shared.rule} aria-hidden="true" />

      <div className={styles.dossier}>
        <span className={styles.tab}>FORM A-01 · PERSONNEL</span>

        {loading && (
          <p className={`${shared.status} ${status?.type === 'error' ? shared.statusError : ''}`}>
            正在调取馆员档案…
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.layout}>
            <div className={styles.fields}>
              <div className={styles.row2}>
                <div className={shared.field}>
                  <label className={shared.label} htmlFor="profile-name">
                    姓名 <span className={shared.labelEn}>Name</span>
                  </label>
                  <input
                    id="profile-name"
                    className={shared.input}
                    value={form.name}
                    onChange={(event) => setField('name', event.target.value)}
                    placeholder="例如：甘昱升"
                  />
                </div>

                <div className={shared.field}>
                  <label className={shared.label} htmlFor="profile-title">
                    职位 <span className={shared.labelEn}>Title</span>
                  </label>
                  <input
                    id="profile-title"
                    className={shared.input}
                    value={form.title}
                    onChange={(event) => setField('title', event.target.value)}
                    placeholder="例如：学生 · 物联网工程"
                  />
                </div>
              </div>

              <div className={shared.field}>
                <label className={shared.label} htmlFor="profile-tagline">
                  一句话介绍 <span className={shared.labelEn}>Tagline</span>
                </label>
                <input
                  id="profile-tagline"
                  className={shared.input}
                  value={form.tagline}
                  onChange={(event) => setField('tagline', event.target.value)}
                  placeholder="一句能概括你的话"
                />
              </div>

              <div className={styles.row2}>
                <div className={shared.field}>
                  <label className={shared.label} htmlFor="profile-email">
                    邮箱 <span className={shared.labelEn}>Email</span>
                  </label>
                  <input
                    id="profile-email"
                    className={shared.input}
                    type="email"
                    value={form.email}
                    onChange={(event) => setField('email', event.target.value)}
                    placeholder="hello@example.com"
                  />
                </div>

                <div className={shared.field}>
                  <label className={shared.label} htmlFor="profile-location">
                    所在地区 <span className={shared.labelEn}>Location</span>
                  </label>
                  <input
                    id="profile-location"
                    className={shared.input}
                    value={form.location}
                    onChange={(event) => setField('location', event.target.value)}
                    placeholder="例如：辽宁 · 大连"
                  />
                </div>
              </div>

              <div className={shared.field}>
                <label className={shared.label} htmlFor="profile-bio">
                  个人简介 <span className={shared.labelEn}>Biography</span>
                </label>
                <textarea
                  id="profile-bio"
                  className={shared.textarea}
                  rows={6}
                  value={form.bio}
                  onChange={(event) => setField('bio', event.target.value)}
                  placeholder="写一段自我介绍，像给档案写批注一样。"
                />
              </div>

              <div className={shared.field}>
                <label className={shared.label} htmlFor="profile-avatar">
                  头像 <span className={shared.labelEn}>Portrait</span>
                </label>
                <input
                  id="profile-avatar"
                  className={shared.input}
                  value={form.avatar.startsWith('data:') ? '' : form.avatar}
                  onChange={(event) => setField('avatar', event.target.value)}
                  placeholder="粘贴图片链接，或在下方选择本地相片"
                />
                <div className={styles.avatarTools}>
                  <label className={styles.uploadLabel}>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={handleAvatarFile}
                    />
                    选择相片底片
                  </label>
                  {form.avatar && (
                    <button
                      type="button"
                      className={styles.clearAvatar}
                      onClick={() => setField('avatar', '')}
                    >
                      撤下相片
                    </button>
                  )}
                  <p className={styles.uploadHint}>JPG / PNG · 建议 3:4 · 不超过 2MB · 将以 Base64 存入档案</p>
                </div>
              </div>
            </div>

            <aside className={styles.photoCol} aria-label="头像预览">
              <div className={styles.photoFrame}>
                <span className={styles.tape} aria-hidden="true" />
                {form.avatar ? (
                  <img
                    className={styles.photoImg}
                    src={form.avatar}
                    alt={form.name ? `${form.name} 的档案照` : '档案照'}
                  />
                ) : (
                  <div className={styles.photoEmpty}>
                    <span className={styles.emptyMark} aria-hidden="true">
                      ◻
                    </span>
                    <span className={styles.emptyEn}>No Portrait</span>
                    <span className={styles.emptyCn}>未归档影像</span>
                  </div>
                )}
                <p className={styles.photoCaption}>{form.name || '未署名'}</p>
                <p className={styles.photoMeta}>FILE NO. A-01 · PORTRAIT</p>
              </div>
              <p className={styles.photoHint}>相纸框预览 · 前台与档案同步</p>
            </aside>
          </div>

          {/* ─── 前台「关于我」档案卡 ─── */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <p className={styles.sectionKicker}>DOSSIER · ABOUT ME</p>
              <h2 className={styles.sectionTitle}>前台「关于我」档案卡</h2>
              <p className={styles.sectionDesc}>
                这些字段会直接显示在介绍页右侧的档案卡上，个人简介与所在地区取自上方的基本登记。
              </p>
            </div>

            <div className={styles.fields}>
              <div className={styles.row3}>
                <div className={shared.field}>
                  <label className={shared.label} htmlFor="profile-age">
                    年龄 <span className={shared.labelEn}>Age</span>
                  </label>
                  <input
                    id="profile-age"
                    className={shared.input}
                    value={form.age}
                    onChange={(event) => setField('age', event.target.value)}
                    placeholder="例如：21"
                  />
                </div>

                <div className={shared.field}>
                  <label className={shared.label} htmlFor="profile-major">
                    专业 <span className={shared.labelEn}>Major</span>
                  </label>
                  <input
                    id="profile-major"
                    className={shared.input}
                    value={form.major}
                    onChange={(event) => setField('major', event.target.value)}
                    placeholder="例如：物联网工程"
                  />
                </div>

                <div className={shared.field}>
                  <label className={shared.label} htmlFor="profile-hobbies">
                    爱好 <span className={shared.labelEn}>Hobby</span>
                  </label>
                  <input
                    id="profile-hobbies"
                    className={shared.input}
                    value={form.hobbies}
                    onChange={(event) => setField('hobbies', event.target.value)}
                    placeholder="例如：品鉴美食 / 阅读 / 羽毛球"
                  />
                </div>
              </div>

              <div className={shared.field}>
                <label className={shared.label}>
                  荣誉与证书 <span className={shared.labelEn}>Honors</span>
                </label>
                <div className={styles.honorList}>
                  {honors.length === 0 && (
                    <p className={styles.honorEmpty}>尚无收录，点击下方按钮登记一条。</p>
                  )}
                  {honors.map((honor, index) => (
                    <div className={styles.honorRow} key={index}>
                      <input
                        className={shared.input}
                        value={honor.title}
                        onChange={(event) => updateHonor(index, 'title', event.target.value)}
                        placeholder="荣誉名称，例如：校级二等奖学金"
                        aria-label={`荣誉 ${index + 1} 名称`}
                      />
                      <input
                        className={shared.input}
                        value={honor.year}
                        onChange={(event) => updateHonor(index, 'year', event.target.value)}
                        placeholder="年份"
                        aria-label={`荣誉 ${index + 1} 年份`}
                      />
                      <button
                        type="button"
                        className={styles.removeHonor}
                        onClick={() => removeHonor(index)}
                      >
                        移除
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" className={styles.addHonor} onClick={addHonor}>
                  ＋ 添加荣誉
                </button>
              </div>
            </div>
          </section>

          {/* ─── 首页卡片：摘录与在读 ─── */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <p className={styles.sectionKicker}>HOME CARDS · EXCERPT &amp; READING</p>
              <h2 className={styles.sectionTitle}>首页卡片 · 摘录与在读</h2>
              <p className={styles.sectionDesc}>
                首页 Hero 下方卡片架的内容。留空时前台会回退到默认文案。
              </p>
            </div>

            <div className={styles.fields}>
              <div className={styles.row2}>
                <div className={shared.field}>
                  <label className={shared.label} htmlFor="profile-excerpt-text">
                    摘录内容 <span className={shared.labelEn}>Excerpt</span>
                  </label>
                  <input
                    id="profile-excerpt-text"
                    className={shared.input}
                    value={form.excerpt_text}
                    onChange={(event) => setField('excerpt_text', event.target.value)}
                    placeholder="例如：Everything you can imagine is real."
                  />
                </div>

                <div className={shared.field}>
                  <label className={shared.label} htmlFor="profile-excerpt-from">
                    摘录出处 <span className={shared.labelEn}>Source</span>
                  </label>
                  <input
                    id="profile-excerpt-from"
                    className={shared.input}
                    value={form.excerpt_from}
                    onChange={(event) => setField('excerpt_from', event.target.value)}
                    placeholder="例如：— 摘录"
                  />
                </div>
              </div>

              <div className={styles.row3}>
                <div className={shared.field}>
                  <label className={shared.label} htmlFor="profile-reading-title">
                    在读图书 <span className={shared.labelEn}>Title</span>
                  </label>
                  <input
                    id="profile-reading-title"
                    className={shared.input}
                    value={form.reading_title}
                    onChange={(event) => setField('reading_title', event.target.value)}
                    placeholder="例如：《文城》"
                  />
                </div>

                <div className={shared.field}>
                  <label className={shared.label} htmlFor="profile-reading-author">
                    作者 <span className={shared.labelEn}>Author</span>
                  </label>
                  <input
                    id="profile-reading-author"
                    className={shared.input}
                    value={form.reading_author}
                    onChange={(event) => setField('reading_author', event.target.value)}
                    placeholder="例如：余华"
                  />
                </div>

                <div className={shared.field}>
                  <label className={shared.label} htmlFor="profile-reading-progress">
                    阅读进度 <span className={shared.labelEn}>Progress</span>
                  </label>
                  <input
                    id="profile-reading-progress"
                    className={shared.input}
                    value={form.reading_progress}
                    onChange={(event) => setField('reading_progress', event.target.value)}
                    placeholder="例如：P. 42"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className={styles.actions}>
            {status ? (
              <p
                className={`${shared.status} ${statusClass}`}
                role={status.type === 'error' ? 'alert' : undefined}
              >
                {status.text}
              </p>
            ) : (
              <p className={styles.actionNote}>所有字段保存后即时生效</p>
            )}
            <button type="submit" className={shared.stampButton} disabled={saving || loading}>
              {saving ? '正在归档…' : '保存修改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
