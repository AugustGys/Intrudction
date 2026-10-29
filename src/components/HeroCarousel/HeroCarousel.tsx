import { useCallback, useEffect, useRef, useState } from 'react';
import type { FocusEvent, TouchEvent } from 'react';
import styles from './HeroCarousel.module.css';

/* ═══════════════════════════════════════════════════════
 * HeroCarousel —— 紧贴导航栏下方的全幅影像长条轮播
 * 无标题、无图注、无边框，导航下方直接是一张复古照片
 * 保留：左右切换箭头、右下角页码指示器、自动轮播、触摸滑动
 * ═══════════════════════════════════════════════════════ */

interface Slide {
  src: string;
  alt: string;
  plate: string;
  caption: string;
  /** object-position：竖向图片裁切到横幅比例时的取景位置 */
  position: string;
  width: number;
  height: number;
}

const SLIDES: Slide[] = [
  {
    src: '/images/carousel/plate-01.jpg',
    alt: '两只猫躺在波斯地毯上',
    plate: 'PLATE 01',
    caption: '午后 · 两只猫，一块波斯地毯，一个不想动的下午。',
    position: 'center',
    width: 1040,
    height: 588,
  },
  {
    src: '/images/carousel/plate-02.jpg',
    alt: '泛黄信笺、旧邮票与手写字的拼贴',
    plate: 'PLATE 02',
    caption: '旧信笺 · 邮票与手写字，时间留下的拼贴。',
    position: 'center 38%',
    width: 1024,
    height: 1365,
  },
  {
    src: '/images/carousel/plate-03.jpg',
    alt: '旧书、烛台与一杯咖啡的书桌',
    plate: 'PLATE 03',
    caption: '书桌一角 · 旧书、烛台，和一杯凉掉的咖啡。',
    position: 'center 42%',
    width: 1050,
    height: 1402,
  },
];

const AUTOPLAY_MS = 5000;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener?.('change', sync);
    return () => query.removeEventListener?.('change', sync);
  }, []);

  return reduced;
}

/** 极简线形箭头（细线 + 小箭头），复古排版的留白感 */
function ArrowIcon({ reverse = false }: { reverse?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 12"
      aria-hidden="true"
      focusable="false"
      style={reverse ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path
        d="M40 6H2M8 1L2 6l6 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const reduced = useReducedMotion();
  const touchStartX = useRef<number | null>(null);

  const go = useCallback((direction: number) => {
    setActive((prev) => (prev + direction + SLIDES.length) % SLIDES.length);
  }, []);

  // 页面切到后台时暂停自动轮播
  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (reduced || focused || tabHidden) return;
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [reduced, focused, tabHidden, active]);

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current == null) return;
    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1);
    touchStartX.current = null;
  }

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    // 仅键盘聚焦时暂停，鼠标点击按钮后仍可恢复自动轮播
    const target = event.target as HTMLElement;
    if (target.matches?.(':focus-visible')) setFocused(true);
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setFocused(false);
    }
  }

  return (
    <div className={styles.band}>
      <div
        className={styles.stage}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') go(-1);
          if (event.key === 'ArrowRight') go(1);
        }}
      >
        <div
          className={styles.viewport}
          role="region"
          aria-roledescription="carousel"
          aria-label="近期影像轮播"
          tabIndex={0}
        >
          {SLIDES.map((slide, index) => (
            <div
              key={slide.src}
              className={`${styles.slide} ${index === active ? styles.slideActive : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${SLIDES.length}`}
              aria-hidden={index !== active}
            >
              <img
                className={styles.image}
                src={slide.src}
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                style={{ objectPosition: slide.position }}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          ))}

          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            onClick={() => go(-1)}
            aria-label="上一张"
          >
            <ArrowIcon />
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={() => go(1)}
            aria-label="下一张"
          >
            <ArrowIcon reverse />
          </button>

          <div className={styles.dots} role="tablist" aria-label="切换影像">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`第 ${index + 1} 张：${slide.caption}`}
                className={`${styles.dot} ${index === active ? styles.dotActive : ''}`}
                onClick={() => setActive(index)}
              >
                {String(index + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>

        {/* 纸色 multiply 叠印层：让老照片印进牛皮纸里 */}
        <span className={styles.paperTint} aria-hidden="true" />
        {/* 底边向下的牛皮纸渐变，图片下沿隐入纸背景 */}
        <span className={styles.fade} aria-hidden="true" />
      </div>

      {/* 手工剪贴装饰层：胶带 / 打字机纸条 / 复古分割线（绝对定位，不占文档流） */}
      <div className={styles.ornaments} aria-hidden="true">
        <span className={`${styles.tape} ${styles.tapeLeft}`} />
        <span className={`${styles.tape} ${styles.tapeRight}`} />

        <p className={styles.figSlip}>
          <span className={styles.figText}>
            FIG. {String(active + 1).padStart(2, '0')} — ARCHIVE PLATE / SHOT ON FILM
          </span>
          <span className={styles.figTape} />
        </p>

        <span className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerMark}>◇</span>
          <span className={styles.dividerLine} />
        </span>
      </div>
    </div>
  );
}
