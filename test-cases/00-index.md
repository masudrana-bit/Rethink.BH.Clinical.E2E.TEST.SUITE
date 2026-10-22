# Test case index — RHD-57736 (Clinical, dev2)

Each story has one md file with its test cases. Automated cases live in `tests/stories/<same folder>/us-NN-*.spec.ts` with the same `TC-USNN-NN` id. Cases marked **manual** are not automated (feature not on dev2, needs a long run, or needs a visual check of a file).

Run a group: `npx playwright test tests/stories/08-program-analysis --project=stories`

Run on another environment: `npm run test:uat -- --project=stories` or `npm run ui:dev3` (`TEST_ENV` = `dev2`, `dev3` or `uat`). Accounts and test data for that environment go in `.env.uat` / `.env.dev3` (copy `.env.uat.example`); anything missing falls back to `.env`. In CI, pick the environment when starting the "E2E release report" workflow; it uses the GitHub Environment of the same name for secrets and variables.

## Kind of test case and "fully automated"

Every case is a **happy path** unless its heading ends with a tag:

- `@negative`: error, validation or permission check (for example required fields, a blocked action, a role that must not see a page).
- `@edge`: edge case (resilience after refresh or re-login, empty states, layout, long-running checks).

A feature (story) is **fully automated** when every happy-path case written for it has an automated test that is not a `test.fixme` placeholder. Negative and edge cases are reported separately and do not change the label. `node scripts/build-coverage.mjs` builds `site/coverage.json` from these headings and the spec titles; the dashboard's "Automation coverage" tab shows it. Today 42 of 47 features are fully automated; US-26, US-30, US-39, US-43 and US-44 each have one happy-path case that is checked by hand (listed below).

| Folder | Stories | Test cases | Automated | Manual |
| --- | --- | --- | --- | --- |
| 01-plan-setup-library | US-01 – US-03 | 7 | 7 | 0 |
| 02-program-authoring | US-04 – US-06 | 8 | 8 | 0 |
| 03-target-criteria | US-07 – US-09 | 9 | 9 | 0 |
| 04-session-lifecycle | US-10 – US-14 | 11 | 11 | 0 |
| 05-data-collection | US-15 – US-22 | 12 | 12 | 0 |
| 06-closeout | US-23 – US-25 | 7 | 7 | 0 |
| 07-platform | US-26 | 5 | 3 | 2 |
| 08-program-analysis | US-27 – US-31 | 9 | 8 | 1 |
| 09-clinical-decisioning | US-32 – US-33 | 4 | 4 | 0 |
| 10-client-funder-reporting | US-34 – US-40 | 10 | 9 | 1 |
| 11-program-library-admin | US-41 – US-47 | 12 | 9 | 3 |
| **Total** | **47** | **94** | **87** | **7** |

## Differences between environments (Oct 21–22)

UAT runs an older build than dev2. Known defects that apply only to some environments carry `envs` in `src/data/known-defects.ts`.

| Test case | UAT | dev2 |
| --- | --- | --- |
| TC-US03-01 | NGC-16: "Uncategorised" (British spelling) | fixed |
| TC-US15-01 | NGC-90: no Model prompt level | fixed |
| TC-US20-01 | High / Medium / Low intensity levels offered (test passes) | levels removed (known defect, dev2 only) |
| TC-US23-01 | also: note fields Client Name / Staff Assigned / Location not pre-filled, note cannot be submitted | template not applied, NGC-86 |
| TC-US24-03 | NGC-65: ABC entries cannot be corrected | fixed |
| TC-US27-01 | x-axis shows session numbers, not dates (NGC-59 area) | fixed |
| TC-US28-01 | NGC-61: phase change not drawn on the target chart | fixed |
| TC-US30-01 | annotations listed but not drawn on the chart | fixed |
| TC-US39-02 | seeded client has no draft funder report: test skips (test data) | has a draft |
| TC-US42-01 | Domain also blank on most programs | Area blank |
| TC-US43-01 | first catalog program has no category: test now picks one that has a category | — |

dev3 (Oct 22): own accounts and test data in `.env.dev3`. The test client is 394036, seeded with `tests/maintenance/seed-test-data.spec.ts`; the clean client is 467421.

