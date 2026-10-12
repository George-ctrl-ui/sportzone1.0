import { phpServer } from './php-runtime';
let api: ReturnType<typeof phpServer>;
try {
  api = phpServer();
} catch (error) {
  console.error(error instanceof Error ? error.message : 'PHP is unavailable. See README.md.');
  process.exit(1);
}
const frontend = Bun.spawn([process.execPath, 'run', 'dev:frontend'], {
  stdout: 'inherit',
  stderr: 'inherit',
});
const stop = () => {
  api.kill();
  frontend.kill();
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
const exitCode = await Promise.race([api.exited, frontend.exited]);
stop();
process.exitCode = exitCode;
