/** Local calendar date `days` from today (negative = past). */
export function daysFromToday(days: number): Date {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

/** `2026-10-12`, the value format of native date inputs. */
export function isoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** `Oct 12, 2026`, the app's display format. */
export function displayDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Patterns matching the common renderings of one calendar day (`Oct 12`, `10/12/2026`, `2026-10-12`). */
export function dayPattern(date: Date): RegExp {
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return new RegExp(`${month} ${d}\\b|\\b0?${m}/0?${d}/${date.getFullYear()}|${isoDate(date)}`);
}

/** Wall-clock time renderings for comparing a displayed time with `date` (`13:58`, `1:58 PM`). */
export function clockPatterns(date: Date): string[] {
  const h = date.getHours();
  const mm = String(date.getMinutes()).padStart(2, '0');
  return [`${String(h).padStart(2, '0')}:${mm}`, `${h}:${mm}`, `${h % 12 || 12}:${mm} ${h < 12 ? 'AM' : 'PM'}`];
}
