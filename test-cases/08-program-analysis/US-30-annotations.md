# US-30 — Annotate a program's chart with clinical events

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Program-Level Analysis |
| Role | BCBA |
| Automation | `tests/stories/08-program-analysis/us-30-annotations.spec.ts` (TC-01, TC-02); TC-03 is a **manual visual check** |
| Watch for | Date entry cleared, calendar clipped (NGC-43, NGC-58, NGC-62) |

**Acceptance:** Add annotation with start date; solid vs dotted lines by type; phase-change lines drawn.

**Observed on dev2 (Oct 19):**
- **Annotate** (`annotation-create-button`) or the rail's **Add** opens the dialog: Title, Detail, Type (Medication Change, Prompt Fade, Target Introduced, Absence Gap, Staff Change, Criteria Change, Note — default Note), Target (Graph-wide), Scope (This program only), Start date, End date, Cancel / Save.
- Start date starts empty and is required; Save does nothing without it. Escape does not close the dialog.
- The annotation rail beside the chart shows a count and starts collapsed (**Expand**). Expanded, it lists rows like "Oct 19 · Medication · <title> · <detail> · All targets", plus per-session "Add annotation at S51" buttons.
- Clicking a row opens **Edit Annotation** with **Delete**; Delete asks "Delete "<title>"? This annotation and its description will be removed permanently." → **Confirm**.
- **Oct 20:** add, list, chart line and reload all work, but Delete fails with "This annotation could not be deleted. Please try again." (same day as the Accounts credential 401 on dev2). Test annotations left behind can be deleted by hand from the seeded program's rail.

---

## TC-US30-01 — Add a dated Medication Change annotation; it is listed on the rail and on the chart, then removed

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded program → Data tab; note the annotation count | — |
| 2 | **Annotate** → Title, Detail, Type **Medication Change**, type today's date into Start date | Typed date is kept (**fails today** if it clears, NGC-43; pick from the calendar instead) |
| 3 | **Save** | Dialog closes; count + 1 |
| 4 | Expand the rail | The annotation is listed; a line is drawn on the chart at the date |
| 5 | Reload the page | Annotation still listed |
| 6 | Click the row → **Delete** → **Confirm** | Confirmation names the annotation; count back to the original |

## TC-US30-02 — Annotation dialog: types offered, start date required, Cancel adds nothing @negative

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Open **Annotate** → Type | Medication Change, Prompt Fade, Staff Change, Criteria Change, Note (and others) |
| 2 | Enter a title only → **Save** | Dialog stays open (start date required) |
| 3 | **Cancel** | Dialog closes; count unchanged |

## TC-US30-03 — Line style by type and phase-change lines (manual visual check)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Add a **Medication Change** and a **Note** annotation on the same program | Lines drawn with different styles (solid vs dotted) per type |
| 2 | Change a target's phase (US-32) and open the chart | A phase-change line is drawn at the effective date |
| 3 | Open the Start date calendar near the bottom of the screen | Calendar fully visible, not clipped (NGC-58, NGC-62) |
