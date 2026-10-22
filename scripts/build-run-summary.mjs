#!/usr/bin/env node
// Turns Playwright's JSON reporter output into site/runs/run-<id>.json and rebuilds site/index.json
// for the release quality dashboard (dashboard/index.html). Node 18+, no dependencies.
//
// Usage:
//   node scripts/build-run-summary.mjs --results test-results/results.json --out site/runs \
//        --release dev2-2026.10.19 --kind release --report-url reports/<runId>/index.html \
//        [--stories stories.json] [--run-id <id>] [--environment https://clinical.dev2.rethinkbhtech.com] [--env-name dev2]
//
// Contract: schemaVersion 1 from .claude/rules/release-quality-dashboard.md, plus these optional fields
// read by the dashboard: run.environment, run.environmentName, index.runs[].environment, index.runs[].environmentName,
// story.testCases, story.manualCases, story.doc, test.annotations.
import fs from 'node:fs';
import path from 'node:path';

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > -1 && process.argv[i + 1] !== undefined ? process.argv[i + 1] : d;
};
const KEY_RE = /@?\b([A-Z][A-Z0-9]+-\d+)\b/;
const STATUSES = ['passed', 'flaky', 'skipped', 'failed'];
const env = process.env;

const readJson = (file, label) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    console.error(`Cannot read ${label} (${file}): ${error.message}`);
    process.exit(2);
  }
};

/** "https://clinical.uat.rethinkbhtech.com" → "uat"; runs published before environments existed were all dev2. */
const envNameOf = (url) => (url ? url.match(/\/\/clinical\.([a-z0-9-]+)\./i)?.[1]?.toLowerCase() ?? new URL(url).host : 'dev2');

const stripAnsi = (s) => (s ?? '').replace(/\u001b\[[0-9;]*m/g, '');
const mapStatus = (t) => ({ expected: 'passed', flaky: 'flaky', unexpected: 'failed', skipped: 'skipped' })[t.status] ?? 'failed';
// Known-defect tests (test.fail) report "passed" while the defect reproduces; they keep their story amber, not green.
const storyStatus = (tests) =>
  tests.some((t) => t.status === 'failed') ? 'red'
  : tests.some((t) => t.status === 'flaky' || t.status === 'skipped' || t.knownDefect) ? 'amber' : 'green';

// Verdict thresholds confirmed with the team (Step 0): not ready when a release-critical story is red or more
// than 5% of tests failed; ready with risks when any other story is red; flaky and skipped never block alone.
const verdictOf = (stories, totals) => {
  const criticalRed = stories.some((s) => s.status === 'red' && s.priority === 'P1');
  if (criticalRed || (totals.total > 0 && totals.failed / totals.total > 0.05)) return 'not-ready';
  return stories.some((s) => s.status === 'red') ? 'risks' : 'ready';
};

const resultsFile = arg('results', 'test-results/results.json');
const storiesFile = arg('stories', 'stories.json');
const results = readJson(resultsFile, 'Playwright results');
const storiesMeta = fs.existsSync(storiesFile) ? readJson(storiesFile, 'stories metadata') : {};
const runId = arg('run-id', env.GITHUB_RUN_ID ?? 'local');
const reportUrl = arg('report-url', `reports/${runId}/index.html`);

const specs = [];
(function walk(suites, file) {
  for (const s of suites ?? []) {
    for (const sp of s.specs ?? []) specs.push({ ...sp, file: sp.file ?? s.file ?? file });
    walk(s.suites, s.file ?? file);
  }
})(results.suites);

const storyKeyOf = (sp) => {
  const fromTag = (sp.tags ?? []).map((t) => t.match(KEY_RE)?.[1]).find(Boolean);
  if (fromTag) return fromTag;
  // Titles such as "TC-US26-01 …" contain key-like fragments, so only accept a title match for a known story.
  const fromTitle = sp.title.match(KEY_RE)?.[1];
  return fromTitle && storiesMeta[fromTitle] ? fromTitle : 'UNTAGGED';
};

const byStory = new Map();
for (const sp of specs) {
  const key = storyKeyOf(sp);
  for (const t of sp.tests ?? []) {
    const attempts = t.results ?? [];
    const status = mapStatus(t);
    const failedAttempt = [...attempts].reverse().find((r) => (r.errors?.length ?? 0) > 0 || r.error);
    const errors = failedAttempt ? (failedAttempt.errors?.length ? failedAttempt.errors : [failedAttempt.error]) : [];
    const firstError = stripAnsi(errors[0]?.message ?? '').trim();
    const more = errors.length > 1 ? ` (+${errors.length - 1} more failed check${errors.length > 2 ? 's' : ''})` : '';
    const defect = t.expectedStatus === 'failed'
      ? ((t.annotations ?? []).concat(attempts.flatMap((r) => r.annotations ?? [])).find((a) => a.type === 'fail')?.description ?? 'known defect')
      : null;
    const test = {
      id: t.id ?? sp.id ?? `${sp.file}:${sp.line}:${sp.title}`,
      name: sp.title.replace(/\s@[\w-]+/g, '').trim(),
      file: sp.file,
      line: sp.line,
      status,
      durationMs: attempts.reduce((a, r) => a + (r.duration ?? 0), 0),
      attempts: attempts.length,
      error: defect && status === 'failed'
        ? `Known defect no longer reproduces (${defect}). Check it is fixed, then remove the test from src/data/known-defects.ts.`
        : (status === 'failed' || status === 'flaky' || defect) && firstError ? (firstError.slice(0, 400 - more.length) + more) : null,
      traceUrl: status === 'failed' || status === 'flaky' || defect ? `${reportUrl}#?testId=${encodeURIComponent(t.id ?? sp.id ?? '')}` : null,
      knownDefect: defect && status === 'passed' ? defect : null,
      knownDefectFixed: Boolean(defect && status === 'failed'),
      skipReason:
        status === 'skipped'
          ? ((t.annotations ?? []).find((a) => a.type === 'skip' || a.type === 'fixme')?.description ?? null)
          : null,
      annotations: (t.annotations ?? [])
        .filter((a) => !['skip', 'fixme', 'fail'].includes(a.type) && a.description)
        .map((a) => ({ type: a.type, description: stripAnsi(a.description).replace(/\s+/g, ' ').slice(0, 300) })),
    };
    if (!byStory.has(key)) byStory.set(key, []);
    byStory.get(key).push(test);
  }
}

const stories = [...byStory.entries()]
  .map(([key, tests]) => {
    const meta = storiesMeta[key] ?? {};
    return {
      key,
      title: meta.title ?? (key === 'UNTAGGED' ? 'Tests without a story tag' : key),
      epic: meta.epic ?? null,
      priority: meta.priority ?? 'P2',
      owner: meta.owner ?? null,
      status: storyStatus(tests),
      counts: { ...Object.fromEntries(STATUSES.map((s) => [s, tests.filter((t) => t.status === s).length])), knownDefects: tests.filter((t) => t.knownDefect).length },
      testCases: meta.testCases ?? null,
      manualCases: meta.manualCases ?? null,
      doc: meta.doc ?? null,
      tests,
    };
  })
  .sort((a, b) => a.key.localeCompare(b.key, 'en', { numeric: true }));

const all = stories.flatMap((s) => s.tests);
const totals = Object.fromEntries(STATUSES.map((s) => [s, all.filter((t) => t.status === s).length]));
totals.total = all.length;
totals.knownDefects = all.filter((t) => t.knownDefect).length;
totals.untagged = byStory.get('UNTAGGED')?.length ?? 0;

if (totals.total === 0) {
  console.error(`No tests found in ${resultsFile}; the run may have crashed before reporting.`);
  process.exit(3);
}

const verdict = verdictOf(stories, totals);
const run = {
  schemaVersion: 1,
  runId,
  runNumber: Number(env.GITHUB_RUN_NUMBER ?? 0),
  runUrl: env.GITHUB_SERVER_URL && env.GITHUB_REPOSITORY ? `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${runId}` : null,
  release: arg('release', env.GITHUB_REF_NAME ?? 'local'),
  kind: arg('kind', 'release'),
  branch: env.GITHUB_REF_NAME ?? arg('branch', 'local'),
  sha: (env.GITHUB_SHA ?? '').slice(0, 7),
  environment: arg('environment', results.config?.metadata?.environment ?? env.BASE_URL ?? null),
  environmentName: null,
  startedAt: results.stats?.startTime ?? new Date().toISOString(),
  durationSec: Math.round((results.stats?.duration ?? 0) / 1000),
  reportUrl,
  totals,
  stories,
};

run.environmentName = arg('env-name', results.config?.metadata?.environmentName ?? env.TEST_ENV ?? envNameOf(run.environment));

const outDir = arg('out', 'site/runs');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, `run-${runId}.json`), JSON.stringify(run, null, 2));

