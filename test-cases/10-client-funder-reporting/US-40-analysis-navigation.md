# US-40 — Reach client-level and program-level analysis

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Client & Funder Reporting |
| Role | BCBA |
| Automation | `tests/stories/10-client-funder-reporting/us-40-analysis-navigation.spec.ts` |
| Watch for | Legacy BH jump with separate sign-in |

**Acceptance:** Navigation between Analyze Data and program charts; Client Info / File Cabinet behaviour documented.

**Observed on dev2 (Oct 19):**
- Client tabs: Client Info, File Cabinet, Sessions, Skills Programs, Behavior Support, Analyze Data, Reports.
- Client Info and File Cabinet open legacy BH in a new tab (`/core/clients/{id}` and `/core/clients/{id}/files`), which may ask to sign in to BH separately.

---

## TC-US40-01 — Move between Analyze Data and a program chart without losing the client; legacy tabs open the same client

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → **Analyze Data** | `/clients/{id}/analyze-data` |
| 2 | **Skills Programs** → "Requesting preferred items" → **Data** tab | `/clients/{id}/programs/{programId}?tab=data`; client switcher still shows the client |
| 3 | **Analyze Data** tab | Back on client-level analysis for the same client |
| 4 | **Client Info**, **File Cabinet** | Each opens legacy BH in a new tab for the same client id |
