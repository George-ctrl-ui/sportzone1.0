import { Database } from 'bun:sqlite';

// Read-only UI verification when a PHP runtime is unavailable. Never accepts bookings.
const db = new Database(':memory:');
db.exec(await Bun.file('src/backend/database/schema.sql').text());
db.exec(await Bun.file('src/backend/database/seed.sql').text());
const server = Bun.serve({
  hostname: '127.0.0.1',
  port: 8000,
  fetch(request) {
    const path = new URL(request.url).pathname;
    if (path === '/api/sports' && request.method === 'GET') {
      return Response.json(
        db
          .query(
            'SELECT id, name, category, description, court, min_rate AS minRate, max_rate AS maxRate, image, image_alt AS imageAlt FROM sports ORDER BY sort_order',
          )
          .all(),
      );
    }
    return Response.json(
      { error: 'Read-only preview. Start PHP to send booking requests.' },
      { status: 503 },
    );
  },
});
console.log(`Read-only SQLite catalogue at ${server.url}. Booking submissions require PHP.`);
const stop = () => {
  server.stop();
  db.close();
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
