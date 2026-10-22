# US-3 — View client's treatment plan

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Plan Setup & Library Context |
| Role | BCBA |
| Automation | `tests/stories/01-plan-setup-library/us-03-view-treatment-plan.spec.ts` |
| Watch for | "Uncategorised" spelling; no status badge; inactive program stays selected when switching to Current (NGC-16, NGC-18, NGC-20) |

**Acceptance:** Program list shows Current/Future/Inactive with domain tag and status; reorder; Mastered programs appear under Inactive.

---

## TC-US03-01 — Review the Current and Inactive plan lists with domain and last-recorded info

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA and open the seeded client | **Current** tab of the program rail is selected and lists the seeded programs |
| 2 | Read each program card | Shows program name, domain tag (e.g. *School Readiness*) and "Date Last Recorded" when data exists |
| 3 | Use the **Domain Filter** | List narrows to programs of that domain only |
| 4 | Reset domain filter, click **Inactive** | Inactive/mastered/future programs listed (or empty state) |
| 5 | Click **Current** again | Current list shown; no inactive program remains selected (NGC-20) |
| 6 | Scan all text | "Uncategorized" uses US spelling (NGC-16) |

## TC-US03-02 — Add a Future program and find it under the right list, then reorder

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open the seeded client | Plan loaded |
| 2 | Create a custom program with status **Future** | Program saved |
| 3 | Look in **Current** | The Future program is **not** in Current |
| 4 | Look in **Inactive** (Future/Inactive list) | The Future program is listed with a status badge |
| 5 | Open **Program list options** menu | A reorder option is offered |
| 6 | Clean-up: delete the program | Program removed |
