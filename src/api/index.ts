import axios from 'axios';

// 后端 API 根地址（开发期直连 3001 端口）
const API_BASE = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

/* ─── 登录令牌（后台） ─── */
const TOKEN_KEY = 'admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

/** 带 Authorization 头的实例，供后台写操作使用 */
const authedApi = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

authedApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ─── 后端返回的数据形状（字段名与数据库列一致）─── */
export interface ProjectRow {
  id: number;
  title: string;
  description: string | null;
  tech_stack: string | null;
  category: string | null;
}

export interface PostRow {
  id: number;
  date: string;
  title: string;
  summary: string | null;
}

export interface MessageRow {
  id: number;
  name: string;
  content: string;
  created_at: string;
}

export interface Honor {
  title: string;
  year: string;
}

export interface Settings {
  /* 后台个人信息字段 */
  name: string | null;
  title: string | null;
  tagline: string | null;
  email: string | null;
  bio: string | null;
  avatar: string | null;
  /* 前台「关于我」档案卡仍在使用的字段 */
  age: string | null;
  location: string | null;
  major: string | null;
  hobbies: string | null;
  monologue: string | null;
  honors: Honor[];
  /* 首页卡片：摘录与在读 */
  excerpt_text: string | null;
  excerpt_from: string | null;
  reading_title: string | null;
  reading_author: string | null;
  reading_progress: string | null;
}

/* 后台表单提交的数据形状 */
export interface ProjectInput {
  title: string;
  description: string;
  tech_stack: string;
  category: string;
}

export interface PostInput {
  date: string;
  title: string;
  summary: string;
}

/* ─── 公开读取接口 ─── */
export const getProjects = () =>
  api.get<ProjectRow[]>('/projects').then((r) => r.data);

export const getPosts = () =>
  api.get<PostRow[]>('/posts').then((r) => r.data);

export const getMessages = () =>
  api.get<MessageRow[]>('/messages').then((r) => r.data);

export const getSettings = () =>
  api.get<Settings | null>('/settings').then((r) => r.data);

/* ─── 后台写操作 ─── */
export const login = (username: string, password: string) =>
  api.post<{ token: string }>('/login', { username, password }).then((r) => r.data);

export const updateSettings = (payload: Partial<Settings>) =>
  authedApi.put('/settings', payload).then((r) => r.data);

/* ─── 访客留言 ─── */
export const createGuestbookMessage = (payload: { name: string; content: string }) =>
  api.post<{ id: number }>('/guestbook', payload).then((r) => r.data);

export const deleteMessage = (id: number) =>
  authedApi.delete<{ ok: boolean }>(`/messages/${id}`).then((r) => r.data);

/* ─── 工程档案 CRUD ─── */
export const createProject = (payload: ProjectInput) =>
  authedApi.post<{ id: number }>('/projects', payload).then((r) => r.data);

export const updateProject = (id: number, payload: ProjectInput) =>
  authedApi.put<{ ok: boolean }>(`/projects/${id}`, payload).then((r) => r.data);

export const deleteProject = (id: number) =>
  authedApi.delete<{ ok: boolean }>(`/projects/${id}`).then((r) => r.data);

/* ─── 手记随笔 CRUD ─── */
export const createPost = (payload: PostInput) =>
  authedApi.post<{ id: number }>('/posts', payload).then((r) => r.data);

export const updatePost = (id: number, payload: PostInput) =>
  authedApi.put<{ ok: boolean }>(`/posts/${id}`, payload).then((r) => r.data);

export const deletePost = (id: number) =>
  authedApi.delete<{ ok: boolean }>(`/posts/${id}`).then((r) => r.data);

export default api;
