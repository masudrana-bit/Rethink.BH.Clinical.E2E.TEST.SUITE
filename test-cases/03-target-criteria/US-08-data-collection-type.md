# US-8 — Configure data-collection type & dimensions

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Target & Criteria Configuration |
| Role | BCBA |
| Automation | `tests/stories/03-target-criteria/us-08-data-collection-type.spec.ts` |
| Watch for | Labelling clean-up ("Task Analysis / Forward Chaining", unsupported types still offered, "Model" prompt missing) (NGC-54) |

**Acceptance:** All collection types selectable and saved; prompt hierarchy with N/A last; dimensions persist and show in Program Details; drawer closes on save.

**Observed on dev3 (Oct 19):** 14 types in three groups:
- **Structured:** Opportunity Based, Task Analysis, Frequency/Rate, Duration, Frequency + Duration, Interval
- **Quick Entry:** Percentage, Numeric, Percentage + Numeric, Rating Scale, Number of Occurrences, Number of Prompts
- **Specialized:** Toileting, PEAK Scoring

The default prompt list is Independent, Verbal, Gestural, Model, Partial Physical, Full Physical, N/A. The wizard's mastery step has no Cancel button, only **Back**.

---

## TC-US08-01 — Opportunity Based with prompts and location; settings persist and show in Program Details @smoke

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open the seeded client, create a custom program with 3 targets | Program opens; Data Settings says no data collection is configured |
| 2 | **Add Data Collection** | Wizard opens on step 1 "Collection Type" with Structured, Quick Entry and Specialized groups |
| 3 | Choose **Opportunity Based** | Optional Dimensions appear (Prompts, Latency, Intensity, Antecedents & Consequences, Location) |
| 4 | Turn on **Prompts** | Prompt choices listed: includes **Model** (NGC-54/NGC-90) and **N/A is last** |
| 5 | Turn on **Location** → **Next: Mastery Criteria** → **Back** | Type and dimensions are kept |
| 6 | **Next** → **Save** | Wizard closes |
| 7 | Check **Data Settings** on Program Details | Shows "Opportunity Based" and "2 optional dimensions" |
| 8 | **Manage Targets** | Each row now has a **Prompt** dropdown and **Set all prompts** is available |
| 9 | Reopen **Manage Data Collection** | Opportunity Based, Prompts and Location are still selected |
| 10 | Clean-up: delete the program | Program removed |

## TC-US08-02 — Every collection type can be selected and shows its mastery wording

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, open the seeded client, create a custom program | Program opens |
| 2 | Open **Add Data Collection**; for each of the 14 types: select it → **Next** | Mastery step heading reads "Mastery Criteria — &lt;type&gt;" |
| 3 | **Back** after each type | Returns to step 1 with the type still selected |
| 4 | **Cancel** | Wizard closes; nothing saved (Data Settings unchanged) |
| 5 | Clean-up: delete the program | Program removed |

## TC-US08-03 — Change the collection type of a configured program

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, create a custom program, configure **Opportunity Based** and save | Data Settings shows Opportunity Based |
| 2 | **Manage Data Collection** → **Task Analysis** → **Next** → **Save** | Wizard closes |
| 3 | Check Data Settings | Shows Task Analysis |
| 4 | Clean-up: delete the program | Program removed |