// Rebuild index.json from every run file present (idempotent).
const indexRuns = fs
  .readdirSync(outDir)
  .filter((f) => /^run-.*\.json$/.test(f))
  .flatMap((f) => {
    try {
      const r = JSON.parse(fs.readFileSync(path.join(outDir, f), 'utf8'));
      return [{
        runId: r.runId,
        release: r.release,
        kind: r.kind,
        branch: r.branch,
        environment: r.environment ?? null,
        environmentName: r.environmentName ?? envNameOf(r.environment),
        startedAt: r.startedAt,
        durationSec: r.durationSec,
        file: `runs/${f}`,
        totals: r.totals,
        verdict: verdictOf(r.stories, r.totals),
        storyStatuses: Object.fromEntries(r.stories.map((s) => [s.key, s.status])),
        flakyTestIds: r.stories.flatMap((s) => s.tests.filter((t) => t.status === 'flaky').map((t) => t.id)),
      }];
    } catch (error) {
      console.warn(`Skipping unreadable run file ${f}: ${error.message}`);
      return [];
    }
  })
  .sort((a, b) => a.startedAt.localeCompare(b.startedAt));
fs.writeFileSync(
  path.join(outDir, '..', 'index.json'),
  JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), runs: indexRuns }, null, 2),
);

// Step summary for the Actions run page.
if (env.GITHUB_STEP_SUMMARY) {
  const rate = (((totals.passed - totals.knownDefects + totals.flaky) / totals.total) * 100).toFixed(1);
  const red = stories.filter((s) => s.status === 'red');
  fs.appendFileSync(
    env.GITHUB_STEP_SUMMARY,
    `## ${run.release} on ${run.environmentName}: ${verdict.replace('-', ' ')}\n\n` +
      `Pass rate **${rate}%** (${totals.passed - totals.knownDefects} passed, ${totals.knownDefects} known defects, ${totals.flaky} on retry, ${totals.skipped} skipped, ${totals.failed} failed)\n\n` +
      (red.length ? `Failing stories:\n${red.map((s) => `- ${s.key} ${s.title}: ${s.counts.failed} failed`).join('\n')}\n` : 'No failing stories.\n'),
  );
}
console.log(`Wrote run-${runId}.json (${run.environmentName}): ${verdict}, ${totals.failed} failed, ${totals.knownDefects} known defects, ${totals.skipped} skipped of ${totals.total}`);
