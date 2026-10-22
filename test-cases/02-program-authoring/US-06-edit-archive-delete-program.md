# US-6 — Edit, archive, or delete a program

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Program Authoring |
| Role | BCBA |
| Automation | `tests/stories/02-program-authoring/us-06-edit-archive-delete-program.spec.ts` |
| Watch for | Delete confirmation not yet seen; Save from reorder list (NGC-14); Edit duplicated in menu (RHD-58952) |

**Acceptance:** Edit from header and card menus; Discontinue; Delete with confirmation; Save works from every route.

---

## TC-US06-01 — Edit the goal and rename a program from the header

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open seeded client, create a custom program | Program detail opens |
| 2 | Click **Edit** on Goals and Objectives, change the goal, Save | New goal displayed |
| 3 | Click **Edit this program** (header pencil), change title, Save | Program rail shows the new title |
| 4 | Open **Program actions** menu | Items: Edit, Duplicate, Update Status, Delete — **Edit appears once** (RHD-58952) |

## TC-US06-02 — Discontinue (archive) a program, then delete it with confirmation

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open seeded client, create a custom program | Listed under Current |
| 2 | **Program actions → Update Status → Discontinued/Inactive** | Program moves from Current to **Inactive** |
| 3 | Open it from Inactive, **Program actions → Delete** | A **confirmation** dialog appears naming the program |
| 4 | Confirm delete | Program disappears from Current and Inactive |
