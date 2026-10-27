import { projects } from '../../data/projects';
import styles from './ProjectIndex.module.css';

export function ProjectIndex() {
  return (
    <section id="works" className={styles.index}>
      {/* 手写批注 —— 左侧空白处（超宽屏才显示） */}
      <span className={styles.annotate} aria-hidden="true">
        Keep exploring&nbsp;&nbsp;&darr;
      </span>

      <div className={styles.inner}>
        <p className={styles.stampLine}>PROJECT INDEX · 工程档案</p>
        <h2 className={styles.heading}>工程档案</h2>

        <ul className={styles.list}>
          {projects.map((p) => (
            <li key={p.title} className={styles.card}>
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
                  <p className={styles.tech}>{p.highlights.join(' · ')}</p>
                </div>
                {/* 盖章式标签 */}
                <span className={styles.stampTag}>{p.tag}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
