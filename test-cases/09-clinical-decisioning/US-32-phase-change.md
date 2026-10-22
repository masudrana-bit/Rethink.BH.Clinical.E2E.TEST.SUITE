# US-32 — Change a target's phase and see its history

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Clinical Decisioning |
| Role | BCBA |
| Automation | `tests/stories/09-clinical-decisioning/us-32-phase-change.spec.ts` |
| Watch for | No phase column/control/history (NGC-60, NGC-82) |

**Acceptance:** Phase column at program level; change phase with reason; history; move beyond Intervention; Baseline status.

**Observed on dev2 (Oct 19):**
- Program Details lists each target's phase (`program-details-target-phase-<id>`) as read-only text.
- **Manage Targets** → each row has a phase control: phase (e.g. "Baseline — not yet recorded"), **Close baseline**, **Change phase**.
- **Change phase** dialog: target name, Phase (Intervention, Generalization, Maintenance, Custom), Effective date, Reason, **History**, Cancel / **Record change** (disabled with "Choose the phase to move to." until a phase is picked).
- A new target's history already holds "Status: Not Started — MANUAL — <date> — Unknown"; each phase change adds "<Phase> — MANUAL — <date> — <user> — <reason>", newest first.
- **Defect — history user:** the initial status entry names the user as "Unknown".
- **Close baseline** opens the same dialog; recording Intervention moves the target out of Baseline.

---

## TC-US32-01 — Move a target from Baseline to Intervention and then Maintenance with reasons; history and the program-level phase follow

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → create an Opportunity Based program → **Manage Targets** | Touch nose phase: Baseline |
| 2 | **Change phase** on Touch nose | Dialog shows the target; Record change disabled ("Choose the phase…"); history shows the initial status entry |
| 3 | Phase **Intervention**, reason "baseline stable over 3 sessions" → **Record change** | Phase reads Intervention |
| 4 | **Change phase** again | One new history entry (Intervention) |
| 5 | Phase **Maintenance**, reason → **Record change** | Phase reads Maintenance (moves beyond Intervention) |
| 6 | Open **Change phase** | Two new entries with both reasons and the user's name; no entry says "Unknown" (**fails today**: the initial status entry does) → Cancel |
| 7 | Close the drawer, reload Program Details | Program-level phase column shows Maintenance; drawer still says Maintenance |
| 8 | Clean-up: delete the program | Removed |

## TC-US32-02 — Close baseline moves a target out of Baseline

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: create an Opportunity Based program → Manage Targets | All targets in Baseline |
| 2 | **Close baseline** on Clap hands (confirm / give a reason if asked) | Clap hands leaves Baseline (Intervention) |
| 3 | Check the other targets | Still Baseline |
| 4 | Clean-up: delete the program | Removed |
