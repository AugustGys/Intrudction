export interface Course {
  name: string; // 课程名
  note: string; // 一句话个人感悟/收获
}

export interface Education {
  major: string;    // 专业名
  school?: string;  // 学校（可选）
  period?: string;  // 就读时间段，如 "2023 — 2027"
  courses: Course[];
}

// ═══════════════════════════════════════════════════════════════
// PLACEHOLDER 学业数据 — 搜索 "// PLACEHOLDER" 即可定位替换点
// ═══════════════════════════════════════════════════════════════

export const education: Education = {
  major: '物联网工程', // PLACEHOLDER
  school: '大连民族大学',          // PLACEHOLDER
  period: '2024 — 2028',     // PLACEHOLDER
  courses: [
    {
      name: '数据结构与算法', // PLACEHOLDER
      note: '第一次明白"优雅"是可以被量化的——时间复杂度就是。', // PLACEHOLDER
    },
    {
      name: '操作系统原理', // PLACEHOLDER
      note: '进程、线程、死锁……学完看电脑的眼神都不一样了。', // PLACEHOLDER
    },
    {
      name: '计算机网络', // PLACEHOLDER
      note: '从一次点击到一次握手，世界比想象中更复杂也更美。', // PLACEHOLDER
    },
    {
      name: '数据库系统', // PLACEHOLDER
      note: '范式让人痛苦，但索引命中的那一刻很治愈。', // PLACEHOLDER
    },
    {
      name: '互联网+', // PLACEHOLDER
      note: '技术的存在就是为了服务于人，而不是人服务于技术。', // PLACEHOLDER
    },
  ],
};
