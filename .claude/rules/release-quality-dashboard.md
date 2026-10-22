---
name: release-quality-dashboard
description: Build and maintain a management-facing release quality dashboard for a Playwright end-to-end suite that runs on GitHub Actions. Use this whenever the user asks for a release dashboard, release report, e2e results for management, story-by-story test results, a readable alternative to the Allure or Playwright HTML report, or wants test results published automatically after every CI run. Covers test tagging, the results-to-JSON converter, the gh-pages storage layout, the GitHub Actions workflow, and the exact rules the dashboard page must follow.
---

# Release quality dashboard

Produce a self-updating dashboard that tells non-technical stakeholders, in plain English, whether a release is ready, and lets engineers drill from a story down to a failing test's trace. The system has four parts, and every part is generated from the rules in this file:

1. **Tagging convention** so every test maps to a story.
2. **Converter** that turns Playwright's JSON reporter output into one `run-<id>.json` per run.
3. **Storage** on the `gh-pages` branch: run files, an `index.json`, and the Playwright HTML report per run.
4. **Dashboard page**: one static `index.html` that reads `index.json` client-side.

Work through the steps in order. Do not skip the confirmation step (Step 0): the verdict thresholds and story priority source are decisions the user owns.

## Vocabulary

| Term | Meaning |
|---|---|
| Run | One execution of the e2e suite in GitHub Actions, identified by `github.run_id`. |
| Release | The version a run is attached to, from the git tag (`v2.14`) or a workflow input. Several runs may share a release; the dashboard shows the latest one per release by default. |
| Story | A ticket (Jira or Linear key such as `APP-5940`). Tests are grouped under stories. |
| Status of a test | `passed`, `flaky` (failed then passed on retry), `skipped`, `failed`. |
| Status of a story | `red`, `amber`, `green`, derived from its tests (rules below). |
| Verdict | `ready`, `risks`, `not-ready`, derived from story statuses and totals (rules below). |

## Step 0: Confirm the five inputs

Ask the user for these before writing anything, offering the defaults shown. Record the answers at the top of the generated workflow file as comments.

| Input | Default | Why it matters |
|---|---|---|
| Ticket system | Jira | Decides the key pattern (`[A-Z][A-Z0-9]+-\d+`) and where to fetch story titles. |
| Where story priority lives | A ticket label `release-critical` | Drives the verdict. Alternative: a `stories.json` file in the repo. |
| Release identifier | Git tag matching `v*` | If releases are not tagged, use a `workflow_dispatch` input named `release`. |
| Verdict thresholds | Below | Management must agree to these; the dashboard states the rule on the page. |
| Hosting | GitHub Pages from the `gh-pages` branch | Alternatives: S3/Azure Blob static site. Only the deploy step changes. |

Default verdict thresholds:

- `not-ready` when any `red` story is release-critical, **or** failed tests exceed 5% of total tests.
- `risks` when any story is `red` but none of them is release-critical.
- `ready` otherwise (flaky and skipped tests never block on their own).

## Step 1: Tagging convention

Rules for the test code (apply with a codemod if the suite is large; do not hand-edit hundreds of files):

- Every `test()` carries exactly one story tag using Playwright's `tag` option: `test('pays with a saved card', { tag: ['@APP-5940'] }, async ({ page }) => { … })`. Playwright 1.42 or later is required for the `tag` option; on older versions put the key in the title instead (`'APP-5940 pays with a saved card'`) and let the converter's title fallback pick it up.
- Additional non-story tags (`@smoke`, `@checkout`) are allowed; the converter ignores anything that does not match the key pattern.
- A `test.describe` block may carry the story tag instead of each test; Playwright propagates it.
- Tests without any story tag are grouped under a synthetic story `UNTAGGED` and the dashboard shows a count of them. Treat a non-zero count as a lint failure in CI once the suite is fully tagged.
- Enable retries in `playwright.config.ts` (`retries: process.env.CI ? 2 : 0`). Without retries there is no `flaky` status and the dashboard loses its most useful signal.
- Reporters in config, so local runs produce the same files CI does:

