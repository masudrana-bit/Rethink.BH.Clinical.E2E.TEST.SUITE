import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

/** Environments the suite can run against. Pick one with TEST_ENV; BASE_URL (shell, CI or .env.<name>) overrides the URL. */
export const ENVIRONMENTS = {
  dev2: 'https://clinical.dev2.rethinkbhtech.com',
  dev3: 'https://clinical.dev3.rethinkbhtech.com',
  uat: 'https://clinical.uat.rethinkbhtech.com',
} as const;
export type EnvName = keyof typeof ENVIRONMENTS;

const root = path.resolve(__dirname, '../..');
const parseFile = (file: string): Record<string, string> | undefined => {
  const full = path.join(root, file);
  return fs.existsSync(full) ? dotenv.parse(fs.readFileSync(full)) : undefined;
};
const nonEmpty = (v: string | undefined) => (v ?? '').trim() || undefined;

const shared = parseFile('.env') ?? {};
const requested = nonEmpty(process.env.TEST_ENV)?.toLowerCase();
if (requested && !(requested in ENVIRONMENTS)) {
  throw new Error(`TEST_ENV="${requested}" is not a known environment. Use one of: ${Object.keys(ENVIRONMENTS).join(', ')}.`);
}
const nameFromUrl = (url: string | undefined) =>
  (Object.keys(ENVIRONMENTS) as EnvName[]).find((n) => url && new URL(ENVIRONMENTS[n]).host === new URL(url).host);
const envName: EnvName = (requested as EnvName | undefined) ?? nameFromUrl(nonEmpty(process.env.BASE_URL) ?? nonEmpty(shared.BASE_URL)) ?? 'dev2';
const envFile = parseFile(`.env.${envName}`);

// A BASE_URL left in the shell for another known environment must not silently redirect an explicit TEST_ENV run.
const inherited = nameFromUrl(nonEmpty(process.env.BASE_URL));
if (requested && inherited && inherited !== envName) {
  if (!process.env.TEST_WORKER_INDEX) console.warn(`Ignoring BASE_URL=${process.env.BASE_URL}: it is ${inherited}, but TEST_ENV is ${envName}.`);
  delete process.env.BASE_URL;
}

// The shared .env holds dev2's BASE_URL; it must not win when another environment is chosen explicitly.
const fileValues: Record<string, string> = { ...shared, ...(envFile ?? {}) };
if (requested && !nonEmpty(envFile?.BASE_URL)) delete fileValues.BASE_URL;
for (const [k, v] of Object.entries(fileValues)) if (process.env[k] === undefined) process.env[k] = v;
process.env.BASE_URL = nonEmpty(process.env.BASE_URL) ?? ENVIRONMENTS[envName];
process.env.TEST_ENV = envName;

if (envName !== 'dev2' && !envFile && !process.env.TEST_WORKER_INDEX && !process.env.CI) {
  console.warn(`No .env.${envName} file: using the accounts and test data from .env, which were set up for dev2.`);
}

const read = (key: string, fallback = ''): string => (process.env[key] ?? '').trim() || fallback;

export type Role = 'bcba' | 'rbt' | 'admin';

export interface Credentials {
  username: string;
  password: string;
  /** True when no dedicated login exists for the role and the view toggle is used instead. */
  usesRoleToggle: boolean;
}

const defaultUser = read('DEFAULT_USERNAME');
const defaultPassword = read('DEFAULT_PASSWORD');

const ownLogin = (prefix: string): Omit<Credentials, 'usesRoleToggle'> | undefined => {
  const username = read(`${prefix}_USERNAME`);
  const password = read(`${prefix}_PASSWORD`);
  return username && password ? { username, password } : undefined;
};

/**
 * A role without its own login reuses the BCBA login (falling back to the default account) and switches view,
 * so every role works against the same caseload and test clients.
 */
function credentialsFor(prefix: string): Credentials {
  const own = ownLogin(prefix);
  if (own) return { ...own, usesRoleToggle: false };
  const shared = ownLogin('BCBA') ?? { username: defaultUser, password: defaultPassword };
  return { ...shared, usesRoleToggle: true };
}

export const env = {
  name: envName,
  baseUrl: read('BASE_URL', ENVIRONMENTS[envName]),
  buildId: read('BUILD_ID'),
  accounts: {
    bcba: credentialsFor('BCBA'),
    rbt: credentialsFor('RBT'),
    admin: credentialsFor('ADMIN'),
  } satisfies Record<Role, Credentials>,
  clients: {
    clean: read('CLEAN_CLIENT_ID', '260967'),
    seeded: read('SEEDED_CLIENT_ID', '472748'),
    group: read('GROUP_CLIENT_ID', '260960'),
  },
  seeded: {
    obProgram: read('SEEDED_OB_PROGRAM', 'Requesting preferred items'),
    obTarget: read('SEEDED_OB_TARGET', 'Snack items'),
    taProgram: read('SEEDED_TA_PROGRAM', 'Washing Hands (Task Analysis)'),
    /** Blank means "not seeded in this environment". */
    intervalProgram: read('SEEDED_INTERVAL_PROGRAM'),
    peakProgram: read('SEEDED_PEAK_PROGRAM'),
    frequencyProgram: read('SEEDED_FREQUENCY_PROGRAM'),
    behavior: read('SEEDED_BEHAVIOR', 'Self Injury'),
    /** Behavior measured with duration-intensity on the seeded client's plan; blank means not seeded. */
    durationIntensityBehavior: read('SEEDED_DI_BEHAVIOR'),
  },
};
