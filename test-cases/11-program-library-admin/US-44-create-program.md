# US-44 — Create a new program

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Program Library Administration |
| Role | Program Administrator |
| Automation | `tests/stories/11-program-library-admin/us-44-create-program.spec.ts` (TC-01); TC-02 is **manual** |
| Watch for | Empty Domain list blocks save; open dropdowns stay drawn |

**Acceptance:** Every category has domains; required fields marked; system targets can be added; dropdowns close after pick; links and files as materials.

**Observed on dev2 (Oct 19):**
- **New Program** dialog: Category, Domain, Area, Title, Goal description, lesson fields (Exercise, Generalization, Error correction, Supplies, Troubleshooting), objectives, bulk target paste with preview, lesson materials (**Add URL**), Keywords, legal acknowledgement, **Save as Draft**, **Publish**.
- Notice: "Save as Draft keeps this program here in Settings only. Publish makes it available in the Add Program catalog".
- Required (marked *): Category, Domain, Program Name. Categories offered: Skills, Inclusion, Transition, Advanced Academic — each has domains.
- New programs created here are listed with Source **Standard** (same as system programs), so admin-created and system programs cannot be told apart in the grid.

---

## TC-US44-01 — Create a program with objectives, targets and a link material and save it as a draft

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Admin → Program Library → **New Program** | Draft vs Publish notice; required fields marked with * (Title, Category…) |
| 2 | Pick each category in turn | Every category offers domains (**fails today** if one is empty) |
| 3 | Fill: Skills, first domain/area, title, goal, 2 objectives, 3 targets (bulk paste), URL material, keywords, legal | Targets listed |
| 4 | **Save as Draft** | Dialog closes; grid row with Status **Draft**, category Skills |
| 5 | **Edit** the draft | Title, goal, targets and material kept → Cancel |
| 6 | Clean-up: delete or deactivate the draft | Removed from the active catalog (**gap today**: a Draft only offers Edit / Publish / Duplicate, so test drafts stay in the catalog) |

## TC-US44-02 — System targets, file materials and dropdown behaviour (manual)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | In New Program, add a target from the system target catalog | Target added |
| 2 | Upload a PDF as a lesson material | File listed |
| 3 | Pick a value in each dropdown | Dropdown closes after the pick; nothing stays drawn on screen |
