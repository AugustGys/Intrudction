import { PaperBackground } from './components/PaperBackground/PaperBackground';
import { EdgeDecorations } from './components/EdgeDecorations/EdgeDecorations';
import { Nav } from './components/Nav/Nav';
import { Hero } from './components/Hero/Hero';
import { ProjectIndex } from './components/ProjectIndex/ProjectIndex';
import { BlogList } from './components/BlogList/BlogList';
import { CourseRecord } from './components/CourseRecord/CourseRecord';
import { FragmentGrid } from './components/FragmentGrid/FragmentGrid';
import { AboutSection } from './components/AboutSection/AboutSection';
import { Footer } from './components/Footer/Footer';
import styles from './App.module.css';

export default function App() {
  return (
    <>
      {/* 牛皮纸纹理 + 暗角：z-index 0 / 1, pointer-events none */}
      <PaperBackground />

      {/* 宽屏边缘装饰：准星 / marginalia / 装订孔 */}
      <EdgeDecorations />

      {/* 内容层：z-index 10，盖住背景 */}
      <div className={styles.root}>
        <Nav />
        <main>
          {/* 1. Hero：大标题 + 介绍 + 个人照片 */}
          <Hero />

          {/* 2. 工程档案：纯文字项目列表（硬核） */}
          <ProjectIndex />

          {/* 3. 双列：手记与随笔 | 学业档案 */}
          <div className={styles.twoCol}>
            <BlogList />
            <CourseRecord />
          </div>

          {/* 4. 碎片与光影：图文并茂的生活记录（文艺） */}
          <FragmentGrid />

          {/* 5. 关于我：手写信 */}
          <AboutSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