```ts
reporter: [
  ['list'],
  ['json', { outputFile: 'test-results/results.json' }],
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['github'],
],
use: { trace: 'retain-on-failure', screenshot: 'only-on-failure' },
```

Optional but recommended: a `stories.json` at the repo root for titles and priorities when the ticket API is not reachable from CI.

```json
{
  "APP-5940": { "title": "Card checkout", "epic": "Payments", "priority": "P1", "owner": "Rafi" },
  "APP-5877": { "title": "Password reset", "epic": "Accounts", "priority": "P2" }
}
```

## Step 2: Data contract

The converter writes exactly this shape. The dashboard reads exactly this shape. Change both or neither.

### `run-<runId>.json`

```json
{
  "schemaVersion": 1,
  "runId": "4821",
  "runNumber": 312,
  "runUrl": "https://github.com/org/repo/actions/runs/4821",
  "release": "v2.14",
  "kind": "release",
  "branch": "main",
  "sha": "9f1c2e7",
  "startedAt": "2026-10-17T09:12:03Z",
  "durationSec": 842,
  "reportUrl": "reports/4821/index.html",
  "totals": { "total": 225, "passed": 215, "flaky": 3, "skipped": 4, "failed": 3, "untagged": 0 },
  "stories": [
    {
      "key": "APP-5877",
      "title": "Password reset",
      "epic": "Accounts",
      "priority": "P2",
      "owner": null,
      "status": "red",
      "counts": { "passed": 3, "flaky": 0, "skipped": 0, "failed": 2 },
      "tests": [
        {
          "id": "a1b2c3",
          "name": "rejects an expired link",
          "file": "tests/accounts/password-reset.spec.ts",
          "line": 41,
          "status": "failed",
          "durationMs": 15320,
          "attempts": 3,
          "error": "page.waitForURL: Timeout 15000ms exceeded.",
          "traceUrl": "reports/4821/index.html#?testId=a1b2c3",
          "skipReason": null
        }
      ]
    }
  ]
}
```

Field rules:

- `kind` is `release` for tagged release runs, `nightly` or `pr` otherwise. The dashboard shows only `release` by default and offers a toggle for the rest.
- `status` on a story is **stored**, not recomputed by the page, so the converter is the single source of truth for the RAG rule.
- `error` is the first 400 characters of the last attempt's error message, ANSI codes stripped. Full output lives in the HTML report.
- `traceUrl` is relative to the site root so the dashboard works on any host.
- Test `id` is Playwright's stable test id (`test.id` in the JSON reporter), used to track flakiness across runs.

### `index.json`

