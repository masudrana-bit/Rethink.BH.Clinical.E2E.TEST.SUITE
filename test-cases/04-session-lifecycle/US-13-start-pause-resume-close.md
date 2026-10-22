# US-13 — Start, pause, resume, and close a session

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Session Access & Lifecycle |
| Role | RBT |
| Automation | `tests/stories/04-session-lifecycle/us-13-start-pause-resume-close.spec.ts` |
| Watch for | Free-text "Receiving Staff"; summary times after pause (NGC-57, NGC-92) |

**Acceptance:** Timer survives pause; session times show real start; timer panel can be minimised; transfer uses a staff picker; duration-intensity data before/after a pause kept.

**Observed on dev2 (Oct 19):**
- **Close Session** offers *Conclude service and move to session note*, *Pause / step away* and *Transfer service to another provider*; the confirm button reads **Move to Session Note**, **Pause Session** or **Go to End Session**.
- Pause returns to the Sessions list with **In progress → Resume a session** ("Paused").
- Transfer shows a **Receiving Staff** dropdown of real staff (name, role) — NGC-57 looks fixed.
- **Oct 20:** the Receiving Staff dropdown is empty. Same day dev2 showed "Accounts rejected this service's credential (status 401) for account 23832. This will not resolve without operator action." on program save, so the staff list (from Accounts) is likely down with it — recheck once Accounts is fixed.
- The summary shows the pause interval, its duration, an optional reason, and "Gross X minus Y paused".
- Duration-intensity before/after a pause is covered with the recorder in US-20 (group 05).

---

## TC-US13-01 — Pause and resume keep the timer and recorded data; summary shows real times

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as RBT, start an ad-hoc session for the seeded client with `Requesting preferred items` | Data sheet; clock runs |
| 2 | Record **Correct**; wait until the clock passes 5 s | Score 100% |
| 3 | Close Session → **Pause / step away** → **Pause Session** | Sessions list shows the client under **Resume a session** as Paused |
| 4 | Wait 5 s → **Resume** | Data sheet reopens; clock continues from where it was (not reset, paused time not counted); score still 100% |
| 5 | Close Session → Conclude | Summary: one pause interval with a duration; net = gross minus paused; **Start Time** is the real start (NGC-92); Scored 1 |
| 6 | Finalize | Session finalized |

## TC-US13-02 — Transfer uses a staff picker; Cancel keeps the session running

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Start an ad-hoc session for the seeded client | Data sheet |
| 2 | Close Session → **Transfer service to another provider** | **Receiving Staff** is a dropdown (not free text) listing staff with roles (NGC-57); confirm reads "Go to End Session" |
| 3 | Pick a staff member, then **Cancel** | Dialog closes; still on the data sheet; clock keeps running |
| 4 | Conclude and finalize | Session finalized |
