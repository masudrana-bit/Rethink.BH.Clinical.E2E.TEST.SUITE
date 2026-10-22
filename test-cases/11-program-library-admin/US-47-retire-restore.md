# US-47 — Retire and restore a program

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Program Library Administration |
| Role | Program Administrator, BCBA |
| Automation | `tests/stories/11-program-library-admin/us-47-retire-restore.spec.ts` |
| Watch for | No confirmation; standard programs cannot be hidden (NGC-30) |

**Acceptance:** Deactivate with confirmation, reactivate; standard programs hidden for one org or clear "Adapt a copy" message.

---

## TC-US47-01 — Deactivate with confirmation hides the program from clients; Reactivate brings it back

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Admin → New Program → fill → **Publish** | Status Active; offered in the clean client's Add Program |
| 2 | **Deactivate** | Confirmation first (**fails today**: deactivates immediately, no confirmation) → Status Inactive |
| 3 | Clean client → Add Program → search | Not offered |
| 4 | **Reactivate** | Status Active; offered again |
| 5 | Clean-up: deactivate | — |

## TC-US47-02 — Deactivating a standard program is either confirmed for this organization only or offers "Adapt a copy" (NGC-30)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | **Deactivate** on a Standard program | Confirmation that explains it is hidden for this organization only, or an "Adapt a copy" message (NGC-30) (**fails today**: deactivated immediately with no message; the test reactivates it) |
| 2 | **Cancel** | Program still Active (if it was deactivated without asking, reactivate it and log the defect) |
