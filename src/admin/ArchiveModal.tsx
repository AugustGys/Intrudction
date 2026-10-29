import { useEffect } from 'react';
import type { ReactNode } from 'react';
import styles from './AdminTable.module.css';

interface ArchiveModalProps {
  tab: string;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/** 档案卡片弹窗：纸卡、索引标签、Esc / 点遮罩关闭 */
export function ArchiveModal({ tab, title, onClose, children }: ArchiveModalProps) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={title}>
        <span className={styles.modalTab}>{tab}</span>
        <header className={styles.modalHeader}>
          <div>
            <p className={styles.modalKicker}>DOSSIER · 档案卡片</p>
            <h2 className={styles.modalTitle}>{title}</h2>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="关闭弹窗">
            ×
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
