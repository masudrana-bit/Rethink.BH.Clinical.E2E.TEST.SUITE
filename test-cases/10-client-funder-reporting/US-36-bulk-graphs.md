# US-36 — Review every program & behavior graph in one report

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Client & Funder Reporting |
| Role | BCBA |
| Automation | `tests/stories/10-client-funder-reporting/us-36-bulk-graphs.spec.ts` |
| Watch for | Selection ignored (NGC-89) |

**Acceptance:** Bulk Graphs respects the selected programs; behaviour graphs included.

**Observed on dev2 (Oct 19):**
- **Bulk Graphs** starts with every item selected ("41 items selected"): "34 program(s) and 7 behavior(s) in this report", one card per graph with a goal status ("No goal set"), and **Render all for printing**.

---

## TC-US36-01 — Bulk Graphs lists every program and behavior, then respects a narrowed selection (NGC-89)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → Analyze Data → **Bulk Graphs**, Include Programs + behaviors | Count "N program(s) and M behavior(s)" with M > 0; a card for "Requesting preferred items" |
| 2 | In the selection, clear all and pick "Requesting preferred items" and "Self Injury" | "1 program(s) and 1 behavior(s)"; exactly 2 cards (**fails today** if the selection is ignored, NGC-89) |
| 3 | **Render all for printing** | Cards rendered |
