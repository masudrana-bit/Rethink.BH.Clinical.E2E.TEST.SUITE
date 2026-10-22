# Rethink BH Clinical E2E Test Suite

End-to-end tests for NextGen Clinical (Jira epic **RHD-57736**), written with Playwright and TypeScript using the Page Object Model. The suite covers the 47 user stories US-1 to US-47: plan setup, program authoring, sessions, data collection, closeout, analysis, funder reporting and the program library admin.

**Release quality dashboard:** <https://masudrana-bit.github.io/Rethink.BH.Clinical.E2E.TEST.SUITE/>

## Requirements

- Node.js 20 or later
- Accounts on the environment under test (dev2, dev3 or UAT)

```bash
npm ci
npx playwright install chromium
```

## Configuration

Copy `.env.example` to `.env` and fill in the logins. `.env` is set up for dev2, the default environment.

For dev3 or UAT, copy `.env.uat.example` to `.env.dev3` or `.env.uat`. Any value left blank there falls back to `.env`.

| Variable | Purpose |
| --- | --- |
| `BCBA_USERNAME`, `BCBA_PASSWORD` | Main login. Required unless `DEFAULT_*` is set. |
| `RBT_*`, `ADMIN_*` | Optional. When blank, the BCBA login is used and the role is switched with the view toggle. |
| `DEFAULT_USERNAME`, `DEFAULT_PASSWORD` | Fallback login when no BCBA login is set. |
| `BASE_URL` | Only needed to override the standard URL of the environment. |
| `CLEAN_CLIENT_ID`, `SEEDED_CLIENT_ID`, `GROUP_CLIENT_ID`, `SEEDED_*` | Test clients and seeded programs that exist in that environment. |

`.env` and `.env.*` are git-ignored. Never commit real logins.

## Running tests

Tests run one at a time (`workers: 1`) because each environment allows one session per user.

| Command | What it runs |
| --- | --- |
| `npm run test:stories` | All story tests on dev2 |
| `npm run test:release` | The release set used by CI (`tests/stories/0*` and `tests/stories/1*`) |
| `npm run test:dev3`, `npm run test:uat` | The suite on another environment, for example `npm run test:uat -- --project=stories` |
| `npm run ui:dev2`, `ui:dev3`, `ui:uat` | Playwright UI mode on that environment |
| `npm run test:smoke` | Tests tagged `@smoke` |
| `npm run report` | Opens the last HTML report |
| `npm run typecheck` | TypeScript check |

Run one area: `npx playwright test tests/stories/08-program-analysis --project=stories`

Tests are tagged `@US-<n>` on their `describe` block, which links them to Jira stories and the dashboard.

## Project layout

```
src/
  config/env.ts        environment selection, accounts and test data
  pages/               page objects, grouped by app area
  flows/               multi-page flows (sign in, role switching, sessions)
  fixtures/            Playwright fixtures that expose the page objects
  data/                known defects, programs and run state
  helpers/             PrimeNG widgets, downloads, test data factory
tests/
  stories/NN-area/     one spec per user story (us-NN-*.spec.ts)
  maintenance/         seed, discover and clean up test data (not part of release runs)
test-cases/            reviewed test cases per story; start at test-cases/00-index.md
specs/                 output folder for the Playwright planner agent
dashboard/index.html   release quality dashboard (a single static page)
scripts/               run summary, coverage, pruning and local dashboard server
stories.json           story list and priorities (US-10 to US-25 are release-critical)
```

Every test case in `test-cases/` has an id `TC-USNN-NN`, and the automated test uses the same id. [`test-cases/00-index.md`](test-cases/00-index.md) lists coverage per area, the manual cases and the differences between environments.

## Release quality dashboard

The dashboard shows a verdict for each release (ready, risks or not ready), story status by priority, pass-rate trends, flaky tests and automation coverage. It keeps a separate history for each environment.

- **Not ready:** a release-critical story is red, or more than 5% of tests failed.
- **Risks:** any other story is red.
- Flaky and skipped tests never block a release on their own. Known defects are listed in `src/data/known-defects.ts`.

To build and view it locally after a run:

```bash
npm run dashboard:build    # writes site/runs/*.json, site/index.json and site/coverage.json
npm run dashboard:serve    # http://localhost:8765/
```

### Publishing

The published dashboard is served by GitHub Pages from the `gh-pages` branch. The workflow `.github/workflows/e2e-release.yml` ("E2E release report") runs the suite on the chosen environment and adds the results to `gh-pages`. Before it can run:

1. Create GitHub Environments named `dev2`, `dev3` and `uat` (Settings → Environments) with the secrets `BCBA_USERNAME` and `BCBA_PASSWORD`, and optionally `RBT_*`, `ADMIN_*` and `SLACK_E2E_WEBHOOK`.
2. Add the test data variables (`CLEAN_CLIENT_ID`, `SEEDED_CLIENT_ID` and so on) to each environment.
3. Start it from Actions → E2E release report → Run workflow.

Changing files under `.github/workflows/` needs a token with the `workflow` scope.

The published HTML reports leave out Playwright traces, because traces record what was typed into the login form and `gh-pages` is public. Screenshots and videos are kept. Before publishing, `scripts/mask-secrets.mjs` replaces the login values with `***` in every published file, because the app shows the signed-in user's name, which on the shared test accounts can equal the username or password. To look at a trace, run the failing test locally and open it with `npm run report`.
