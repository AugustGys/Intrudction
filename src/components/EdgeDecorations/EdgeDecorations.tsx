import styles from './EdgeDecorations.module.css';

const BINDER_HOLES = Array.from({ length: 8 });

/** 全屏边缘装饰：marginalia 垂直文字 + 四角印刷准星 + 左侧装订孔 */
export function EdgeDecorations() {
  return (
    <div className={styles.layer} aria-hidden="true">
      {/* 1. 左右垂直 marginalia —— 杂志页眉页脚标记 */}
      <p className={`${styles.marginalia} ${styles.marginLeft}`}>
        DIGITAL GARDEN · SCROLL TO EXPLORE
      </p>
      <p className={`${styles.marginalia} ${styles.marginRight}`}>
        PORTFOLIO · 2026 · MY INTRODUCTION
      </p>

      {/* 2. 四角印刷准星（圆圈 + 十字线） */}
      <span className={`${styles.mark} ${styles.tl}`} />
      <span className={`${styles.mark} ${styles.tr}`} />
      <span className={`${styles.mark} ${styles.bl}`} />
      <span className={`${styles.mark} ${styles.br}`} />

      {/* 3. 左侧活页装订孔 —— 整页纸被装订在本子上的暗示 */}
      <div className={styles.binder}>
        {BINDER_HOLES.map((_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  );
}
