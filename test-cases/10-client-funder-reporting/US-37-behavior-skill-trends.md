# US-37 — Review behavior & replacement-skill trends side by side

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Client & Funder Reporting |
| Role | BCBA (RBT for the session) |
| Automation | `tests/stories/10-client-funder-reporting/us-37-behavior-skill-trends.spec.ts` |
| Watch for | Nothing measured on 29 Sep |

**Acceptance:** Side-by-side chart once the behaviour is measured on a plan.

**Observed on dev2 (Oct 19):**
- Client → **Behavior Support**: plan list (Current / Inactive), **Add New**, **Emerging behaviors** panel (behaviors from session ABC entries that are not on a plan), plan detail with tabs **Plan**, **Quick Reference**, **Data**, **Review**.
- The "Self Injury" plan is named "SIB" in the header; Plan tab: goal "Not written yet", function not determined, "Review overdue", "No skills linked yet".
- **Data** tab: filters (Graph: Behavior graph, Behavior, Plot by, Range), **Linked measures** ("1 LINKED MEASURE — Self Injury measured by Frequency, legacy setup"), **Behavior trend** paired co-graph with a phase legend, and **Session Data** rows (date, behavior, measure, value, duration, phase, staff, note) with CSV export.
- **Defect (Oct 20, session at ~01:00 UTC+6):** the Session Data row is dated **Oct 19** while the data sheet header showed Oct 20 — the behavior data uses the UTC day. The date check is a soft check so the rest of the flow still runs.

---

## TC-US37-01 — Behavior counts from a session appear in the plan Data tab beside the linked measures

| # | Action | Expected result |
| --- | --- | --- |
| 1 | RBT: session on the seeded client with "Self Injury" → **+1** twice → conclude and finalize | Behavior shows 2 |
| 2 | BCBA: client → Behavior Support → Self Injury plan → **Data** | Paired co-graph for Self Injury drawn |
| 3 | Session Data | Top row: today, Self Injury, Frequency **2** |
| 4 | Linked measures | Behavior and its replacement skill graphed side by side (**fails today**: only 1 linked measure, no skill linked) |
