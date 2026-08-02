'use client';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'خانه', icon: <path d="M3 12L12 4l9 8M5 10v10h14V10" /> },
  { id: 'tasks', label: 'تسک‌ها', icon: <path d="M4 6h16M4 12h16M4 18h10" /> },
  { id: 'planner', label: 'برنامه‌ریزی', icon: <path d="M3.5 9.5h17M8 3v4M16 3v4" /> },
  { id: 'habits', label: 'عادت‌ها', icon: <path d="M12 21c4-2 7-5.5 7-10a7 7 0 10-14 0c0 4.5 3 8 7 10zM12 15v-6M9 11l3-3 3 3" /> },
  { id: 'goals', label: 'اهداف', icon: <path d="M12 12" /> },
  { id: 'journal', label: 'یادداشت روزانه', icon: <path d="M8.5 9h6M8.5 12.5h6" /> },
  { id: 'timer', label: 'تمرکز', icon: <path d="M12 9v4l3 2M9.5 2.5h5" /> },
];

export default function Sidebar({ view, setView, theme, toggleTheme, onExport, onRefresh, connected }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2C12 2 6 8 6 13C6 16.3 8.7 19 12 19C15.3 19 18 16.3 18 13C18 8 12 2 12 2Z" fill="#0F1D18" />
            <path d="M12 19V22" stroke="#0F1D18" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="brand-name">رشد</div>
          <div className="brand-sub">همراه توسعه فردی</div>
        </div>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={'nav-item ' + (view === item.id ? 'active' : '')}
            onClick={() => setView(item.id)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {item.id === 'goals' ? (
                <>
                  <circle cx="12" cy="12" r="8.3" />
                  <circle cx="12" cy="12" r="4.4" />
                  <circle cx="12" cy="12" r="0.9" fill="currentColor" />
                </>
              ) : (
                item.icon
              )}
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="conn-status">
          <span className={'conn-dot ' + (connected ? '' : 'off')}></span>
          {connected ? 'متصل به دیتابیس' : 'در حال اتصال...'}
        </div>
        <div className="theme-toggle">
          <span>حالت نمایش</span>
          <button onClick={toggleTheme}>{theme === 'dark' ? 'تیره' : 'روشن'}</button>
        </div>
        <div className="data-actions">
          <button onClick={onExport}>خروجی</button>
          <button onClick={onRefresh}>به‌روزرسانی</button>
        </div>
      </div>
    </aside>
  );
}
