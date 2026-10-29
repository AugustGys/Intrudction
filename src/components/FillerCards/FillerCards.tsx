import { useEffect, useState } from 'react';
import { getSettings } from '../../api';
import styles from './FillerCards.module.css';

/* ═══════════════════════════════════════════════════════
 * FillerCards —— 首页 Hero 下方的不规则小卡片架
 * 「摘录」与「在读」的内容来自后台个人信息管理，留空时回退默认值
 * ═══════════════════════════════════════════════════════ */

// 后台未配置时的兜底内容
const DEFAULT_QUOTE = {
  text: 'Everything you can imagine is real.',
  from: '— 摘录',
};

const DEFAULT_READING = {
  title: '《文城》',
  author: '余华',
  progress: 'P. 42',
};

type Quote = typeof DEFAULT_QUOTE;
type Reading = typeof DEFAULT_READING;

// PLACEHOLDER: 天气卡（静态占位，后期可接 API）
const WEATHER = { city: '我的城市', temp: '16°', desc: '多云转晴' };

/** 实时时钟卡 */
function ClockCard() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className={`${styles.card} ${styles.clock}`}>
      <p className={styles.cardLabel}>TIME · 此刻</p>
      <p className={styles.clockDigits}>
        {pad(now.getHours())}:{pad(now.getMinutes())}
        <span className={styles.clockSec}>{pad(now.getSeconds())}</span>
      </p>
      <p className={styles.clockDate}>
        {now.getFullYear()}.{pad(now.getMonth() + 1)}.{pad(now.getDate())}
      </p>
    </div>
  );
}

/** 月历卡（自动计算当月，高亮今天） */
function CalendarCard() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 本月 1 号星期几
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  return (
    <div className={`${styles.card} ${styles.calendar}`}>
      <p className={styles.cardLabel}>
        CALENDAR · {year}.{String(month + 1).padStart(2, '0')}
      </p>
      <div className={styles.calGrid}>
        {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
          <span key={d} className={styles.calHead}>{d}</span>
        ))}
        {cells.map((d, i) => (
          <span
            key={i}
            className={`${styles.calDay} ${d === today ? styles.calToday : ''}`}
          >
            {d ?? ''}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 名言摘录卡（手写体） */
function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <div className={`${styles.card} ${styles.quote}`}>
      <p className={styles.cardLabel}>EXCERPT · 摘录</p>
      <p className={styles.quoteText}>{quote.text}</p>
      <p className={styles.quoteFrom}>{quote.from}</p>
    </div>
  );
}

/** 在读图书卡 */
function ReadingCard({ reading }: { reading: Reading }) {
  return (
    <div className={`${styles.card} ${styles.reading}`}>
      <p className={styles.cardLabel}>READING · 在读</p>
      <p className={styles.bookTitle}>{reading.title}</p>
      <p className={styles.bookAuthor}>{reading.author}</p>
      <p className={styles.bookProgress}>{reading.progress}</p>
    </div>
  );
}

/** 天气卡（静态占位） */
function WeatherCard() {
  return (
    <div className={`${styles.card} ${styles.weather}`}>
      <p className={styles.cardLabel}>WEATHER · 天气</p>
      <p className={styles.weatherTemp}>{WEATHER.temp}</p>
      <p className={styles.weatherDesc}>{WEATHER.city} · {WEATHER.desc}</p>
    </div>
  );
}

export function FillerCards() {
  const [quote, setQuote] = useState<Quote>(DEFAULT_QUOTE);
  const [reading, setReading] = useState<Reading>(DEFAULT_READING);

  useEffect(() => {
    let alive = true;
    getSettings()
      .then((settings) => {
        if (!alive || !settings) return;
        if (settings.excerpt_text?.trim()) {
          setQuote({
            text: settings.excerpt_text,
            from: settings.excerpt_from?.trim() || DEFAULT_QUOTE.from,
          });
        }
        if (settings.reading_title?.trim()) {
          setReading({
            title: settings.reading_title,
            author: settings.reading_author?.trim() || '',
            progress: settings.reading_progress?.trim() || '',
          });
        }
      })
      .catch(() => {
        /* 读取失败时保持默认兜底内容 */
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className={styles.shelf} aria-label="随手卡片架">
      <div className={styles.grid}>
        <ClockCard />
        <QuoteCard quote={quote} />
        <CalendarCard />
        <ReadingCard reading={reading} />
        <WeatherCard />
      </div>
    </section>
  );
}
