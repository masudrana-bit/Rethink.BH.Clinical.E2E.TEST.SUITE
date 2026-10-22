# US-22 — Record an in-session ABC entry

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Data Collection |
| Role | RBT |
| Automation | `tests/stories/05-data-collection/us-22-abc-entry.spec.ts` |
| Watch for | "Context: 7" instead of name |

**Acceptance:** Pick plan-defined and novel behaviours; context shows its name in the audit list.

**Observed on dev2 (Oct 19):**
- **Record ABC Data** opens from the dock and from each client's behavior support card. The dialog has Client, Behaviors (autocomplete with **Show behavior suggestions**), Context/Activity, Antecedent, Consequences and Possible Function chips, Notes and **Save Entry**.
- Typing a name that is not on the plan offers **Add "<name>" as emerging behavior**; the chosen behavior shows as a chip tagged **NEW**.
- **Defect (group session):** opening Record ABC Data from the second client's behavior card still pre-selects the first client in the dialog.
- The novel behavior is saved as an emerging behavior on the seeded client (unique `E2E-…` name). E2E-05 later builds a behavior plan from such a behavior.

---

## TC-US22-01 — Record a plan-defined and a novel behavior; audit shows context names

| # | Action | Expected result |
| --- | --- | --- |
| 1 | RBT: New Session → seeded client → pick `Requesting preferred items` and the behavior `Self Injury` → Start | Data sheet with the behavior support card |
| 2 | Dock → **Record ABC Data** | Dialog opens (single-client sessions have no Client picker; group sessions show it) |
| 3 | Show behavior suggestions | `Self Injury` offered |
| 4 | Pick `Self Injury`; Context **Academics**; Antecedent **Task/command given**; Consequence **Ignored**; Function **Avoiding something**; note → **Save Entry** | Dialog closes |
| 5 | Record ABC Data again → type a new name → **Add "…" as emerging behavior** | Chip with **NEW** tag |
| 6 | Context **Home**; Antecedent **Denied access to item**; Consequence **Redirected to activity** → Save Entry | Dialog closes |
| 7 | Close Session → Conclude | Audit list has both ABC entries; contexts read **Academics** and **Home**, never "Context: <number>" |
| 8 | Finalize | Session finalized |

## TC-US22-02 — In a group session, Record ABC Data from a client's card targets that client

| # | Action | Expected result |
| --- | --- | --- |
| 1 | RBT: New Session → group client and seeded client (OB program for each, `Self Injury` for the seeded client) → Start | One section per client |
| 2 | **Record ABC Data** on the seeded client's behavior card | Dialog Client = seeded client (**defect: first client pre-selected**; workaround: pick the client) |
| 3 | Pick `Self Injury`, Context **Lunch/recess** → Save Entry | Dialog closes |
| 4 | Conclude | Seeded client's tab lists the ABC entry |
| 5 | Finalize every client | Session finalized |