A summary of every run, rewritten on every deploy. Keeps the dashboard's first load small; the page fetches a `run-<id>.json` only when a release is selected.

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-10-17T09:28:40Z",
  "runs": [
    {
      "runId": "4821", "release": "v2.14", "kind": "release", "branch": "main",
      "startedAt": "2026-10-17T09:12:03Z", "durationSec": 842, "file": "runs/run-4821.json",
      "totals": { "total": 225, "passed": 215, "flaky": 3, "skipped": 4, "failed": 3, "untagged": 0 },
      "verdict": "risks",
      "storyStatuses": { "APP-5940": "green", "APP-5877": "red" },
      "flakyTestIds": ["d4e5f6"]
    }
  ]
}
```

`storyStatuses` and `flakyTestIds` exist so the page can compute "since last release" and "chronically flaky" without loading older run files.

## Step 3: Derivation rules (implement in the converter, mirror in the page only for display)

### Test status

Map Playwright's per-test `status` field: `expected` → `passed`, `flaky` → `flaky`, `unexpected` → `failed`, `skipped` → `skipped`. A `timedOut` or `interrupted` final result counts as `failed`.

### Story status

- `red` if any test is `failed`.
- `amber` if no test failed and any test is `flaky` or `skipped`.
- `green` otherwise.

### Verdict

Apply the thresholds confirmed in Step 0. The converter writes the verdict into `index.json`; the page displays it and also prints the rule in a tooltip so nobody has to guess why a release is amber.

### Change since last release (page-side)

Compare the story's status with its status in the previous `release` run in `index.json`:

| Previous → current | Label | Tone |
|---|---|---|
| not red → red | New failure | bad |
| red → red | Still failing (N releases), N counted consecutively | bad |
| red → not red | Fixed | good |
| green → amber | Now needs a retry | warn |
| amber → green | Stable again | good |
| anything else | No change | neutral |
| story absent previously | New story | neutral |

### Chronically flaky (page-side)

A test id that appears in `flakyTestIds` in 3 or more of the last 8 release runs. Show it in "What needs attention" with the count and the sentence "Likely a timing issue in the test, not the product."

### Pass rate

`(passed + flaky) / total × 100`, one decimal. Flaky tests did pass; the dashboard shows them separately so the rate is honest without hiding instability.

## Step 4: Converter script

Create `scripts/build-run-summary.mjs`. Node 18 or later, no dependencies. It must be deterministic and must never throw on a partially written results file; log and exit non-zero instead.

```js
#!/usr/bin/env node
// Usage: node scripts/build-run-summary.mjs --results test-results/results.json --out site/runs \
//        --release v2.14 --kind release --report-url reports/4821/index.html [--stories stories.json]
import fs from 'node:fs';
import path from 'node:path';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > -1 ? process.argv[i + 1] : d; };
const KEY_RE = /@?\b([A-Z][A-Z0-9]+-\d+)\b/;
const env = process.env;

const results = JSON.parse(fs.readFileSync(arg('results', 'test-results/results.json'), 'utf8'));
const storiesMeta = fs.existsSync(arg('stories', 'stories.json')) ? JSON.parse(fs.readFileSync(arg('stories', 'stories.json'), 'utf8')) : {};
const runId = env.GITHUB_RUN_ID ?? 'local';
const reportUrl = arg('report-url', `reports/${runId}/index.html`);

const specs = [];
(function walk(suites, file) { for (const s of suites ?? []) { for (const sp of s.specs ?? []) specs.push({ ...sp, file: sp.file ?? s.file ?? file }); walk(s.suites, s.file ?? file); } })(results.suites);

