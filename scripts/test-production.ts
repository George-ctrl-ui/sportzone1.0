import { mkdtemp, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { phpServer } from './php-runtime';

if (!(await Bun.file('dist/index.html').exists()))
  throw new Error('Run bun run build before the production smoke test.');
const directory = await mkdtemp(join(process.cwd(), '.api-test-'));
let server: ReturnType<typeof phpServer> | undefined;
const base = 'http://127.0.0.1:8012';
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
try {
  server = phpServer(8012, { DATABASE_PATH: join(directory, 'test.sqlite') });
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
  assert(ready, 'PHP did not start');
  const entry = await Bun.file('dist/index.html').text();
  for (const page of ['/', '/court', '/court/', '/gallery', '/booking?sport=badminton']) {
    const response = await fetch(base + page);
    assert(response.ok && (await response.text()) === entry, `Built page: ${page}`);
  }
  const redirect = await fetch(`${base}/about`, { redirect: 'manual' });
  assert(
    redirect.status === 308 && redirect.headers.get('location') === '/#about',
    'About redirect',
  );
  const assets = [...entry.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)].map(
    (match) => match[1],
  );
  assert(
    assets.some((asset) => asset.endsWith('.js')),
    'Built JavaScript reference',
  );
  assert(
    assets.some((asset) => asset.endsWith('.css')),
    'Built stylesheet reference',
  );
  for (const image of new Bun.Glob('images/*.webp').scanSync('dist'))
    assets.push('/' + image.replaceAll('\\', '/'));
  assert(
    assets.some((asset) => asset.endsWith('.webp')),
    'Built photos present',
  );
  assets.push('/favicon.svg');
  for (const asset of assets) {
    const response = await fetch(base + asset);
    const expected = await Bun.file(resolve('dist', asset.slice(1))).arrayBuffer();
    assert(response.ok, `Asset served: ${asset}`);
    assert(
      Buffer.from(await response.arrayBuffer()).equals(Buffer.from(expected)),
      `Asset contents: ${asset}`,
    );
    if (asset.endsWith('.webp'))
      assert(response.headers.get('content-type') === 'image/webp', `Photo MIME type: ${asset}`);
  }
  for (const path of [
    '/.env',
    '/src/backend/storage/sports-zone.sqlite',
    '/images/missing.webp',
    '/images/%2e%2e%2fsrc/backend/app/bootstrap.php',
    '/missing-page',
  ])
    assert((await fetch(base + path)).status === 404, `Private or missing path: ${path}`);
  console.log(
    `Production smoke checks passed: pages, redirect, ${assets.length} assets, private paths.`,
  );
} finally {
  server?.kill();
  if (server) await server.exited;
  // mkdtemp creates this directory directly inside the current workspace.
  await rm(directory, { recursive: true, force: true });
}
