import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearToken } from '../api';
import styles from './AdminLayout.module.css';

const MENU = [
  { index: '01', label: '内容概览', en: 'Overview', to: '/admin/dashboard', end: true },
  { index: '02', label: '个人信息', en: 'Personnel', to: '/admin/dashboard/profile', end: false },
  { index: '03', label: '项目管理', en: 'Projects', to: '/admin/dashboard/projects', end: false },
  { index: '04', label: '博客管理', en: 'Journal', to: '/admin/dashboard/posts', end: false },
  { index: '05', label: '留言管理', en: 'Guestbook', to: '/admin/dashboard/messages', end: false },
];

export function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate('/admin', { replace: true });
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar} aria-label="后台目录">
        <span className={styles.spine} aria-hidden="true">
          MY GARDEN · 私人档案馆 · INTERNAL USE ONLY
        </span>

        <div className={styles.brand}>
          <p className={styles.brandKicker}>ARCHIVE · NO. 028</p>
          <Link to="/admin/dashboard" className={styles.brandTitle}>
            数字花园
          </Link>
          <p className={styles.brandSub}>内部档案管理系统</p>
        </div>

        <nav className={styles.menu} aria-label="后台导航">
          <p className={styles.menuLabel}>馆藏目录 / Catalog</p>
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? `${styles.item} ${styles.itemActive}` : styles.item
              }
            >
              <span className={styles.itemIndex}>{item.index}</span>
              <span className={styles.itemText}>
                <span className={styles.itemLabel}>{item.label}</span>
                <span className={styles.itemEn}>{item.en}</span>
              </span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <Link to="/" className={styles.siteLink}>
            ← 返回前台档案馆
          </Link>
          <button type="button" className={styles.logout} onClick={handleLogout}>
            注销通行证
          </button>
          <p className={styles.footerNote}>Admin Only · 2026</p>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
