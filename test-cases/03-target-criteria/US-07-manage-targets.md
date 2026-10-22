# US-7 — Manage targets / steps within a program

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Target & Criteria Configuration |
| Role | BCBA |
| Automation | `tests/stories/03-target-criteria/us-07-manage-targets.spec.ts` |
| Watch for | Objective/Group dropdowns only after first save; linking one target linked all; no phase column; clipped dropdowns (NGC-03, NGC-05, NGC-53, NGC-84, NGC-87) |

**Acceptance:** Add, bulk add, edit, reorder, status (incl. On hold, un-master), objective and group assignment, dropdowns usable on every row, date-stamped change history.

**Observed on dev3 (Oct 19):**
- Rows only get the **Group** dropdown after the targets are saved once, and the **Prompt** dropdown only after a collection type is configured. Rows only show **Objective** when the program has objectives.
- Since Oct 20, when the program has objectives, every new target needs one before the save goes through ("Choose an objective for …"). The test assigns Objective 1 and saves again.
- A target group is saved as soon as **Add** is clicked, even if the drawer is then cancelled. Duplicate group names are accepted.
- After **Delete group** the open drawer still lists the group until it is reopened.
- **Remove** has no confirmation; **Cancel** discards the removal.
- **Defect:** renaming one target and changing another target's group (or objective) in the same save fails with "Something went wrong saving these changes. Please try again." The API returns `PATCH …/programs/{id}/targets/{targetId}` → **412 Conflict/StaleVersion** ("The resource has changed since the version supplied in If-Match"). Each change saves fine on its own. TC-US07-01 records this as a soft failure, then saves the edits in two passes.

---

## TC-US07-01 — Add, bulk add, rename, reorder and assign objective and group

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open the seeded client, create a custom program with 2 objectives and targets `Touch nose`, `Clap hands`, `Stand up` | Program opens on Program Details |
| 2 | **Manage Targets** → type `Point to dog` → **Add** | New row appears |
| 3 | Paste `Wave` and `Jump` into **Bulk custom targets** → **Add Parsed Targets** | "2 ready"; both rows appear |
| 4 | **Save** | Drawer closes; the Targets table lists all 6 targets; the table has a **Phase** column (NGC-60) |
| 5 | Reopen **Manage Targets**, rename `Stand up` to `Stand up tall` | Name field updated |
| 6 | Click **Move Jump up** | `Jump` moves above `Wave` |
| 7 | Add group `Body parts`; set `Touch nose` → Group = `Body parts` and Objective = **Objective 2** (targets default to Objective 1) | Dropdowns open fully and close after the pick (NGC-87) |
| 8 | **Save** (all changes in one save) | Drawer closes with no error. If "Something went wrong…" appears (412 defect above): Cancel, then save rename/reorder and group/objective separately |
| 9 | Reopen **Manage Targets** | Rename and order persisted; only `Touch nose` has the group and Objective 2; every other row keeps no group and Objective 1 (NGC-05) |
| 10 | Clean-up: delete the program | Program removed |

## TC-US07-02 — Status lifecycle: In Progress, On hold, Mastered and un-master, with dated history

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open the seeded client, create a custom program with 3 targets | Program opens |
| 2 | **Manage Targets**: `Clap hands` → Status **In Progress**; tick **On hold** for `Stand up`; **Save** | Targets table shows `Clap hands` In Progress |
| 3 | Reopen, open the status history of `Clap hands` | History lists **In Progress** with today's date and the user |
| 4 | Set `Clap hands` → **Mastered**, **Save** | Table shows Mastered with a Date Mastered |
| 5 | Reopen Manage Targets | `Clap hands` is in the **Maintenance** phase; its Status dropdown is locked and an **Unmaster** button is shown |
| 6 | Click **Unmaster**, **Save** | Status is no longer Mastered |
| 7 | Open the status history of `Clap hands` | History lists In Progress and Mastered, each date-stamped |
| 8 | Check `Stand up` | **On hold** is still ticked |
| 9 | Clean-up: delete the program | Program removed |

## TC-US07-03 — Remove a target (cancel and save) and delete a group

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open the seeded client, create a custom program with 3 targets | Program opens |
| 2 | **Manage Targets** → **Remove Stand up** → **Cancel** | Drawer closes; the Targets table still lists `Stand up` |
| 3 | **Manage Targets** → **Remove Stand up** → **Save** | `Stand up` is gone from the Targets table |
| 4 | Reopen, add group `Temp group`, delete it via **Delete → Delete group** | Confirmation names the group; after reopening the drawer, the group is gone |
| 5 | Clean-up: delete the program | Program removed |
