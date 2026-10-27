import type { Fragment } from '../../data/fragments';
import styles from './FragmentCard.module.css';

interface FragmentCardProps {
  fragment: Fragment;
  /** 在网格中的渲染顺序，用于加载动画延迟 60ms/张 */
  index: number;
  /** 主海报卡（第 0 张跨两列，带 ARCHIVE 印章） */
  featured?: boolean;
}

export function FragmentCard({ fragment, index, featured }: FragmentCardProps) {
  return (
    <article
      className={`${styles.card} ${featured ? styles.featured : ''}`}
      style={{ ['--load-delay' as string]: `${index * 60}ms` }}
    >
      <p className={styles.number}>№ {fragment.index}</p>

      {/* 复古印刷配图 —— 滤镜 + multiply 混合，像印在旧纸上 */}
      {fragment.image && (
        <img
          className={styles.picture}
          src={fragment.image}
          alt={fragment.title}
          loading="lazy"
        />
      )}

      <h3 className={styles.title}>{fragment.title}</h3>
      <p className={styles.description}>{fragment.description}</p>
      <p className={styles.highlights}>
        {fragment.highlights.join(' · ')}
      </p>

      {/* 档案页码角标 —— 右下角 */}
      <span className={styles.pageMark}>— P. 0{index + 1} —</span>

      {/* 档案馆印章 —— 主海报卡右上角 */}
      {featured && <span className={styles.stamp}>ARCHIVE</span>}
    </article>
  );
}
