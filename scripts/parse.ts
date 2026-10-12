import { parseSync } from 'oxc-parser';
const files = [
  ...new Bun.Glob('src/frontend/**/*.{ts,svelte}').scanSync(),
  ...new Bun.Glob('scripts/*.ts').scanSync(),
  'vite.config.ts',
  'svelte.config.js',
];
let failures = 0;
for (const file of files) {
  const content = await Bun.file(file).text();
  const blocks = file.endsWith('.svelte')
    ? [...content.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1])
    : [content];
  for (const block of blocks) {
    const result = parseSync(file.endsWith('.svelte') ? `${file}.ts` : file, block);
    if (result.errors.length) {
      console.error(file, result.errors);
      failures++;
    }
  }
}
if (failures) process.exit(1);
console.log(`Oxc parsed script syntax in ${files.length} source files.`);
