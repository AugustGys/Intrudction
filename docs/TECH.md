# 技术文档 — My Introduction 数字花园

## 1. 技术栈

- **框架**：React 18 + TypeScript 5
- **构建**：Vite 5
- **样式**：CSS Modules（每个组件一个 `.module.css`）+ 全局设计变量（`design-tokens.css`）
- **零运行时依赖**：除 `react` / `react-dom` 外无第三方库；无图片资源包，字体走 Google Fonts CDN

## 2. 运行与构建

```bash
npm install      # 安装依赖
npm run dev      # 开发服务器（Vite，HMR）
npm run build    # 类型检查 tsc -b + 生产构建，输出 dist/
```

## 3. 目录结构

```
MyIntruduction/
├── index.html                  # Google Fonts 外链（Fraunces / Noto Serif SC / JetBrains Mono / Caveat）
├── public/
│   ├── paper-bg.png            # 牛皮纸背景图（用户自放）
│   ├── images/profile.jpg      # 个人照片（用户自放）
│   └── cursors/                # 自定义光标 SVG（quill.svg / gear.svg）
├── docs/                       # 本文档 + PRD.md
└── src/
    ├── main.tsx                # Vite 入口，挂载 #root，导入 global.css
    ├── App.tsx                 # 页面组装（见 §4 分层）
    ├── App.module.css          # 内容层 z-index: 10 + 双列容器
    ├── styles/
    │   ├── design-tokens.css   # :root CSS 变量（色板/间距/动效，见 PRD §4.1）
    │   └── global.css          # reset、字体栈、平滑滚动、选中色、光标、背景水印、减动效
    ├── data/                   # 纯数据，无逻辑；占位内容均有 // PLACEHOLDER 标记
    │   ├── projects.ts         # Project[] — 工程档案
    │   ├── posts.ts            # Post[] — 手记（date/title/excerpt/content?）
    │   ├── education.ts        # Education — major/school/period/courses[]
    │   └── fragments.ts        # Fragment[] — 碎片画廊（含 image?）
    └── components/             # 每个组件 = Xxx.tsx + Xxx.module.css
        ├── PaperBackground/    # 背景图 + 暗角，fixed，z-index 0/1，pointer-events none
        ├── EdgeDecorations/    # 宽屏边缘装饰层，z-index 2，pointer-events none
        ├── Nav/                # fixed 导航，毛玻璃底
        ├── Hero/               # 刊号/标题/肖像拍立得/「园」水印
        ├── ProjectIndex/       # 工程档案活页索引卡列表
        ├── BlogList/           # 手记目录，原地展开（useState openIndex）
        ├── CourseRecord/       # 学业档案纸板夹
        ├── FragmentGrid/       # Bento 网格容器（跨列 + 加载延迟编排）
        ├── FragmentCard/       # 碎片卡片（滤镜图片/胶带/印章/页码）
        ├── AboutSection/       # 手写信 + 邮戳
        └── Footer/             # 毛玻璃页脚
```

## 4. 分层架构（z-index 契约）

| 层 | z-index | 组件 | 说明 |
|---|---|---|---|
| 背景纹理 | 0 | PaperBackground 底图 | `position: fixed; pointer-events: none` |
| 暗角 | 1 | PaperBackground vignette | radial-gradient 蒙层 |
| 边缘装饰 | 2 | EdgeDecorations | 半透明卡片处会隐约透出，更像印在纸上 |
| 内容 | 10 | App `.root` | 盖过所有装饰 |

**约束**：新增任何 fixed/absolute 装饰必须遵守此表并加 `pointer-events: none`，否则遮挡内容点击。

## 5. 数据流

单向无状态管理库：`data/*.ts` → 组件 props 直读。唯一交互状态是 BlogList 的 `openIndex`（哪一行展开）。

## 6. 关键实现点

### 6.1 复古滤镜（FragmentCard 图片）

```css
filter: sepia(0.7) grayscale(0.4) contrast(1.1) brightness(0.9);
mix-blend-mode: multiply;   /* 与牛皮纸纹理融合，像印刷上去 */
opacity: 0.9;
```

外链 picsum 图片固定种子（`?seed=xxx`），保证刷新不变；换成本地图时把 `image` 改为 `/images/xxx.jpg` 即可，滤镜自动生效。

### 6.2 毛玻璃

导航 / 页脚 / 档案卡均使用 `backdrop-filter: blur(...)` + 半透明底色。依赖 `-webkit-` 前缀由浏览器自动处理（构建无需 autoprefixer 配置）。

### 6.3 加载编排动画

FragmentGrid 给每张卡注入内联 CSS 变量 `--load-delay: ${index * 60}ms`，卡片 `card-fade-up` keyframes 消费该变量——编排逻辑在父组件、动画定义在子组件 CSS，职责分离。

### 6.4 平滑滚动与锚点偏移

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: var(--nav-height); /* fixed 导航不遮标题 */
}
```

### 6.5 自定义光标

```css
@media (hover: hover) and (pointer: fine) {
  body { cursor: url('/cursors/quill.svg') 2 2, auto; }
  a, button, [role='button'] { cursor: url('/cursors/gear.svg') 12 12, pointer; }
}
```

- 热点 = `url()` 后的 `X Y`，指 SVG 24×24 画面内「真实点击点」的像素坐标
- 触屏设备（`pointer: coarse`）不匹配媒体查询，自动用系统指针
- SVG 内 `fill: none`，内容顶格绘制避免指针「飘」

### 6.6 双线边框技巧

单元素实现双线：外层 `border: 1px solid rgba(43,29,20,0.3)` + 内层 `box-shadow: inset 0 0 0 1px rgba(43,29,20,0.15)`（ProjectIndex 档案卡、AboutSection 邮戳、ARCHIVE 印章同法）。

### 6.7 减动效

`global.css` 内 `@media (prefers-reduced-motion: reduce)` 将所有 `animation/transition` 时长压至 0.01ms、禁用平滑滚动。

## 7. 外部依赖一览

| 资源 | 来源 | 用途 |
|---|---|---|
| Google Fonts | fonts.googleapis.com | Fraunces / Noto Serif SC / JetBrains Mono / Caveat |
| picsum.photos | 外链图片 | 碎片区占位配图（固定种子） |
| 本地图片 | `public/` | `paper-bg.png`、`images/profile.jpg`（需用户自放） |

## 8. 已知注意事项

- `index.html` 的 `<title>` 仍为 `Selected Works — Portfolio`，与数字花园定位不符，待改。
- BlogList 的展开内容目前只显示 `excerpt`，`content` 字段已预留（详情页或 Modal 属后续迭代）。
- `docs/agents/` 下的 agent 配置（issue-tracker / domain）与站点代码无关，是工作流配置。
