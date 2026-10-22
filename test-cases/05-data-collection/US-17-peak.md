# US-17 — Record PEAK attempts

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Data Collection |
| Role | BCBA (set-up), RBT (collection) |
| Automation | `tests/stories/05-data-collection/us-17-peak.spec.ts` |
| Watch for | Seed a PEAK program first (NGC-55) |

**Acceptance:** Train/test labels, trial blocks kept together, block-level mastery, scoring display.

**Observed on dev2 (Oct 19):**
- No PEAK program is seeded on dev2, so the test creates one (**PEAK Scoring**) on the seeded client and deletes it afterwards.
- The card shows **Scoring 1** with **Total score**, then one block holding every target. Each target has a method badge (**Train**), a phase, a score ("Unscored" / "Score: 8") and buttons **0 · 2 · 4 · 8 · 10**.
- **Record another scoring** becomes available once targets are scored; earlier scorings stay as tabs.
- Block-level mastery needs several sessions of data and is covered by US-33, not here.

---

## TC-US17-01 — Score a PEAK block, see totals, and start another scoring

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → create a custom program (Touch nose, Clap hands, Stand up) → Manage Data Collection: **PEAK Scoring** → Save | Program Details shows "PEAK Scoring" |
| 2 | Switch to RBT → New Session with the program → Start | Card shows "Scoring 1", "Total score: 0" |
| 3 | Inspect targets | Every target shows a Train/Test method badge and "Unscored"; all three sit in one block |
| 4 | Score Touch nose **8**, Clap hands **10**, Stand up **4** | Chosen buttons pressed; target shows "Score: 8"; **Total score: 22** |
| 5 | **Record another scoring** | "Scoring 2" selected, Total score 0 |
| 6 | Select Scoring 1 | Total score 22 again |
| 7 | Close Session → Conclude → Finalize | Session finalized |
| 8 | Delete the program | Program removed |
