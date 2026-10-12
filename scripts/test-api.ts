import { Database } from 'bun:sqlite';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { phpServer } from './php-runtime';

const directory = await mkdtemp(join(process.cwd(), '.api-test-'));
const database = join(directory, 'test.sqlite');
let server: ReturnType<typeof phpServer> | undefined;
const base = 'http://127.0.0.1:8011';
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
try {
  server = phpServer(8011, { DATABASE_PATH: database });
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      ready = (await fetch(`${base}/api/health`)).ok;
      if (ready) break;
    } catch {
      /* Server is starting. */
    }
    await Bun.sleep(100);
  }
  assert(ready, 'PHP API did not start');
  const sports = await (await fetch(`${base}/api/sports`)).json();
  assert(sports.length === 4 && sports[0].minRate === 250, 'SQLite seed catalogue');
  const session = await fetch(`${base}/api/session`);
  const cookie = session.headers.get('set-cookie')!.split(';')[0];
  const { token } = await session.json();
  const tomorrow = new Date(Date.now() + 48 * 3600000).toISOString().slice(0, 10);
  const request = {
    name: "Test O'Connor",
    phone: '0917 123 4567',
    email: 'test@example.com',
    sport: 'basketball',
    date: tomorrow,
    time: '18:00',
    duration: 2,
    message: '<script>test</script>',
    website: '',
  };
  const post = (input: unknown, csrf = token) =>
    fetch(`${base}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie, 'X-CSRF-Token': csrf },
      body: JSON.stringify(input),
    });
  assert((await post(request, 'wrong')).status === 403, 'CSRF rejection');
  assert((await post({ ...request, sport: 'not-a-sport' })).status === 422, 'Sport validation');
  assert((await post({ ...request, date: '2026-02-30' })).status === 422, 'Real-date validation');
  assert((await post({ ...request, time: '23:00' })).status === 422, 'Opening hours validation');
  assert((await post({ ...request, duration: 9 })).status === 422, 'Duration validation');
  assert((await post({ ...request, phone: 'invalid' })).status === 422, 'Phone validation');
  const response = await post(request);
  assert(response.status === 201, 'Booking persisted');
  const receipt = await response.json();
  const db = new Database(database, { readonly: true });
  const saved = db
    .query('SELECT name, message, status FROM booking_requests WHERE reference = ?')
    .get(receipt.reference) as { name: string; message: string; status: string };
  assert(
    saved.name === request.name && saved.message === request.message && saved.status === 'pending',
    'Prepared SQL stores exact values',
  );
  db.close();
  assert((await fetch(`${base}/api/bookings`)).status === 405, 'No public booking list');
  assert(
    (await fetch(`${base}/src/backend/storage/sports-zone.sqlite`)).status === 404,
    'Database is not public',
  );
  for (let attempt = 0; attempt < 4; attempt++)
    assert((await post(request)).status === 201, 'Request quota allows five requests');
  assert((await post(request)).status === 429, 'Rate limit persists in SQLite');
  console.log(
    'API integration checks passed: SQL seed, persistence, CSRF, validation, privacy, request limits.',
  );
} finally {
  server?.kill();
  if (server) await server.exited;
  await rm(directory, { recursive: true, force: true });
}
