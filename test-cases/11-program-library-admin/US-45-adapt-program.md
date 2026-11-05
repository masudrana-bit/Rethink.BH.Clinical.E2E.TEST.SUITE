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

**Xray:** [RHD-60125](https://rethinkautism.atlassian.net/browse/RHD-60125)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Admin → Program Library → **Edit** on a Standard program | Prompt to adapt a copy, explaining the original is not changed for others (NGC-75) (**fails today**: editor opens directly) |
| 2 | Continue → rename the copy "E2E-… Adapted" → **Save as Draft** | Saved |
| 3 | Search the copy | Source **Custom / Adapted** (**fails today** if "Standard", NGC-70); Status Draft |
| 4 | Search the original | Same title, Source Standard, same status |
| 5 | Clean-up: delete or deactivate the copy | — |

**Observed on dev3 (Nov 5):** Edit still opens the standard program itself. The tests below cancel that editor without saving and make the copy with **Duplicate** instead. Duplicate asks first ("Creates a separate new program based on this one. The original is not changed. A duplicate cannot be deleted, only deactivated.") and creates the copy as soon as you confirm, so a run that fails before publishing leaves a draft copy that can't be removed. Copies of programs with no Category or Domain need both filled before saving.

## TC-US45-02 — An adapted copy can be added to a client plan with its added target

**Xray:** [RHD-60390](https://rethinkautism.atlassian.net/browse/RHD-60390)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Admin → Program Library → **Edit** on a Standard program | Prompt to adapt a copy (**fails today**: editor opens on the original; cancelled, copy made with **Duplicate**) |
| 2 | Rename the copy "E2E-… Adapted Copy" → add target "Adapted target" → **Publish** | Copy Active; offered under System Programs in Add Program |
| 3 | Clean client → Add Program → add the copy → open it | Goal copied; Manage Targets offers "Adapted target" from the program's template |
| 4 | Clean-up: delete the program from the plan; deactivate the copy | — |

## TC-US45-03 — Adapting a program does not change plans or previews of the original

**Xray:** [RHD-60391](https://rethinkautism.atlassian.net/browse/RHD-60391)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Clean client (A) → make sure the Standard program is on the plan → note its targets | — |
| 2 | Admin → adapt the program (Duplicate while the adapt prompt is missing) → rename, add target "Adapted only target" → **Publish** | Copy listed under its new name |
| 3 | Client A → open the original program → Manage Targets | Same targets as in step 1, no "Adapted only target" |
| 4 | Seeded client (B) → Add Program → System Programs → preview the original | No "Adapted only target" |
| 5 | Clean-up: remove the original from client A if the test added it; deactivate the copy | — |
