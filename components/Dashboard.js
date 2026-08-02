'use client';

import { jalaliDateString, quotes, toFaDigits, todayKey } from '@/lib/date';

const CIRC = 2 * Math.PI * 76;

export default function Dashboard({ tasks, habits, goals, focusCount, setView, loading }) {
  const now = new Date();
  const hour = now.getHours();
  const greet =
    hour < 5 ? 'شب‌بخیر 🌙' : hour < 12 ? 'صبح‌بخیر ✨' : hour < 18 ? 'ظهر‌بخیر ☀️' : 'عصر‌بخیر 🌇';
  const today = todayKey();

  const todayTasks = tasks.filter((t) => t.date === today);
  const doneTasks = todayTasks.filter((t) => t.done);
  const habitsDoneToday = habits.filter((h) => h.logs.includes(today));

  const totalItems = todayTasks.length + habits.length;
  const doneItems = doneTasks.length + habitsDoneToday.length;
  const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <section className="view active">
      <div className="view-head">
        <div>
          <div className="view-title">{greet}</div>
          <div className="view-desc">بیایید نگاهی به مسیر امروز شما بیندازیم.</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card hero">
          <div className="hero-greeting">امروز</div>
          <div className="hero-date">{jalaliDateString(now)}</div>
          <div className="ring-wrap">
            <svg width="172" height="172" viewBox="0 0 172 172">
              <circle cx="86" cy="86" r="76" stroke="var(--ring-track)" strokeWidth="14" fill="none" />
              <circle
                cx="86" cy="86" r="76" stroke="var(--gold)" strokeWidth="14" fill="none" strokeLinecap="round"
                strokeDasharray={CIRC.toFixed(1)}
                strokeDashoffset={(CIRC * (1 - pct / 100)).toFixed(1)}
                style={{ transition: 'stroke-dashoffset .6s ease' }}
              />
            </svg>
            <div className="ring-pct">
              <div className="n num">{toFaDigits(pct)}%</div>
              <div className="l">پیشرفت امروز</div>
            </div>
          </div>
          <div className="hero-quote">{quotes[now.getDate() % quotes.length]}</div>
        </div>

        <div>
          <div className="stat-row">
            <StatCard color="gold" num={toFaDigits(doneTasks.length + '/' + todayTasks.length)} label="تسک‌های امروز"
              icon={<path d="M20 6L9 17l-5-5" />} />
            <StatCard color="teal" num={toFaDigits(habitsDoneToday.length + '/' + habits.length)} label="عادت‌های امروز"
              icon={<path d="M12 21c4-2 7-5.5 7-10a7 7 0 10-14 0c0 4.5 3 8 7 10z" />} />
            <StatCard color="coral" num={toFaDigits(goals.length)} label="هدف فعال"
              icon={<circle cx="12" cy="12" r="8.3" />} />
            <StatCard color="gold" num={toFaDigits(focusCount)} label="جلسه تمرکز"
              icon={<><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2" /></>} />
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <div className="panel-title">
              تسک‌های امروز
              <button className="see-all" onClick={() => setView('tasks')}>مشاهده همه</button>
            </div>
            {loading ? (
              <div className="skeleton skeleton-row" />
            ) : todayTasks.length === 0 ? (
              <div style={{ fontSize: 12.5, color: 'var(--text-faint)', padding: '8px 4px' }}>
                برای امروز تسکی ثبت نشده است.
              </div>
            ) : (
              todayTasks.slice(0, 5).map((t) => (
                <div className="mini-row" key={t.id}>
                  <span className={'dot prio-' + t.prio}></span>
                  <span className={'t ' + (t.done ? 'done' : '')}>{t.title}</span>
                </div>
              ))
            )}
          </div>

          <div className="card">
            <div className="panel-title">
              عادت‌های امروز
              <button className="see-all" onClick={() => setView('habits')}>مشاهده همه</button>
            </div>
            {loading ? (
              <div className="skeleton skeleton-row" />
            ) : habits.length === 0 ? (
              <div style={{ fontSize: 12.5, color: 'var(--text-faint)', padding: '8px 4px' }}>
                هنوز عادتی نساخته‌اید.
              </div>
            ) : (
              habits.map((h) => {
                const on = h.logs.includes(today);
                return (
                  <div className="mini-row" key={h.id}>
                    <span style={{ fontSize: 15 }}>{h.emoji}</span>
                    <span className="t">{h.name}</span>
                    <span
                      className="tag"
                      style={{
                        background: on ? 'var(--teal-soft)' : 'var(--surface-2)',
                        color: on ? 'var(--teal)' : 'var(--text-faint)',
                      }}
                    >
                      {on ? 'انجام‌شد' : 'باقی‌مانده'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ color, num, label, icon }) {
  return (
    <div className="card stat-card">
      <div className="stat-icon" style={{ background: `var(--${color}-soft)`, color: `var(--${color})` }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icon}</svg>
      </div>
      <div className="stat-num num">{num}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
