# US-23 — Close a session and review summary, audit & note

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Session Closeout & Data Integrity |
| Role | RBT |
| Automation | `tests/stories/06-closeout/us-23-close-session-summary.spec.ts` |
| Watch for | Test template; "removed from this device" wording (NGC-86) |

**Acceptance:** Summary, audit list, note drafted from the account template, finalize wording; appointment shows completed.

**Observed on dev2 (Oct 19):**
- Close Session → Conclude → **Move to Session Note** opens `/sessions/:id/summary` with these sections: Session Times (required review), Collected Data (Overall %, Scored, Targets, Programs, Performance by Target, Program Totals, Collected Targets, Target Notes, Behaviors, ABC Data), Quick Note, Session Note and Session Data Audit.
- Right after the summary opens, the target and program names briefly show as numeric ids ("19887", "9027"); the names appear once the plan has loaded.
- **Session Note:** shows "No template selected" / "Loading the note template…" for a few seconds, then the template picked on the pre-session page (here "Parent Training Session Note"). It autosaves a draft ("Draft saved: <date> by <user>") and shows a Daily Summary Sheet with the session's data ("Requesting preferred items · Snack items · 50% · 1/2 correct; 2 trials"). **Submit note** stays disabled with "Complete N required fields before submitting." until the fields marked * are filled. Typo in the template: "Parent reponse to training".
- **Session Data Audit:** "N correction(s)" counter; one group per program (collapsed; trials listed as "Collection type: Opportunity based · Outcome: correct"), ABC entries ("Behaviors: … · Context: Academics · Antecedent: … · Consequence: … · Note: …"), behavior counts and session times. Each entry has a **Current** badge, most have **Correct** and/or a delete (trash) button.
- **Finalize Session** is disabled with "Confirm the session times below before finalizing." until "I confirm these are the session start and end times." is ticked. Finalizing does not require the note to be submitted, and lands on RBT Sessions (`/rbt/sessions`).
- Ad-hoc sessions do not appear in the RBT Sessions list; only scheduled appointments do.
- Scheduled sessions load every plan program under "Available to add" (62 for the seeded client) and all plan behaviors, including a **Duration** behavior "Whining".
- **Finalize prompt:** "Finalize this session? Finalizing locks this summary. Changes after finalization are handled outside this application, and the session will be removed from this device. This cannot be undone." with **Cancel** / **Finalize and remove** — NGC-86 still present.
- **Defect — template not carried over:** the appointment row names "Parent Training Session Note", but the pre-session page offers only "Billable Session Note" / "Non-Billable Session Note" (pre-selected "None"). Whatever is picked there is not applied: the summary note shows "No template selected — This note has not been started" with its own template picker (a different list: "Parent Training Session Note (Billable)", "Billable Session Note (Billable)", …). Picking a template there starts the note.
- **Defect — RBT Home vs Sessions:** after finalizing, RBT Sessions shows the appointment as "Note complete · Finalized", but RBT Home still lists it with **Open** (only the "Missed" badge disappears), and opening it starts another session on the same appointment.
- **Oct 20:** the 9:00 appointment cannot be started before its start time ("This session starts at 9:00 AM. You can start it then."). The test then runs an ad-hoc session and skips the appointment check; an appointment left in progress by an earlier run is finalized first.
- **Defect (Oct 20):** the appointment's pre-session page shows "0 skills · 0 behavior plans" and the data sheet has no behavior support card, so the plan behavior cannot be counted (on Oct 19 all plan behaviors loaded). The test notes it and continues without the behavior count.
- The "Billable Session Note (Billable)" template requires Client Name, Purpose of Session, Daily Summary Sheet, Summary and an RBT/BT signature (signature pad).

---

## TC-US23-01 — Conclude a scheduled session: summary, audit list, account note template, finalize, appointment completed

| # | Action | Expected result |
| --- | --- | --- |
| 1 | RBT Home → today's scheduled session for the seeded client → **Open** | Pre-session page; account note templates offered |
| 2 | Pick a real (non-test) note template → **Start Session** | Data sheet opens |
| 3 | Record Correct + Incorrect on the seeded target; add 1 behavior count; Record ABC Data (Academics / Task/command given / Ignored) | Card shows 50% |
| 4 | Close Session → Conclude → Move to Session Note | Summary: Overall **50%**, Scored **2**, target listed by name, "Self Injury 1 time", ABC card with "Academics" |
| 5 | Expand the program in Session Data Audit | 2 trial entries (one correct, one incorrect), 1 behavior entry, ABC entry with "Context: Academics" (not an id), session times entry; **0 correction(s)** |
| 6 | Wait for the session note | Template is the one picked in step 2 (**fails today**: "No template selected"; the test then picks it in the note's own picker); not a test template; data table row shows the target at 50%; Submit disabled with "required field" message |
| 7 | Fill the required note fields (text, options, dropdowns, signature) → **Save draft** | Required-field message clears; "Draft saved: … by …" |
| 8 | Look at Finalize; tick the times confirmation → Finalize | Disabled with hint before ticking; finalize prompt does **not** say "removed from this device" (**fails today**, NGC-86) |
| 9 | Confirm | Leaves the summary (RBT Sessions) |
| 10 | RBT Sessions → today's row for the client | Row shows **Finalized / Completed** (not "Missed") |
| 11 | RBT Home → today's row for the client | Also shows it finalized (**fails today**: still offered with **Open**) |

If the client has no open scheduled session today, steps 1–2 use an ad-hoc session and step 10 is skipped (noted as a test-data gap).

## TC-US23-02 — Finalize stays locked until the session times are confirmed @negative

| # | Action | Expected result |
| --- | --- | --- |
| 1 | RBT: ad-hoc session → record one trial → Conclude | Summary opens |
| 2 | Look at Finalize and Session Times | Finalize disabled; hint "Confirm the session times below before finalizing."; Reviewed Duration shown; paused "0m" |
| 3 | Session times audit entry → **Correct** | "Correct Record" with Start / End inputs and a reason; **Save Correction** disabled; Cancel closes it; still 0 corrections |
| 4 | Tick the times confirmation, then untick it | Finalize enabled, then disabled again |
| 5 | Tick it → Finalize → Confirm | Session finalized |
