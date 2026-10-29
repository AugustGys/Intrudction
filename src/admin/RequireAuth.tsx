import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../api';

/** 路由守卫：没有通行证一律退回 /admin 登录页 */
export function RequireAuth({ children }: { children: ReactNode }) {
  if (!getToken()) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}