const stripAnsi = s => (s ?? '').replace(/\u001b\[[0-9;]*m/g, '');
const mapStatus = t => ({ expected: 'passed', flaky: 'flaky', unexpected: 'failed', skipped: 'skipped' }[t.status] ?? 'failed');

const byStory = new Map();
for (const sp of specs) {
  const tagHit = (sp.tags ?? []).map(t => t.match(KEY_RE)?.[1]).find(Boolean) ?? sp.title.match(KEY_RE)?.[1] ?? 'UNTAGGED';
  for (const t of sp.tests ?? []) {
    const last = t.results?.at(-1) ?? {};
    const status = mapStatus(t);
    const test = {
      id: t.id ?? `${sp.file}:${sp.line}:${sp.title}`,
      name: sp.title.replace(KEY_RE, '').trim(),
      file: sp.file, line: sp.line,
      status,
      durationMs: (t.results ?? []).reduce((a, r) => a + (r.duration ?? 0), 0),
      attempts: t.results?.length ?? 0,
      error: status === 'failed' || status === 'flaky' ? stripAnsi((t.results ?? []).find(r => r.error)?.error?.message).slice(0, 400) || null : null,
      traceUrl: status === 'failed' || status === 'flaky' ? `${reportUrl}#?testId=${encodeURIComponent(t.id ?? '')}` : null,
      skipReason: status === 'skipped' ? (t.annotations?.find(a => a.type === 'skip')?.description ?? null) : null,
    };
    if (!byStory.has(tagHit)) byStory.set(tagHit, []);
    byStory.get(tagHit).push(test);
  }
}

const storyStatus = tests => tests.some(t => t.status === 'failed') ? 'red' : tests.some(t => t.status === 'flaky' || t.status === 'skipped') ? 'amber' : 'green';
const stories = [...byStory.entries()].map(([key, tests]) => ({
  key,
  title: storiesMeta[key]?.title ?? (key === 'UNTAGGED' ? 'Tests without a story tag' : key),
  epic: storiesMeta[key]?.epic ?? null,
  priority: storiesMeta[key]?.priority ?? 'P2',
  owner: storiesMeta[key]?.owner ?? null,
  status: storyStatus(tests),
  counts: Object.fromEntries(['passed', 'flaky', 'skipped', 'failed'].map(s => [s, tests.filter(t => t.status === s).length])),
  tests,
})).sort((a, b) => a.key.localeCompare(b.key));

const all = stories.flatMap(s => s.tests);
const totals = Object.fromEntries(['passed', 'flaky', 'skipped', 'failed'].map(s => [s, all.filter(t => t.status === s).length]));
totals.total = all.length;
totals.untagged = byStory.get('UNTAGGED')?.length ?? 0;

const criticalRed = stories.some(s => s.status === 'red' && s.priority === 'P1');
const verdict = criticalRed || totals.failed / totals.total > 0.05 ? 'not-ready' : stories.some(s => s.status === 'red') ? 'risks' : 'ready';

const run = {
  schemaVersion: 1,
  runId, runNumber: Number(env.GITHUB_RUN_NUMBER ?? 0),
  runUrl: env.GITHUB_SERVER_URL && env.GITHUB_REPOSITORY ? `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${runId}` : null,
  release: arg('release', env.GITHUB_REF_NAME ?? 'local'),
  kind: arg('kind', 'release'),
  branch: env.GITHUB_REF_NAME ?? 'local', sha: (env.GITHUB_SHA ?? '').slice(0, 7),
  startedAt: results.stats?.startTime ?? new Date().toISOString(),
  durationSec: Math.round((results.stats?.duration ?? 0) / 1000),
  reportUrl, totals, stories,
};

const outDir = arg('out', 'site/runs');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, `run-${runId}.json`), JSON.stringify(run, null, 2));

// Rebuild index.json from every run file present (idempotent).
const indexRuns = fs.readdirSync(outDir).filter(f => /^run-.*\.json$/.test(f)).map(f => {
  const r = JSON.parse(fs.readFileSync(path.join(outDir, f), 'utf8'));
  const crit = r.stories.some(s => s.status === 'red' && s.priority === 'P1');
  return {
    runId: r.runId, release: r.release, kind: r.kind, branch: r.branch, startedAt: r.startedAt, durationSec: r.durationSec,
    file: `runs/${f}`, totals: r.totals,
    verdict: crit || r.totals.failed / r.totals.total > 0.05 ? 'not-ready' : r.stories.some(s => s.status === 'red') ? 'risks' : 'ready',
    storyStatuses: Object.fromEntries(r.stories.map(s => [s.key, s.status])),
    flakyTestIds: r.stories.flatMap(s => s.tests.filter(t => t.status === 'flaky').map(t => t.id)),
  };
}).sort((a, b) => a.startedAt.localeCompare(b.startedAt));
fs.writeFileSync(path.join(outDir, '..', 'index.json'), JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), runs: indexRuns }, null, 2));

