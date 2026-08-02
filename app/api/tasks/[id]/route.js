import { sql } from '@vercel/postgres';
import { ensureSchema } from '@/lib/db';

export async function PATCH(req, { params }) {
  await ensureSchema();
  const body = await req.json();
  if (typeof body.done === 'boolean') {
    await sql`UPDATE tasks SET done = ${body.done} WHERE id = ${params.id}`;
  }
  if (typeof body.title === 'string') {
    await sql`UPDATE tasks SET title = ${body.title} WHERE id = ${params.id}`;
  }
  return Response.json({ ok: true });
}

export async function DELETE(req, { params }) {
  await ensureSchema();
  await sql`DELETE FROM tasks WHERE id = ${params.id}`;
  return Response.json({ ok: true });
}
