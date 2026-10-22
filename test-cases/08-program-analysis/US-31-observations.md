# US-31 — Review and correct recorded observations

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Program-Level Analysis |
| Role | BCBA (RBT for the session) |
| Automation | `tests/stories/08-program-analysis/us-31-observations.spec.ts` |
| Watch for | AG Grid watermark; empty Staff/Location; correction from Targets view (NGC-44) |

**Acceptance:** Observations grid with Staff and Location filled; correct a data point; chart updates.

**Observed on dev2 (Oct 19):**
- Below the chart, **Session Data** (`observation-grid`) has columns Date, Target, Phase, Value, Trials (Correct / Incorrect), Audit, Setting, Staff, plus **Details** and **Correct** per row. Layout: Grouped by target / Event stream.
- The grid only lists sessions finalized on **this device**: "Sessions recorded on other devices could not be loaded. The table shows this device's sessions only." So the test must finalize a session in the same browser first.

---

## TC-US31-01 — A finalized session is listed in the Observations grid with staff and setting; correcting it updates the grid and chart

| # | Action | Expected result |
| --- | --- | --- |
| 1 | RBT (same browser): ad-hoc session on "Requesting preferred items" → Snack items: Correct, Incorrect → conclude and finalize | Session finalized |
| 2 | BCBA: program → Data tab → Session Data | A row dated today for Snack items, value 50%, trials 1 / 1 |
| 3 | Check Staff and Setting | Both filled; no AG Grid trial watermark (**fails today**: Setting shows "—" and the AG Grid Enterprise trial watermark is displayed, NGC-44) |
| 4 | **Correct** on the row → change the Incorrect trial to Correct, give a reason → Save | Dialog closes |
| 5 | Check the grid and chart | Value 100%; Audit marks the row as corrected; the chart point moves |
