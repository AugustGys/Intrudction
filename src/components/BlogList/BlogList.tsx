import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, type PostRow } from '../../api';
import styles from './BlogList.module.css';

export function BlogList() {
  const [rows, setRows] = useState<PostRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  // 展开的行 id；null = 全部收起
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    getPosts()
      .then((data) => {
        if (alive) setRows(data);
      })
      .catch(() => {
        if (alive) setError('手记读取失败：请确认后端已在 3001 端口运行');
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="blog" className={styles.blog}>
      <div className={styles.inner}>
        {/* 区域标题 —— 打字机刊号 + 宋体大标题 */}
        <p className={styles.stampLine}>FIELD NOTES · 手记</p>
        <h2 className={styles.heading}>手记与随笔</h2>

        {error && <p className={styles.status}>{error}</p>}
        {!error && !rows && <p className={styles.status}>正在翻阅手记...</p>}

        <ul className={styles.list}>
          {rows?.map((post) => {
            const open = openId === post.id;
            return (
              <li key={post.id} className={styles.item}>
                <button
                  type="button"
                  className={styles.row}
                  onClick={() => setOpenId(open ? null : post.id)}
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
                <div className={`${styles.excerptWrap} ${open ? styles.open : ''}`}>
                  <p className={styles.excerpt}>{post.summary}</p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* 底部补白：查看全部 + 横向拍立得风景照，平衡右列高度 */}
        {/* PLACEHOLDER: 后期做「全部手记」归档页后，把 to 改成对应路由 */}
        <Link to="/notes" className={styles.moreLink}>
          查看全部手记 <span aria-hidden="true">→</span>
        </Link>

        {/* PLACEHOLDER: 换成你自己的风景照，放 public/images/ 下后改 src */}
        <figure className={styles.snap}>
          <img
            src="https://picsum.photos/seed/notes-landscape/640/400"
            alt="随手的风景"
            loading="lazy"
            className={styles.snapImg}
          />
          <figcaption className={styles.snapCaption}>路上随手拍</figcaption>
        </figure>
      </div>
    </section>
  );
}
