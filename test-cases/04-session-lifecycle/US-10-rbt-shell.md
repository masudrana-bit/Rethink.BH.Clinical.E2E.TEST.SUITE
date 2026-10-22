# US-10 — Access the RBT shell and navigate to sessions

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Session Access & Lifecycle |
| Role | RBT (role toggle on the BCBA login when no RBT login is configured) |
| Automation | `tests/stories/04-session-lifecycle/us-10-rbt-shell.spec.ts` |
| Watch for | Role landing after refresh (NGC-47) |

**Acceptance:** RBT lands on RBT home, not BCBA pages, incl. after re-login.

**Observed on dev2 (Oct 19):**
- The RBT shell (`/rbt`) has its own header and a three-item nav: **Home**, **Sessions**, **Clients**. BCBA navigation (Staff, Supervision, Settings…) is not shown.
- **Defect:** right after switching to the RBT view, Home shows "No scheduled sessions today" and the New Session wizard lists no clients. Both appear only after a browser refresh. The suite reloads once after the toggle as a workaround (`flows.signInAs('rbt')`).

---

## TC-US10-01 — RBT lands on RBT home and navigates the RBT shell

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in and enter the RBT view | URL is `/rbt`; RBT header and nav are shown; no BCBA navigation (Staff, Settings) |
| 2 | Wait on Home without refreshing | Today's schedule is listed (same rows as after a refresh) — **defect above** |
| 3 | Refresh the browser | Still on `/rbt` in the RBT shell (NGC-47); Today list loaded |
| 4 | Nav → **Sessions** | `/rbt/sessions` with date range, filters, Start Live Session and Post-Session Entry |
| 5 | Nav → **Clients** | `/rbt/clients` lists "Your assigned clients" |
| 6 | Nav → **Home** | Back on `/rbt` |

## TC-US10-02 — RBT view survives refresh on a deep page and re-login @edge

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as RBT, open **Sessions** | `/rbt/sessions` |
| 2 | Refresh the browser | Still `/rbt/sessions` in the RBT shell, not a BCBA page (NGC-47) |
| 3 | Sign out from the user menu | Sign-in screen |
| 4 | Sign in again | A dedicated RBT login lands on `/rbt`. With the role toggle the landing page is recorded; switching to the RBT view lands on `/rbt` |

> Observed on dev2: signing in again in the same browser lands the shared account on the BCBA **Clients** page with "Your caseload could not be loaded" (known caseload 401 after sign-in, see US-26). The run records it and recovers with **Try again**.
