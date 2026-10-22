# US-29 — Add trend lines to a program's chart

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Program-Level Analysis |
| Role | BCBA |
| Automation | `tests/stories/08-program-analysis/us-29-trend-lines.spec.ts` |
| Watch for | Control hidden in Display panel; no hint (NGC-42, NGC-85) |

**Acceptance:** Trend line with 3+ points; hint when fewer.

**Observed on dev2 (Oct 19):**
- The **Trend** checkbox (`trend-visible-toggle`) is on the Data tab; with it on, one more line is drawn (data + trend). Trend scope ("Across visible sessions") is in the Display panel.
- On a program with no data, turning Trend on shows "A trend line needs at least 3 data points." (NGC-85 fixed on dev2).

---

## TC-US29-01 — Trend line is added to a chart with 3+ points and removed again

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded program → Data tab | Chart has 3 or more session points |
| 2 | Turn on **Trend** (open **Display** first if the control is not visible — NGC-42) | A trend line is added (one more line on the chart) |
| 3 | Turn Trend off | Trend line removed |

## TC-US29-02 — With fewer than 3 points the trend control explains why no line is drawn (NGC-85) @edge

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: create an Opportunity Based program (no sessions) → Data tab | Empty chart |
| 2 | Try to turn on Trend | A hint says 3 or more points are needed (**fails today** if no hint, NGC-85) |
| 3 | Clean-up: delete the program | Removed |
