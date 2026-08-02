import { sql } from '@vercel/postgres';

let ready = false;

export async function ensureSchema() {
  if (ready) return;

  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date DATE,
      prio TEXT DEFAULT 'med',
      done BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      emoji TEXT DEFAULT '🌱',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS habit_logs (
      habit_id TEXT REFERENCES habits(id) ON DELETE CASCADE,
      log_date DATE,
      PRIMARY KEY (habit_id, log_date)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      deadline TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS milestones (
      id TEXT PRIMARY KEY,
      goal_id TEXT REFERENCES goals(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      done BOOLEAN DEFAULT FALSE,
      position INT DEFAULT 0
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      entry_date DATE DEFAULT CURRENT_DATE,
      mood TEXT,
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS planner_items (
      id TEXT PRIMARY KEY,
      item_date DATE NOT NULL,
      text TEXT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS focus_sessions (
      id TEXT PRIMARY KEY,
      session_date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  ready = true;
}
