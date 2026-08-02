import { sql } from '@vercel/postgres';
import { ensureSchema } from '@/lib/db';

export async function GET() {
  await ensureSchema();
  const [tasks, habits, habitLogs, goals, milestones, journal, planner, focus] = await Promise.all([
    sql`SELECT * FROM tasks`,
    sql`SELECT * FROM habits`,
    sql`SELECT * FROM habit_logs`,
    sql`SELECT * FROM goals`,
    sql`SELECT * FROM milestones`,
    sql`SELECT * FROM journal_entries`,
    sql`SELECT * FROM planner_items`,
    sql`SELECT * FROM focus_sessions`,
  ]);

  return Response.json({
    exported_at: new Date().toISOString(),
    tasks: tasks.rows,
    habits: habits.rows,
    habit_logs: habitLogs.rows,
    goals: goals.rows,
    milestones: milestones.rows,
    journal_entries: journal.rows,
    planner_items: planner.rows,
    focus_sessions: focus.rows,
  });
}
