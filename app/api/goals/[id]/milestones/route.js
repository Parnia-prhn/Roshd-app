import { sql } from '@vercel/postgres';
import { randomUUID } from 'crypto';
import { ensureSchema } from '@/lib/db';

export async function POST(req, { params }) {
  await ensureSchema();
  const body = await req.json();
  const id = randomUUID();
  const countRes = await sql`SELECT COUNT(*) FROM milestones WHERE goal_id = ${params.id}`;
  const position = Number(countRes.rows[0].count) + 1;
  await sql`
    INSERT INTO milestones (id, goal_id, text, done, position)
    VALUES (${id}, ${params.id}, ${body.text}, false, ${position})
  `;
  return Response.json({ id }, { status: 201 });
}
