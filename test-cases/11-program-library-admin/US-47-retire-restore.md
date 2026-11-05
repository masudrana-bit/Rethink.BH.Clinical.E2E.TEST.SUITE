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

**Xray:** [RHD-60127](https://rethinkautism.atlassian.net/browse/RHD-60127), [RHD-60383](https://rethinkautism.atlassian.net/browse/RHD-60383)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Admin → New Program → fill → **Publish** | Status Active; offered in the clean client's Add Program |
| 2 | **Deactivate** | Confirmation first (**fails today**: deactivates immediately, no confirmation) → Status Inactive |
| 3 | Clean client → Add Program → search | Not offered |
| 4 | **Reactivate** | Status Active; offered again |
| 5 | Clean-up: deactivate | — |

## TC-US47-02 — Deactivating a standard program is either confirmed for this organization only or offers "Adapt a copy" (NGC-30)

**Xray:** [RHD-60127](https://rethinkautism.atlassian.net/browse/RHD-60127)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | **Deactivate** on a Standard program | Confirmation that explains it is hidden for this organization only, or an "Adapt a copy" message (NGC-30) (**fails today**: deactivated immediately with no message; the test reactivates it) |
| 2 | **Cancel** | Program still Active (if it was deactivated without asking, reactivate it and log the defect) |

## TC-US47-03 — A deactivated program stays on a plan that uses it and is hidden from other clients

**Xray:** [RHD-60383](https://rethinkautism.atlassian.net/browse/RHD-60383)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Admin → New Program → fill → **Publish** | Active; offered in Add Program |
| 2 | Clean client (A) → Add Program → add it → note its targets | On the plan |
| 3 | Program Library → **Deactivate** | Status Inactive |
| 4 | Seeded client (B) → Add Program → search the title | Not offered |
| 5 | Client A → open the program | Still on the plan (Current) with the same targets |
| 6 | Clean-up: delete the program from client A | — |
