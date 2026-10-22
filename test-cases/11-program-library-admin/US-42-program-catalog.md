# US-42 — View the organization's program catalog

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Program Library Administration |
| Role | Program Administrator |
| Automation | `tests/stories/11-program-library-admin/us-42-program-catalog.spec.ts` (TC-01); TC-02 is **manual** |
| Watch for | Missing domain/area; actions cut off; panel overlap (NGC-68, NGC-81) |

**Acceptance:** Catalog grid with domain/area, author, last edited, actions visible without side scroll; side panel does not overlap.

**Observed on dev2 (Oct 19):**
- Program Library loads slowly ("Loading the program library.", up to about a minute). Toolbar: search, **New Program**, page size (50 per page), Category / Domain / Area filters, "26 of 26".
- Columns: Program Name, Category, Domain, Area, Source, Status, actions (**Edit**, **Deactivate**, overflow **Duplicate**). There is no Author or Last edited column.
- Example row: "Completing Activities with a Beginning and End - Older | Skills | Play/Leisure | — | Standard | Active" (Area blank).

---

## TC-US42-01 — Catalog grid shows program details and row actions without side scrolling

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Admin → Settings → Program Library | Grid with a count (N of M) |
| 2 | Check the columns | Program Name, Category, Domain, Area, Source, Status; Author and Last edited (**fails today**: missing, NGC-68) |
| 3 | Check Domain and Area | Filled for every program (**fails today**: Area is "—" on all 18 rendered rows; Domain filled, NGC-68) |
| 4 | Check row actions | Edit / Deactivate / more visible without scrolling sideways (NGC-81) |

## TC-US42-02 — Side panel does not overlap the grid (manual) @edge

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Open **Edit** on a program at a 1280 px wide window | Editor panel does not cover the grid actions or toolbar |
