import { HeroCarousel } from '../HeroCarousel/HeroCarousel';
import styles from './Hero.module.css';

/** 当图片加载失败时，显示占位灰底 + "Your Photo" */
function PortraitFallback() {
  return <div className={styles.portraitPlaceholder}>Your Photo</div>;
}

export function Hero() {
  return (
    <section id="top" className={styles.hero}>
      {/* 水印字 —— 数字花园 */}
      <span aria-hidden="true" className={styles.watermark}>园</span>

      {/* 导航栏下方的全幅影像档案轮播 */}
      <HeroCarousel />

      <div className={styles.inner}>
        {/* 左侧文字区 */}
        <div className={styles.textWrap}>
          <p className={styles.stampLine}>EST. 2026 · VOL. 01</p>
          <p className={styles.tagline}>MY INTRODUCTION TO THE WORLD · 2026</p>
          <h1 className={styles.title}>My Introduction </h1>
          <p className={styles.subtitle}>
            我是一个普通的学生，热爱技术，也热爱生活。我没有轰轰烈烈的大志向或者大愿望，我想过好当下。
          </p>
        </div>

        {/* 右侧个人肖像拍立得 */}
        <div className={styles.portraitWrap}>
          <img
            className={styles.portrait}
            src="/images/profile.jpg"
            alt="Your portrait"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              const parent = (e.currentTarget as HTMLImageElement)
                .parentElement as HTMLElement;
              if (parent && !parent.querySelector('.portrait-placeholder')) {
                const placeholder = document.createElement('div');
                placeholder.className = 'portrait-placeholder';
                placeholder.textContent = 'Your Photo';
                Object.assign(placeholder.style, {
                  width: '100%',
                  aspectRatio: '4 / 5',
                  backgroundColor: '#A89880',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  letterSpacing: '0.18em',
                  color: 'rgba(43, 29, 20, 0.4)',
                  textTransform: 'uppercase',
                });
                parent.appendChild(placeholder);
              }
            }}
          />
          {/* SSR / 无 JS 时的 fallback */}
          <noscript>
            <PortraitFallback />
          </noscript>
          {/* 手写批注 —— 照片下方，Caveat 手写体 */}
          <p className={styles.handnote}>A collection of recent works.</p>
        </div>
      </div>
    </section>
  );
}
