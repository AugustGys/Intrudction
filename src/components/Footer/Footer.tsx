import styles from './Footer.module.css';

// PLACEHOLDER — 搜索 "// PLACEHOLDER" 替换为你的真实社交链接
const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/AugustGys' },    // PLACEHOLDER
  { label: 'X', href: '#' },          // PLACEHOLDER
  { label: 'Email', href: 'mailto:2219501783@qq.com' }, // PLACEHOLDER
];

export function Footer() {
  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} GanYuSheng
        </p>
        <nav className={styles.links}>
          {socialLinks.map((item) => (
            <a key={item.label} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