// Step summary for the Actions run page.
if (env.GITHUB_STEP_SUMMARY) {
  const rate = ((totals.passed + totals.flaky) / totals.total * 100).toFixed(1);
  const red = stories.filter(s => s.status === 'red');
  fs.appendFileSync(env.GITHUB_STEP_SUMMARY,
    `## ${run.release}: ${verdict.replace('-', ' ')}\n\n` +
    `Pass rate **${rate}%** (${totals.passed} passed, ${totals.flaky} on retry, ${totals.skipped} skipped, ${totals.failed} failed)\n\n` +
    (red.length ? `Failing stories:\n${red.map(s => `- ${s.key} ${s.title}: ${s.counts.failed} failed`).join('\n')}\n` : 'No failing stories.\n'));
}
console.log(`Wrote run-${runId}.json: ${verdict}, ${totals.failed} failed of ${totals.total}`);
```

Keep a retention rule: when more than 60 run files exist, delete the oldest `nightly` and `pr` runs first, and never delete `release` runs from the last 26 weeks.

## Step 5: Storage layout on `gh-pages`

```
/                     ← site root (GitHub Pages)
index.html            ← the dashboard page (Step 6); copied from main on every deploy
index.json            ← rebuilt on every deploy
runs/run-<id>.json    ← one per run
reports/<id>/         ← the Playwright HTML report for that run
stories.json          ← optional copy, for title lookup in the page
```

Rules:

- The page and the data live on the same origin, so no CORS configuration is needed.
- Never commit `test-results/` (traces are large). The HTML report already embeds what it needs.
- Delete `reports/<id>/` folders older than the retention rule in Step 4 at the same time as their run file.
- If GitHub Pages is unavailable (private repo on a free plan), publish the same folder to an S3 bucket or Azure Static Web App; only the deploy step changes.

## Step 6: The dashboard page

Generate `dashboard/index.html` on the main branch. One file, inline CSS and JavaScript, no build step, no framework. If a chart library is wanted, load it from cdnjs or jsDelivr pinned to an exact version; otherwise draw the trend as inline SVG (preferred: fewer moving parts).

### Data loading

1. `fetch('index.json')`, filter to `kind === 'release'` unless the "Include nightly and PR runs" toggle is on, keep the latest run per release, sort by `startedAt`.
2. Select the release from the URL hash (`#v2.14`) if present, otherwise the latest. Update the hash when the user changes release so links can be shared.
3. `fetch(run.file)` for the selected release. Show a skeleton state while loading; show a clear error if the file is missing ("Results for v2.14 are not published yet. The pipeline may still be running.").
4. Cache fetched run files in memory for the session.

### Sections, in this order

1. **Header**: title "Release quality", one-line subtitle naming the suite and branch, a release selector, a link "Open full test report" pointing to `run.reportUrl`, and a link to the Actions run.
2. **Verdict panel** (the one visually dominant element): the verdict word (`Ready`, `Ready, with risks`, `Not ready`), one sentence explaining it using real numbers and story names, run metadata in one line, pass rate with its change in points versus the previous release, and a single stacked composition bar for passed / on retry / skipped / failed.
3. **Counts**: passed first time, passed on retry, skipped, failed, stories fully passing (`x of y`), untagged tests if greater than zero.
4. **Trend**: the last 8 releases as stacked bars with the pass rate printed above each; clicking or pressing Enter on a bar selects that release.
5. **What needs attention**: every failed test (name, story, first line of the error) followed by chronically flaky tests (rule in Step 3). Empty state sentence when there is nothing.
6. **Results by story**: table with Story (key, title, epic), Priority (`Release-critical` / `Standard`), Result badge, Tests count, Breakdown (text plus a 120px mini bar), Since last release. Filter chips: All, Needs attention, Failing, Changed since last release. Search box over key, title and epic. Rows sort red → amber → green, then P1 first, then key. Clicking a row expands its tests: status dot, name, status word, duration, error text in a monospace block, "View trace" link for failed and flaky tests, skip reason for skipped tests.
7. **Footer**: generated time from `index.json`, a one-line statement of the verdict rule.

### Language rules for everything the page displays

