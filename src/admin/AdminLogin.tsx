import { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { login, setToken } from '../api';
import shared from './admin.module.css';
import styles from './AdminLogin.module.css';

export function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError('档案编号与通行口令均不可为空。');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await login(username.trim(), password);
      setToken(data.token);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error
        : undefined;
      setError(message || '通行证核验失败：请确认后端已在 3001 端口运行。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.pass} aria-label="档案馆通行证登录">
        <div className={styles.holes} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className={styles.stamp} aria-hidden="true">
          <span>ADMIN</span>
          <span>ONLY</span>
        </div>

        <header className={styles.header}>
          <p className={styles.kicker}>ARCHIVE OFFICE · FORM A-07</p>
          <h1 className={styles.title}>档案馆通行证</h1>
          <p className={styles.subTitle}>Internal Access Permit</p>
        </header>

        <div className={styles.serial}>
          <span className={styles.serialLabel}>持有人 / Holder</span>
          <span className={styles.serialValue}>ADMINISTRATOR</span>
          <span className={styles.serialLabel}>有效期 / Valid</span>
          <span className={styles.serialValue}>7 DAYS</span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={shared.field}>
            <label className={shared.label} htmlFor="admin-username">
              档案编号 <span className={shared.labelEn}>Archive ID</span>
            </label>
            <input
              id="admin-username"
              className={shared.input}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className={shared.field}>
            <label className={shared.label} htmlFor="admin-password">
              通行口令 <span className={shared.labelEn}>Passphrase</span>
            </label>
            <input
              id="admin-password"
              className={shared.input}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className={`${shared.stampButton} ${styles.submit}`} disabled={loading}>
            {loading ? '正在核验…' : '签 发 通 行 证'}
          </button>
        </form>

        <p className={styles.note}>Authorized personnel only · 未经授权不得入内</p>
        <Link to="/" className={styles.back}>
          ← 返回前台档案馆
        </Link>
      </main>
    </div>
  );
}
