# US-12 — Create an ad-hoc session, incl. multi-client group

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Session Access & Lifecycle |
| Role | RBT; BCBA for the client-page entry point |
| Automation | `tests/stories/04-session-lifecycle/us-12-adhoc-group-session.spec.ts` |
| Watch for | Client not pre-selected; group session not yet run |

**Acceptance:** New Session from RBT home and from a client page (client pre-selected); group session with 2 clients records data per client.

**Observed on dev2 (Oct 19):**
- Wizard: **1. Clients → 2. Skills & behaviors → 3. Confirm**, then the pre-session page and **Start Session**. Choose 1–8 clients.
- **Defect:** **Start Live Session** on a client's Sessions tab opens the wizard with **no client selected**.
- A group session shows one data sheet with a section per client; its summary has a tab per client ("Needs note") and one set of session times for all clients.
- "Requesting preferred items" (seeded, Opportunity Based, no prompt dimension) records trials with **Correct / Incorrect / N/A** buttons.

---

## TC-US12-01 — Ad-hoc single-client session from RBT home

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as RBT, Home → **New Session** | Wizard with **LIVE** badge on step 1 |
| 2 | Tick the seeded client → **Next** | "1 / 8 clients selected"; step 2 lists the client's skill programs and behavior plans |
| 3 | Tick `Requesting preferred items` → **Next** | Session order lists it; Confirm shows the client with "1 skills & behaviors selected" |
| 4 | **Start Session** on the confirm step, then on the pre-session page | Data sheet with the program card |
| 5 | Record **Correct** for the target | Card score 100% |
| 6 | Close Session → Conclude | Summary: Scored 1, Programs 1 |
| 7 | Finalize | Back on the Sessions list |

## TC-US12-02 — Start Live Session from the client page pre-selects the client

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open the seeded client → **Sessions** tab | Start Live Session and Post-Session Entry shown |
| 2 | **Start Live Session** | Wizard opens with the seeded client already ticked — **defect above**; workaround: tick it |
| 3 | Next → Next → Start Session → Start Session | Data sheet header names the seeded client |
| 4 | Conclude and finalize | Session finalized |

## TC-US12-03 — Group session with two clients records data per client

| # | Action | Expected result |
| --- | --- | --- |
| 1 | RBT → New Session → tick the seeded client and the group client | "2 / 8 clients selected" |
| 2 | Step 2: pick `Requesting preferred items` for each client | Each client shows "1 selected" |
| 3 | Confirm → **Start Session** | Pre-session page has a tab per client |
| 4 | **Start Session** | Data sheet header lists both clients; one section per client |
| 5 | Record **Correct** for the seeded client's first target and **Incorrect** for the group client's first target | Each card shows its own score (100% / 0%) |
| 6 | Close Session → Conclude | Summary has a tab per client; seeded client Scored 1 at 100%, group client Scored 1 at 0% |
| 7 | Finalize (each client if asked) | Session finalized |
