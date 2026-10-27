import { fragments } from '../../data/fragments';
import { FragmentCard } from '../FragmentCard/FragmentCard';
import styles from './FragmentGrid.module.css';

export function FragmentGrid() {
  return (
    <section id="fragments" className={styles.section}>
      {/* 手写批注 —— 右侧空白处（超宽屏才显示） */}
      <span className={styles.annotate} aria-hidden="true">
        life in fragments&nbsp;&larr;
      </span>

      <div className={styles.inner}>
        <p className={styles.stampLine}>FRAGMENTS &amp; LIGHT · 生活碎片</p>
        <h2 className={styles.heading}>碎片与光影</h2>

        {/* 复古装饰分割线 */}
        <div className={styles.divider} aria-hidden="true">
          <svg viewBox="0 0 600 24" width="600" height="24" fill="none">
            <line x1="0" y1="12" x2="238" y2="12" stroke="currentColor" strokeWidth="1" />
            <line x1="362" y1="12" x2="600" y2="12" stroke="currentColor" strokeWidth="1" />
            <path d="M300 5 L307 12 L300 19 L293 12 Z" fill="currentColor" />
            <path d="M262 12 h10 M267 7 v10" stroke="currentColor" strokeWidth="1" />
            <path d="M328 12 h10 M333 7 v10" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        {/* Bento 网格：行1 [00 00 01] · 行2 [02 03 03] */}
        <div className={styles.grid}>
          {fragments.map((fragment, index) => (
            <div
              key={fragment.index}
              className={index === 0 ? styles.featured : undefined}
            >
              <FragmentCard
                fragment={fragment}
                index={index}
                featured={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
