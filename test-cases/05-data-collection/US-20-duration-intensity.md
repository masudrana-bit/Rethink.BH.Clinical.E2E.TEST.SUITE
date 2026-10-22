# US-20 — Record duration-intensity behavior data

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Data Collection |
| Role | BCBA (set-up), RBT (collection) |
| Automation | `tests/stories/05-data-collection/us-20-duration-intensity.spec.ts` |
| Watch for | Recorder not seen on 29 Sep (NGC-35) |

**Acceptance:** Recorder available once the behaviour is linked to a plan/program; data visible in behaviour graph. (US-13 adds: duration-intensity data before/after a pause is kept.)

**Observed on dev2 (Oct 19):**
- A program with collection type **Duration** shows the duration-intensity recorder per target: "No active timer", **Total**, **Session totals** High / Medium / Low, **Start Timer** (opens High · Medium · Low) and **Rewind 10 s**. While a segment runs the button reads **Change** and offers Switch to High / Medium / Low and **End timer**; the program timer also shows in the dock.
- **Changed on Oct 20:** the Duration recorder is a plain timer — "No active timer", **Total**, **Start Timer** → "Running 0:0x" → **Stop Timer**, Rewind 10 s. No High / Medium / Low levels and no per-level totals. The test records this as a finding (soft check) and still verifies that timed segments add up and survive a pause; the level checks run again if the levels come back. Confirm with product whether intensity was removed on purpose.
- The seeded behavior on Benson Moon ("Self Injury") is measured as **Frequency/Rate** (+1 / Undo), so no behavior with duration-intensity is seeded. Set `SEEDED_DI_BEHAVIOR` once one is added to the behavior plan; until then the behavior check is skipped with a note.
- The behavior graph check belongs to US-35 / US-37 (Analyze Data).

---

## TC-US20-01 — Duration-intensity segments per level survive a pause

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → create a custom program → Manage Data Collection: **Duration** → Save (maintenance workaround) | Program Details shows "Duration" |
| 2 | Switch to RBT → New Session with the program → Start | Recorder shows "No active timer", Total 0:00 |
| 3 | Look at the recorder | High / Medium / Low intensity levels are offered (**missing on Oct 20**, soft check) |
| 4 | Start Timer (→ **High** if levels are offered), ~3 s; with levels: Change → **Switch to Low**, ~3 s; then stop | "No active timer"; Total > 0:00; with levels: High and Low > 0:00 and Total = High + Low (±1 s) |
| 5 | Close Session → **Pause** → resume from Sessions | Totals unchanged after resume |
| 6 | Start Timer (→ **Medium** if offered) ~2 s → stop | Total grows; with levels: Medium > 0:00, High and Low unchanged |
| 7 | Close Session → Conclude → Finalize | Session finalized |
| 8 | Delete the program | Program removed |

## TC-US20-02 — Plan behavior offers the duration-intensity recorder

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Requires `SEEDED_DI_BEHAVIOR` (skipped otherwise) | — |
| 2 | RBT: New Session → seeded client → pick the behavior → Start | Behavior support card lists the behavior with a duration-intensity recorder (**NGC-35**) |
| 3 | Start High ~2 s, stop | High > 0:00 |
| 4 | Conclude → Finalize | Session finalized |
