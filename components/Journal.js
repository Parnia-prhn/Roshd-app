'use client';

import { useState } from 'react';
import { jalaliDateString } from '@/lib/date';

const MOODS = ['😊', '😌', '😐', '😔', '😤'];

export default function Journal({ entries, onAdd, onDelete, loading }) {
  const [mood, setMood] = useState(MOODS[0]);
  const [text, setText] = useState('');

  function submit() {
    const t = text.trim();
    if (!t) return;
    onAdd(mood, t);
    setText('');
  }

  return (
    <section className="view active">
      <div className="view-head">
        <div>
          <div className="view-title">یادداشت روزانه</div>
          <div className="view-desc">چند خط دربارهٔ امروز بنویسید.</div>
        </div>
      </div>

      <div className="card journal-composer">
        <div className="mood-row">
          {MOODS.map((m) => (
            <button key={m} className={'mood-btn ' + (mood === m ? 'active' : '')} onClick={() => setMood(m)}>
              {m}
            </button>
          ))}
        </div>
        <textarea placeholder="امروز چطور گذشت؟..." value={text} onChange={(e) => setText(e.target.value)} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button className="btn sm" onClick={submit}>ثبت یادداشت</button>
        </div>
      </div>

      {loading ? (
        <div className="skeleton skeleton-row" style={{ height: 80 }} />
      ) : entries.length === 0 ? (
        <div className="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M9 10h.01M15 10h.01M8 15c1 1.2 2.4 2 4 2s3-.8 4-2" /></svg>
          <div className="e-title">هنوز یادداشتی نیست</div>
          <div className="e-desc">چند خط دربارهٔ امروز بنویسید و ثبت کنید.</div>
        </div>
      ) : (
        entries.map((j) => {
          const d = j.created_at ? new Date(j.created_at) : new Date();
          return (
            <div className="journal-entry" key={j.id}>
              <div className="je-head">
                <span className="je-mood">{j.mood}</span>
                <span className="je-date">{jalaliDateString(d)}</span>
                <button className="icon-btn" onClick={() => onDelete(j.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0l-.8 12.5A2 2 0 0114.2 21H9.8a2 2 0 01-2-1.5L7 7" /></svg>
                </button>
              </div>
              <div className="je-text">{j.text}</div>
            </div>
          );
        })
      )}
    </section>
  );
}
