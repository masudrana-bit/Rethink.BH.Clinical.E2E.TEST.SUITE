# US-24 — Correct a previously recorded attempt or fact

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Session Closeout & Data Integrity |
| Role | RBT |
| Automation | `tests/stories/06-closeout/us-24-correct-recorded-data.spec.ts` |
| Watch for | ABC correction "unavailable" (NGC-65) |

**Acceptance:** Correct a trial and an ABC entry; audit trail for undone/corrected points; data visible on the collection screen.

**Observed on dev2 (Oct 19):**
- In session, trials are changed or deleted from the trial-by-trial chips (covered in US-15 TC-02), and **Undo last trial** removes the most recent one.
- On the summary, **Correct** on a trial opens "Correct Record": ORIGINALLY RECORDED value, an Outcome editor (Correct / Incorrect / N/A), a required **Correction reason**, and **Save Correction** (disabled until a reason is entered).
- After a correction the audit group shows "1 corrected", the original entry (no longer Current) and the corrected one with the reason and the user ("Outcome: correct · E2E: pressed the wrong button · Jennifer Gregory · Current").
- **Delete** (trash) asks "Delete Record … It stays in the audit, marked deleted, and no longer counts in the summary." with a **Reason for deleting** and **Delete Record**.
- **Defect — undo leaves no trail:** a trial removed with **Undo last trial** on the data sheet is simply gone; the audit list shows only the remaining trials.
- **Correct** on an ABC entry opens "Correct Record" with "Correction unavailable — This data point does not expose a supported clinical source record, so it cannot be corrected here yet." (NGC-65 still present). ABC entries, behaviors and trials can be removed with the trash button.

---

## TC-US24-01 — Correct a trial outcome from the audit list; the summary and audit trail update

| # | Action | Expected result |
| --- | --- | --- |
| 1 | RBT: ad-hoc session on the seeded program → record Correct, Incorrect → Conclude | Overall 50% |
| 2 | Expand the program in Session Data Audit → **Correct** on the Incorrect trial | "Correct Record" shows "Outcome: incorrect" and the Correct / Incorrect / N/A editor |
| 3 | Pick **Correct**; try to save without a reason; add a reason → **Save Correction** | Save disabled until the reason is entered; dialog closes |
| 4 | Look at the audit and summary | **1 correction(s)**; the trial now reads "Outcome: correct"; the original value and the reason are kept in the audit trail; Overall **100%** |
| 5 | Finalize | Session finalized |

## TC-US24-02 — Undo in session and delete from the audit list leave an audit trail

| # | Action | Expected result |
| --- | --- | --- |
| 1 | RBT: ad-hoc session → record Correct, Incorrect, Correct | 3 trial chips |
| 2 | **Undo last trial** | 2 chips; 50% |
| 3 | Conclude | Scored **2**; the undone trial is traceable in the audit list (**fails today**: not listed) |
| 4 | Delete the Incorrect trial from the audit list and confirm | Scored **1**; Overall **100%**; the removed trial stays visible as removed |
| 5 | Finalize | Session finalized |

## TC-US24-03 — Correct or remove an ABC entry from the audit list (NGC-65)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | RBT: ad-hoc session with the seeded behavior → Record ABC Data (Academics) → Conclude | One ABC audit entry |
| 2 | **Correct** on the ABC entry | "Correct Record" shows the original values and an editable form (**fails today**: "Correction unavailable", NGC-65) → Cancel |
| 3 | Delete the ABC entry and confirm | ABC card gone; "No ABC entries were recorded during the run." |
| 4 | Finalize | Session finalized |
