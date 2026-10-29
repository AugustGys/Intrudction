import { BlogList } from '../components/BlogList/BlogList';
import { AboutMeCard } from '../components/AboutMeCard/AboutMeCard';
import styles from './pages.module.css';

/** 介绍页：手记与随笔 | 个人介绍档案卡（错落双列杂志内页） */
export default function Notes() {
  return (
    <div className={`${styles.page} ${styles.twoCol}`}>
      <BlogList />
      <AboutMeCard />
    </div>
  );
}
