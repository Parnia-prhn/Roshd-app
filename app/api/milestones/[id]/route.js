import { sql } from '@vercel/postgres';
import { ensureSchema } from '@/lib/db';

export async function PATCH(req, { params }) {
  await ensureSchema();
  const body = await req.json();
  if (typeof body.done === 'boolean') {
    await sql`UPDATE milestones SET done = ${body.done} WHERE id = ${params.id}`;
  }
  return Response.json({ ok: true });
}

export async function DELETE(req, { params }) {
  await ensureSchema();
  await sql`DELETE FROM milestones WHERE id = ${params.id}`;
  return Response.json({ ok: true });
}
