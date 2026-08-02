import { sql } from '@vercel/postgres';
import { randomUUID } from 'crypto';
import { ensureSchema } from '@/lib/db';

export async function GET() {
  await ensureSchema();
  const habitsRes = await sql`SELECT * FROM habits ORDER BY created_at ASC`;
  const logsRes = await sql`
    SELECT habit_id, log_date FROM habit_logs
    WHERE log_date >= CURRENT_DATE - INTERVAL '60 days'
  `;
  const logsByHabit = {};
  for (const row of logsRes.rows) {
    const key = row.habit_id;
    if (!logsByHabit[key]) logsByHabit[key] = [];
    logsByHabit[key].push(
      row.log_date instanceof Date ? row.log_date.toISOString().slice(0, 10) : row.log_date
    );
  }
  const habits = habitsRes.rows.map((h) => ({ ...h, logs: logsByHabit[h.id] || [] }));
  return Response.json(habits);
}

export async function POST(req) {
  await ensureSchema();
  const body = await req.json();
  const id = randomUUID();
  await sql`INSERT INTO habits (id, name, emoji) VALUES (${id}, ${body.name}, ${body.emoji || '🌱'})`;
  return Response.json({ id }, { status: 201 });
}
