'use client';

import { addDays, gregorianToJalali, jalaliMonths, toFaDigits, todayKey, weekdayName } from '@/lib/date';

export default function Planner({ items, onAdd, onDelete, loading }) {
  const today = new Date();
  const days = [];
  for (let i = 0; i < 7; i++) days.push(addDays(today, i));

  function addItem(dateKey) {
    const val = prompt('برنامهٔ این روز:');
    if (val && val.trim()) onAdd(dateKey, val.trim());
  }

  return (
    <section className="view active">
      <div className="view-head">
        <div>
          <div className="view-title">برنامه‌ریزی هفتگی</div>
          <div className="view-desc">برنامهٔ هر روز هفته را از امروز بچینید.</div>
        </div>
      </div>

      <div className="week-grid">
        {days.map((d, i) => {
          const key = todayKey(d);
          const dayItems = items.filter((it) => {
            const itDate = it.item_date instanceof Date ? todayKey(it.item_date) : String(it.item_date).slice(0, 10);
            return itDate === key;
          });
          const j = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
          return (
            <div className={'day-col ' + (i === 0 ? 'today' : '')} key={key}>
              <div className="day-head">
                <div className="day-name">{weekdayName(d)}</div>
                <div className="day-num num">{toFaDigits(j[2])} {jalaliMonths[j[1] - 1]}</div>
              </div>
              {loading ? (
                <div className="skeleton" style={{ height: 30 }} />
              ) : (
                dayItems.map((it) => (
                  <div className="day-item" key={it.id}>
                    <span className="txt">{it.text}</span>
                    <button className="rm" onClick={() => onDelete(it.id)}>×</button>
                  </div>
                ))
              )}
              <button className="day-add" onClick={() => addItem(key)}>+ افزودن</button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
