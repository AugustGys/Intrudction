import styles from './AboutSection.module.css';

/* PLACEHOLDER: 常用工具（想增减直接改数组） */
const TOOLS = ['VS Code', 'Trae', 'Intellij IDEA', 'Git'];

/* PLACEHOLDER: 联系方式（换成你的邮箱和 GitHub 主页） */
const CONTACTS = [
  { label: 'EMAIL ME', href: 'mailto:hello@example.com' },
  { label: 'GITHUB', href: 'https://github.com/' },
];

export function AboutSection() {
  return (
    <section className={styles.about}>
      <div className={styles.letter}>
        {/* 右上角邮票（齿孔边缘 + 极小风景图） */}
        <div className={styles.stamp} aria-hidden="true">
          <img src="https://picsum.photos/seed/letter-landscape/120/140" alt="" className={styles.stampImg} />
          <span className={styles.stampPrice}>2026</span>
        </div>

        {/* 圆形邮戳：波浪线 + 城市 + 日期 */}
        <div className={styles.postmark} aria-hidden="true">
          <svg className={styles.waves} viewBox="0 0 60 24" fill="none">
            <path d="M2 5 q5 -4 10 0 t10 0 t10 0 t10 0 t10 0" stroke="currentColor" strokeWidth="1.1" />
            <path d="M2 12 q5 -4 10 0 t10 0 t10 0 t10 0 t10 0" stroke="currentColor" strokeWidth="1.1" />
            <path d="M2 19 q5 -4 10 0 t10 0 t10 0 t10 0 t10 0" stroke="currentColor" strokeWidth="1.1" />
          </svg>
          <div className={styles.postmarkCircle}>
            <span className={styles.postmarkCity}>DALIAN</span>
            <span className={styles.postmarkDate}>2026.10.29</span>
          </div>
        </div>

        <p className={styles.stampLine}>A LETTER TO YOU</p>

        <div className={styles.body}>
          <p>你好，我是 甘昱升。</p>
          <p>
            目前还是一名学生。这里不是简历，也不是作品集——
            更像是我的一本手稿：写过的代码、做过的设计、
            读过的书，以及一些没头没尾的日常思考。
          </p>
          <p>
            我把这里叫作「数字花园」。东西不多，长得也慢，
            但每一篇都是认真种下的。欢迎你随便逛逛。
          </p>
        </div>

        {/* 手写签名 */}
        <p className={styles.signature}>— yours, GanYuSheng</p>
      </div>

      {/* ─── 信纸下方：常驻工具与联系方式 ─── */}
      <div className={styles.below}>
        <ul className={styles.tools} aria-label="常用工具">
          {TOOLS.map((t) => (
            <li key={t} className={styles.tool}>{t}</li>
          ))}
        </ul>

        <nav className={styles.contacts} aria-label="联系方式">
          {CONTACTS.map((c) => (
            <a key={c.label} href={c.href} className={styles.contact} target="_blank" rel="noreferrer">
              {c.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
