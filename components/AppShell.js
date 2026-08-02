'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Sidebar from './Sidebar';
import ToastStack from './ToastStack';
import Dashboard from './Dashboard';
import Tasks from './Tasks';
import Planner from './Planner';
import Habits from './Habits';
import Goals from './Goals';
import Journal from './Journal';
import Timer from './Timer';

export default function AppShell() {
  const [view, setView] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [journal, setJournal] = useState([]);
  const [planner, setPlanner] = useState([]);
  const [focusCount, setFocusCount] = useState(0);

  const toast = useCallback((message, type) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type: type || 'info' }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('roshd_theme') : null;
    if (saved) setTheme(saved);
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('roshd_theme', theme);
  }, [theme]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [t, h, g, j, p, f] = await Promise.all([
        api.get('/api/tasks'),
        api.get('/api/habits'),
        api.get('/api/goals'),
        api.get('/api/journal'),
        api.get('/api/planner'),
        api.get('/api/focus'),
      ]);
      setTasks(t); setHabits(h); setGoals(g); setJournal(j); setPlanner(p); setFocusCount(f.count);
      setConnected(true);
    } catch (e) {
      setConnected(false);
      toast('اتصال به دیتابیس برقرار نشد. مطمئن شوید Postgres را به پروژه وصل کرده‌اید.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadAll(); }, [loadAll]);

  /* ---------- tasks ---------- */
  async function addTask(payload) {
    try { await api.post('/api/tasks', payload); setTasks(await api.get('/api/tasks')); toast('تسک اضافه شد', 'success'); }
    catch (e) { toast('ثبت تسک ناموفق بود', 'error'); }
  }
  async function toggleTask(t) {
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)));
    try { await api.patch('/api/tasks/' + t.id, { done: !t.done }); }
    catch (e) { toast('ثبت تغییر ناموفق بود', 'error'); loadAll(); }
  }
  async function deleteTask(id) {
    setTasks((prev) => prev.filter((x) => x.id !== id));
    try { await api.del('/api/tasks/' + id); }
    catch (e) { toast('حذف ناموفق بود', 'error'); loadAll(); }
  }
  async function clearDoneTasks() {
    const done = tasks.filter((t) => t.done);
    setTasks((prev) => prev.filter((t) => !t.done));
    try { await Promise.all(done.map((t) => api.del('/api/tasks/' + t.id))); toast('تسک‌های انجام‌شده پاک شدند', 'success'); }
    catch (e) { toast('پاک کردن ناموفق بود', 'error'); loadAll(); }
  }

  /* ---------- habits ---------- */
  async function addHabit(name) {
    const emojis = ['🌱', '💧', '📚', '🏃', '🧘', '🌙', '🥗', '✍️', '🎯', '☀️'];
    const emoji = emojis[habits.length % emojis.length];
    try { await api.post('/api/habits', { name, emoji }); setHabits(await api.get('/api/habits')); toast('عادت جدید ساخته شد', 'success'); }
    catch (e) { toast('ساخت عادت ناموفق بود', 'error'); }
  }
  async function toggleHabitDay(habitId, dateKey) {
    setHabits((prev) => prev.map((h) => {
      if (h.id !== habitId) return h;
      const has = h.logs.includes(dateKey);
      return { ...h, logs: has ? h.logs.filter((d) => d !== dateKey) : [...h.logs, dateKey] };
    }));
    try { await api.post('/api/habits/' + habitId + '/toggle', { date: dateKey }); }
    catch (e) { toast('ثبت عادت ناموفق بود', 'error'); loadAll(); }
  }
  async function deleteHabit(id) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    try { await api.del('/api/habits/' + id); }
    catch (e) { toast('حذف ناموفق بود', 'error'); loadAll(); }
  }

  /* ---------- goals ---------- */
  async function addGoal(name, deadline) {
    try { await api.post('/api/goals', { name, deadline }); setGoals(await api.get('/api/goals')); toast('هدف جدید ثبت شد', 'success'); }
    catch (e) { toast('ثبت هدف ناموفق بود', 'error'); }
  }
  async function deleteGoal(id) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    try { await api.del('/api/goals/' + id); }
    catch (e) { toast('حذف ناموفق بود', 'error'); loadAll(); }
  }
  async function addMilestone(goalId, text) {
    try { await api.post('/api/goals/' + goalId + '/milestones', { text }); setGoals(await api.get('/api/goals')); }
    catch (e) { toast('افزودن نقطه عطف ناموفق بود', 'error'); }
  }
  async function toggleMilestone(goalId, milestoneId, done) {
    setGoals((prev) => prev.map((g) => g.id !== goalId ? g : {
      ...g, milestones: g.milestones.map((m) => m.id === milestoneId ? { ...m, done } : m),
    }));
    try { await api.patch('/api/milestones/' + milestoneId, { done }); }
    catch (e) { toast('ثبت تغییر ناموفق بود', 'error'); loadAll(); }
  }

  /* ---------- journal ---------- */
  async function addJournal(mood, text) {
    try { await api.post('/api/journal', { mood, text }); setJournal(await api.get('/api/journal')); toast('یادداشت ثبت شد', 'success'); }
    catch (e) { toast('ثبت یادداشت ناموفق بود', 'error'); }
  }
  async function deleteJournal(id) {
    setJournal((prev) => prev.filter((j) => j.id !== id));
    try { await api.del('/api/journal/' + id); }
    catch (e) { toast('حذف ناموفق بود', 'error'); loadAll(); }
  }

  /* ---------- planner ---------- */
  async function addPlannerItem(date, text) {
    try { await api.post('/api/planner', { date, text }); setPlanner(await api.get('/api/planner')); }
    catch (e) { toast('افزودن برنامه ناموفق بود', 'error'); }
  }
  async function deletePlannerItem(id) {
    setPlanner((prev) => prev.filter((p) => p.id !== id));
    try { await api.del('/api/planner/' + id); }
    catch (e) { toast('حذف ناموفق بود', 'error'); loadAll(); }
  }

  /* ---------- focus timer ---------- */
  async function completeFocusSession() {
    setFocusCount((c) => c + 1);
    try { await api.post('/api/focus'); toast('یک جلسه تمرکز ثبت شد 🎯', 'success'); }
    catch (e) { toast('ثبت جلسه ناموفق بود', 'error'); }
  }

  async function exportData() {
    try {
      const data = await api.get('/api/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'roshd-backup.json';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast('فایل خروجی دانلود شد', 'success');
    } catch (e) { toast('گرفتن خروجی ناموفق بود', 'error'); }
  }

  return (
    <div className="app">
      <Sidebar
        view={view} setView={setView}
        theme={theme} toggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onExport={exportData} onRefresh={loadAll}
        connected={connected}
      />
      <main className="content">
        {view === 'dashboard' && (
          <Dashboard tasks={tasks} habits={habits} goals={goals} focusCount={focusCount} setView={setView} loading={loading} />
        )}
        {view === 'tasks' && (
          <Tasks tasks={tasks} onAdd={addTask} onToggle={toggleTask} onDelete={deleteTask} onClearDone={clearDoneTasks} loading={loading} />
        )}
        {view === 'planner' && (
          <Planner items={planner} onAdd={addPlannerItem} onDelete={deletePlannerItem} loading={loading} />
        )}
        {view === 'habits' && (
          <Habits habits={habits} onAdd={addHabit} onToggleDay={toggleHabitDay} onDelete={deleteHabit} loading={loading} />
        )}
        {view === 'goals' && (
          <Goals goals={goals} onAdd={addGoal} onDelete={deleteGoal} onAddMilestone={addMilestone} onToggleMilestone={toggleMilestone} loading={loading} />
        )}
        {view === 'journal' && (
          <Journal entries={journal} onAdd={addJournal} onDelete={deleteJournal} loading={loading} />
        )}
        {view === 'timer' && (
          <Timer sessionCount={focusCount} onComplete={completeFocusSession} />
        )}
      </main>
      <ToastStack toasts={toasts} />
    </div>
  );
}
