export interface Post {
  date: string;    // "2024.05.12"
  title: string;   // 文章标题
  excerpt: string; // 摘要，展开时显示
  content?: string; // 正文（暂留空）
}

// ═══════════════════════════════════════════════════════════════
// PLACEHOLDER 博客数据 — 搜索 "// PLACEHOLDER" 即可定位替换点
// ═══════════════════════════════════════════════════════════════

export const posts: Post[] = [
  {
    date: '2026.05.12',
    title: '近期阅读：我与地坛', // PLACEHOLDER
    excerpt:
      '如果说地坛教会了他如何面对命运的无常，那么他的母亲则教会了他另一件事——爱，是比苦难更加坚韧的东西。', // PLACEHOLDER
  },
  {
    date: '2026.03.28',
    title: '关于AI应用的重新思考', // PLACEHOLDER
    excerpt:
      'AI 生成的文字越来越工整、无懈可击，但我发现自己依然更偏爱那些带着口语病、语句磕绊的真实日记。也许在未来的数字世界里，那些偶尔的“卡壳”与“不完美”，才是我们生而为人的证明。', // PLACEHOLDER
  },
  {
    date: '2024.01.07',
    title: '周末的休闲时光', // PLACEHOLDER
    excerpt:
      '难得一个周末没有多余的事情去做，原来拥有自己的时间已经越来越少了。', // PLACEHOLDER
  },
];
