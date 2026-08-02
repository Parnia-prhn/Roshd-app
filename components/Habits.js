'use client';

import { addDays, toFaDigits, todayKey, weekdayShort } from '@/lib/date';

function habitStreak(habit) {
  let streak = 0;
  let d = new Date();
  const logSet = new Set(habit.logs);
  while (true) {
    const key = todayKey(d);
    if (logSet.has(key)) {
      streak++;
      d = addDays(d, -1);
    } else break;
  }
  return streak;
}

export default function Habits({ habits, onAdd, onToggleDay, onDelete, loading }) {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) days.push(addDays(today, -i));

  function addHabit() {
    const name = prompt('نام عادت جدید:');
    if (name && name.trim()) onAdd(name.trim());
  }

  return (
    <section className="view active">
      <div className="view-head">
        <div>
          <div className="view-title">عادت‌ها</div>
          <div className="view-desc">عادت‌های تازه بسازید و پیوستگی آن‌ها را دنبال کنید.</div>
        </div>
        <button className="btn" onClick={addHabit}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>
          عادت جدید
        </button>
      </div>

      {loading ? (
        <>
          <div className="skeleton skeleton-row" style={{ height: 90 }} />
          <div className="skeleton skeleton-row" style={{ height: 90 }} />
        </>
      ) : habits.length === 0 ? (
        <div className="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M9 10h.01M15 10h.01M8 15c1 1.2 2.4 2 4 2s3-.8 4-2" /></svg>
          <div className="e-title">هنوز عادتی نساخته‌اید</div>
          <div className="e-desc">روی «عادت جدید» بزنید و اولین عادت خود را شروع کنید.</div>
        </div>
      ) : (
        habits.map((h) => {
          const streak = habitStreak(h);
          const logSet = new Set(h.logs);
          return (
            <div className="habit-card" key={h.id}>
              <div className="habit-top">
                <div className="habit-emoji">{h.emoji}</div>
                <div>
                  <div className="habit-name">{h.name}</div>
                  <div className="habit-streak">پیوستگی فعلی: <b className="num">{toFaDigits(streak)}</b> روز</div>
                </div>
                <div className="habit-week">
                  {days.map((d) => {
                    const key = todayKey(d);
                    const on = logSet.has(key);
                    return (
                      <button
                        key={key}
                        className={'day-check ' + (on ? 'on' : '')}
                        onClick={() => onToggleDay(h.id, key)}
                      >
                        <span>{weekdayShort(d)}</span>
                        <span className="dn num">{toFaDigits(d.getDate())}</span>
                      </button>
                    );
                  })}
                </div>
                <button className="icon-btn" onClick={() => onDelete(h.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0l-.8 12.5A2 2 0 0114.2 21H9.8a2 2 0 01-2-1.5L7 7" /></svg>
                </button>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}
