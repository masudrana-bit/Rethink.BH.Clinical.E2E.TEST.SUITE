# US-2 — Search & browse the program library

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Plan Setup & Library Context |
| Role | BCBA |
| Automation | `tests/stories/01-plan-setup-library/us-02-search-browse-library.spec.ts` |
| Watch for | Domain/Area blank on system programs; "author" in search hint; search slow or fails intermittently (NGC-22, NGC-50) |

**Acceptance:** Add Program: System Programs and My Programs tabs; keyword search; Category/Domain/Area filters; Add and Preview per row.

**Observed on dev2 (Oct 20):** library keyword search took 4.0 s and 4.6 s in two runs, over the 3 s cross-cutting target (soft check; the rest of the flow passes).

---

## TC-US02-01 — Browse System Programs, search by keyword and preview a program @smoke

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open the seeded client (Skills Programs) | Program rail is shown |
| 2 | Click **Add New** / **Add Program** | Add Program dialog opens on **System Programs**; columns Program Name, Category, Domain, Area, Author, Details, Client Status |
| 3 | Check the search hint | Placeholder offers name, category, domain, area (and author — NGC-50 watch) |
| 4 | Type `Matching` in search | Results appear within 3 s and every row name contains "Matching" |
| 5 | Every row | Has an **Add** and a **Preview** button |
| 6 | Click **Preview** on the first result | Preview shows the program name, goal / lesson details; close returns to the list |
| 7 | Check Domain and Area of system programs | Not blank (NGC-22 — failing today if "—") |

## TC-US02-02 — Filter by Category / Domain / Area and switch to My Programs

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open seeded client, open **Add Program** | Library loaded |
| 2 | Open the **Category** filter | Lists categories (e.g. Skills, Inclusion, Transition, Advanced Academic) |
| 3 | Pick a category | Rows shown all belong to that category, or an empty-state message is shown |
| 4 | Domain filter becomes usable for that category; pick the first domain | Rows narrow to that domain |
| 5 | Switch to **My Programs** | Only the user's/org custom programs are listed; System Programs is no longer highlighted (RHD-57975) |
| 6 | Close the dialog | Plan unchanged |
