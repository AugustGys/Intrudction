export interface Project {
  title: string;       // 项目名
  description: string; // 一句话介绍
  tag: 'CODE' | 'HARDWARE'; // 右侧角标
  highlights: string[]; // 技术栈
}

// ═══════════════════════════════════════════════════════════════
// PLACEHOLDER 工程档案 — 搜索 "// PLACEHOLDER" 即可定位替换点
// ═══════════════════════════════════════════════════════════════

export const projects: Project[] = [
  {
    title: '面包房烘焙系统', // PLACEHOLDER
    description: '一个基于 SpringBoot 框架的面包房烘焙系统，用于管理面包房的订单。', // PLACEHOLDER
    tag: 'CODE',
    highlights: ['SpringBoot', 'Vue3', 'Element Plus', 'MyBatis-Plus'], // PLACEHOLDER（原"MySQLatis-Plus"疑为笔误，已改为 MyBatis-Plus）
  },
  {
    title: '基于51单片机的番茄钟', // PLACEHOLDER
    description: '一个基于51单片机的番茄钟，用于管理番茄工作法。', // PLACEHOLDER
    tag: 'HARDWARE',
    highlights: ['51单片机', 'C语言'], // PLACEHOLDER
  },
  {
    title: '倒车雷达系统', // PLACEHOLDER
    description: '利用数电模电知识，实现倒车雷达系统的功能。', // PLACEHOLDER
    tag: 'HARDWARE',
    highlights: ['数字电路技术', '数字信号处理', '电路与电子技术基础'], // PLACEHOLDER
  },
  {
    title: '基于Unity的孔子文化虚拟展馆', // PLACEHOLDER
    description: '一个基于 Unity 的孔子文化虚拟展馆，用于展示孔子的文化。', // PLACEHOLDER
    tag: 'CODE',
    highlights: ['Unity', 'C#'], // PLACEHOLDER
  },
];
