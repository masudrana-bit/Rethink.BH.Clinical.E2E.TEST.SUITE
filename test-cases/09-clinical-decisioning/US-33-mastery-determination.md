# US-33 — Review and confirm automatic mastery determinations

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Clinical Decisioning |
| Role | BCBA (RBT for the sessions) |
| Automation | `tests/stories/09-clinical-decisioning/us-33-mastery-determination.spec.ts` |
| Watch for | Needs enough data; auto-advance (NGC-60) |

**Acceptance:** Determination raised when criteria are met; confirm/reject; target status updates.

**Observed on dev2 (Oct 19):**
- Program Details has a **Mastery review** panel (`mastery-evaluation-review`); with nothing pending it reads "No mastery determinations are waiting for review."
- Mastery criteria mode **Automatic with Confirmation** shows "require BCBA confirmation" in Data Settings (US-9).
- Ticking "Skip baseline / advance directly to intervention" disables Save until a **Reason** is chosen ("Choose why baseline is being skipped, so the decision is on record.").
- **Defect:** after saving with skip baseline, all targets are still in **Baseline** and Data Settings still lists the baseline criteria. The test moves them to Intervention with the phase dialog to continue.
- **Defect (to confirm manually):** after an RBT session finalized with 3/3 Independent on two Intervention targets (criteria 80%, 1 trial, 1 session, "Rules-based — require BCBA confirmation"), no determination appeared within 2 minutes (reloading the program). If determinations are produced by a delayed background job, re-check after it runs.

---

## TC-US33-01 — Meeting the criteria raises a determination; confirm masters one target and reject keeps the other in progress

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → custom program (Touch nose, Clap hands, Stand up) → Add Data Collection → Opportunity Based → mastery: skip baseline (pick a reason), **Automatic with Confirmation**, 80%, min trials 1, **1 session** → Save | Data Settings says "require BCBA confirmation"; review panel empty |
| 1a | Manage Targets | All targets in **Intervention** (**fails today**: still Baseline → move each to Intervention with a reason) |
| 2 | RBT: session with the program → Touch nose and Clap hands 3 × Independent each → conclude and finalize | Finalized |
| 3 | BCBA: open the program (reload until it appears, up to 2 min) | Determinations for Touch nose and Clap hands; none for Stand up (**fails today**: none raised within 2 minutes) |
| 4 | **Confirm** Touch nose, **Reject** Clap hands (reason if asked) | Review panel empty again |
| 5 | Manage Targets | Touch nose **Mastered** with a mastered date; Clap hands not mastered |
| 6 | RBT: new session with the program | Touch nose no longer on the data sheet; Clap hands is → record one trial, finalize |
| 7 | Clean-up: delete the program | Removed |

## TC-US33-02 — Program without pending determinations shows the empty review state @edge

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded program "Requesting preferred items" | Mastery review panel: "No mastery determinations are waiting for review." |
