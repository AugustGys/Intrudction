import { useEffect, useState } from 'react';
import { getSettings, type Settings } from '../../api';
import styles from './AboutMeCard.module.css';

/** 个人介绍档案卡 —— 介绍页右侧的宽卡片 */
export function AboutMeCard() {
  const [data, setData] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getSettings()
      .then((s) => {
        if (alive) setData(s);
      })
      .catch(() => {
        if (alive) setError('个人档案读取失败：请确认后端已在 3001 端口运行');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className={styles.wrap} aria-label="个人介绍">
      <div className={styles.card}>
        {/* 档案夹索引标签页 */}
        <span className={styles.tab} aria-hidden="true">PERSONAL FILE</span>

        <p className={styles.stampLine}>DOSSIER · 自我介绍</p>
        <h2 className={styles.heading}>关于我</h2>

        {loading && <p className={styles.status}>正在调取个人档案...</p>}
        {error && <p className={styles.status}>{error}</p>}

        {data && (
          <>
            {/* 基本信息：打字机登记行 */}
            <dl className={styles.fields}>
              <div className={styles.field}>
                <dt>AGE</dt><dd>{data.age || '—'}</dd>
              </div>
              <div className={styles.field}>
                <dt>LOC</dt><dd>{data.location || '—'}</dd>
              </div>
              <div className={styles.field}>
                <dt>MAJOR</dt><dd>{data.major || '—'}</dd>
              </div>
              <div className={styles.field}>
                <dt>HOBBY</dt><dd>{data.hobbies || '—'}</dd>
              </div>
            </dl>

            {/* 荣誉与证书：盖章列表 */}
            <p className={styles.subLabel}>HONORS · 荣誉与证书</p>
            <ul className={styles.honors}>
              {data.honors.map((h) => (
                <li key={h.title} className={styles.honor}>
                  <span className={styles.honorTitle}>{h.title}</span>
                  <span className={styles.honorYear}>{h.year}</span>
                </li>
              ))}
            </ul>

            {/* 个人简介：后台「个人简介」即写即同步 */}
            <p className={styles.monologue}>{data.bio || data.monologue}</p>
          </>
        )}
      </div>
    </section>
  );
}
