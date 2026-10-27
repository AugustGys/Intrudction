import styles from './Nav.module.css';

const navItems = [
  { label: '首页', href: '#top' },
  { label: '作品', href: '#works' },
  { label: '手记', href: '#blog' },
  { label: '关于', href: '#about' },
];

export function Nav() {
  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <a href="#top" className={styles.logo}>My Introduction</a>
        <nav className={styles.links}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.link}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
