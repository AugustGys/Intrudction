import styles from './PaperBackground.module.css';

/**
 * PaperBackground — 复古牛皮纸 / 老派手稿背景
 *
 * 两层叠加：
 *   1. .imgLayer —— 真实牛皮纸纹理图（Unsplash URL），背景色后备 #E3D1B6
 *   2. .vignette —— 暗角径向渐变，模拟旧纸张边缘发黄发暗
 *
 * 全局约束：pointer-events none / position fixed / z-index 0-1
 * 内容层在 App.tsx 里有更高 z-index
 */
export function PaperBackground() {
  return (
    <div aria-hidden="true">
      {/* Layer 1: 真实牛皮纸纹理 */}
      <div className={styles.imgLayer} />
      {/* Layer 2: 边缘暗角 Vignette */}
      <div className={styles.vignette} />
    </div>
  );
}
