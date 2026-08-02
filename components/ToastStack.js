'use client';

export default function ToastStack({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={'toast ' + (t.type || 'info')}>
          <span className="dot" style={{ borderRadius: '50%' }}></span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
