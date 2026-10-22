# US-18 — Record simple collection data (8 types)

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Data Collection |
| Role | BCBA (set-up), RBT (collection) |
| Automation | `tests/stories/05-data-collection/us-18-simple-collection.spec.ts` |
| Watch for | Individual recorders never exercised; frequency-duration open |

**Acceptance:** Percentage, numeric, rating, tally, interval, frequency, duration, frequency-duration — each recorder exercised and saved.

**Observed on dev2 (Oct 19):**
- Recorders per target row (each with **Recorded** value and **Undo Last Entry**):
  - Percentage — "Percentage for X" + **Add** → "75% avg"
  - Numeric — "Numeric value for X" + **Add** → "7 avg"
  - Rating Scale — buttons **1–5** → "3 avg"
  - Number of Occurrences (tally) — "Count for X" + **Add** → "3 avg"
  - Frequency/Rate — **Start Program Timer**, "How many times for X" + **Save** → DAILY SUMMARY "4 times"
  - Interval (partial, every 1 min) — **Start Interval** → **Occurred?** → **Stop** → "100% (1/1)"; next is **Start Next Interval**. Stopping an interval early without marking it records nothing; a full minute unmarked records "0% (0/1)" (see US-21).
  - Duration — the duration-intensity recorder: **Start Timer** → High / Medium / Low; while running **Change** offers Switch to High/Medium/Low and **End timer**; session totals per level
  - Frequency + Duration — **Tally (n)**, **Start Duration** (reads "Duration Running…" while timing; no separate stop), **Save** ends the duration and saves the entry
- **Defect (US-9 / maintenance):** for Frequency/Rate, Duration, Frequency + Duration, Numeric and Number of Occurrences the mastery step keeps **Save** disabled with "Maintenance: enter a threshold value." even after the intervention threshold is set. Workaround in the test: turn on custom maintenance criteria and enter a threshold.
- Saving a Frequency/Rate count starts that target's program timer even if it wasn't started manually. Closing the session then asks "You have 1 timer running … Stop it and continue, or go back?" (**Go Back** / **Stop Timers and Continue**). The test stops the timers and continues; whether the auto-start is intended needs confirming with the product owner.
- The test creates its programs on the seeded client and deletes them afterwards.

---

## TC-US18-01 — Quick-entry recorders: percentage, numeric, rating, tally

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → create four custom programs with collection types Percentage, Numeric, Rating Scale and Number of Occurrences | Each shows its type in Program Details |
| 2 | Switch to RBT → New Session with the four programs → Start | Four cards |
| 3 | Percentage: Touch nose **75** → Add | "75% avg" |
| 4 | Percentage: Touch nose **25** → Add, then **Undo Last Entry** | Back to "75% avg" |
| 5 | Numeric: Touch nose **7** → Add | "7 avg" |
| 6 | Rating Scale: Touch nose **3** | "3 avg" |
| 7 | Number of Occurrences: Touch nose **3** → Add | "3 avg" |
| 8 | Close Session → Conclude | Summary lists the programs |
| 9 | Finalize; delete the programs | Programs removed |

## TC-US18-02 — Timed recorders: frequency, interval, duration, frequency + duration

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → create programs with Frequency/Rate, Interval, Duration and Frequency + Duration | Saved (maintenance workaround where Save is blocked) |
| 2 | RBT: New Session with the four programs → Start | Four cards |
| 3 | Frequency: Touch nose **4** → Save | DAILY SUMMARY "4 times" |
| 4 | Interval: Start → **Occurred?** → Stop; then Start Next → **Occurred?** → Stop | "100% (1/1)", then "100% (2/2)" |
| 5 | Duration: Start Timer → **High** for ~2 s → Change → **End timer** | High total > 0:00; Total ≥ High |
| 6 | Frequency + Duration: Tally ×2 → Start Duration ~2 s → Save entry | "Tally (2)"; Recorded value no longer "--" |
| 7 | Close Session → Conclude → Finalize | Session finalized |
| 8 | Delete the programs | Programs removed |