- **Data sheet stays blank for a client with a large plan.** On AppClient (84614, about 125 programs) starting a session requests targets, objectives, mastery criteria and data collection for every program at once (about 1,000 calls). About a third get no answer within 15 s, the retry loses another third, and the data sheet shows only the toolbar: no programs, no error and no Retry. 20 session tests failed this way in the first dev3 run; they pass on a client with a small plan. Not tracked in Jira yet.
- Fixed on dev3 (still on dev2/UAT): TC-US09-03 maintenance threshold, TC-US10-01 RBT view needs refresh, TC-US32-01 phase history "Unknown", TC-US38-01 publishing unavailable. Fixed on dev3 like dev2: NGC-16, NGC-65, NGC-90.
- Reproduces on dev3: NGC-49 RBT schedule shows clients outside the caseload (TC-US11-01, passes on dev2/UAT); no intensity levels on the duration recorder (TC-US20-01, as on dev2); pre-session note template not applied (TC-US23-01); Domain blank in the program catalog (TC-US42-01, as on UAT); library search 3.5 s (TC-US02-01).
- Test data on dev3: the seeded client has no funder reports (TC-US39-02 skips); the session note templates differ from dev2 (no "Billable Session Note").

## Manual cases

- TC-US26-04 Launch from the BH dashboard tile (no tile hand-off on dev2, NGC-66) — `test.fixme` in the spec
- TC-US26-05 No forced sign-out over a 90-minute session — `test.fixme` in the spec
- TC-US30-03 Annotation line styles and phase-change lines (visual)
- TC-US39-03 Exported PNG / PDF content (open the files)
- TC-US42-02 Editor panel does not overlap the grid at 1280 px
- TC-US43-02 "Last edited" updates on every edit (no such column today)
- TC-US44-02 System targets, file upload, dropdown behaviour

## Defects found on dev2 (Oct 19) — groups 07–11

Tests keep running past these (soft checks) unless noted, so the rest of the flow is still verified.

| Story | Finding |
| --- | --- |
| US-26 | Role shown as "Role 4 a"; caseload returns 401 right after sign-in (recovers with Try again) |
| US-31 | Observations grid: Setting is "—"; AG Grid trial watermark shown (NGC-44) |
| US-32 | Phase history lists the user as "Unknown" |
| US-33 | Skip baseline leaves targets in Baseline; no mastery determination raised within 2 min after criteria met (**test stops**) — confirm manually |
| US-37 | Only 1 linked measure — no replacement skill graphed with the behavior |
| US-38 | Review tab: "Publishing is unavailable for this plan." |
| US-39 | Report editor intermittently stays on "Loading report…" |
| US-41 | RBT view can open Settings by URL |
| US-42 | No Author / Last edited columns; Area blank on most programs (NGC-68) |
| US-44 | Draft programs cannot be deleted or deactivated (only Edit / Publish / Duplicate); admin-created programs show Source "Standard" |
| US-45 | Edit on a standard program edits in place, no "adapt a copy" prompt (**test stops before saving**) |
| US-46 | Publish has no confirmation |
| US-47 | Deactivate has no confirmation, also on standard programs (NGC-30) |

## Failure triage — full run Oct 19–20 (36 failed of 89)

**Test-script issues (fixed):**

