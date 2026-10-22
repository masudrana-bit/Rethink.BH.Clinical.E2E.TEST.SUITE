# US-19 — Record a toileting visit

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Data Collection |
| Role | BCBA (set-up), RBT (collection) |
| Automation | `tests/stories/05-data-collection/us-19-toileting.spec.ts` |
| Watch for | NGC-46 |

**Acceptance:** Sit-duration timer, outcome options highlighted after selection, saved to summary.

**Observed on dev2 (Oct 19):**
- A Toileting program card shows "No active visit", **Start Sit Timer**, the outcome chips (Urine · BM · Both · No elimination), dry check, accident and challenging-behavior controls and a metrics strip (Visits, Continent voids, Accidents, Continent %, Avg visit …).
- **Start Sit Timer** → "Visit active 0:02"; **Stop Sit Timer** → "Sit ended at 0:02 — enter visit details"; **Submit Visit** → event log row "HH:MM Bathroom visit Urine" and "Recorded 1/1".
- The selected outcome chip gets `aria-pressed=true` and the `--selected` style.

---

## TC-US19-01 — Time a sit, pick an outcome, submit, and see it in the metrics

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → create a custom program → Manage Data Collection: **Toileting** → Save | Program Details shows "Toileting" |
| 2 | Switch to RBT → New Session with the program → Start | Card: "No active visit"; Recorded "--" |
| 3 | **Start Sit Timer**, wait ~3 s | "Visit active 0:0x" and the timer counts up |
| 4 | Click **Urine** | Urine highlighted (pressed); other outcomes not |
| 5 | **Stop Sit Timer** | "Sit ended at …"; Submit Visit enabled |
| 6 | **Submit Visit** | "No active visit"; Recorded **1/1**; event log row "Bathroom visit Urine"; Visits **1**; Continent voids **1**; Avg visit > 0:00 |
| 7 | Close Session → Conclude → Finalize | Session finalized |
| 8 | Delete the program | Program removed |
