# US-16 — Record task-analysis attempts

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Data Collection |
| Role | BCBA (set-up), RBT (collection) |
| Automation | `tests/stories/05-data-collection/us-16-task-analysis.spec.ts` |
| Watch for | No demo program on 29 Sep; % correct missing (NGC-88) |

**Acceptance:** Steps scored, new series starts at step 1, % correct in summary; forward/backward chain honoured.

**Observed on dev2 (Oct 19):**
- A Task Analysis program turns each target into a step. The card shows the chain badge (default **Total Task**), "Opportunity N", progress "x/3 steps" and the series %.
- **Expand steps** lists the steps; each has its own picker (I · V · G · PP · FP · N/A). A step stays disabled ("Step 2 not recorded") until the step before it is recorded.
- **Record another opportunity** is enabled once every step is recorded and opens a new opportunity at step 1; earlier opportunities stay as tabs.
- The test creates the program on the seeded client and deletes it afterwards. Forward/backward chaining is not exercised (default Total Task only).

---

## TC-US16-01 — Score every step, start a new series at step 1, see % in the summary

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → create a custom program (steps Touch nose, Clap hands, Stand up) → Manage Data Collection: **Task Analysis** → Save | Program Details shows "Task Analysis", 3 steps |
| 2 | Switch to RBT → New Session with the program → Start | Card shows chain badge **Total Task**, "Opportunity 1", "0/3 steps" |
| 3 | Expand steps | Step 1 offers "Record prompt level"; steps 2 and 3 are disabled |
| 4 | Step 1 → Independent | Step 1 reads "currently Independent"; step 2 enabled |
| 5 | Step 2 → Independent, Step 3 → Full Physical | "3/3 steps"; series % shown (not "--") |
| 6 | **Record another opportunity** | "Opportunity 2" selected; "0/3 steps"; step 1 enabled, step 2 disabled |
| 7 | Select Opportunity 1 | Still "3/3 steps" |
| 8 | Close Session → Conclude | Summary shows a % correct for the session (**NGC-88**) |
| 9 | Finalize; delete the program | Program removed |
