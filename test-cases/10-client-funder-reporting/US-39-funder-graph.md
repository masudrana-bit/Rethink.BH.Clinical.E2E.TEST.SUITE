# US-39 — Produce a funder-ready graph

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Client & Funder Reporting |
| Role | BCBA |
| Automation | `tests/stories/10-client-funder-reporting/us-39-funder-graph.spec.ts` (TC-01, TC-02); TC-03 is a **manual check of the exported files** |
| Watch for | British spellings; required-field markers (NGC-67) |

**Acceptance:** Export with correct spelling, aspect ratio and x-axis labels; required fields marked.

**Observed on dev2 (Oct 19):**
- Program → Data → **Payor** view: payor profile, Save / Reset, styling toggle, export actions (Letter, Print, Export PDF, Export PNG) and the "Funder graph".
- Client → **Reports** (Funder Reports): list of "NextGen Funder Report - ABA Treatment Plan" items (Draft / Submitted). **New report** creates a draft immediately ("Creating…").
- Opening a report (`/clients/{id}/reports/{reportId}`): the first attempt stayed on "Loading report…" for over 90 seconds; the automated run later loaded the editor within 60 seconds. Required fields marked with `*`: Client Name, Date of Birth / Age, Plan of Care Begin, Plan of Care End (all "From Clinical"). Treat slow loading as intermittent.

---

## TC-US39-01 — Funder (payor) graph of a program exports as PNG and PDF with dated x-axis labels and US spelling

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded program → Data → **Payor** | Funder graph with payor profile and export actions; x-axis labels carry session dates |
| 2 | **Export PNG**, **Export PDF** | Both files download |
| 3 | Read the funder view | US spelling (behavior, organization…) (**fails today** if British spellings, NGC-67) |

## TC-US39-02 — Funder report opens in the editor with required fields marked

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → **Reports** | Draft and Submitted reports listed |
| 2 | Open the latest Draft | Editor finishes loading within 60 seconds (intermittently stays on "Loading report…") |
| 3 | Check the fields | Required fields marked; US spelling |

## TC-US39-03 — Exported files (manual)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Open the PNG and PDF from TC-01 | Chart keeps its aspect ratio (not stretched); x-axis labels readable and dated; title and client details correct |
