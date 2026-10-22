# US-4 — Add a library program to a plan (Current / Future)

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Program Authoring |
| Role | BCBA |
| Automation | `tests/stories/02-program-authoring/us-04-add-library-program.spec.ts` |
| Watch for | Goal and lesson plan not copied (NGC-72); duplicate warning only in same tab (NGC-21) |

**Acceptance:** Added program carries goal, objectives, targets and lesson plan; duplicate warning; status moves Future → Current.

---

## TC-US04-01 — Add a system program as Current and confirm goal, targets and lesson plan were copied

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open the clean client | Skills Programs shown |
| 2 | Precondition: if `Following One-Step Instructions` or `Matching Identical Pictures` is already on the plan (Current or Inactive), delete it | Neither program is on the plan |
| 3 | Open **Add Program**, search `Following One-Step Instructions`, open **Preview**, note the goal and whether the catalog has details, go **Back to Catalog** | Preview shows goal and keywords |
| 4 | Choose **Add as: Current**, click **Add** | Success; dialog stays or closes |
| 5 | Open the program from the **Current** list | Program detail page opens |
| 6 | Check **Goals and Objectives** | Goal text matches the catalog goal (NGC-72) |
| 7 | If the catalog had details: open **Lesson Information** | Lesson plan content is present (no "No lesson plan available") |
| 8 | If the catalog had details: open **Manage Targets** | Library targets are present |

> Test data note: steps 7–8 only run when the catalog preview lists targets or a lesson plan. On dev3 every preview says "No catalog details recorded"; on dev2 previews show only the goal and keywords. Either way the run records a `test-data gap` annotation. Seed a system program with targets and a lesson plan to cover them.

## TC-US04-02 — Duplicate protection: "Already added" in the catalog and a warning from a stale second tab @negative

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open the clean client (program from TC-01 is on the plan) | Skills Programs shown |
| 2 | Open **Add Program**, search `Following One-Step Instructions` | Row shows an **Already added** chip and has no **Add** button; close the dialog |
| 3 | Precondition: delete `Identifying Objects` from the plan if present | Not on the plan |
| 4 | Tab 1: open **Add Program**, search `Identifying Objects`. Tab 2 (same session): open the same client, **Add Program**, search the same program | Both tabs show the row with an **Add** button |
| 5 | Tab 2: **Add as Current → Add**, close tab 2 | Program added |
| 6 | Tab 1 (list is now stale): click **Add** | A duplicate warning dialog appears (NGC-21); cancel it |
| 7 | Reload, open **Current** | Plan has exactly one copy of `Identifying Objects` |
| 8 | Clean-up: delete `Identifying Objects` | Removed |

## TC-US04-03 — Add a program as Future and move it to Current

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open the clean client, add `Matching Identical Pictures` as **Future** | Program appears under Inactive/Future, not under Current |
| 2 | Open it, **Program actions → Update Status → Current** | Status updated |
| 3 | Go to **Current** | Program now listed under Current |
