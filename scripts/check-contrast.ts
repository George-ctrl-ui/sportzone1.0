export {};
const source = await Bun.file('src/frontend/styles/_tokens.scss').text();
const [light, dark] = source.split('@media');
const tokens = (text: string) =>
  Object.fromEntries(
    [...text.matchAll(/(--[\w-]+):\s*(#[\da-f]{6})/gi)].map((match) => [match[1], match[2]]),
  );
const themes = { light: tokens(light), dark: { ...tokens(light), ...tokens(dark) } };
function luminance(hex: string) {
  const channels = hex
    .slice(1)
    .match(/../g)!
    .map((value) => {
      const n = parseInt(value, 16) / 255;
      return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
const pairs: [string, string, number][] = [
  ['--text-primary', '--surface-page', 4.5],
  ['--text-secondary', '--surface-page', 4.5],
  ['--text-secondary', '--surface-raised', 4.5],
  ['--text-secondary', '--surface-sunken', 4.5],
  ['--text-on-court', '--surface-court', 4.5],
  ['--text-court-muted', '--surface-court', 4.5],
  ['--text-on-accent', '--accent', 4.5],
  ['--text-on-accent', '--accent-hover', 4.5],
  ['--danger-text', '--danger-bg', 4.5],
  ['--success-text', '--surface-raised', 4.5],
  ['--border-default', '--surface-raised', 3],
  ['--border-default', '--surface-page', 3],
  ['--focus-ring', '--surface-page', 3],
  ['--focus-ring', '--surface-raised', 3],
];
for (const [theme, values] of Object.entries(themes)) {
  let minimum = Infinity;
  for (const [foreground, background, threshold] of pairs) {
    const [a, b] = [luminance(values[foreground]), luminance(values[background])].sort(
      (x, y) => y - x,
    );
    const ratio = (a + 0.05) / (b + 0.05);
    if (ratio < threshold)
      throw new Error(
        `${theme}: ${foreground} on ${background} = ${ratio.toFixed(2)} (needs ${threshold})`,
      );
    minimum = Math.min(minimum, ratio);
  }
  console.log(
    `${theme}: ${pairs.length} text, status, control, and focus contrast pairs passed; minimum ${minimum.toFixed(2)}:1.`,
  );
}
