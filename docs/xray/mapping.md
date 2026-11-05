# Xray RHD-60204 mapped to the automated suite

Compared on 2026-11-05 using the Xray test steps. 83 Xray tests: 38 covered, 32 partly covered, 13 not covered.

Run the automated tests for one Xray case with `npx playwright test --grep @RHD-60282`, or all mapped tests with `--grep @xray`.

| Xray test | Title | Coverage | Automated tests | Not covered yet |
|---|---|---|---|---|
| [RHD-60113](https://rethinkautism.atlassian.net/browse/RHD-60113) | Select and switch client context | Covered | TC-US01-01, TC-US01-02, TC-US01-03 | — |
| [RHD-60114](https://rethinkautism.atlassian.net/browse/RHD-60114) | Browse, search and filter the program library | Covered | TC-US02-01, TC-US02-02 | — |
| [RHD-60115](https://rethinkautism.atlassian.net/browse/RHD-60115) | View and organize the client's treatment plan | Covered | TC-US03-01, TC-US03-02 | — |
| [RHD-60116](https://rethinkautism.atlassian.net/browse/RHD-60116) | Add library programs to Current and Future | Covered | TC-US04-01, TC-US04-02, TC-US04-03 | — |
| [RHD-60117](https://rethinkautism.atlassian.net/browse/RHD-60117) | Create a custom program | Covered | TC-US05-01, TC-US05-02, TC-US05-03 | — |
| [RHD-60118](https://rethinkautism.atlassian.net/browse/RHD-60118) | Program materials and lesson notes by role | Partly covered | TC-US05-01 | File material, lesson note, and the RBT seeing them read-only |
| [RHD-60119](https://rethinkautism.atlassian.net/browse/RHD-60119) | Edit and rename a program from every entry point | Partly covered | TC-US06-01 | Edit from the card menu and the reorder list; tooltips |
| [RHD-60120](https://rethinkautism.atlassian.net/browse/RHD-60120) | Discontinue and delete a program | Covered | TC-US06-02 | — |
| [RHD-60121](https://rethinkautism.atlassian.net/browse/RHD-60121) | Copy a program | Not covered | — | Copy a program within a client and to another client |
| [RHD-60122](https://rethinkautism.atlassian.net/browse/RHD-60122) | Open Settings and the program catalog as Program Admin | Covered | TC-US41-01, TC-US42-01 | — |
| [RHD-60123](https://rethinkautism.atlassian.net/browse/RHD-60123) | Search and filter the catalog | Covered | TC-US43-01 | — |
| [RHD-60124](https://rethinkautism.atlassian.net/browse/RHD-60124) | Create a program and save as draft | Covered | TC-US44-01 | — |
| [RHD-60125](https://rethinkautism.atlassian.net/browse/RHD-60125) | Adapt a standard program without changing it for others | Covered | TC-US45-01 | — |
| [RHD-60126](https://rethinkautism.atlassian.net/browse/RHD-60126) | Publish a draft | Covered | TC-US46-01 | — |
| [RHD-60127](https://rethinkautism.atlassian.net/browse/RHD-60127) | Deactivate and reactivate a program, and check client impact | Covered | TC-US47-01, TC-US47-02 | — |
| [RHD-60380](https://rethinkautism.atlassian.net/browse/RHD-60380) | Reach Settings by direct URL and after a refresh | Partly covered | TC-US41-02 | Program Admin reopens Settings by copied URL after sign-out, and after a refresh |
| [RHD-60383](https://rethinkautism.atlassian.net/browse/RHD-60383) | A deactivated program is hidden from Add Program but stays on existing plans | Partly covered | TC-US47-01 | The deactivated program stays on a plan that already uses it |
| [RHD-60388](https://rethinkautism.atlassian.net/browse/RHD-60388) | Publish a revision of an already published program | Not covered | — | Open draft revision on a published program, change a target, publish, BCBA sees the update |
| [RHD-60390](https://rethinkautism.atlassian.net/browse/RHD-60390) | Adapted copy can be added to a client plan with its changes | Not covered | — | Adapted copy with an added target is offered in Add Program and keeps the target on the plan |
| [RHD-60391](https://rethinkautism.atlassian.net/browse/RHD-60391) | Adapting a program does not change client plans that use the original | Not covered | — | Plans using the original and the library preview are unchanged after adapting |
| [RHD-60393](https://rethinkautism.atlassian.net/browse/RHD-60393) | A saved draft reopens with everything that was entered | Partly covered | TC-US44-01 | Refresh, reopen the draft and compare every field; file material |
| [RHD-60394](https://rethinkautism.atlassian.net/browse/RHD-60394) | Create a program with its own goal, objectives and targets, then edit the draft | Partly covered | TC-US44-01 | Reopen the draft, change and add a target, Last edited updates |
| [RHD-60282](https://rethinkautism.atlassian.net/browse/RHD-60282) | Opportunity Based program: create and collect data, with and without prompts | Covered | TC-US08-01, TC-US15-01, TC-US15-02 | — |
| [RHD-60283](https://rethinkautism.atlassian.net/browse/RHD-60283) | Task Analysis Forward Chain: create and collect data, with and without prompts | Partly covered | TC-US16-01 | Forward Chain order, program without prompts, Baseline and Intervention |
| [RHD-60284](https://rethinkautism.atlassian.net/browse/RHD-60284) | Task Analysis Backward Chain: create and collect data, with and without prompts | Not covered | — | Backward Chain create and record |
| [RHD-60285](https://rethinkautism.atlassian.net/browse/RHD-60285) | Task Analysis Total Task: create and collect data, with and without prompts | Covered | TC-US16-01 | — |
| [RHD-60286](https://rethinkautism.atlassian.net/browse/RHD-60286) | Frequency/Rate program: create and collect data | Partly covered | TC-US18-02, TC-US09-03 | Three targets in Baseline, Intervention and Maintenance; per-target charts |
| [RHD-60287](https://rethinkautism.atlassian.net/browse/RHD-60287) | Duration program: create and collect data | Partly covered | TC-US18-02 | Three targets in different phases; summary totals and charts |
| [RHD-60288](https://rethinkautism.atlassian.net/browse/RHD-60288) | Frequency + Duration program: create and collect data | Partly covered | TC-US18-02 | Three targets in different phases; summary and charts |
| [RHD-60289](https://rethinkautism.atlassian.net/browse/RHD-60289) | Interval programs (Whole, Partial, Momentary): create and collect data | Partly covered | TC-US18-02, TC-US21-01 | All three interval types; unselected interval skill; charts |
| [RHD-60290](https://rethinkautism.atlassian.net/browse/RHD-60290) | Quick Entry Percentage, Numeric and Percentage + Numeric: create and collect data | Partly covered | TC-US18-01 | Percentage + Numeric; 150 rejected on percentage; charts |
| [RHD-60291](https://rethinkautism.atlassian.net/browse/RHD-60291) | Quick Entry Rating Scale, Number of Occurrences and Number of Prompts: create and collect data | Partly covered | TC-US18-01 | Number of Prompts; charts |
| [RHD-60292](https://rethinkautism.atlassian.net/browse/RHD-60292) | Toileting program: create and collect data | Partly covered | TC-US19-01 | Three targets in different phases; charts |
| [RHD-60293](https://rethinkautism.atlassian.net/browse/RHD-60293) | PEAK Scoring program: create and collect data | Partly covered | TC-US17-01 | Train and test blocks per target; charts |
| [RHD-60294](https://rethinkautism.atlassian.net/browse/RHD-60294) | Add targets and assign objectives and groups | Partly covered | TC-US07-01 | Removing an objective reassigns its targets to the first objective |
| [RHD-60295](https://rethinkautism.atlassian.net/browse/RHD-60295) | Reorder targets, change statuses and review change history | Covered | TC-US07-01, TC-US07-02 | — |
| [RHD-60296](https://rethinkautism.atlassian.net/browse/RHD-60296) | Manage Data Collection options and collection type rules | Covered | TC-US08-02, TC-US08-03 | — |
| [RHD-60297](https://rethinkautism.atlassian.net/browse/RHD-60297) | Configure mastery and baseline criteria for each data type | Partly covered | TC-US09-01, TC-US09-02, TC-US09-03 | Criteria for every collection type |
| [RHD-60298](https://rethinkautism.atlassian.net/browse/RHD-60298) | Configure maintenance, generalization and days-based criteria | Partly covered | TC-US09-01 | Days-based criteria; goal line follows the criteria |
| [RHD-60299](https://rethinkautism.atlassian.net/browse/RHD-60299) | Edit criteria on a program that already has data | Not covered | — | Change mastery criteria on a program with data; charts and goal line follow |
| [RHD-60300](https://rethinkautism.atlassian.net/browse/RHD-60300) | Timers during a session | Covered | TC-US21-01 | — |
| [RHD-60301](https://rethinkautism.atlassian.net/browse/RHD-60301) | Behavior data: duration-intensity, frequency and duration with details | Partly covered | TC-US20-01, TC-US20-02 | Frequency and duration behaviors with details; behavior note |
| [RHD-60302](https://rethinkautism.atlassian.net/browse/RHD-60302) | ABC for plan-defined and novel behaviors | Covered | TC-US22-01 | — |
| [RHD-60303](https://rethinkautism.atlassian.net/browse/RHD-60303) | ABC archived and unused options | Not covered | — | Archived ABC options hidden for new entries, history kept |
| [RHD-60304](https://rethinkautism.atlassian.net/browse/RHD-60304) | Recording page: selection, entry modes and layout | Not covered | — | Select all and deselect all, entry modes, long target names |
| [RHD-60305](https://rethinkautism.atlassian.net/browse/RHD-60305) | Change a target's phase with a reason and review history | Covered | TC-US32-01, TC-US32-02 | — |
| [RHD-60306](https://rethinkautism.atlassian.net/browse/RHD-60306) | Record baseline, switch to Intervention and record again | Partly covered | TC-US28-01, TC-US32-01 | Record in Baseline, switch, record in Intervention, both on the chart |
| [RHD-60307](https://rethinkautism.atlassian.net/browse/RHD-60307) | Auto-switch from baseline to intervention (confirm it exists in NextGen) | Not covered | — | Automatic switch from Baseline to Intervention |
| [RHD-60311](https://rethinkautism.atlassian.net/browse/RHD-60311) | Mastery determination is raised for each program type | Partly covered | TC-US33-01 | Determinations for task analysis programs |
| [RHD-60312](https://rethinkautism.atlassian.net/browse/RHD-60312) | Confirm and reject mastery determinations | Covered | TC-US33-01, TC-US33-02 | — |
| [RHD-60313](https://rethinkautism.atlassian.net/browse/RHD-60313) | Mastery paths: with maintenance, goals only, and days-based | Not covered | — | Maintenance, goals-only and days-based mastery paths |
| [RHD-60314](https://rethinkautism.atlassian.net/browse/RHD-60314) | Re-introduce a mastered target | Partly covered | TC-US07-02 | Re-introduce a mastered target; it returns to the data sheet |
| [RHD-60358](https://rethinkautism.atlassian.net/browse/RHD-60358) | Launch from the BH dashboard tile and by direct URL | Partly covered | TC-US26-01, TC-US26-02, TC-US26-04 | Launch from the BH dashboard tile (manual) |
| [RHD-60359](https://rethinkautism.atlassian.net/browse/RHD-60359) | Stay signed in during a long session | Partly covered | TC-US26-03, TC-US26-05 | 90-minute session (manual) |
| [RHD-60360](https://rethinkautism.atlassian.net/browse/RHD-60360) | BCBA, RBT and Program Admin permissions | Partly covered | TC-US10-01, TC-US10-02, TC-US26-02, TC-US41-02, TC-US11-01 | Other roles' pages blocked by direct URL; RBT read-only on plans |
| [RHD-60361](https://rethinkautism.atlassian.net/browse/RHD-60361) | Data persists after sign-out, refresh and client switch | Partly covered | TC-US25-01, TC-US25-02 | Counts compared after sign-out and client switch |
| [RHD-60362](https://rethinkautism.atlassian.net/browse/RHD-60362) | Hand-off to legacy BH | Covered | TC-US01-03, TC-US40-01 | — |
| [RHD-60363](https://rethinkautism.atlassian.net/browse/RHD-60363) | Browser, device and performance smoke | Partly covered | TC-US02-01 | Edge, Safari, tablet; client list and session start times |
| [RHD-60364](https://rethinkautism.atlassian.net/browse/RHD-60364) | UI consistency sweep | Not covered | — | Visual sweep; best kept manual |
| [RHD-60365](https://rethinkautism.atlassian.net/browse/RHD-60365) | Numbers agree across screens | Partly covered | TC-US31-01, TC-US34-01 | Same values compared on summary, chart, Analyze Data and funder graph |
| [RHD-60366](https://rethinkautism.atlassian.net/browse/RHD-60366) | Mastered targets report | Covered | TC-US34-01, TC-US34-02 | — |
| [RHD-60367](https://rethinkautism.atlassian.net/browse/RHD-60367) | Custom cross-program comparison graph | Covered | TC-US35-01 | — |
| [RHD-60368](https://rethinkautism.atlassian.net/browse/RHD-60368) | All-graphs report for selected programs | Covered | TC-US36-01 | — |
| [RHD-60369](https://rethinkautism.atlassian.net/browse/RHD-60369) | Behavior Support Plan: create and publish | Partly covered | TC-US38-01 | Start a plan from a novel behavior, edit and publish, versions |
| [RHD-60370](https://rethinkautism.atlassian.net/browse/RHD-60370) | Behavior and replacement-skill side-by-side trend | Covered | TC-US37-01 | — |
| [RHD-60371](https://rethinkautism.atlassian.net/browse/RHD-60371) | ABC pattern breakdown | Covered | TC-US38-01 | — |
| [RHD-60372](https://rethinkautism.atlassian.net/browse/RHD-60372) | Funder-ready skill graph export | Covered | TC-US39-01, TC-US39-02 | — |
| [RHD-60373](https://rethinkautism.atlassian.net/browse/RHD-60373) | Funder-ready behavior graphs | Not covered | — | Funder behavior and intensity rate graphs |
| [RHD-60374](https://rethinkautism.atlassian.net/browse/RHD-60374) | Navigate between client-level and program-level analysis | Covered | TC-US40-01 | — |
| [RHD-60375](https://rethinkautism.atlassian.net/browse/RHD-60375) | Save and reuse a funder graph (optional, confirm scope) | Partly covered | TC-US35-01 | Save as new version, same and empty name, overwrite |
| [RHD-61112](https://rethinkautism.atlassian.net/browse/RHD-61112) | Scheduled sessions list: counts and sessions-to-finalize banner | Covered | TC-US11-01, TC-US11-03 | — |
| [RHD-61113](https://rethinkautism.atlassian.net/browse/RHD-61113) | Start a scheduled session | Covered | TC-US11-02 | — |
| [RHD-61114](https://rethinkautism.atlassian.net/browse/RHD-61114) | Pause, resume and close a session, and check times | Covered | TC-US13-01 | — |
| [RHD-61115](https://rethinkautism.atlassian.net/browse/RHD-61115) | Ad-hoc session from RBT home and from a client page | Covered | TC-US12-01, TC-US12-02 | — |
| [RHD-61116](https://rethinkautism.atlassian.net/browse/RHD-61116) | Group session with two clients | Covered | TC-US12-03, TC-US22-02 | — |
| [RHD-61117](https://rethinkautism.atlassian.net/browse/RHD-61117) | Group session with four clients | Not covered | — | Four-client group session (needs two more test clients) |
| [RHD-61118](https://rethinkautism.atlassian.net/browse/RHD-61118) | Transfer a session to another staff member | Partly covered | TC-US13-02 | Complete a transfer (needs a second staff account) |
| [RHD-61119](https://rethinkautism.atlassian.net/browse/RHD-61119) | Backfill a historical session | Covered | TC-US14-01 | — |
| [RHD-61120](https://rethinkautism.atlassian.net/browse/RHD-61120) | Conclude a session and review the summary, audit list and drafted note | Covered | TC-US23-01 | — |
| [RHD-61121](https://rethinkautism.atlassian.net/browse/RHD-61121) | Save the note as a draft, then finalize the session | Covered | TC-US23-01, TC-US23-02 | — |
| [RHD-61123](https://rethinkautism.atlassian.net/browse/RHD-61123) | Correct recorded data and review the audit trail | Covered | TC-US24-01, TC-US24-02, TC-US24-03 | — |
| [RHD-61126](https://rethinkautism.atlassian.net/browse/RHD-61126) | Refresh or restart the browser during a session | Covered | TC-US25-01, TC-US25-02 | — |
| [RHD-61128](https://rethinkautism.atlassian.net/browse/RHD-61128) | Finalize group sessions per client (two-client and four-client) | Partly covered | TC-US12-03 | Finalize each client's session separately; four clients |
