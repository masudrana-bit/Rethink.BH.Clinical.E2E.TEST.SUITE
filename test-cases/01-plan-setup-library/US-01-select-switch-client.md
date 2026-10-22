# US-1 — Select / switch active client context

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — section 2, Plan Setup & Library Context |
| Role | BCBA / clinical lead |
| Automation | `tests/stories/01-plan-setup-library/us-01-select-switch-client.spec.ts` |
| Watch for | Client Info / File Cabinet open legacy BH in a new tab (expected). Switching client inside Settings should stay in Settings (NGC-48). |

**Acceptance (what to verify):** Clients page lists name, DOB, ID, status; search by name/ID; switcher reloads every tab; header shows client DOB.

---

## TC-US01-01 — Find a client on the Clients page and open their workspace @smoke

**Preconditions:** BCBA account; seeded client exists (`SEEDED_CLIENT_ID`).

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Open the Clinical URL and sign in with the BCBA account | Lands on **Clients** ("View and select active clients"), header shows user name and role |
| 2 | Look at the client table header | Columns are **Client Name, D.O.B., Client ID, Status** |
| 3 | Read the first row | Name, DOB (e.g. *Jan 1, 2001*) and status (*Active/Inactive*) are filled |
| 4 | Type the seeded client's name in **Search by name** | List narrows to rows containing that name |
| 5 | Click **Clear Filters** | Full list is back |
| 6 | Click the seeded client's name | Client workspace opens on **Skills Programs**; tab bar shows Client Info, File Cabinet, Sessions, Skills Programs, Behavior Support, Analyze Data, Funder Reports |
| 7 | Look at the header | Client switcher shows the client name and **DOB** |

## TC-US01-02 — Switch client from the header and every tab reloads for the new client

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA and open the seeded client | Skills Programs shows the seeded client's programs |
| 2 | Open **Sessions** tab | URL is `/clients/<seeded>/sessions` |
| 3 | Use the header client switcher to pick the clean client | Header shows the clean client and its DOB; URL now contains the clean client ID and stays on Sessions |
| 4 | Open **Skills Programs**, **Behavior Support**, **Analyze Data** | Each tab URL uses the clean client ID; none of the seeded client's program names are shown |
| 5 | Switch back to the seeded client | Seeded client's programs are visible again |

## TC-US01-03 — Search by Client ID and hand-off to legacy BH

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, go to **Clients** | Clients list loaded |
| 2 | Note a client that has a Client ID number; type it into **Search by Client ID** | Only rows with that Client ID remain |
| 3 | Open that client, click **Client Info** | Legacy BH opens in a **new tab** at `/core/clients/<id>` for the same client |
| 4 | Click **File Cabinet** | Legacy BH opens in a new tab at `/core/clients/<id>/files` |
