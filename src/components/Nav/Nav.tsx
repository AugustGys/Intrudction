import { Link, NavLink } from 'react-router-dom';
import styles from './Nav.module.css';

const navItems = [
  { label: '首页', to: '/' },
  { label: '作品', to: '/works' },
  { label: '介绍', to: '/notes' },
  { label: '留言', to: '/guestbook' },
  { label: '关于', to: '/about' },
];

export function Nav() {
  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>My Introduction</Link>
        <nav className={styles.links}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
