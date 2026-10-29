import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMessages, getPosts, getProjects } from '../api';
import shared from './admin.module.css';
import styles from './AdminDashboard.module.css';

interface Counts {
  projects: number;
  posts: number;
  messages: number;
}

export function AdminDashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([getProjects(), getPosts(), getMessages()])
      .then(([projects, posts, messages]) => {
        if (!alive) return;
        setCounts({
          projects: projects.length,
          posts: posts.length,
          messages: messages.length,
        });
      })
      .catch(() => {
        if (alive) setError('目录读取失败：请确认后端已在 3001 端口运行。');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const stats = [
    { index: '01', label: '工程档案', en: 'Projects', value: counts?.projects },
    { index: '02', label: '手记随笔', en: 'Journal', value: counts?.posts },
    { index: '03', label: '访客留言', en: 'Guestbook', value: counts?.messages },
  ];

  return (
    <div className={shared.page}>
      <header className={shared.header}>
        <p className={shared.kicker}>CONTENT OFFICE · 内务工作台</p>
        <h1 className={shared.title}>内容管理</h1>
        <p className={shared.desc}>
          所有馆藏的总目录。左侧抽屉按编目装订，任何改动都会即时写回档案库。
        </p>
      </header>

      <div className={shared.rule} aria-hidden="true" />

      {error && (
        <p className={`${shared.status} ${shared.statusError}`} role="alert">
          {error}
        </p>
      )}
      {loading && !error && <p className={shared.status}>正在清点馆藏…</p>}

      <div className={styles.stats}>
        {stats.map((stat) => (
          <article key={stat.index} className={styles.statCard}>
            <span className={styles.statTab}>FILE {stat.index}</span>
            <p className={styles.statIndex}>NO. {stat.index} / 馆藏</p>
            <p className={styles.statValue}>{stat.value ?? '—'}</p>
            <p className={styles.statLabel}>{stat.label}</p>
            <p className={styles.statEn}>{stat.en}</p>
            <span className={styles.statStamp}>已归档</span>
          </article>
        ))}
      </div>

      <div className={styles.lower}>
        <section className={styles.quick} aria-label="快捷归档">
          <p className={shared.sectionKicker}>QUICK ACCESS · 快捷归档</p>
          <h2 className={shared.sectionTitle}>下一步做什么</h2>

          <div className={styles.quickLinks}>
            <Link to="/admin/dashboard/profile" className={styles.quickLink}>
              <span>
                <span className={styles.quickLabel}>修改个人信息</span>
                <span className={styles.quickEn}>Personnel File</span>
              </span>
              <span className={styles.quickArrow} aria-hidden="true">
                →
              </span>
            </Link>

            <Link to="/admin/dashboard/projects" className={styles.quickLink}>
              <span>
                <span className={styles.quickLabel}>整理工程档案</span>
                <span className={styles.quickEn}>Projects</span>
              </span>
              <span className={styles.quickArrow} aria-hidden="true">
                →
              </span>
            </Link>

            <Link to="/admin/dashboard/posts" className={styles.quickLink}>
              <span>
                <span className={styles.quickLabel}>补录手记随笔</span>
                <span className={styles.quickEn}>Journal</span>
              </span>
              <span className={styles.quickArrow} aria-hidden="true">
                →
              </span>
            </Link>

            <Link to="/admin/dashboard/messages" className={styles.quickLink}>
              <span>
                <span className={styles.quickLabel}>处理访客留言</span>
                <span className={styles.quickEn}>Guestbook</span>
              </span>
              <span className={styles.quickArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </section>

        <aside className={styles.memo} aria-label="馆员备忘">
          <p className={styles.memoKicker}>MEMO · 馆员备忘</p>
          <p className={styles.memoBody}>
            先归档，再发布。
            <br />
            修改个人信息后点击「保存修改」，新档案会立即写回馆藏。
          </p>
          <p className={styles.memoSign}>— Archive Office</p>
        </aside>
      </div>
    </div>
  );
}
