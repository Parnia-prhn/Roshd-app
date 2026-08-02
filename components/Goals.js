'use client';

import { toFaDigits } from '@/lib/date';

function goalProgress(g) {
  if (!g.milestones.length) return 0;
  const done = g.milestones.filter((m) => m.done).length;
  return Math.round((done / g.milestones.length) * 100);
}

export default function Goals({ goals, onAdd, onDelete, onAddMilestone, onToggleMilestone, loading }) {
  function addGoal() {
    const name = prompt('نام هدف:');
    if (!name || !name.trim()) return;
    const deadline = prompt('مهلت (اختیاری):') || '';
    onAdd(name.trim(), deadline);
  }

  return (
    <section className="view active">
      <div className="view-head">
        <div>
          <div className="view-title">اهداف</div>
          <div className="view-desc">هدف‌های بزرگ‌تر را با نقاط عطف کوچک پیش ببرید.</div>
        </div>
        <button className="btn" onClick={addGoal}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>
          هدف جدید
        </button>
      </div>

      {loading ? (
        <div className="skeleton skeleton-row" style={{ height: 120 }} />
      ) : goals.length === 0 ? (
        <div className="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M9 10h.01M15 10h.01M8 15c1 1.2 2.4 2 4 2s3-.8 4-2" /></svg>
          <div className="e-title">هنوز هدفی ثبت نکرده‌اید</div>
          <div className="e-desc">روی «هدف جدید» بزنید و مسیر رسیدن به آن را بچینید.</div>
        </div>
      ) : (
        goals.map((g) => {
          const pct = goalProgress(g);
          return (
            <div className="goal-card" key={g.id}>
              <div className="goal-top">
                <div>
                  <div className="goal-name">{g.name}</div>
                  {g.deadline ? <div className="goal-deadline">مهلت: {g.deadline}</div> : null}
                </div>
                <button className="icon-btn" onClick={() => onDelete(g.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0l-.8 12.5A2 2 0 0114.2 21H9.8a2 2 0 01-2-1.5L7 7" /></svg>
                </button>
              </div>
              <div className="bar-track"><div className="bar-fill" style={{ width: pct + '%' }} /></div>
              <div className="goal-pct">
                <span>{g.milestones.filter((m) => m.done).length} از {g.milestones.length} نقطه عطف</span>
                <span className="num">{toFaDigits(pct)}%</span>
              </div>
              <div className="milestones">
                {g.milestones.map((m) => (
                  <div className="milestone" key={m.id}>
                    <button
                      className={'check ' + (m.done ? 'checked' : '')}
                      style={{ width: 18, height: 18 }}
                      onClick={() => onToggleMilestone(g.id, m.id, !m.done)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                    </button>
                    <span className={'mtxt ' + (m.done ? 'done' : '')}>{m.text}</span>
                  </div>
                ))}
                <button
                  className="btn ghost sm"
                  style={{ alignSelf: 'flex-start', marginTop: 6 }}
                  onClick={() => {
                    const text = prompt('نقطهٔ عطف جدید:');
                    if (text && text.trim()) onAddMilestone(g.id, text.trim());
                  }}
                >
                  + نقطه عطف
                </button>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}
