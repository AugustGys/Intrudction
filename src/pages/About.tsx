import { AboutSection } from '../components/AboutSection/AboutSection';
import styles from './pages.module.css';

/** 关于页：手写信 */
export default function About() {
  return (
    <div className={`${styles.page} ${styles.pagePadded}`}>
      <AboutSection />
    </div>
  );
}
