import { phpServer } from './php-runtime';
try {
  if (process.argv.includes('--production') && !(await Bun.file('dist/index.html').exists()))
    throw new Error('Frontend build missing. Run bun run build before bun start.');
  const server = phpServer();
  console.log(`Sports Zone: http://127.0.0.1:${process.env.API_PORT || 8000}`);
  process.on('SIGINT', () => {
    server.kill();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    server.kill();
    process.exit(0);
  });
  process.exit(await server.exited);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'PHP is unavailable. See README.md.');
  process.exit(1);
}
