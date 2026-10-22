const runId = (process.env.E2E_RUN_ID ?? new Date().toISOString().replace(/\D/g, '').slice(2, 12)).trim();

/** Unique, recognisable name for data created by this suite, e.g. "E2E-2610181547 Custom Program". */
export function uniqueName(label: string): string {
  const suffix = Math.random().toString(36).slice(2, 6);
  return `E2E-${runId}-${suffix} ${label}`;
}

export function isoDate(daysFromToday = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}

export const e2eRunId = runId;
