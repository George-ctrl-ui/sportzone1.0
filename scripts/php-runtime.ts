import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
export function phpCommand(): string[] {
  const local = resolve('.tools/php/php.exe');
  const binary = process.env.PHP_BINARY || (existsSync(local) ? local : 'php');
  const config = resolve('.tools/php/php.ini');
  return existsSync(config) && binary === local ? [binary, '-c', config] : [binary];
}
export function phpServer(
  port = Number(process.env.API_PORT || 8000),
  environment: Record<string, string> = {},
) {
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('API_PORT must be an integer between 1 and 65535.');
  const probe = Bun.spawnSync(
    [...phpCommand(), '-r', 'exit(extension_loaded("pdo_sqlite") ? 0 : 1);'],
    { stdout: 'pipe', stderr: 'pipe' },
  );
  if (probe.exitCode !== 0)
    throw new Error(
      `PHP could not start with PDO SQLite (exit ${probe.exitCode}). Check runtime availability and Windows application-control policy. ${probe.stderr.toString()}`,
    );
  return Bun.spawn(
    [
      ...phpCommand(),
      '-S',
      `127.0.0.1:${port}`,
      '-t',
      'src/backend/public',
      'src/backend/public/router.php',
    ],
    {
      stdout: 'inherit',
      stderr: 'inherit',
      env: { ...process.env, ...environment },
    },
  );
}
