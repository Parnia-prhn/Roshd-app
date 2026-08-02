'use client';

import { useMemo, useState } from 'react';
import { toFaDigits } from '@/lib/date';

const prioLabel = { high: 'بالا', med: 'متوسط', low: 'کم' };
const prioWeight = { high: 3, med: 2, low: 1 };

export default function Tasks({ tasks, onAdd, onToggle, onDelete, onClearDone, loading }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [prio, setPrio] = useState('med');
  const [filter, setFilter] = useState('today');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('created');

  const todayStr = new Date().toISOString().slice(0, 10);

  const filtered = useMemo(() => {
    let list = tasks.filter((t) => {
      if (filter === 'today') return t.date === todayStr && !t.done;
      if (filter === 'upcoming') return t.date > todayStr && !t.done;
      if (filter === 'done') return t.done;
      return true;
    });
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q));
    }
    if (sort === 'prio') {
      list = [...list].sort((a, b) => prioWeight[b.prio] - prioWeight[a.prio]);
    } else if (sort === 'date') {
      list = [...list].sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
    }
    return list;
  }, [tasks, filter, query, sort, todayStr]);

  function submit() {
    const t = title.trim();
    if (!t) return;
    onAdd({ title: t, date: date || todayStr, prio });
    setTitle('');
    setDate('');
  }

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <section className="view active">
      <div className="view-head">
        <div>
          <div className="view-title">تسک‌ها</div>
          <div className="view-desc">کارهایی که باید انجام شوند را اینجا مدیریت کنید.</div>
        </div>
      </div>

      <div className="add-inline">
        <input
          type="text" placeholder="یک تسک جدید بنویسید..." value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select value={prio} onChange={(e) => setPrio(e.target.value)}>
          <option value="low">اولویت کم</option>
          <option value="med">اولویت متوسط</option>
          <option value="high">اولویت بالا</option>
        </select>
        <button className="btn" onClick={submit}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>
          افزودن
        </button>
      </div>

      <div className="filter-tabs">
        {[
          ['today', 'امروز'],
          ['upcoming', 'پیش‌رو'],
          ['all', 'همه'],
          ['done', 'انجام‌شده'],
        ].map(([id, label]) => (
          <button key={id} className={'filter-tab ' + (filter === id ? 'active' : '')} onClick={() => setFilter(id)}>
            {label}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
          <input placeholder="جستجو در تسک‌ها..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="created">جدیدترین</option>
          <option value="prio">بر اساس اولویت</option>
          <option value="date">بر اساس تاریخ</option>
        </select>
      </div>

      {doneCount > 0 && (
        <div className="bulk-bar">
          <span className="num">{toFaDigits(doneCount)}</span> تسک انجام‌شده وجود دارد.
          <button onClick={onClearDone}>پاک کردن انجام‌شده‌ها</button>
        </div>
      )}

      <div className="task-list">
        {loading ? (
          <>
            <div className="skeleton skeleton-row" />
            <div className="skeleton skeleton-row" />
            <div className="skeleton skeleton-row" />
          </>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M9 10h.01M15 10h.01M8 15c1 1.2 2.4 2 4 2s3-.8 4-2" /></svg>
            <div className="e-title">هنوز چیزی نیست</div>
            <div className="e-desc">یک تسک جدید اضافه کنید تا اینجا نمایش داده شود.</div>
          </div>
        ) : (
          filtered.map((t) => (
            <div className="task-item" key={t.id}>
              <button className={'check ' + (t.done ? 'checked' : '')} onClick={() => onToggle(t)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
              </button>
              <span className={'title ' + (t.done ? 'done' : '')}>{t.title}</span>
              <div className="task-meta">
                <span className="tag" style={{ background: 'var(--surface-2)', color: 'var(--text-dim)' }}>
                  {prioLabel[t.prio]}
                </span>
                <span className="task-date">{t.date ? toFaDigits(t.date.split('-').reverse().join('/')) : 'بدون تاریخ'}</span>
                <button className="icon-btn" onClick={() => onDelete(t.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0l-.8 12.5A2 2 0 0114.2 21H9.8a2 2 0 01-2-1.5L7 7" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
