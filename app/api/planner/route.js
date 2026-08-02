import { sql } from '@vercel/postgres';
import { randomUUID } from 'crypto';
import { ensureSchema } from '@/lib/db';

export async function GET() {
  await ensureSchema();
  const { rows } = await sql`
    SELECT * FROM planner_items
    WHERE item_date >= CURRENT_DATE AND item_date < CURRENT_DATE + INTERVAL '7 days'
    ORDER BY item_date ASC
  `;
  return Response.json(rows);
}

export async function POST(req) {
  await ensureSchema();
  const body = await req.json();
  const id = randomUUID();
  await sql`INSERT INTO planner_items (id, item_date, text) VALUES (${id}, ${body.date}, ${body.text})`;
  return Response.json({ id }, { status: 201 });
}
