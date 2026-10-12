import { Database } from 'bun:sqlite';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
const path = resolve(process.env.DATABASE_PATH || 'src/backend/storage/sports-zone.sqlite');
await mkdir(dirname(path), { recursive: true });
const db = new Database(path, { create: true });
db.exec('PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;');
db.exec(await Bun.file('src/backend/database/schema.sql').text());
db.exec(await Bun.file('src/backend/database/seed.sql').text());
const sports = db.query('SELECT COUNT(*) count FROM sports').get() as { count: number };
console.log(
  `SQLite initialized at ${path} with ${sports.count} sports. Existing records preserved.`,
);
db.close();
