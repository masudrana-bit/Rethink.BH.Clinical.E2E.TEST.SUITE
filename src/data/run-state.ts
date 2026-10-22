import * as fs from 'fs';
import * as path from 'path';

/** Data handed from one core E2E scenario to the next (E2E-01 -> E2E-07 reuse the same client and records). */
export interface CoreRunState {
  clientId?: string;
  clientName?: string;
  libraryProgramCurrent?: string;
  libraryProgramFuture?: string;
  customProgram?: string;
  customProgramId?: string;
  targets?: string[];
  objectives?: string[];
  scheduledSessionId?: string;
  adHocSessionId?: string;
  groupSessionId?: string;
  historicalSessionId?: string;
  historicalDate?: string;
  novelBehavior?: string;
  annotationNote?: string;
  adminProgram?: string;
  counts?: { programs: number; sessionsToFinalize: number };
}

const file = path.resolve(__dirname, '../../reports/core-run-state.json');

export function readState(): CoreRunState {
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf8')) as CoreRunState) : {};
}

export function writeState(patch: Partial<CoreRunState>): CoreRunState {
  const next = { ...readState(), ...patch };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(next, null, 2));
  return next;
}

export function requireState<K extends keyof CoreRunState>(key: K): NonNullable<CoreRunState[K]> {
  const value = readState()[key];
  if (value === undefined || value === null) {
    throw new Error(`Core E2E state "${String(key)}" is missing - run the previous scenario first (npm run test:core).`);
  }
  return value as NonNullable<CoreRunState[K]>;
}
