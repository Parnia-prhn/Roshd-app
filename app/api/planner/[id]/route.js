import { sql } from '@vercel/postgres';
import { ensureSchema } from '@/lib/db';

export async function DELETE(req, { params }) {
  await ensureSchema();
  await sql`DELETE FROM planner_items WHERE id = ${params.id}`;
  return Response.json({ ok: true });
}
