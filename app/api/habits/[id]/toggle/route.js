import { sql } from '@vercel/postgres';
import { ensureSchema } from '@/lib/db';

export async function POST(req, { params }) {
  await ensureSchema();
  const body = await req.json();
  const date = body.date;
  const existing = await sql`
    SELECT 1 FROM habit_logs WHERE habit_id = ${params.id} AND log_date = ${date}
  `;
  if (existing.rows.length) {
    await sql`DELETE FROM habit_logs WHERE habit_id = ${params.id} AND log_date = ${date}`;
    return Response.json({ on: false });
  } else {
    await sql`INSERT INTO habit_logs (habit_id, log_date) VALUES (${params.id}, ${date})`;
    return Response.json({ on: true });
  }
}
