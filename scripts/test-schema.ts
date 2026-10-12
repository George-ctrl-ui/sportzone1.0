import { Database } from 'bun:sqlite';
const db = new Database(':memory:');
const schema = await Bun.file('src/backend/database/schema.sql').text();
const seed = await Bun.file('src/backend/database/seed.sql').text();
db.exec(schema);
db.exec(seed);
db.exec(schema);
db.exec(seed);
const count = db.query('SELECT COUNT(*) count FROM sports').get() as { count: number };
if (count.count !== 4) throw new Error('Seed must be idempotent');
const insert = db.query(
  'INSERT INTO booking_requests (reference, name, phone, sport_id, preferred_date, start_time, duration) VALUES (?, ?, ?, ?, ?, ?, ?)',
);
insert.run('SZ-TEST', 'Test User', '09171234567', 'basketball', '2026-12-01', '18:00', 2);
for (const [reference, sport, duration] of [
  ['SZ-BAD-FK', 'unknown', 1],
  ['SZ-BAD-DURATION', 'basketball', 5],
] as const) {
  let rejected = false;
  try {
    insert.run(reference, 'Test User', '09171234567', sport, '2026-12-01', '18:00', duration);
  } catch {
    rejected = true;
  }
  if (!rejected) throw new Error('Schema must reject invalid foreign keys and duration');
}
const saved = db
  .query('SELECT status FROM booking_requests WHERE reference = ?')
  .get('SZ-TEST') as { status: string };
if (saved.status !== 'pending') throw new Error('New requests must be pending');
console.log(
  'SQLite schema checks passed: idempotent seed, foreign keys, constraints, pending status.',
);
db.close();
