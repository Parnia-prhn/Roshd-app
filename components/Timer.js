'use client';

import { useEffect, useRef, useState } from 'react';
import { pad, toFaDigits } from '@/lib/date';

const FOCUS_SECONDS = 25 * 60;
const CIRC = 2 * Math.PI * 102;

export default function Timer({ sessionCount, onComplete }) {
  const [left, setLeft] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          onComplete();
          return FOCUS_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, onComplete]);

  function reset() {
    clearInterval(intervalRef.current);
    setRunning(false);
    setLeft(FOCUS_SECONDS);
  }

  const m = Math.floor(left / 60), s = left % 60;
  const frac = left / FOCUS_SECONDS;

  return (
    <section className="view active">
      <div className="view-head">
        <div>
          <div className="view-title">تمرکز</div>
          <div className="view-desc">با تکنیک پومودورو روی یک کار تمرکز کنید.</div>
        </div>
      </div>

      <div className="card timer-wrap">
        <div className="timer-ring">
          <svg width="230" height="230" viewBox="0 0 230 230">
            <circle cx="115" cy="115" r="102" stroke="var(--ring-track)" strokeWidth="12" fill="none" />
            <circle
              cx="115" cy="115" r="102" stroke="var(--teal)" strokeWidth="12" fill="none" strokeLinecap="round"
              strokeDasharray={CIRC.toFixed(1)}
              strokeDashoffset={(CIRC * (1 - frac)).toFixed(1)}
              style={{ transition: 'stroke-dashoffset .3s linear' }}
            />
          </svg>
          <div className="timer-time num">{toFaDigits(pad(m) + ':' + pad(s))}</div>
        </div>
        <div className="timer-mode">زمان تمرکز</div>
        <div className="timer-controls">
          <button className="btn ghost sm" onClick={reset}>شروع دوباره</button>
          <button className="btn" onClick={() => setRunning((r) => !r)}>{running ? 'توقف' : 'شروع'}</button>
        </div>
        <div className="timer-sessions">جلسات تمرکز امروز: <b className="num">{toFaDigits(sessionCount)}</b></div>
      </div>
    </section>
  );
}
