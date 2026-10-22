# US-5 — Create a custom program

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Program Authoring |
| Role | BCBA |
| Automation | `tests/stories/02-program-authoring/us-05-create-custom-program.spec.ts` |
| Watch for | Domain/Area options missing; new program not searchable (NGC-24, NGC-25, NGC-51, NGC-52) |

**Acceptance:** Create with category/domain/area, objectives, targets, lesson materials (links and files); appears in search afterwards.

---

## TC-US05-01 — Build a full custom program with objectives, bulk targets, lesson plan and a material link @smoke

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open the seeded client, click **Add Program → Create Custom Program** | Form "Build a custom program shell…" opens |
| 2 | Choose **Category = Skills** | Domain list becomes available and is **not empty** (NGC-24) |
| 3 | Choose first Domain and Area | Values selected |
| 4 | Enter unique **Title**, **Goal description**, **Add as: Current** | Fields filled |
| 5 | Add 2 objectives | Both listed under Objectives |
| 6 | Fill Exercise, Generalization, Error correction, Supplies, Troubleshooting | Text accepted |
| 7 | Paste 3 targets (one per line) into **Bulk custom targets**, click **Add Parsed Targets** | "3 ready"; all 3 staged under Program Targets |
| 8 | **Add URL** lesson material (title + link) | Material listed |
| 9 | Tick **I agree to the custom content policy**, click **Save Program** | Dialog closes; program listed under **Current** |
| 10 | Open the program | Goal shown; Manage Targets lists the 3 targets |

## TC-US05-02 — New custom program saved to My Programs is searchable in the library

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open seeded client, create a custom program with **Save to My Programs** on | Saved |
| 2 | Open **Add Program → My Programs**, search its title | Program appears in results (NGC-25/NGC-52) |

## TC-US05-03 — Required-field validation @negative

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Open Create Custom Program and click **Save Program** without filling anything | Form is not saved; required fields (Category, Title, policy) are flagged |
