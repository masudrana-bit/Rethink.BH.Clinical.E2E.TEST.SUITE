# US-27 — Review a program's combined trend chart

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Program-Level Analysis |
| Role | BCBA (RBT for the session) |
| Automation | `tests/stories/08-program-analysis/us-27-combined-trend-chart.spec.ts` |
| Watch for | Goal line source (NGC-59) |

**Acceptance:** Chart renders from session data; real dates on x-axis; goal line uses mastery goal; date-range filter.

**Observed on dev2 (Oct 19):**
- Program → **Data** tab (`?tab=data`) has three views: **Combined**, **Targets**, **Payor**. Summary tiles: Sessions, Targets, Average, Mastered.
- The combined chart labels each point with the session number and date, e.g. "S45 Oct 19". A finalized session shows up as the next session number, dated today.
- **Display** opens the filter panel: Target, Staff, Setting, Time of day, Sessions, Plot by (Plot by session), Range (Last 12 sessions / All sessions / Custom sessions), Graph type (Performance trend), Trend scope, annotation toggles, Always show baseline.
- One horizontal plot line is drawn on the seeded program's chart; whether it comes from the mastery goal needs a manual check against the program's criteria (NGC-59). *Oct 20: TC-US27-01 passes (goal line drawn), so NGC-59 appears fixed on dev2.*

---

## TC-US27-01 — A finalized session appears on the combined chart as a new point dated today

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → "Requesting preferred items" → **Data** tab → Combined | Chart drawn; note the last session label (e.g. S55) |
| 2 | Switch to RBT, start an ad-hoc session with the program, record **Correct**, **Correct** on "Snack items", conclude and finalize | Session finalized |
| 3 | Back as BCBA, open the Data tab again | A new last point (previous + 1) labelled with **today's date** |
| 4 | Check the summary tiles | Sessions and Average shown |
| 5 | Check the goal line | Goal line drawn at the mastery criterion (**fails today** if absent, NGC-59) |

## TC-US27-02 — Date-range filter changes the sessions shown

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: open the seeded program Data tab → **Display** | Range offers Last 12 sessions, All sessions, Custom sessions |
| 2 | Choose **Last 12 sessions** | At most 12 points |
| 3 | Choose **All sessions** | More points than step 2 (the seeded program has more than 12 sessions) |
