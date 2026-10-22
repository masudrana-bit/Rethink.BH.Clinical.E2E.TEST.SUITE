# US-34 — Review mastered targets across a client's plan

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Client & Funder Reporting |
| Role | BCBA |
| Automation | `tests/stories/10-client-funder-reporting/us-34-mastered-targets.spec.ts` |
| Watch for | Mastered target missing (NGC-45); reports saved on device only |

**Acceptance:** Mastered targets report lists every mastered target; saved reports follow the user.

**Observed on dev2 (Oct 19):**
- Client → **Analyze Data** has three modes: Mastered Targets (default), Custom Graph, Bulk Graphs; plus paper size, Print, Export PDF / PNG / CSV and **Save report**.
- Date range buttons: 2 weeks, 1 month, 3 months, 6 months, All, or a custom range.
- Mastered Targets: grouping (Domain …), tiles Mastered (13), In scope (71), Remaining (58) for the seeded client, and a chart.
- Saved reports: "No saved reports yet."

---

## TC-US34-01 — Mastered targets report: tiles add up, chart and grouping, any date range

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → Analyze Data | Mastered Targets report with tiles and chart |
| 2 | Range **3 months**, then **All** | Mastered + Remaining = In scope each time; Mastered > 0 |
| 3 | Open the grouping list | More than one grouping offered |
| 4 | Compare with the plan: every target with status Mastered is counted (manual spot-check, NGC-45) | — |

## TC-US34-02 — A saved report stays available after reload and in a new browser session

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Analyze Data → **Save report** → name it | Listed under saved reports |
| 2 | Reload | Still listed |
| 3 | Sign in as the same user in a fresh browser session (new device) → Analyze Data | Still listed (**fails today** if reports are saved on the device only) |
