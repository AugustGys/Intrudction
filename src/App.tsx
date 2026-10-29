import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { PaperBackground } from './components/PaperBackground/PaperBackground';
import { EdgeDecorations } from './components/EdgeDecorations/EdgeDecorations';
import { Nav } from './components/Nav/Nav';
import { Footer } from './components/Footer/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import Home from './pages/Home';
import Works from './pages/Works';
import Notes from './pages/Notes';
import Guestbook from './pages/Guestbook';
import About from './pages/About';
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProfile } from './admin/AdminProfile';
import { AdminProjects } from './admin/AdminProjects';
import { AdminPosts } from './admin/AdminPosts';
import { AdminMessages } from './admin/AdminMessages';
import { RequireAuth } from './admin/RequireAuth';
import styles from './App.module.css';

/** 前台站点外壳：导航 + 页面 + 页脚 */
function PublicLayout() {
  return (
    <>
      {/* 宽屏边缘装饰：准星 / marginalia / 装订孔 */}
      <EdgeDecorations />

      {/* 内容层：z-index 10，盖住背景 */}
      <div className={styles.root}>
        <Nav />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* 路由切换自动回顶 */}
      <ScrollToTop />

      {/* 牛皮纸纹理 + 暗角：z-index 0 / 1, pointer-events none */}
      <PaperBackground />

      <Routes>
        {/* ─── 后台：通行证登录 ─── */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* ─── 后台：带守卫的档案管理框架 ─── */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>

        {/* ─── 前台 ─── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/guestbook" element={<Guestbook />} />
          <Route path="/about" element={<About />} />
          {/* 未匹配路径回首页 */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
