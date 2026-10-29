import { Hero } from '../components/Hero/Hero';
import { FillerCards } from '../components/FillerCards/FillerCards';
import styles from './pages.module.css';

/** 首页：Hero 介绍区 + 不规则 filler 卡片架 */
export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />
      <FillerCards />
    </div>
  );
}
