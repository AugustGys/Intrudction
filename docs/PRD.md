# 需求文档（PRD）— My Introduction 数字花园

> 版本：v1.0（对应当前代码实现）
> 本文档描述的是**最终落地**的需求；仓库根目录的 `PRD.md` 为最初的设计原稿，已不一致，仅作历史参考。

---

## 1. 产品定位

一个**学生的个人数字花园（Digital Garden）/ 手稿本**——不是求职简历，而是记录代码、设计与日常思考的个人站点。

- **风格**：复古牛皮纸 / 老派手稿。像一本装订起来的旧档案册，而非现代作品集网站。
- **形态**：单页应用（Single Page），全部内容纵向排列，导航锚点平滑滚动。
- **语言**：中文为主，英文仅作排版点缀（刊号、印章、批注）。

## 2. 页面结构（自上而下）

| 序 | 模块 | 锚点 | 内容 |
|---|---|---|---|
| 0 | 全局背景 | — | 牛皮纸纹理图 + 边缘暗角（Vignette） |
| 1 | Hero | `#top` | 刊号 `EST. 2026 · VOL. 01`、大标题、介绍文案、个人肖像（拍立得样式 + 手写批注）、巨型「园」字水印 |
| 2 | 工程档案 | `#works` | 纯文字项目列表，每条是一张「活页索引卡」（打孔 + 双线边框 + 盖章角标） |
| 3 | 手记与随笔 \| 学业档案 | `#blog` | 左右双列杂志内页（1fr / 1.2fr），中间垂直虚线分隔 |
| 4 | 碎片与光影 | `#fragments` | 图文并茂的生活记录画廊（Bento Grid 拼贴卡） |
| 5 | 关于我 | `#about` | 手写信风格 + 邮戳装饰 + 手写签名 |
| 6 | 页脚 | `#contact` | 社交链接与邮箱 |

### 2.1 导航

`首页 → #top`、`作品 → #works`、`手记 → #blog`、`关于 → #about`。
导航栏 fixed 置顶，半透明毛玻璃底（`blur(8px)`），底部深褐细线；点击锚点平滑滚动（`scroll-behavior: smooth` + `scroll-padding-top` 偏移）。

## 3. 各模块需求

### 3.1 工程档案（ProjectIndex）

- 数据源 `src/data/projects.ts`，字段：`id / title / description / highlights / kind`
- 每条 = 独立「活页索引卡」：半透明纸底 `rgba(251,249,244,0.7)` + `blur(4px)`、双线边框、圆角 4px、左侧 3 个打孔
- 卡内布局：打孔列 → 标题（21px 加粗）+ 描述（15px / 行高 1.6）+ 技术栈（13px 宽字距，复古红）→ 右侧盖章标签 `[CODE]` / `[HARDWARE]`（红框微倾）
- 交互：hover 时卡片 `translateX(4px)` 右移（抽拉档案感），标题变复古红

### 3.2 手记与随笔（BlogList）

- 数据源 `src/data/posts.ts`，字段：`date / title / excerpt / content?`
- 档案目录式行列表：手绘勾选 `✓`（Caveat 手写体）→ 打字机字体日期 → 衬线大标题 → 右端箭头 `→`
- 行间极细虚线分隔 `rgba(43,29,20,0.2)`
- 点击行**原地展开**摘要（grid-template-rows 动画），箭头旋转 90°；hover 行底微深 + 标题变红 + 箭头右移 6px

### 3.3 学业档案（CourseRecord）

- 数据源 `src/data/education.ts`，字段：`major / school / period / courses[{name, note}]`
- 「硬纸板夹」外观：虚线外框 + 内侧双线描边 + 微倾 0.3deg + 左上角 `ACADEMIC RECORD` 索引标签页
- 课程行：打字机序号 `01.` → 衬线加粗课程名 → 右侧手写体批注；行间虚线；hover 课程名变红

### 3.4 碎片与光影（FragmentGrid + FragmentCard）

- 数据源 `src/data/fragments.ts`，字段：`id / title / description / highlights / image?`
- Bento Grid：等宽三列，行 1 `[00 00 01]`、行 2 `[02 03 03]`（主海报卡与末卡对角跨列），同行等高
- 卡片：半透明纸底 + 深褐细边框 + 顶部胶带装饰；配图统一 `aspect-ratio: 16/9` + `object-fit: cover`
- **复古融合滤镜**（图片必须套用）：
  `filter: sepia(0.7) grayscale(0.4) contrast(1.1) brightness(0.9); mix-blend-mode: multiply; opacity: 0.9`
- 编号：打字机字体 `№ 00` 斜体；页码角标 `— P. 01 —`；主海报卡右上角 `ARCHIVE` 红印章（双线框、rotate -10°）
- 交互：hover `translateY(-3px) scale(1.01)` + `z-index: 10`；标题下划线从左展开；加载时按编号顺序淡入（每张延迟 60ms）

### 3.5 关于我（AboutSection）

- 手写信样式：信纸微倾 -0.4deg，右上角双线圆邮戳 `DIGITAL GARDEN`（复古红 rotate 10°），结尾 Caveat 手写签名
- 内容为感性随笔文案（非简历口吻）

## 4. 视觉规范

### 4.1 色板（`src/styles/design-tokens.css`）

| Token | 值 | 用途 |
|---|---|---|
| `--color-canvas` | `#B29770` | 后备底色（图片加载失败时） |
| `--color-paper` | `rgba(245,235,215,0.4)` | 卡片半透明羊皮纸 |
| `--color-nav-bg` | `rgba(190,170,140,0.7)` | 导航/页脚毛玻璃底 |
| `--color-ink` | `#2B1D14` | 主文字（深墨水） |
| `--color-muted` | `#5E4B35` | 次要文字（深卡其） |
| `--color-accent` | `#8B3A2E` | 强调色（复古褪色红） |
| `--color-border` | `rgba(43,29,20,0.2)` | 边框/分割线 |

### 4.2 字体

`Fraunces, 'Noto Serif SC', serif`（全局衬线）· `JetBrains Mono`（打字机/编号/日期/印章）· `Caveat`（手写批注/签名）。

### 4.3 背景与边缘装饰

- 背景：`public/paper-bg.png` 牛皮纸实拍图，`cover / center / fixed` + radial-gradient 暗角
- 宽屏边缘装饰（EdgeDecorations，全部 `pointer-events: none`）：左右垂直 marginalia 文字、四角印刷准星、左侧装订孔、手写批注（≥1440px 显示）
- `body::before/after` 极淡几何水印（`+`、`◇`，透明度 0.1）

## 5. 交互与无障碍

- 自定义光标：桌面端 `body` 羽毛笔 / 可点击元素（`a`、`button`）齿轮；触屏设备自动回退系统默认（`@media (hover: hover) and (pointer: fine)`）
- 全站无阴影；hover 反馈一律用位移、变色、透明度变化
- `prefers-reduced-motion`：禁用所有动画与平滑滚动
- 选中文字：复古红底米色字

## 6. 响应式断点

| 断点 | 行为 |
|---|---|
| ≥1440px | 全部装饰（含手写批注）显示 |
| ≤1200px | 隐藏 marginalia 与装订孔 |
| ≤1024px | 碎片区降为两列 |
| ≤900px | 双列塌成单列（虚线改横向）；EdgeDecorations 整层隐藏 |
| ≤640px | 卡片单列；档案卡/课程行改为纵向排版 |

## 7. 内容占位（待用户替换）

- 所有数据文件中的 `// PLACEHOLDER` 注释处
- `public/images/profile.jpg`（个人照片）、`public/paper-bg.png`（背景图）
- About 与签名中的名字
