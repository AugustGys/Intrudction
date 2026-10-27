import styles from './AboutSection.module.css';

export function AboutSection() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.letter}>
        {/* 复古邮戳 —— 右上角双线圆章 */}
        <div className={styles.postmark} aria-hidden="true">
          <span className={styles.postmarkText}>DIGITAL<br />GARDEN</span>
        </div>

        <p className={styles.stampLine}>A LETTER TO YOU</p>

        <div className={styles.body}>
          <p>你好，我是 甘昱升。</p>
          <p>
            目前还是一名学生。这里不是简历，也不是作品集——
            更像是我的一本手稿：写过的代码、做过的设计、
            读过的书，以及一些没头没尾的日常思考。
          </p>
          <p>
            我把这里叫作「数字花园」。东西不多，长得也慢，
            但每一篇都是认真种下的。欢迎你随便逛逛。
          </p>
        </div>

        {/* 手写签名 */}
        <p className={styles.signature}>— yours, GanYuSheng</p>
      </div>
    </section>
  );
}
