import { sql } from '@vercel/postgres';
import { randomUUID } from 'crypto';
import { ensureSchema } from '@/lib/db';

export async function GET() {
  await ensureSchema();
  const goalsRes = await sql`SELECT * FROM goals ORDER BY created_at DESC`;
  const milesRes = await sql`SELECT * FROM milestones ORDER BY position ASC`;
  const byGoal = {};
  for (const m of milesRes.rows) {
    if (!byGoal[m.goal_id]) byGoal[m.goal_id] = [];
    byGoal[m.goal_id].push(m);
  }
  const goals = goalsRes.rows.map((g) => ({ ...g, milestones: byGoal[g.id] || [] }));
  return Response.json(goals);
}

export async function POST(req) {
  await ensureSchema();
  const body = await req.json();
  const id = randomUUID();
  await sql`INSERT INTO goals (id, name, deadline) VALUES (${id}, ${body.name}, ${body.deadline || null})`;
  return Response.json({ id }, { status: 201 });
}