- Write for someone who has never seen a test report. "Passed on retry" not "flaky"; "Release-critical" not "P1"; "Fixed" not "regression resolved".
- Every number has a noun next to it. Never a bare "97.1%".
- Verdict sentences use real counts and story names from the data, never templated vagueness such as "some tests failed".
- Sentence case for all labels. No all-caps labels, no abbreviations the audience would not know.
- Never say a flaky test "failed". It passed; it is unstable.

### Visual rules

- Status colours are the only strong colours on the page: green for passed, amber for retry and skipped, red for failed, grey for neutral. Everything else is neutral.
- Status is never conveyed by colour alone: always pair it with a word or badge text.
- Define all colours as CSS custom properties on `:root`, redefine them under `@media (prefers-color-scheme: dark)` guarded as `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`. Give `body` an explicit background.
- One typeface family (a Google Font with a system fallback stack, or the system stack alone). Type scale: 46px verdict and pass rate, 28px counts, 22px page title, 16px section titles, 15px body, 13px secondary.
- Responsive to 360px: verdict panel and the two-column row collapse to one column; the story table scrolls horizontally inside its own container; the page body never scrolls sideways.
- Keyboard: every interactive element is focusable with a visible `:focus-visible` ring; table rows and trend bars respond to Enter and Space and expose `aria-expanded` or `aria-label`.
- Respect `prefers-reduced-motion`. No entrance animations; the only motion is the expand caret.
- Print stylesheet: hide filters and controls, avoid breaking cards across pages.
- Declare `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` and pad `:root` with `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.

### Things the page must not do

- Recompute story status or verdict with its own rules; it displays what the converter stored.
- Show PR or nightly runs in the release trend unless the toggle is on.
- Hide skipped tests inside the passed count.
- Link to anything that needs a GitHub login unless the whole site is already behind one.

## Step 7: GitHub Actions workflow

Create `.github/workflows/e2e-release.yml`. It needs `contents: write` to push to `gh-pages`. The job order is fixed: tests, converter, publish; the converter and publish steps run even when tests fail (that is the whole point).

```yaml
name: E2E release report

on:
  push:
    tags: ['v*']
  workflow_dispatch:
    inputs:
      release:
        description: Release label, for example v2.14
        required: true
      kind:
        description: release | nightly | pr
        default: release

permissions:
  contents: write

