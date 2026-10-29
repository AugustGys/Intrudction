-- ═══════════════════════════════════════════════════════
-- 数字花园 · 数据库初始化脚本
-- 用法：在 Navicat 中新建连接后，新建数据库 my_garden，再运行本脚本
-- ═══════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS my_garden DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE my_garden;

-- ─── 后台账号 ───
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL COMMENT 'bcrypt 哈希'
);

-- ─── 工程档案 ───
CREATE TABLE IF NOT EXISTS projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  tech_stack VARCHAR(255) COMMENT '逗号分隔，如 React,Node.js',
  category VARCHAR(20) DEFAULT 'CODE' COMMENT 'CODE / HARDWARE'
);

-- ─── 手记与随笔 ───
CREATE TABLE IF NOT EXISTS posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  date VARCHAR(20) NOT NULL COMMENT '如 2024.05.12',
  title VARCHAR(200) NOT NULL,
  summary TEXT
);

-- ─── 留言墙 ───
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  content VARCHAR(500) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─── 个人信息（单行配置）───
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) COMMENT '姓名',
  title VARCHAR(100) COMMENT '职位',
  tagline VARCHAR(255) COMMENT '一句话介绍',
  email VARCHAR(100) COMMENT '邮箱',
  age VARCHAR(20),
  location VARCHAR(100) COMMENT '所在地区',
  bio TEXT COMMENT '个人简介',
  avatar MEDIUMTEXT COMMENT '头像：图片链接或 Base64 data URI',
  major VARCHAR(100),
  hobbies VARCHAR(200),
  monologue TEXT,
  honors TEXT COMMENT 'JSON 数组：[{"title":"...","year":"..."}]',
  excerpt_text VARCHAR(255) COMMENT '首页摘录文本',
  excerpt_from VARCHAR(100) COMMENT '摘录出处',
  reading_title VARCHAR(120) COMMENT '在读书名',
  reading_author VARCHAR(120) COMMENT '在读作者',
  reading_progress VARCHAR(50) COMMENT '在读进度，如 P. 42'
);

INSERT INTO settings (
  name, title, tagline, email, age, location, bio, avatar, major, hobbies, monologue, honors,
  excerpt_text, excerpt_from, reading_title, reading_author, reading_progress
) VALUES
('甘昱升', '学生 · 物联网工程', '在代码与纸页之间，慢慢种一座数字花园。',
 'hello@example.com', '21', '辽宁 · 大连',
 '我是一个普通的学生。喜欢瞎捣鼓各种小东西，遇到感兴趣的事愿意慢慢琢磨。偶尔会焦虑体测和以后的去向，也会好好照顾自己，平平淡淡稳步生活。',
 '/images/profile.jpg',
 '物联网工程', '品鉴美食 / 阅读 / 羽毛球 / 发呆',
 '我是一个普通的学生。喜欢瞎捣鼓各种小东西，遇到感兴趣的事愿意慢慢琢磨。偶尔会焦虑体测和以后的去向，也会好好照顾自己，平平淡淡稳步生活。',
 '[{"title":"校级二等奖学金","year":"2026"},{"title":"光电赛省赛二等奖","year":"2025"},{"title":"英语六级 CET-6","year":"2025"}]',
 'Everything you can imagine is real.', '— 摘录', '《文城》', '余华', 'P. 42');


-- ─── 预设数据 ───
-- admin / 123456（password 为 bcrypt 哈希）
INSERT INTO users (username, password) VALUES
('admin', '$2b$10$M5mU3.ssG9ZjetMSkukNZe2EtqMSaopJqfVnN5NGDPRP3syoKAgES');

INSERT INTO projects (title, description, tech_stack, category) VALUES
('校园二手书交易平台', '课设项目：支持发布、搜索与站内信的小程序端二手书流转平台。', 'Vue3,Spring Boot,MySQL', 'CODE'),
('基于 STM32 的智能宿舍门禁', 'RFID 刷卡 + 指纹双因子认证，数据通过 MQTT 上报到本地服务器。', 'STM32,MQTT,C', 'HARDWARE');

INSERT INTO posts (date, title, summary) VALUES
('2026.10.20', '关于 React 状态管理的重新思考', '从 Context 到 Zustand，状态管理的本质是控制数据流的方向。'),
('2026.10.25', '周末的胶片冲洗实验', '第一次自己冲 C-41，温度没控制好，但颗粒感意外地迷人。');
