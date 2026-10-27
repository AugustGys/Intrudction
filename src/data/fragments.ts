export interface Fragment {
  index: string;        // "00", "01"...
  title: string;        // 碎片标题
  description: string;  // 一段小随想
  highlights: string[]; // 关键词
  image: string;        // picsum 固定种子图，刷新不变
}

// ═══════════════════════════════════════════════════════════════
// PLACEHOLDER 生活碎片 — 搜索 "// PLACEHOLDER" 即可定位替换点
// ═══════════════════════════════════════════════════════════════

export const fragments: Fragment[] = [
  {
    index: '00',
    title: '假期风光', // PLACEHOLDER
    description:
      '太久没有出门去看看那海了，虽然只是海边的一个小镇，但感觉还是不一样的。', // PLACEHOLDER
    highlights: ['海', '假期'],
    image: 'https://picsum.photos/seed/fragment-film/800/600',
  },
  {
    index: '01',
    title: '凌晨两点的代码与咖啡', // PLACEHOLDER
    description:
      '编译通过的那一刻，窗外的鸟已经开始叫了。又通宵了，但还是没有找到问题所在。', // PLACEHOLDER// PLACEHOLDER
    highlights: ['深夜', 'Debug'],
    image: 'https://picsum.photos/seed/fragment-coffee/600/400',
  },
  {
    index: '02',
    title: '近期阅读：我与地坛', // PLACEHOLDER
    description:
      '《我与地坛》读到一半。"应当想象西西弗是幸福的"——推石头上山这件事本身，就是对抗荒诞的方式。', // PLACEHOLDER
    highlights: ['阅读', '存在主义'],
    image: 'https://picsum.photos/seed/fragment-camus/600/400',
  },
  {
    index: '03',
    title: '雨天咖啡馆的窗边', // PLACEHOLDER
    description:
      '周六下午三点，一杯美式放到凉。什么也没做，只是看街上的人走来走去。有时候"浪费时间"才是正经事。', // PLACEHOLDER
    highlights: ['发呆', '观察'],
    image: 'https://picsum.photos/seed/fragment-rain/600/400',
  },
];
