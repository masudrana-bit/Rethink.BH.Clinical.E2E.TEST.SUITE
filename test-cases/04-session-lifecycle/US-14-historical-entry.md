# US-14 — Enter historical / backfill session data

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Session Access & Lifecycle |
| Role | RBT, then BCBA to check the program data |
| Automation | `tests/stories/04-session-lifecycle/us-14-historical-entry.spec.ts` |
| Watch for | Start/end times still required and default to now |

**Acceptance:** Historical entry for a past date; times optional; data appears on graphs with the chosen date.

**Observed on dev2 (Oct 19):**
- **Post-Session Entry** uses the same wizard with a **HISTORICAL** badge and an **Observation date** (native date input, `max` = today).
- It opens a bulk-entry sheet (`/bulk-entry`) with service details, optional **Session Start / End** time fields and Correct / Incorrect / N/A **counts** per target with **Apply**.
- Start/end can be left blank — but the summary then shows the **entry time** (now) on the chosen date as the session start and end (watch-for item).
- **Defect (Oct 20, entered at 00:28 UTC+6):** backfilling Oct 13 with blank times shows Oct 13 on the summary, but the program's Observations grid lists the session under **Oct 14**. The chosen date seems to be combined with the current UTC time, so entries made between local midnight and 06:00 move one day. Not seen when entering in the daytime.

---

## TC-US14-01 — Backfill a past date with times left blank and see it in the program data

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as RBT, Sessions → **Post-Session Entry** | Wizard with **HISTORICAL** badge and Observation date; future dates are blocked (`max` = today) |
| 2 | Observation date = 7 days ago; tick the seeded client; pick `Requesting preferred items` | Confirm text names the chosen date |
| 3 | **Begin Post-Session Entry** | Bulk-entry sheet shows the chosen service date; Session Start/End are empty and not required |
| 4 | Counts for the target: Correct 3, Incorrect 1 → **Apply** | "4 data points entered"; score 75% |
| 5 | **Review Entry → Move to Summary** | Summary tagged **HISTORICAL**, dated the chosen day; Overall 75%, Scored 4 |
| 6 | Check the session times | Blank times are not replaced by the current time (watch-for) |
| 7 | Finalize | Session finalized |
| 8 | Switch to BCBA, open the seeded client → the program → **Data** | Observations include the chosen date |