| Story | Cause | Fix |
| --- | --- | --- |
| US-13, US-27, US-29, US-30, US-34 | dev2 intermittently shows "Couldn't load this client's treatment plan", "Programs couldn't be loaded", "This program could not be found", "Saved reports could not be loaded"; tests had no recovery | `BasePage.recoverLoadErrors` clicks Retry (or reloads) up to 3 times and notes each retry as "dev2 load error"; used by the plan, wizard program step, program details, program data tab and saved reports |
| US-27, US-29, US-30 | "Sessions recorded on other devices could not be loaded." stays on the program data tab even though the charts load | Program data tab treats it as non-blocking: noted as a known defect, test continues |
| US-20, US-18 | Duration recorder changed to a plain Start / Stop timer (no intensity levels) | `startDurationTimer` / `stopDurationTimer` / `durationTotal` handle both recorders; missing levels is a soft-check finding |
| US-23 | Run at night: the 9:00 appointment cannot be started yet; a later run resumed a half-done appointment | Falls back to an ad-hoc session (appointment check skipped); a leftover in-progress appointment is finalized first |
| US-37 | Hard date check failed after local midnight | Date is now a soft check (defect below); the count and the rest of the flow are still verified |
| US-07 | New targets now need an objective before the target manager saves ("Choose an objective for …") | `TargetManagerDrawer.save` assigns Objective 1 to each named target and saves again (noted as "objective required") |
| US-12, US-28 | Finalize sometimes shows "Skill data could not be saved… try Finalize again", or leaves a blank summary page | `SessionClosePage.finalize` finalizes once more, or reloads the blank page first |
| US-13, US-18, US-25 | Data sheet shows "Couldn't load <client>'s programs", or a card shows "We couldn't load how this program collects data" | `DataSheetPage.showProgram` clicks Retry (up to 3 times for a card) |
| US-13 | Receiving Staff list empty (Accounts outage) | Reopens Close Session once, then skips as "dev2 environment outage" |
| US-47 | Status read right after publish was stale | Status is polled (re-search) for up to 60 s |
| US-42, US-43 | Catalog passed 50 programs, so the grid now pages ("1 to 50 of 52") and the pager was read as the program count; the search check also read rows before the filter applied | `shownCount` ignores the pager; the search check waits until every row matches |
| Any (sign-in) | dev2 sign-in handoff fails intermittently: "We couldn't sign you in. That sign-in link did not work." | `SignInPage.signIn` starts over, up to 3 attempts (noted as "dev2 sign-in error"), then skips as "dev2 environment outage"; a rejected username/password still fails |
| Safari smoke, tablet RBT projects | WebKit is not installed on this machine (`browserType.launch: Executable doesn't exist`) | Run `npx playwright install webkit` to use those projects locally; the local dashboard run uses `--project=stories` |

**How known defects and outages are reported (Oct 20):**

- Tests that hit a known product defect are marked *expected to fail* in `src/data/known-defects.ts` (TC id, summary, and a pattern for the defect's error). The dashboard shows them as "Known defect" (amber), not as failures.
- If a marked test fails for a different reason, it is reported as a real failure ("not the known defect"). If it passes, it fails with "Expected to fail, but passed": check that the defect is fixed, then remove the entry.
- `IGNORE_KNOWN_DEFECTS=1` turns the marking off and shows the raw results.
- dev2 save outages ("rejected this service's credential", "Something went wrong saving this program", "Something went wrong. Please try again."): the save is retried once, then the test is skipped as "dev2 environment outage". A partial save ("these targets were not added") skips at once, because a retry would create a duplicate program.
- US-15 (NGC-90) and US-27 (NGC-59) pass again on Oct 20, so they are no longer in the list.

**Product / environment defects (marked as known defects):**

| Story | Finding |
| --- | --- |
| All program-creating tests (US-15, US-18, US-20, US-28, US-44) | Program save fails intermittently: "Something went wrong saving this program", "The program was saved, but these targets were not added", and "Accounts rejected this service's credential (status 401) for account 23832. This will not resolve without operator action." — dev2 backend credential problem, needs an operator |
| US-13 | Receiving Staff list empty during the same outage (back later on Oct 20) |
| US-30 | Annotation delete fails: "This annotation could not be deleted." |
| US-14 | Backfill entered between local midnight and 06:00 (UTC+6) lands one day later in the Observations grid |
| US-37 | Behavior Session Data uses the UTC day for a session recorded after local midnight |
| US-23 | Appointment session has no behavior support card ("0 behavior plans"); plus template not carried over, NGC-86 wording, RBT Home still shows Open |
| US-20 | Duration recorder no longer offers High / Medium / Low intensity (confirm with product) |
| US-2 | Library search 4.0–4.6 s (target 3 s) |
| Already listed | US-4 (NGC-21), US-7 (412 on combined save), US-9 (maintenance threshold), US-10 (schedule needs refresh, NGC-47), US-12 (client not pre-selected), US-15 (Model prompt, NGC-90), US-22 (ABC client), US-24 (undo leaves no trail), US-26, US-27 (goal line, NGC-59), US-31 – US-33, US-38, US-41, US-42, US-45 – US-47 |
