import { ProjectIndex } from '../components/ProjectIndex/ProjectIndex';
import { FragmentGrid } from '../components/FragmentGrid/FragmentGrid';
import styles from './pages.module.css';

/** 作品页：工程档案（硬核文字列表）+ 碎片与光影（生活画廊） */
export default function Works() {
  return (
    <div className={`${styles.page} ${styles.pagePadded}`}>
      <ProjectIndex />
      <FragmentGrid />
    </div>
  );
}
