import { sql } from '@vercel/postgres';
import { randomUUID } from 'crypto';
import { ensureSchema } from '@/lib/db';

export async function GET() {
  await ensureSchema();
  const { rows } = await sql`
    SELECT COUNT(*) FROM focus_sessions WHERE session_date = CURRENT_DATE
  `;
  return Response.json({ count: Number(rows[0].count) });
}

export async function POST() {
  await ensureSchema();
  const id = randomUUID();
  await sql`INSERT INTO focus_sessions (id) VALUES (${id})`;
  return Response.json({ ok: true }, { status: 201 });
}
