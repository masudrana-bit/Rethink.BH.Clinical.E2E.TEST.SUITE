# US-43 — Find a program in the catalog

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Program Library Administration |
| Role | Program Administrator |
| Automation | `tests/stories/11-program-library-admin/us-43-find-program.spec.ts` (TC-01); TC-02 is **manual** (no Last edited column) |
| Watch for | Filters incomplete (NGC-23, NGC-69) |

**Acceptance:** Search and filters; last-edited updates on every edit.

**Observed on dev2 (Oct 19):**
- Category filter: All Categories, Custom Curriculum, Inclusion, Skills, Transition. Domain filter lists domains such as Community, Daily Living, Employment, Expressive Language, Group Participation, Home, Leisure, Motor, Peer Interaction…

---

## TC-US43-01 — Search by name, filter by category / domain / area, and clear back to the full catalog

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Admin → Program Library; note the total | — |
| 2 | Search a word from the first program's name | Only programs containing the word |
| 3 | Search "zzz-no-such-program-zzz" | Empty grid, "0 of M" |
| 4 | Clear the search | Full catalog again |
| 5 | Category filter = the first program's category | Only that category |
| 6 | Open Domain and Area filters | Options offered (area **fails today** if empty, NGC-69); Domain filter narrows to that domain |

## TC-US43-02 — Last edited updates on every edit (manual)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Edit an E2E draft and save | Last edited date/user updates in the grid (**fails today**: no Last edited column) |
