import { useEffect, useState } from 'react';
import { getProjects, type ProjectRow } from '../../api';
import styles from './ProjectIndex.module.css';

export function ProjectIndex() {
  const [rows, setRows] = useState<ProjectRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getProjects()
      .then((data) => {
        if (alive) setRows(data);
      })
      .catch(() => {
        if (alive) setError('档案读取失败：请确认后端已在 3001 端口运行');
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="works" className={styles.index}>
      {/* 手写批注 —— 左侧空白处（超宽屏才显示） */}
      <span className={styles.annotate} aria-hidden="true">
        Keep exploring&nbsp;&nbsp;&darr;
      </span>

      <div className={styles.inner}>
        <p className={styles.stampLine}>PROJECT INDEX · 工程档案</p>
        <h2 className={styles.heading}>工程档案</h2>

        {error && <p className={styles.status}>{error}</p>}
        {!error && !rows && <p className={styles.status}>正在调取档案...</p>}

        <ul className={styles.list}>
          {rows?.map((p) => (
            <li key={p.id} className={styles.card}>
              {/* 左侧活页打孔 —— 3 个均匀分布的圆孔 */}
              <div className={styles.holes} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <div className={styles.row}>
                <h3 className={styles.title}>{p.title}</h3>
                <div className={styles.mid}>
                  <p className={styles.desc}>{p.description}</p>
                  <p className={styles.tech}>
                    {(p.tech_stack ?? '')
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
                {/* 盖章式标签 */}
                <span className={styles.stampTag}>{p.category ?? 'CODE'}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
