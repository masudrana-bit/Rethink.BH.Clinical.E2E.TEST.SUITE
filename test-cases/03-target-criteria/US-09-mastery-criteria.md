# US-9 — Configure mastery, maintenance & generalization criteria

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Target & Criteria Configuration |
| Role | BCBA |
| Automation | `tests/stories/03-target-criteria/us-09-mastery-criteria.spec.ts` |
| Watch for | Generalisation sign-off rule not confirmed; unsupported-units note (NGC-40, NGC-80) |

**Acceptance:** Mastery, baseline (min OR max), maintenance and generalisation save and display; validation of required values and >100%; frequency-based criteria for frequency programs.

**Observed on dev3 (Oct 19):**
- The mastery step has four collapsible sections: Baseline to Intervention, Intervention to Mastered (the only one expanded by default), Generalization and Maintenance.
- Each section uses the same field set: Mode (Clinician Attestation / Automatic / Automatic with Confirmation), Direction (At Least / At Most), Threshold, Min trials, Count, Window (consecutive / total / of the last), Unit (Sessions / Day / Week / Month).

---

## TC-US09-01 — Mastery, baseline, generalization and maintenance save and display @smoke

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open the seeded client, create a custom program with 3 targets | Program opens |
| 2 | **Add Data Collection** → **Opportunity Based** → **Next** | Mastery step "Mastery Criteria — Opportunity Based"; defaults 80% / 5 trials / 3 consecutive sessions |
| 3 | Check the dropdowns | Mode, Direction, Window and Unit offer the options listed above |
| 4 | Expand Baseline: Direction **At Most**, Threshold **30** | Accepted (baseline can be a minimum or a maximum) |
| 5 | Intervention: Mode **Automatic with Confirmation**, Threshold **90**, Count **3** | Accepted |
| 6 | Expand Generalization and enable it; Maintenance stays enabled | Generalization shows ACTIVE |
| 7 | **Save** | Wizard closes |
| 8 | Check **Data Settings** | "Baseline at most 30%", "Mastery criteria at least 90% … across 3 consecutive sessions", "require BCBA confirmation", "Generalization On", "Maintenance On" |
| 9 | Reopen the wizard → **Next** | Saved values are shown |
| 10 | Clean-up: delete the program | Program removed |

## TC-US09-02 — Validation: percentage above 100 and empty required values @negative

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, create a custom program, **Add Data Collection** → **Opportunity Based** → **Next** | Mastery step |
| 2 | Intervention Threshold = **150** | "Percentage must be between 0 and 100."; field marked invalid; **Save** disabled |
| 3 | Clear the Threshold | **Save** stays disabled |
| 4 | Threshold = **90** | Error gone; **Save** enabled |
| 5 | **Back** → **Cancel** | Wizard closes without saving |
| 6 | Clean-up: delete the program | Program removed |

## TC-US09-03 — Frequency/Rate programs use frequency-based criteria

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, create a custom program, **Add Data Collection** → **Frequency/Rate** → **Next** | "Mastery Criteria — Frequency/Rate"; the threshold unit reads "occurrences per session"; threshold starts empty and Save is disabled ("Mastered: enter a threshold value.") |
| 2 | Intervention Threshold = **150** | No percentage error (frequency is not capped at 100) |
| 3 | Leave Maintenance on "same as Intervention" | **Save** should be enabled. Defect seen Oct 19: Save stays disabled with "Maintenance: enter a threshold value." even though Maintenance mirrors Intervention |
| 4 | Workaround: Maintenance → **Use Custom Criteria**, threshold **150** → **Save** | Saved |
| 5 | Check **Data Settings** | Shows Frequency/Rate with the frequency criteria (no % sign) |
| 6 | Clean-up: delete the program | Program removed |
