# US-45 — Edit a program without changing it for everyone else

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Program Library Administration |
| Role | Program Administrator |
| Automation | `tests/stories/11-program-library-admin/us-45-adapt-program.spec.ts` |
| Watch for | Source still "Standard"; overlapping actions (NGC-70, NGC-71, NGC-75) |

**Acceptance:** Adapt creates a copy marked Custom/Adapted; original unchanged; owner warning correct; Edit vs Open draft revision vs Adapt behave consistently.

**Observed on dev2 (Oct 19):**
- Every catalog row on dev2 is Source **Standard**, Status **Active** — including programs created by the admin. The page has an adapt confirmation (`program-library-admin-adapt-confirm`), but in the automated run (Oct 19) **Edit** on "Completing Activities with a Beginning and End - Older" opened the editor directly with no adapt prompt. **Defect**: the standard program is edited in place. The test stops there without saving, so the original is not changed.

---

## TC-US45-01 — Editing a standard program adapts a copy; the original stays Standard and unchanged

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Admin → Program Library → **Edit** on a Standard program | Prompt to adapt a copy, explaining the original is not changed for others (NGC-75) (**fails today**: editor opens directly) |
| 2 | Continue → rename the copy "E2E-… Adapted" → **Save as Draft** | Saved |
| 3 | Search the copy | Source **Custom / Adapted** (**fails today** if "Standard", NGC-70); Status Draft |
| 4 | Search the original | Same title, Source Standard, same status |
| 5 | Clean-up: delete or deactivate the copy | — |
