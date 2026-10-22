# US-21 — Track session and program timers

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Data Collection |
| Role | BCBA (set-up), RBT (collection) |
| Automation | `tests/stories/05-data-collection/us-21-timers.spec.ts` |
| Watch for | Program/interval timers not re-tested |

**Acceptance:** Session, program and interval timers run, pause and display correctly.

**Observed on dev2 (Oct 19):**
- Session clock in the data-sheet header (m:ss).
- Frequency/Rate cards have **Start Program Timer** per target; running: **Pause** / **Stop**; paused: **Resume** / **Stop**.
- Running timers are listed in the dock under "Running and due timers": one row per program timer ("Program Timer <program> 0:05", "Paused" when paused) and per interval (countdown from 1:00).
- Interval (partial, every 1 minute, auto-restart): a full minute without "Occurred?" records **0% (0/1)** and the next interval starts automatically. Stopping early without marking records nothing.
- Closing a session with any timer still running shows "You have N timer(s) running … Stop it and continue, or go back to the session?" with **Go Back** / **Stop Timers and Continue**, after **Move to Session Note** is confirmed.
- Session pause/resume is covered by US-13.

---

## TC-US21-01 — Session, program and interval timers run, pause and stop

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → create a **Frequency/Rate** program and an **Interval** program | Saved (maintenance workaround for Frequency/Rate) |
| 2 | Switch to RBT → New Session with both → Start; wait ~3 s | Session clock advanced by ≥ 2 s |
| 3 | Frequency: **Start Program Timer** for Touch nose | Pause and Stop shown; dock row "Program Timer <program>" counts up |
| 4 | **Pause Program Timer**; wait ~2.5 s | Resume shown; dock row says "Paused" and does not advance |
| 5 | **Resume** | Dock row advances again |
| 6 | **Stop Program Timer** | Start Program Timer offered again; dock row gone |
| 7 | Interval: **Start Interval** for Touch nose | Occurred? shown; dock row "Interval <program>" counts down from ~1:00 |
| 8 | Wait for the minute to end without marking | Recorded **0% (0/1)** |
| 9 | **Stop** | "Start Next Interval"; dock row gone |
| 10 | Close Session → Conclude → Finalize; delete the programs | Session finalized; programs removed |
