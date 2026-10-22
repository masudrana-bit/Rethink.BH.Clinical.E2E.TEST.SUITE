# US-25 — Resume an in-progress session after a refresh

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Session Closeout & Data Integrity |
| Role | RBT |
| Automation | `tests/stories/06-closeout/us-25-resume-after-refresh.spec.ts` |
| Watch for | – |

**Acceptance:** Refresh and browser restart mid-session; nothing lost.

**Observed on dev2 (Oct 19):**
- A reload keeps the data sheet on `/sessions/:id/run` with the score, trial counts, behavior counts and session clock intact. Target rows come back collapsed (expand to see the trial chips).
- RBT Home shows **IN PROGRESS · Resume a session** with one row per open session ("Benson Moon · In progress · Continue"); **Continue** reopens the same session.

---

## TC-US25-01 — Refresh mid-session: trials, behavior count, ABC entry and clock are kept; recording continues

| # | Action | Expected result |
| --- | --- | --- |
| 1 | RBT: ad-hoc session with the seeded program and behavior | Data sheet opens |
| 2 | Record Correct + Incorrect, 1 behavior count, an ABC entry (Home); note the clock | 50%; behavior 1 |
| 3 | Refresh the browser | Same session URL |
| 4 | Check the sheet | 50%; Correct 1 / Incorrect 1; trial chips "Correct, Incorrect"; behavior 1; clock later than before |
| 5 | Record another Correct | 67% |
| 6 | Conclude | Scored **3**; the ABC entry from before the refresh and the behavior entry are in the audit list |
| 7 | Finalize | Session finalized |

## TC-US25-02 — Close the tab and come back: RBT Home offers the session under "Resume a session" with its data

| # | Action | Expected result |
| --- | --- | --- |
| 1 | RBT: ad-hoc session → record Correct + Incorrect | 50% |
| 2 | Close the tab; open a new one on the app (same browser profile) → RBT Home | "Resume a session" lists the session for the client, "In progress" |
| 3 | **Continue** | Same session's data sheet; 50%; clock running |
| 4 | Conclude → Finalize | Scored **2**; session finalized |
