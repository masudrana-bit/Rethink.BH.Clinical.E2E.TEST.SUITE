# US-15 — Record standard discrete-trial attempts

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Data Collection |
| Role | BCBA (set-up), RBT (collection) |
| Automation | `tests/stories/05-data-collection/us-15-discrete-trials.spec.ts` |
| Watch for | Model prompt missing; popup cut off; on-hold targets shown (NGC-90) |

**Acceptance:** Every prompt level incl. Model; trial-by-trial view shows prompt code; change-trial popup fully visible; on-hold targets hidden.

**Observed on dev2 (Oct 19):**
- An Opportunity Based program with the Prompts dimension shows a **Record prompt level for <target>** button per target; it opens an inline toolbar **I · V · G · PP · FP · N/A**.
- **Defect (NGC-90):** **Model** is configured in the prompt hierarchy but is not offered on the data sheet. *Oct 20: TC-US15-01 passes, so this appears fixed on dev2; confirm, then close NGC-90.*
- Each trial becomes a chip in **Trials:** showing the prompt code (e.g. `I`, `V`). Independent scores as Correct, other prompts as Incorrect.
- On-hold targets are hidden from the data sheet (fixed on dev2).
- Clicking a chip opens an inline **Edit trial N** toolbar (change prompt or delete) inside the card — not a floating popup.
- Programs and targets are created by the test on the seeded client and deleted afterwards.

---

## TC-US15-01 — Every prompt level is recordable, shown trial by trial; on-hold targets stay off the sheet

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → create a custom program (targets Touch nose, Clap hands, Stand up) → Manage Data Collection: Opportunity Based + Prompts → Save | Program Details shows "Opportunity Based" |
| 2 | Manage Targets → tick **On hold** for "Stand up" → Save | Drawer closes |
| 3 | Switch to RBT → New Session → seeded client → pick the program → Start Session ×2 | Data sheet shows the program card |
| 4 | Read the card's targets | Touch nose and Clap hands listed; **Stand up (on hold) not listed** |
| 5 | Open the prompt picker for Touch nose | Independent, Verbal, Gestural, **Model**, Partial Physical, Full Physical, N/A — N/A last (**Model missing — NGC-90**) |
| 6 | Record one trial at every offered level | One chip per trial, in order, each naming its prompt; Undo enabled |
| 7 | Record Independent for Clap hands | Clap hands: 100% correct |
| 8 | Close Session → Conclude | Summary: Scored = trials recorded, excluding N/A (N/A is not scored) |
| 9 | Finalize; switch back to BCBA and delete the program | Program removed |

## TC-US15-02 — Change and delete a recorded trial from the trial-by-trial view

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: create an Opportunity Based + Prompts program on the seeded client | Saved |
| 2 | RBT: start a session with the program; record **Verbal** for Touch nose | Chip "Incorrect, prompt Verbal"; score 0% |
| 3 | Click the chip | **Edit trial 1** toolbar opens fully inside the viewport, current level (Verbal) marked |
| 4 | Change it to **Independent** | Chip reads "Correct, prompt Independent"; score 100% |
| 5 | Record **Gestural**, then delete trial 2 from its toolbar | One trial left; score 100% |
| 6 | Conclude | Summary: Scored 1, 100% |
| 7 | Finalize; delete the program | Program removed |