concurrency:
  group: e2e-report-publish   # serialise pushes to gh-pages
  cancel-in-progress: false

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 60
    env:
      RELEASE: ${{ github.event.inputs.release || github.ref_name }}
      KIND: ${{ github.event.inputs.kind || 'release' }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }

      - run: npm ci
      - run: npx playwright install --with-deps

      - name: Run e2e suite
        id: tests
        continue-on-error: true
        run: npx playwright test
        env: { CI: true }

      - name: Build run summary
        run: |
          node scripts/build-run-summary.mjs \
            --results test-results/results.json \
            --out site/runs \
            --release "$RELEASE" --kind "$KIND" \
            --report-url "reports/${{ github.run_id }}/index.html" \
            --stories stories.json

      - name: Check out published site
        uses: actions/checkout@v4
        with:
          ref: gh-pages
          path: published
        continue-on-error: true   # first run: branch does not exist yet

      - name: Assemble site
        run: |
          mkdir -p published/runs published/reports
          cp site/runs/*.json published/runs/
          cp dashboard/index.html published/index.html
          [ -f stories.json ] && cp stories.json published/stories.json || true
          rm -rf "published/reports/${{ github.run_id }}"
          cp -r playwright-report "published/reports/${{ github.run_id }}"
          # rebuild index.json against everything now present
          node scripts/build-run-summary.mjs --results test-results/results.json --out published/runs \
            --release "$RELEASE" --kind "$KIND" --report-url "reports/${{ github.run_id }}/index.html" --stories stories.json
          node scripts/prune-old-runs.mjs published   # retention rule from Step 4

      - name: Publish to gh-pages
        run: |
          cd published
          git init -q
          git checkout -q -B gh-pages
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A
          git commit -q -m "Results for $RELEASE (run ${{ github.run_id }})"
          git push -f "https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}.git" gh-pages

      - name: Notify
        if: always()
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_E2E_WEBHOOK }}
        run: |
          [ -z "$SLACK_WEBHOOK" ] && exit 0
          VERDICT=$(node -e "const i=require('./published/index.json');console.log(i.runs.at(-1).verdict)")
          RATE=$(node -e "const t=require('./published/index.json').runs.at(-1).totals;console.log(((t.passed+t.flaky)/t.total*100).toFixed(1))")
          curl -s -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"E2E for $RELEASE: *$VERDICT*, pass rate $RATE%. <https://${{ github.repository_owner }}.github.io/${{ github.event.repository.name }}/#$RELEASE|Open dashboard>\"}" "$SLACK_WEBHOOK"

      - name: Fail the job if tests failed
        if: steps.tests.outcome == 'failure'
        run: exit 1
```

Notes:

- The `published` checkout uses a fresh `git init` plus force push, which keeps `gh-pages` history to one commit and avoids the branch growing by the size of the HTML report every week. If history is wanted, replace the publish step with `peaceiris/actions-gh-pages@v4` and `keep_files: true`.
- The `concurrency` group matters: two runs finishing together would otherwise overwrite each other's `index.json`.
- Enable GitHub Pages on the repository (Settings → Pages → Deploy from branch `gh-pages`, folder `/`). The agent cannot do this; tell the user.
- Nightly runs: add a `schedule` trigger with `KIND=nightly` and `RELEASE=nightly-<date>`.

## Step 8: Local verification before the first CI run

1. `npx playwright test` locally with the reporters from Step 1 so `test-results/results.json` exists.
2. `node scripts/build-run-summary.mjs --release v0.0.0 --out site/runs`. Check `site/index.json` has one run and that story keys look right; a high `untagged` count means the tag convention is not applied yet.
3. Serve `dashboard/index.html` next to `site/index.json` and `site/runs/` with any static server (`npx serve site` after copying the page in). Open it, select the run, expand a story.
4. Introduce one deliberate failure and one `test.skip`, rerun, confirm the verdict, the "New failure" label and the skip reason all appear.

## Acceptance checklist

The work is done when every line is true:

- [ ] Every test resolves to a story key or the dashboard shows the untagged count.
- [ ] `run-<id>.json` and `index.json` validate against the contract in Step 2 (write a tiny schema check in the converter if the team wants it enforced).
- [ ] A manager can answer "Is this release ready, and if not, which stories are blocking it?" from the verdict panel alone, without scrolling.
- [ ] Clicking a story shows its tests; clicking a failed test's trace link opens the Playwright report for that run.
- [ ] Selecting an older release in the trend updates every section, and the URL hash changes so the view can be shared.
- [ ] A story failing in two consecutive releases shows "Still failing (2 releases)".
- [ ] A test flaky in 3 of the last 8 releases appears under "What needs attention".
- [ ] The page is readable in light and dark mode, at 360px width, and when printed.
- [ ] The workflow publishes even when tests fail, and the job still ends red when they do.
- [ ] Two overlapping runs cannot corrupt `index.json` (concurrency group present).

## Extending later

- **Ticket titles from the API**: a step before the converter that fetches titles for every key in the results and writes `stories.json`. Jira: `GET /rest/api/3/search?jql=key in (…)&fields=summary,labels,priority`. Linear: GraphQL `issues(filter: { identifier: { in: […] } })`. Map the `release-critical` label to `priority: P1`.
- **Release notes**: the converter's step summary is already Markdown; append it to the GitHub Release body with `gh release edit`.
- **Per-environment runs**: add `environment` to the contract and a selector to the header; keep one `index.json` per environment to keep the page simple.
- **History older than the trend**: add a small "All releases" table under the trend reading from `index.json`; no new data is needed.
