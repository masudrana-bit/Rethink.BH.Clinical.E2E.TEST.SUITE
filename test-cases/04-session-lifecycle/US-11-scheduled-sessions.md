# US-11 — View and open scheduled sessions

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Session Access & Lifecycle |
| Role | RBT |
| Automation | `tests/stories/04-session-lifecycle/us-11-scheduled-sessions.spec.ts` |
| Watch for | List not restricted to own clients (NGC-49); banner counts other clients |

**Acceptance:** Sessions list shows only the RBT's own clients; program/target counts and status correct; "sessions to finalize" banner per client.

**Observed on dev2 (Oct 19):**
- Opening a scheduled session goes to a **pre-session page** (client details, service, prep, behavior plans to review, note template) with **Start Session**; the data sheet opens after Start.
- A scheduled session starts with no skill programs picked ("N more active skills can be added mid-session from the Programs drawer").
- The **Needs attention → Incomplete session notes** list on Home shows concluded sessions that are not finalized. Concluded sessions are kept on the device only ("removed from this device" on finalize), so a fresh browser does not show them.

---

## TC-US11-01 — Sessions list is limited to own clients and shows correct counts

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as RBT, nav → **Clients** | Caseload ("Your assigned clients") listed |
| 2 | Nav → **Sessions**, range **This Week** | "N assigned sessions"; every row's client is in the caseload (NGC-49) |
| 3 | Open the **Client** filter | Only caseload clients are offered (NGC-49) |
| 4 | Home: read the seeded client's row "N programs / M targets" | Counts are numbers; the row shows a status (Missed / Paused / …) |
| 5 | New Session → seeded client → **Add all** | "SESSION ORDER (N SKILLS)" equals the program count on the schedule row |

## TC-US11-02 — Open a scheduled session: pre-session page, then data sheet

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Home → seeded client's scheduled row (another caseload row if it is completed) → **Open** | Pre-session page: client name and DOB, service and location, prep card, note template list with real account templates |
| 2 | Choose a note template → **Start Session** | Data sheet opens within 2 s (cross-cutting performance); header names the client; session clock runs |
| 3 | Close Session → Conclude → Finalize | Session finalized; back on the Sessions list |

## TC-US11-03 — Concluded session appears in "Incomplete session notes" for its client only

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Start an ad-hoc session for the seeded client, record one trial, **Close Session → Conclude** | Session summary |
| 2 | Leave the summary with the header back arrow, go Home | **Incomplete session notes** lists the seeded client's session; count matches the rows; no other client is listed for this session |
| 3 | **Open** the row | Summary of the same session |
| 4 | **Finalize** | Row is gone from Incomplete session notes |
