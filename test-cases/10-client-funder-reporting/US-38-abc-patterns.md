# US-38 — Review ABC patterns for a behavior plan

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Client & Funder Reporting |
| Role | BCBA (RBT for the session) |
| Automation | `tests/stories/10-client-funder-reporting/us-38-abc-patterns.spec.ts` |
| Watch for | Thin with one entry; plan not published |

**Acceptance:** Antecedent/consequence/context breakdown with several entries; published plan.

**Observed on dev2 (Oct 19):**
- Plan **Review** tab: "Nothing is waiting for review. Publishing is unavailable for this plan." and "This plan is in effect, but no version has been published in Clinical yet." (legacy plans carried over from Rethink BH).

---

## TC-US38-01 — ABC entries recorded in a session show up in the plan ABC breakdown

| # | Action | Expected result |
| --- | --- | --- |
| 1 | RBT: session on the seeded client with "Self Injury" → two ABC entries (Academics; Task/command given; Ignored) → finalize | Finalized |
| 2 | BCBA: Behavior Support → Self Injury plan → **Data** → Graph list | An ABC breakdown view is offered |
| 3 | Choose the ABC view | Antecedent "Task/command given", consequence "Ignored" and context "Academics" listed with counts |
| 4 | **Review** tab | Plan can be published (**fails today**: "Publishing is unavailable for this plan.") |
