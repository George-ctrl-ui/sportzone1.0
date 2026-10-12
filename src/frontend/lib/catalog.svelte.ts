import type { Sport } from './types';
export const catalog = $state<{ sports: Sport[]; loading: boolean; error: string }>({
  sports: [],
  loading: true,
  error: '',
});
export async function loadSports() {
  catalog.loading = true;
  catalog.error = '';
  try {
    const response = await fetch('/api/sports', { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Court details unavailable. Retry or call 0917 555 7768.');
    catalog.sports = await response.json();
  } catch (error) {
    catalog.error = error instanceof Error ? error.message : 'Court details unavailable.';
  } finally {
    catalog.loading = false;
  }
}
