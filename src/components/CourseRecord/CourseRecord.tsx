import { education } from '../../data/education';
import styles from './CourseRecord.module.css';

export function CourseRecord() {
  return (
    <section id="record" className={styles.record}>
      <div className={styles.inner}>
        {/* 硬纸板夹 / 虚线框档案 */}
        <div className={styles.folder}>
          {/* 档案夹顶部标签 */}
          <div className={styles.tab} aria-hidden="true">
            ACADEMIC RECORD
          </div>

          <p className={styles.stampLine}>OFFICIAL TRANSCRIPT · 学业档案</p>
          <h2 className={styles.heading}>修读课程</h2>

          {/* 专业信息 —— 打字机报头 */}
          <p className={styles.meta}>
            MAJOR: {education.major}
            {education.school && ` · ${education.school}`}
            {education.period && ` · ${education.period}`}
          </p>

          <ul className={styles.courses}>
            {education.courses.map((course, i) => (
              <li key={course.name} className={styles.course}>
                {/* 打字机序号 */}
                <span className={styles.no}>
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <span className={styles.name}>{course.name}</span>
                {/* 手写体批注 */}
                <span className={styles.note}>{course.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
