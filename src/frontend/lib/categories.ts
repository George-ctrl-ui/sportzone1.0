import type { Sport } from './types';

export function groupSports(sports: Sport[]) {
  const groups = new Map<string, { id: string; name: string; sports: Sport[] }>();
  for (const sport of sports) {
    const label = sport.category.trim() || 'Court sport';
    const key = label.toLowerCase().replace(/\s+sports?$/, '');
    const id = encodeURIComponent(key.replace(/\s+/g, '-'));
    if (!groups.has(key)) {
      groups.set(key, {
        id,
        name: /\bsports?$/i.test(label) ? label.replace(/sports?$/i, 'sports') : label,
        sports: [],
      });
    }
    groups.get(key)!.sports.push(sport);
  }
  return [...groups.values()];
}
