import { useState } from 'react';
import { posts } from '../../data/posts';
import styles from './BlogList.module.css';

export function BlogList() {
  // 展开的行索引；null = 全部收起
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="blog" className={styles.blog}>
      <div className={styles.inner}>
        {/* 区域标题 —— 打字机刊号 + 宋体大标题 */}
        <p className={styles.stampLine}>FIELD NOTES · 手记</p>
        <h2 className={styles.heading}>手记与随笔</h2>

        <ul className={styles.list}>
          {posts.map((post, i) => {
            const open = openIndex === i;
            return (
              <li key={post.date + post.title} className={styles.item}>
                <button
                  type="button"
                  className={styles.row}
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                >
                  {/* 手绘勾选批注 */}
                  <span className={styles.mark} aria-hidden="true">✓</span>
                  <span className={styles.date}>{post.date}</span>
                  <span className={styles.title}>{post.title}</span>
                  <span className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`}>
                    →
                  </span>
                </button>

                {/* 原地展开摘要 */}
                <div
                  className={`${styles.excerptWrap} ${open ? styles.open : ''}`}
                >
                  <p className={styles.excerpt}>{post.excerpt}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
