# US-35 — Build a custom cross-program comparison graph

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Client & Funder Reporting |
| Role | BCBA |
| Automation | `tests/stories/10-client-funder-reporting/us-35-custom-comparison-graph.spec.ts` |
| Watch for | Behaviour graphs "not available yet" |

**Acceptance:** Several programs plotted together; behaviour graphs available; save the report.

**Observed on dev2 (Oct 19):**
- **Custom Graph**: Include Programs / Behaviors / Programs + behaviors; "Select programs to compare" (41 available for the seeded client); Display by Day, Calculation Total (pooled); toggles Baseline, Goal line, Phase changes.
- Empty state: "Select programs to compare them on one time axis."; export is disabled with "Choose at least one program to print or export."

---

## TC-US35-01 — Two programs and a behavior plotted on one time axis; the report can be exported and saved

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → Analyze Data → **Custom Graph** | Empty state; export disabled |
| 2 | Select "Requesting preferred items" and a second program | One chart with both programs; export enabled |
| 3 | Include **Programs + behaviors** → add "Self Injury" | Behavior plotted on the same chart (**fails today** if "not available yet") |
| 4 | **Export PNG** | PNG downloaded |
| 5 | **Save report** with a name | Listed under saved reports |
