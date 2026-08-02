import { sql } from '@vercel/postgres';
import { randomUUID } from 'crypto';
import { ensureSchema } from '@/lib/db';

export async function GET() {
  await ensureSchema();
  const { rows } = await sql`SELECT * FROM tasks ORDER BY created_at DESC`;
  return Response.json(rows);
}

export async function POST(req) {
  await ensureSchema();
  const body = await req.json();
  const id = randomUUID();
  await sql`
    INSERT INTO tasks (id, title, date, prio, done)
    VALUES (${id}, ${body.title}, ${body.date || null}, ${body.prio || 'med'}, false)
  `;
  return Response.json({ id }, { status: 201 });
}
