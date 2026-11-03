# NextGen Clinical QA — Status Report

**Date:** November 3, 2026  
**Scope:** E2E testing epic [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) and manual test execution [RHD-60204](https://rethinkautism.atlassian.net/browse/RHD-60204)  
**Environments:** dev2, dev3, UAT  
**Overall status:** **AT RISK** — coverage is strong, but dev3 is not release-ready and the manual execution has not started.

---

## Executive summary

- **82% of all test scenarios run automatically.** Combining the 83 manual Xray tests with our 94 automated test cases gives 106 scenarios; 87 of them are automated.
- **dev3 is "Not ready"** after the latest run (Oct 27): pass rate 65.2%, with 8 failures to investigate and 17 product defects that still reproduce.
- **Manual execution RHD-60204 is at 0%.** All 83 Xray tests are still in Draft, but it has already produced 15 defect tickets.
- **12 manual scenarios have no automation yet**, mostly program-type variants, mastery paths and library revisions.

## Key metrics

| Metric | Value |
|---|---|
| Combined scenarios (automated suite + Xray tests not yet covered) | 106 |
| Automated | 87 (82%) |
| Xray tests covered by automation: fully / partly / not at all | 44 / 27 / 12 of 83 |
| Automated suite: test cases automated | 87 of 94 |
| Automated suite: stories fully automated | 42 of 47 |
| Latest dev3 run (GitHub Actions, Oct 27) | 58 passed, 17 known defects, 8 failed, 6 skipped of 89 |
| dev3 pass rate | 65.2% (Oct 22 local run: 71.1%) |
| Defects raised from the Xray execution | 15 (13 Ready for Development, 2 In Progress) |

## Highlights

1. **Automated suite runs in CI on any environment.** The GitHub Actions pipeline runs the full suite on dev2, dev3 or UAT and publishes a release dashboard per environment. A full dev3 run takes about one hour.
2. **dev3 test data is in place.** Dedicated test clients and seeded programs were set up on dev3. The local dev3 run went from 39 to 82 tests behaving as expected (Oct 22).
3. **Confirmed fixes on dev3:** the RBT view no longer needs a refresh, the frequency mastery threshold saves, phase history names the user, behavior plans can be published, and NGC-16, NGC-65 and NGC-90 are fixed.

## Risks and blockers

| Risk | Impact | Action needed | Owner |
|---|---|---|---|
| **dev3 data sheet stays blank for clients with large plans.** About 1,000 requests fire at session start, and a third time out. | RBTs cannot record data for those clients. | Log a defect and route it to engineering (not in Jira yet). | QA → Engineering |
| **8 dev3 failures in the Oct 27 CI run** | Release verdict "Not ready" | Triage: 2 are likely CI-only (legacy BH new tab), 1 known defect now passes, 5 follow dev3 changes since Oct 22. | QA automation |
| **17 product defects still reproduce on dev3.** Examples: NGC-49 caseload filter, NGC-86 note template not applied, NGC-68 catalog columns. | Release-critical session close-out and catalog flows are affected. | Prioritise fixes before release. | Product / Engineering |
| **Manual execution RHD-60204 not started (0%)** | The 12 uncovered scenarios are only covered once it runs. | Assign testers and start the execution. | QA lead |
| **Four-client group sessions and staff transfer cannot be automated yet** | Gaps remain in session coverage. | Provide two more test clients and a second staff account on dev3. | Environment owner |

## Coverage by product area

| Product area | Xray tests | Covered | Partly | Not covered | Automated test cases |
|---|---:|---:|---:|---:|---:|
| Session lifecycle and closeout | 13 | 10 | 2 | 1 | 18 of 18 |
| Plan setup and program authoring | 9 | 6 | 2 | 1 | 15 of 15 |
| Program types: create and collect data | 12 | 7 | 4 | 1 | 7 of 7 |
| Targets and criteria | 6 | 3 | 2 | 1 | 9 of 9 |
| Recording during a session | 5 | 2 | 2 | 1 | 5 of 5 |
| Phases and mastery | 7 | 2 | 3 | 2 | 4 of 4 |
| Platform and cross-cutting | 8 | 1 | 6 | 1 | 3 of 5 |
| Program analysis charts | — | — | — | — | 8 of 9 |
| Client and funder reporting | 10 | 7 | 2 | 1 | 9 of 10 |
| Program library admin | 13 | 6 | 4 | 3 | 9 of 12 |
| **Total** | **83** | **44** | **27** | **12** | **87 of 94** |

## Defects raised from the manual execution (RHD-60204)

| Defect | Summary | Status |
|---|---|---|
| [RHD-60506](https://rethinkautism.atlassian.net/browse/RHD-60506) | All targets displayed as Baseline on the data record page | Ready for Development |
| [RHD-60512](https://rethinkautism.atlassian.net/browse/RHD-60512) | Target phase names overlap on the graph | Ready for Development |
| [RHD-60572](https://rethinkautism.atlassian.net/browse/RHD-60572) | Inconsistent note icons across programs | Ready for Development |
| [RHD-60576](https://rethinkautism.atlassian.net/browse/RHD-60576) | Missing validation for prompt assignment on new targets | Ready for Development |
| [RHD-60578](https://rethinkautism.atlassian.net/browse/RHD-60578) | No Fading Prompts option when Automastery is selected | Ready for Development |
| [RHD-60579](https://rethinkautism.atlassian.net/browse/RHD-60579) | All targets recordable regardless of Objective sequence | Ready for Development |
| [RHD-60907](https://rethinkautism.atlassian.net/browse/RHD-60907) | Toileting: objectives, targets and mastery criteria misaligned | Ready for Development |
| [RHD-59598](https://rethinkautism.atlassian.net/browse/RHD-59598) | Program Library: missing unique name validation | In Progress |
| [RHD-61011](https://rethinkautism.atlassian.net/browse/RHD-61011) | Locations list shows only the dummy entry | In Progress |
| [RHD-61012](https://rethinkautism.atlassian.net/browse/RHD-61012) | Program Library: selecting a program no longer opens its side panel | Ready for Development |
| [RHD-61215](https://rethinkautism.atlassian.net/browse/RHD-61215) | Negative values allowed in Mastery Criteria | Ready for Development |
| [RHD-61408](https://rethinkautism.atlassian.net/browse/RHD-61408) | No validation for collection type change on programs with data | Ready for Development |
| [RHD-61411](https://rethinkautism.atlassian.net/browse/RHD-61411) | No validation for adding objectives to TA programs | Ready for Development |
| [RHD-61417](https://rethinkautism.atlassian.net/browse/RHD-61417) | Read-only TA steps | Ready for Development |
| [RHD-61474](https://rethinkautism.atlassian.net/browse/RHD-61474) | Group selection and phase fields missing when adding a target | Ready for Development |

## Next steps (next 1–2 weeks)

1. Triage and fix the 8 dev3 CI failures, then re-run dev3 through GitHub Actions.
2. Log the blank data sheet defect for large plans.
3. Automate 5 quick gaps: TA backward chain, publishing a revision, the two adapted-copy scenarios, and copying a program.
4. Add automated checks for 5 manual-execution defects: RHD-61215, RHD-60576, RHD-60578, RHD-59598 and RHD-61011.
5. Tag each automated test with its Xray key so automated results can be reported in RHD-60204.
6. Start the manual execution RHD-60204, focusing on the 12 scenarios with no automation.

---

*Sources: Jira (RHD-57736, RHD-60204 and linked defects, read Nov 3, 2026); automated suite `tests/stories`; GitHub Actions run 40478073527 (dev3, Oct 27, 2026).*
