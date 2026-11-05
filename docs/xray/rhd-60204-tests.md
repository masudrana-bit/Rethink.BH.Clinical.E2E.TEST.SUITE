# Xray test execution RHD-60204: test steps

83 tests, 344 steps. Read from Jira on 2026-11-05.

## RHD-60113 Select and switch client context

Folder: NextGen Clinical / Clients / Plan Setup & Library Context RHD-52586

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Sign in as BCBA and open the Clients page |  |  |
| 2 | Search by client name, then by client ID, and select the client |  |  |
| 3 | Open the plan and Analyze Data in separate tabs |  |  |
| 4 | Switch to another client with the client switcher, including while inside Settings |  |  |
| 5 | Switch back to the first client |  | The list shows name, DOB, ID and status, and both searches return the correct client.<br>The header shows the selected client's name and DOB.<br>Every tab reloads for the new client and no data from the previous client is visible.<br>No client switcher in Settings present |

## RHD-60114 Browse, search and filter the program library

Folder: NextGen Clinical / Clients / Plan Setup & Library Context RHD-52586

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Open Add Program for the client |  |  |
| 2 | Open System Programs, then My Programs |  |  |
| 3 | Search by keyword, apply Category, Domain and Area filters, and Preview a result row |  |  |
| 4 | Run at least five searches and filter changes in a row, including a term with no results |  | The active tab is highlighted correctly (RHD-57975).<br>Results match the search and filters, and Domain and Area are populated on system programs.<br>Add and Preview are available per row.<br>Search and filters keep responding with no stale results and a clear empty state (RHD-59601, NGC-22, NGC-50)<br>Keyword search returns only programs whose name or category matches.<br>Every visible row still shows name, domain/category tag, and author.<br>No matches shows an explicit empty state, not a blank screen.<br>Assessment-recommended filtering is deferred and is not a working control. |

## RHD-60115 View and organize the client's treatment plan

Folder: NextGen Clinical / Clients / Plan Setup & Library Context RHD-52586

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Open the plan of a client with no programs |  |  |
| 2 | Add programs, then review the Current, Future and Inactive groups |  |  |
| 3 | Reorder programs and refresh the page |  |  |
| 4 | Select an inactive program, then switch to Current |  |  |
| 5 | Check where a mastered program is listed, if one exists |  | A clear empty state with an Add Program action is shown, with no error.<br>Programs are grouped correctly with domain tag and status badge, and US spelling<br>The order persists after refresh.<br>The inactive program does not stay selected<br>Mastered programs appear under Inactive. |

## RHD-60116 Add library programs to Current and Future

Folder: NextGen Clinical / Clients / Program Authoring RHD-52588

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Add a system program to Current |  |  |
| 2 | Add a second program to Future |  |  |
| 3 | Try adding a program already on the plan from the System tab, then from My Programs |  |  |
| 4 | Move the Future program to Current |  |  |
| 5 | Open each added program |  | Goal, objectives, targets and lesson plan are copied (NGC-72)<br>Each program shows under the correct group.<br>A duplicate warning is shown in both tabs (NGC-21) and the user can cancel.<br>The moved program keeps its configuration. |

## RHD-60117 Create a custom program

Folder: NextGen Clinical / Clients / Program Authoring RHD-52588

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Choose Create custom program and try to save with required fields empty |  |  |
| 2 | Enter name, category, domain and area, then add goal, objectives and three targets |  |  |
| 3 | Try to save with a name that already exists |  |  |
| 4 | Save with a unique name |  |  |
| 5 | Search My Programs and add the program to the plan |  | Required fields are marked and block saving.<br>Domain and Area options exist (NGC-24, NGC-25).<br>The duplicate name is rejected with a clear message (RHD-59598).<br>The program saves and is searchable (NGC-51, NGC-52).<br>It can be added to the plan. |

## RHD-60118 Program materials and lesson notes by role

Folder: NextGen Clinical / Clients / Program Authoring RHD-52588

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Open a program (BCBA role) and add a link and a file as lesson materials |  |  |
| 2 | Add a lesson note and save |  |  |
| 3 | Reopen the program and check the materials and note |  |  |
| 4 | Sign in as RBT and open the same program |  | The link, file and note save.<br>They show correctly when reopened.<br>The RBT can view them but not edit. |

## RHD-60119 Edit and rename a program from every entry point

Folder: NextGen Clinical / Clients / Program Authoring RHD-52588

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Rename the program from the program header and save |  |  |
| 2 | Edit it from the card menu and save |  |  |
| 3 | Edit it from the reorder list and save |  |  |
| 4 | Open the Skill Programs page and hover the menu icons |  | Changes save from every route (NGC-14).<br>Only one Edit option is shown (RHD-58952).<br>The new name appears everywhere.<br>Tooltips are shown and labels are consistent (RHD-58411, RHD-58829). |

## RHD-60120 Discontinue and delete a program

Folder: NextGen Clinical / Clients / Program Authoring RHD-52588

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Discontinue a Current program from the card menu and confirm |  |  |
| 2 | Choose Delete on another program, then Cancel |  |  |
| 3 | Choose Delete again and confirm |  | The program moves to Inactive and its data is kept.<br>Cancel keeps the program.<br>A confirmation message appears and the program is removed from the plan |

## RHD-60121 Copy a program

Folder: NextGen Clinical / Clients / Program Authoring RHD-52588

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Copy a program within the same client |  |  |
| 2 | Copy a program to another client, with and without recorded data |  | Recorded data should not copy |
| 3 | Edit the copy |  | The copy is independent of the original<br>The original is unchanged |

## RHD-60122 Open Settings and the program catalog as Program Admin

Folder: NextGen Clinical / Settings / Program Library Administration RHD-52755

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Sign in as Program Admin and open Settings. |  |  |
| 2 | Open the Locations list. |  |  |
| 3 | Open the program catalog. |  |  |
| 4 | Check the columns and actions, and open the side panel. |  | Settings opens for the admin.<br>The Locations list has no test locations.<br>Domain, area, author, last edited and actions are visible without side scrolling (NGC-68).<br>The side panel does not overlap the grid (NGC-81). |

## RHD-60123 Search and filter the catalog

Folder: NextGen Clinical / Settings / Program Library Administration RHD-52755

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Search the catalog by program name. |  |  |
| 2 | Apply each available filter, alone and combined. |  |  |
| 3 | Edit a program and return to the catalog. |  | Search returns the right programs.<br>Filters are complete and work together (NGC-23, NGC-69).<br>Last edited updates on every edit. |

## RHD-60124 Create a program and save as draft

Folder: NextGen Clinical / Settings / Program Library Administration RHD-52755

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Create a program, choosing each category in turn. |  |  |
| 2 | Add system targets and lesson materials (link and file). |  |  |
| 3 | Try to save with required fields empty, then with an existing name. |  |  |
| 4 | Save as draft. |  | Every category has domains.<br>Required fields are marked and block saving.<br>The duplicate name is rejected (RHD-59598).<br>Dropdowns close after a selection, and the draft saves. |

## RHD-60125 Adapt a standard program without changing it for others

Folder: NextGen Clinical / Settings / Program Library Administration RHD-52755

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Choose Adapt on a standard program. |  |  |
| 2 | Edit the copy and save. |  |  |
| 3 | Check the original. |  |  |
| 4 | Compare Edit, Open draft revision and Adapt on the same program. |  | A copy is created and marked Custom or Adapted, not "Standard" (NGC-70).<br>The original is unchanged for other users.<br>The owner warning is correct and the three actions behave consistently, without overlapping buttons (NGC-71, NGC-75). |

## RHD-60126 Publish a draft

Folder: NextGen Clinical / Settings / Program Library Administration RHD-52755

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Choose Publish on a draft and cancel the confirmation |  |  |
| 2 | Publish again and confirm |  |  |
| 3 | As BCBA open Add Program for the client |  | A confirmation appears first, and cancelling leaves the draft unpublished.<br>The program publishes.<br>The published program is visible to clients in the Add Program list. |

## RHD-60127 Deactivate and reactivate a program, and check client impact

Folder: NextGen Clinical / Settings / Program Library Administration RHD-52755

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Deactivate the published program and confirm |  |  |
| 2 | As BCBA check the client's Add Program list |  |  |
| 3 | Reactivate the program and confirm |  |  |
| 4 | Check the Add Program list again |  |  |
| 5 | Try to deactivate a standard program |  |  |
| 6 | Open the client's existing plan |  | A confirmation appears first.<br>The program disappears from the list while inactive.<br>It reappears after reactivation.<br>A standard program is hidden for the organization, or a clear "Adapt a copy" message appears (NGC-30).<br>The client's existing plan is unchanged by all library changes. |

## RHD-60282 Opportunity Based program: create and collect data, with and without prompts

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As BCBA choose Opportunity Based in Manage Data Collection for a new program with prompts, and set the prompt hierarchy including a fading prompt option |  |  |
| 2 | Create a second Opportunity Based program without prompts |  |  |
| 3 | Add targets (set minimum trials to zero on one) and add both programs to the plan |  |  |
| 4 | As RBT start a session and open the program with prompts. Record correct and incorrect trials at every prompt level. Rrecord data for Baseline and Intervention |  |  |
| 5 | Open the trial-by-trial view and change one trial |  |  |
| 6 | Open the program without prompts and record correct and incorrect trials |  |  |
| 7 | Conclude the session and check the summary and chart |  | Both programs save and show their collection type in Program Details<br>The prompt list ends with N/A. The program without prompts shows no prompt options.<br>Each trial shows its prompt code, and the change-trial popup is fully visible.<br>Minimum trials of zero behaves according to the defined rule with no errors.<br>On-hold targets are hidden (NGC-90).<br>The summary and graph show correct percent for both programs<br>Each data point displays correct phase as it was recorded |

## RHD-60283 Task Analysis Forward Chain: create and collect data, with and without prompts

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Create a Task Analysis program with Forward Chain and prompts, and a second with Forward Chain without prompts |  |  |
| 2 | Open Manage steps and add, edit and reorder steps for both |  |  |
| 3 | Add both programs to the plan |  |  |
| 4 | As RBT record data for Baseline and Intervention |  |  |
| 5 | Start a new series, then conclude the session and check the summary |  | Steps save in order, and Forward Chain is shown clearly in Program Details (RHD-58828)<br>The recording screen follows forward-chain order<br>Prompt levels are offered only on the program with prompts<br>A new series starts at step 1 (NGC-88)<br>The summary and graph show correct percentage<br>Each data point displays correct phase as it was recorded |

## RHD-60284 Task Analysis Backward Chain: create and collect data, with and without prompts

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Create a Task Analysis program with Backward Chain and prompts, and a second with Backward Chain without prompts |  |  |
| 2 | Add, edit and reorder steps, and add both programs to the plan |  |  |
| 3 | As RBT record data for Baseline and Intervention |  |  |
| 4 | Start a new series, then conclude the session and check the summary and graphs |  | Steps save in order, and Backward Chain is shown clearly in Program Details<br>The recording screen follows backward-chain order<br>Prompt levels are offered only on the program with prompts<br>A new series starts correctly, and the summary& graph shows correct percent<br>Each data point displays correct phase as it was recorded |

## RHD-60285 Task Analysis Total Task: create and collect data, with and without prompts

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Create a Task Analysis program with Total Task and prompts, and a second with Total Task without prompts |  |  |
| 2 | Add steps and add both programs to the plan |  |  |
| 3 | As RBT score every step on each attempt in a session, using prompt levels on the first program. Record baseline and Intervention |  |  |
| 4 | Conclude the session and check the summary and graph |  | Total Task is shown in Program Details<br>Every step is scored on each attempt<br>Prompt levels are offered only on the program with prompts<br>The summary and graph shows percent correctly for all Baseline, Intervention, Maintenance |

## RHD-60286 Frequency/Rate program: create and collect data

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Create a Frequency/Rate program and set its dimensions. |  |  |
| 2 | Add 3 targets to the program and add it to the plan. |  |  |
| 3 | As BCBA, set one target to Baseline, one to Intervention and one to Maintenance. |  |  |
| 4 | As RBT, start a session and record several occurrences on every target, and correct one. |  |  |
| 5 | Conclude the session and check the summary. |  |  |
| 6 | Open the program chart and each target's chart. |  | The dimensions persist.<br>Counts record and can be corrected on every target.<br>The summary shows the count and the rate for each target.<br>Each target has its own series on the program chart and on its own chart.<br>Each target's data appears under its phase (Baseline, Intervention or Maintenance), with phase lines drawn (NGC-61).<br>Chart values match the session summary. |

## RHD-60287 Duration program: create and collect data

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Create a Duration program. |  |  |
| 2 | Add 3 targets to the program and add it to the plan. |  |  |
| 3 | As BCBA, set one target to Baseline, one to Intervention and one to Maintenance. |  |  |
| 4 | As RBT, start a session and record durations with the timer on every target, including one pause. |  |  |
| 5 | Conclude the session and check the summary. |  |  |
| 6 | Open the program chart and each target's chart. |  | The recorded durations are saved on every target, and the timer pauses and resumes correctly.<br>The summary shows total and average duration for each target.<br>Each target has its own series on the program chart and on its own chart.<br>Each target's data appears under its phase (Baseline, Intervention or Maintenance), with phase lines drawn (NGC-61).<br>Chart values match the session summary. |

## RHD-60288 Frequency + Duration program: create and collect data

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Create a Frequency + Duration program. |  |  |
| 2 | Add 3 targets to the program and add it to the plan. |  |  |
| 3 | As BCBA, set one target to Baseline, one to Intervention and one to Maintenance. |  |  |
| 4 | As RBT, start a session and record several occurrences, each with a duration, on every target. |  |  |
| 5 | Conclude the session and check the summary. |  |  |
| 6 | Open the program chart and each target's chart. |  | Each occurrence stores both count and duration on every target.<br>The summary shows frequency, total duration and average duration for each target.<br>The charts show both frequency and duration.<br>Each target has its own series on the program chart and on its own chart.<br>Each target's data appears under its phase (Baseline, Intervention or Maintenance), with phase lines drawn (NGC-61).<br>Chart values match the session summary. |

## RHD-60289 Interval programs (Whole, Partial, Momentary): create and collect data

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Create three Interval programs, one each for Whole Interval, Partial Interval and Momentary Interval, and set the interval length. |  |  |
| 2 | Add 3 targets to each program and add the programs to the plan. |  |  |
| 3 | As BCBA, set one target in each program to Baseline, one to Intervention and one to Maintenance. |  |  |
| 4 | As RBT, start a session and run each program in it, marking each interval as occurred or not occurred on every target. Leave one interval skill unselected. |  |  |
| 5 | Conclude the session and check the summary. |  |  |
| 6 | Open the program chart and each target's chart for every program. |  | Each program shows the correct interval type.<br>The interval timer runs and signals the end of each interval.<br>Each interval mark is saved on every target, and the summary shows percent of intervals.<br>The unselected interval skill is not recorded (RHD-57373).<br>Each target has its own series on the program chart and on its own chart.<br>Each target's data appears under its phase (Baseline, Intervention or Maintenance), with phase lines drawn (NGC-61).<br>Chart values match the session summary. |

## RHD-60290 Quick Entry Percentage, Numeric and Percentage + Numeric: create and collect data

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Create one program for each of Percentage, Numeric and Percentage + Numeric. |  |  |
| 2 | Add 3 targets to each program and add the programs to the plan. |  |  |
| 3 | As BCBA, set one target in each program to Baseline, one to Intervention and one to Maintenance. |  |  |
| 4 | As RBT, start a session and enter a value for every target, including 150 on a percentage target. |  |  |
| 5 | Conclude the session and check the summary. |  |  |
| 6 | Open the program chart and each target's chart for every program. |  | Percentage rejects values above 100 and accepts valid values.<br>Numeric accepts a number.<br>Percentage + Numeric saves both values.<br>Each value appears in the summary.<br>Each target has its own series on the program chart and on its own chart.<br>Each target's data appears under its phase (Baseline, Intervention or Maintenance), with phase lines drawn (NGC-61).<br>Chart values match the session summary. |

## RHD-60291 Quick Entry Rating Scale, Number of Occurrences and Number of Prompts: create and collect data

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Create one program for each of Rating Scale, Number of Occurrences and Number of Prompts. |  |  |
| 2 | Add 3 targets to each program and add the programs to the plan. |  |  |
| 3 | As BCBA, set one target in each program to Baseline, one to Intervention and one to Maintenance. |  |  |
| 4 | As RBT, start a session and enter a value for every target. |  |  |
| 5 | Conclude the session and check the summary. |  |  |
| 6 | Open the program chart and each target's chart for every program. |  | The Rating Scale offers its configured range.<br>Number of Occurrences and Number of Prompts accept counts.<br>Each value saves and appears in the summary.<br>Each target has its own series on the program chart and on its own chart.<br>Each target's data appears under its phase (Baseline, Intervention or Maintenance), with phase lines drawn (NGC-61).<br>Chart values match the session summary. |

## RHD-60292 Toileting program: create and collect data

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Create a Toileting program. |  |  |
| 2 | Add 3 targets to the program and add it to the plan. |  |  |
| 3 | As BCBA, set one target to Baseline, one to Intervention and one to Maintenance. |  |  |
| 4 | As RBT, start a session, start the sit timer, end the visit and choose an outcome for every target. |  |  |
| 5 | Conclude the session and check the summary. |  |  |
| 6 | Open the program chart and each target's chart. |  | The sit timer runs, and the selected outcome is highlighted (NGC-46).<br>Each visit is saved to the summary.<br>Each target has its own series on the program chart and on its own chart.<br>Each target's data appears under its phase (Baseline, Intervention or Maintenance), with phase lines drawn (NGC-61).<br>Chart values match the session summary. |

## RHD-60293 PEAK Scoring program: create and collect data

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Create a PEAK Scoring program. |  |  |
| 2 | Add 3 targets to the program and add it to the plan. |  |  |
| 3 | As BCBA, set one target to Baseline, one to Intervention and one to Maintenance. |  |  |
| 4 | As RBT, start a session and run a train block and a test block for every target. |  |  |
| 5 | Conclude the session and check the summary. |  |  |
| 6 | Open the program chart and each target's chart. |  | Train and test labels show, and the blocks stay together.<br>Block-level scoring is correct (NGC-55).<br>Each target has its own series on the program chart and on its own chart.<br>Each target's data appears under its phase (Baseline, Intervention or Maintenance), with phase lines drawn (NGC-61).<br>Chart values match the session summary. |

## RHD-60294 Add targets and assign objectives and groups

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Open a program on the client and add one target, then bulk-add three or more. |  |  |
| 2 | Assign an objective and a group to each row before the first save, and link one target to an objective. |  |  |
| 3 | Save and reopen the program. |  |  |
| 4 | Add a new objective and assign targets to it, then remove the objective. |  | All targets save, and new targets are shown as Baseline by default (RHD-58452).<br>The Objective and Group dropdowns are usable on every row before the first save (NGC-53).<br>Linking one target does not link the others (NGC-84, NGC-87).<br>Assignments persist after reopening.<br>Removing an objective does not delete its targets, and they get assigned to the first Objective in the program |

## RHD-60295 Reorder targets, change statuses and review change history

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Reorder the targets and refresh the page. |  |  |
| 2 | Set one target to On hold. |  |  |
| 3 | Master one target manually, then un-master it. |  |  |
| 4 | Add a target from the data entry page and master it manually. |  |  |
| 5 | Open the change history. |  |  |
| 6 | Open the program and the plan list and compare the objective status. |  |  |
| 7 | Open the dropdowns in the last table row, in a drawer and in a narrow window. |  | The order persists after refresh.<br>The On-hold target is hidden from data recording.<br>Each status change updates the target, and the history is date-stamped for every change.<br>The objective status is the same on the plan list and the program page (RHD-58839).<br>Dropdowns are never clipped and the page does not freeze (NGC-03). |

## RHD-60296 Manage Data Collection options and collection type rules

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As BCBA open Manage Data Collection while creating a new program. |  |  |
| 2 | Check the three groups and their options: Structured Collection (Opportunity Based, Task Analysis, Frequency/Rate, Duration, Frequency + Duration, Interval), Quick Entry (Percentage, Numeric, Percentage + Numeric, Rating Scale, Number of Occurrences, Number of Prompts) and Specialized Collection (Toileting, PEAK Scoring). |  |  |
| 3 | Try to select two options. |  |  |
| 4 | Select one option, set the dimensions (and the prompt hierarchy for a type that has prompts) and save. |  |  |
| 5 | Record data for the program in a session. |  |  |
| 6 | Reopen Manage Data Collection on the program and try to change the collection type. |  | All 14 options appear under the right group, and only one can be selected<br>The drawer closes on save, and the type and dimensions persist after reopening<br>The collection type can be chosen only when the program is created. Once the program has data it cannot be changed |

## RHD-60297 Configure mastery and baseline criteria for each data type

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | For each collection type that offers criteria, open a program of that type and set the mastery criteria. |  |  |
| 2 | Set baseline criteria using minimum OR maximum. |  |  |
| 3 | Try to save with required values empty, then with a percentage above 100. |  | Validation blocks the empty and over-100 cases with clear messages (NGC-40) |
| 4 | On a frequency/rate program set frequency-based criteria: count/frequency of the target along with the amount of time user observed the client. This could be a programmed amount of time OR the entire length of the session |  | Count/frequency of the target along with the amount of time user observed the client |
| 5 | Save and reopen each program. |  | All values save and display on the program |

## RHD-60298 Configure maintenance, generalization and days-based criteria

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | On a program set maintenance criteria and generalization criteria. |  |  |
| 2 | Set mastery criteria that use days, for each data type. |  |  |
| 3 | Save and reopen the program. |  |  |
| 4 | Check how the criteria show in Program Details and on the chart goal line. |  | Maintenance and generalization criteria save and display (RHD-58825).<br>Days-based criteria save for every data type.<br>The chart goal line follows the saved mastery criteria (NGC-59). |

## RHD-60299 Edit criteria on a program that already has data

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Open a program that has recorded sessions. |  |  |
| 2 | Change the mastery criteria and save. |  |  |
| 3 | Open the program charts and the goal line. |  |  |
| 4 | Open the same program in a second browser and edit it at the same time. |  | Goals and mastery criteria propagate to the program, charts and goal line<br>Concurrent edits do not corrupt the mastery state |

## RHD-60300 Timers during a session

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT start a session and open a program that has a program timer. |  |  |
| 2 | Run the session timer and the program timer together. |  |  |
| 3 | Pause, wait, then resume. |  |  |
| 4 | Minimize the timer panel. |  | Both timers run, pause and resume correctly.<br>The session timer does not reset after a pause.<br>The panel can be minimized. |

## RHD-60301 Behavior data: duration-intensity, frequency and duration with details

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT record duration-intensity data for a behavior linked to a plan, before and after a pause. |  |  |
| 2 | Record a frequency behavior with details and a duration behavior with details. |  |  |
| 3 | Add a behavior note. |  |  |
| 4 | Conclude the session and open the behavior graph and summary. |  | The recorder is available, and the data is kept across the pause (NGC-35).<br>Duration options match between skills and behaviors (RHD-57366).<br>Details and the note save and appear in the summary.<br>The data shows in the behavior graph. |

## RHD-60302 ABC for plan-defined and novel behaviors

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT open the ABC logger in a session. |  |  |
| 2 | Log an entry for a plan-defined behavior, choosing antecedent, consequence and context. |  |  |
| 3 | Log an entry for a novel behavior that isn't on the plan. |  |  |
| 4 | Open the audit list. |  | Both entries save and appear in the audit list.<br>The audit list shows the context name, not an ID.<br>Dropdowns show all options and stay open while scrolling (RHD-57350). |

## RHD-60303 ABC archived and unused options

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As BCBA archive one ABC option that has history and leave another option unused. |  |  |
| 2 | As RBT open the ABC recorder. |  |  |
| 3 | Open the ABC data view and the analysis view. |  | Archived options are hidden for new entries, but their history stays visible.<br>Unused options display correctly in both views. |

## RHD-60304 Recording page: selection, entry modes and layout

Folder: NextGen Clinical / Clients / Target & Criteria Configuration RHD-52589 + Data Collection RHD-52594

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT open the recording page for a session. |  |  |
| 2 | Use select all, then deselect all. |  |  |
| 3 | Compare Structured Collection with Quick Entry for the same session. |  |  |
| 4 | Open a target with a long name. |  | Select all and deselect all work (RHD-57668).<br>Both entry modes behave as designed (RHD-58809).<br>Buttons stay aligned with long names (RHD-57360). |

## RHD-60305 Change a target's phase with a reason and review history

Folder: NextGen Clinical / Clients / Clinical Decisioning RHD-52598

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Open the program and find the Phase column. |  |  |
| 2 | Change a target's phase and enter a reason. |  |  |
| 3 | Open the phase history. |  |  |
| 4 | Move a target beyond Intervention, then back to Baseline. |  | The phase column and control exist (NGC-60).<br>The history shows the reason, date and user (NGC-82).<br>All phases are available and Baseline shows correctly. |

## RHD-60306 Record baseline, switch to Intervention and record again

Folder: NextGen Clinical / Clients / Clinical Decisioning RHD-52598

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT record baseline data for a target in a session. |  |  |
| 2 | As BCBA switch the target to Intervention. |  |  |
| 3 | As RBT record intervention data. |  |  |
| 4 | Open the target chart. |  | Both phases are recorded and shown separately on the chart.<br>The phase line is drawn on the chart (NGC-61).<br>New targets are not wrongly shown as Baseline (RHD-58452). |

## RHD-60307 Auto-switch from baseline to intervention (confirm it exists in NextGen)

Folder: NextGen Clinical / Clients / Clinical Decisioning RHD-52598

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Turn auto-switch on for opportunity-based, task analysis and frequency programs and for behaviors. |  |  |
| 2 | Record enough baseline data to meet the baseline criteria. |  |  |
| 3 | Repeat with auto-switch off. |  | With auto-switch on, the target moves to Intervention automatically.<br>With it off, the target stays in Baseline. |

## RHD-60311 Mastery determination is raised for each program type

Folder: NextGen Clinical / Clients / Clinical Decisioning RHD-52598

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT record enough data to meet the mastery criteria on task analysis and opportunity-based programs, without maintenance. |  |  |
| 2 | As BCBA open the determinations list. |  |  |
| 3 | Look for the indicator or prompt. |  | A determination is raised for the target, objective and program as criteria are met.<br>The BCBA is alerted: legacy used an orange dot and a pop-up, and NextGen uses the determinations list. |

## RHD-60312 Confirm and reject mastery determinations

Folder: NextGen Clinical / Clients / Clinical Decisioning RHD-52598

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Confirm one determination. |  |  |
| 2 | Reject a determination on another target. |  |  |
| 3 | Open the RBT data sheet and the plan. |  |  |
| 4 | If behaviors can be mastered, repeat with a behavior. |  | Confirm sets the target to Mastered and removes it from the RBT data sheet.<br>The program moves to Inactive when all of its targets are mastered.<br>Reject leaves the target in its current status and records the rejection. |

## RHD-60313 Mastery paths: with maintenance, goals only, and days-based

Folder: NextGen Clinical / Clients / Clinical Decisioning RHD-52598

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Master a skill that has maintenance criteria, then record maintenance data until the criteria are met. |  |  |
| 2 | Master a skill that has goals only and no mastery criteria. |  |  |
| 3 | Check days-based decisions with automastery off, then on. |  | The skill enters maintenance first and becomes mastered after the maintenance criteria are met.<br>Goals-only mastery completes with no criteria errors.<br>Days are calculated accurately, and automastery masters the target automatically. |

## RHD-60314 Re-introduce a mastered target

Folder: NextGen Clinical / Clients / Clinical Decisioning RHD-52598

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Re-introduce a mastered target. |  |  |
| 2 | Open the RBT data sheet. |  |  |
| 3 | Open the change history. |  | The target returns to the data sheet with its history kept.<br>The re-introduction appears in the history. |

## RHD-60358 Launch from the BH dashboard tile and by direct URL

Folder: NextGen Clinical / Clients / Platform Enablement RHD-52596

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Sign in to BH and click the Clinical tile. |  |  |
| 2 | Sign out, then open the direct URL (clinical.<env>.rethinkbhtech.com) and sign in. |  |  |
| 3 | Check the role you land in each time. |  | The tile opens NextGen with no second sign-in (NGC-66).<br>The direct URL signs in normally.<br>The correct role is applied in both cases. |

## RHD-60359 Stay signed in during a long session

Folder: NextGen Clinical / Clients / Platform Enablement RHD-52596

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Sign in and work for 90 minutes with 20-minute idle gaps. |  |  |
| 2 | Return to the tab after each gap. |  |  |
| 3 | If a sign-out happens, note the reason. |  | No forced sign-out occurs within the 90 minutes. A session expiry of about 30 minutes was seen on 25 Sep.<br>If a sign-out happens, the reason is logged.<br>The token refreshes on tab focus. |

## RHD-60360 BCBA, RBT and Program Admin permissions

Folder: NextGen Clinical / Clients / Platform Enablement RHD-52596

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Sign in as BCBA, RBT and Program Admin in turn, refresh and sign in again for each, and note the landing page and menus. |  |  |
| 2 | As each role, open the other roles' pages by direct URL. |  |  |
| 3 | As RBT, open plans and materials, and the sessions list. |  |  |
| 4 | As each role, look for Settings. |  | Each role lands on its own home each time, including after refresh and re-login (NGC-47).<br>Each role sees only its own menus, and other roles' pages are blocked.<br>The RBT is read-only on plans and materials and sees only their own clients' sessions (NGC-49).<br>Settings is visible only to the Program Admin. |

## RHD-60361 Data persists after sign-out, refresh and client switch

Folder: NextGen Clinical / Clients / Platform Enablement RHD-52596

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Note the counts of programs, targets, sessions and plans for a client. |  |  |
| 2 | Sign out, then sign back in from the BH tile. |  |  |
| 3 | Refresh the page. |  |  |
| 4 | Switch to another client and back, and compare the counts. |  |  |
| 5 | If a deploy happens during the test window, repeat the comparison after it. |  | All data is present and unchanged after each step.<br>Counts match before and after, including after a deploy. |

## RHD-60362 Hand-off to legacy BH

Folder: NextGen Clinical / Clients / Platform Enablement RHD-52596

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Click Client Info on a client. |  |  |
| 2 | Click File Cabinet on the same client. |  | Each opens legacy BH in a new tab on the correct client (agreed behavior for now).<br>Any separate sign-in is documented. |

## RHD-60363 Browser, device and performance smoke

Folder: NextGen Clinical / Clients / Platform Enablement RHD-52596

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | In Edge and Safari, smoke-test plan setup, a session and analysis. |  |  |
| 2 | Open the RBT session screens on a tablet. |  |  |
| 3 | Time library search, client list load and session start. |  |  |
| 4 | Open dropdowns in a narrow window. |  | No layout or functional breaks in Edge, Safari or on the tablet.<br>Library search and client list load in under 3 seconds, and session start takes under 2.<br>The page does not freeze when opening dropdowns in a narrow window (NGC-03). |

## RHD-60364 UI consistency sweep

Folder: NextGen Clinical / Clients / Platform Enablement RHD-52596

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Open the main screens (plan, program library, session, Analyze Data, catalog). |  |  |
| 2 | Check spelling, watermarks and the dropdown lists. |  |  |
| 3 | Check required fields in forms and drawers. |  | US spelling is used throughout.<br>No "trial use" watermarks appear.<br>No test data shows in dropdowns on the demo tenant.<br>Dropdowns are never clipped inside tables or drawers, and required fields are marked. |

## RHD-60365 Numbers agree across screens

Folder: NextGen Clinical / Funder Report / E2E

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | For one program and date range, open the session summary, the Observations grid, the program chart, Analyze Data and the funder graph. |  |  |
| 2 | Compare the values for each date. |  | The numbers are the same on every screen. |

## RHD-60366 Mastered targets report

Folder: NextGen Clinical / Funder Report / E2E

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Open Analyze Data and the Mastered Targets report for a client with mastered targets. |  |  |
| 2 | Compare the list with the plan. |  |  |
| 3 | Save the report. |  |  |
| 4 | Sign in on another device and open the saved report. |  | Every mastered target is listed (NGC-45).<br>The saved report follows the user across devices (it was saved on device only on 29 Sep). |

## RHD-60367 Custom cross-program comparison graph

Folder: NextGen Clinical / Funder Report / E2E

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Open the custom graph builder and plot several programs together. |  |  |
| 2 | Add a behavior graph. |  |  |
| 3 | Save the report and reopen it. |  | All series render, including behaviors (they showed "not available yet" on 29 Sep).<br>The saved report reloads with the same selections. |

## RHD-60368 All-graphs report for selected programs

Folder: NextGen Clinical / Funder Report / E2E

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Select a subset of programs. |  |  |
| 2 | Generate the all-graphs report. |  | Only the selected programs appear (NGC-89), plus the behavior graphs. |

## RHD-60369 Behavior Support Plan: create and publish

Folder: NextGen Clinical / Funder Report / E2E

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | From a novel behavior logged in a session choose Start a Plan. |  |  |
| 2 | Edit the goal, functions and strategies. |  |  |
| 3 | Link a replacement skill. |  |  |
| 4 | Publish the plan and open the versions list. |  |  |
| 5 | Open a closed plan. |  | A plan starts from the behavior and all fields save.<br>The plan publishes and its versions are listed.<br>A closed plan can be reviewed.<br>No delete option exists for a behavior yet (RHD-59477). |

## RHD-60370 Behavior and replacement-skill side-by-side trend

Folder: NextGen Clinical / Funder Report / E2E

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Record data for the behavior and the replacement skill on the published plan. |  |  |
| 2 | Open the side-by-side chart. |  | Both series show once the behavior is measured on a plan (nothing was measured on 29 Sep). |

## RHD-60371 ABC pattern breakdown

Folder: NextGen Clinical / Funder Report / E2E

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Log several ABC entries for a behavior on the published plan. |  |  |
| 2 | Open the ABC pattern view. |  | The antecedent, consequence and context breakdown is meaningful with several entries (it was thin with one entry).<br>The breakdown is available only for a published plan. |

## RHD-60372 Funder-ready skill graph export

Folder: NextGen Clinical / Funder Report / E2E

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Create a skill graph for export. |  |  |
| 2 | Fill the required fields. |  |  |
| 3 | Check the chart title. |  |  |
| 4 | Export in each available format. |  | Spelling is US English (British spellings were seen) and the required fields are marked (NGC-67).<br>The aspect ratio and x-axis labels are correct.<br>The chart title is correct for a skill graph.<br>Each available export format opens correctly with accurate data. |

## RHD-60373 Funder-ready behavior graphs

Folder: NextGen Clinical / Funder Report / E2E

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Create a behavior graph and an intensity rate graph for export. |  |  |
| 2 | Include a discontinued program in the date range. |  |  |
| 3 | Check the chart titles. |  |  |
| 4 | Export. |  | Behavior graph titles are correct.<br>The intensity rate graph shows the recorded intensity data.<br>Discontinued programs show or hide as the product intends (confirm the NextGen behavior).<br>Each export opens correctly with accurate data. |

## RHD-60374 Navigate between client-level and program-level analysis

Folder: NextGen Clinical / Funder Report / E2E

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | From Analyze Data open a program chart. |  |  |
| 2 | Return to the client-level analysis. |  |  |
| 3 | Click Client Info and File Cabinet. |  | Navigation works in both directions.<br>Client Info and File Cabinet open legacy BH, which is documented and is the agreed hand-off. |

## RHD-60375 Save and reuse a funder graph (optional, confirm scope)

Folder: NextGen Clinical / Funder Report / E2E

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Save a funder graph as a draft. |  |  |
| 2 | Save as a new version, with the same name and with an empty name. |  |  |
| 3 | Overwrite an existing saved graph. |  |  |
| 4 | Save a graph to the File Cabinet. |  | An empty name is rejected and a same name asks before overwriting.<br>Saved items are where the product intends (legacy used the File Cabinet). |

## RHD-60380 Reach Settings by direct URL and after a refresh

Folder: NextGen Clinical / Settings / Program Library Administration RHD-52755

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Sign in as Program Admin and open Settings | Program Admin login | Settings opens |
| 2 | Copy the Settings URL and sign out |  | The user is signed out |
| 3 | Sign back in and open the copied URL | Settings URL | Settings opens directly |
| 4 | Refresh the browser |  | The admin stays on Settings and is not sent to the home page |

## RHD-60383 A deactivated program is hidden from Add Program but stays on existing plans

Folder: NextGen Clinical / Settings / Program Library Administration RHD-52755

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Sign in as BCBA and add a custom program to Client A's plan | Client A, published custom program | The program is added |
| 2 | Sign in as Program Admin, deactivate that program and confirm |  | The program shows as inactive |
| 3 | Sign in as BCBA, open Add Program for Client B and search for the program | Client B | The program is not listed |
| 4 | Open Client A's plan | Client A | The program is still on the plan, with its targets and data unchanged |

## RHD-60388 Publish a revision of an already published program

Folder: NextGen Clinical / Settings / Program Library Administration RHD-52755

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Sign in as Program Admin and choose Open draft revision on a published program | Published program | A draft revision opens |
| 2 | Rename a target or add a target, and save the revision |  | The revision is saved |
| 3 | Publish the revision and confirm |  | A confirmation appears first, and the catalog shows the program as Published |
| 4 | Sign in as BCBA, open Add Program for a client and preview the program |  | The updated version is shown |

## RHD-60390 Adapted copy can be added to a client plan with its changes

Folder: NextGen Clinical / Settings / Program Library Administration RHD-52755

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Sign in as Program Admin, adapt a standard program and add a target to the copy | Standard program | The copy is created with the new target |
| 2 | Save the copy, and publish it if it was saved as a draft |  | The copy is saved and available |
| 3 | Sign in as BCBA and open Add Program for a client |  | The copy is listed |
| 4 | Add the copy to the plan and open it |  | It includes the added target and the rest of the copy's content |

## RHD-60391 Adapting a program does not change client plans that use the original

Folder: NextGen Clinical / Settings / Program Library Administration RHD-52755

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Sign in as BCBA and add a standard program to Client A's plan | Client A | The program is added |
| 2 | Sign in as Program Admin, adapt that program, change the copy and save |  | The copy is saved |
| 3 | Sign in as BCBA and open Client A's plan |  | The original program is still there with its targets unchanged |
| 4 | Open Add Program for Client B and preview the standard program | Client B | It shows the original content, not the copy's changes |

## RHD-60393 A saved draft reopens with everything that was entered

Folder: NextGen Clinical / Settings / Program Library Administration RHD-52755

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Sign in as Program Admin and create a program with name, category, domain, area, targets, a link and a file | A URL and a small PDF | All values are accepted |
| 2 | Save as draft |  | The draft is saved |
| 3 | Refresh the browser and reopen the draft from the catalog |  | Name, category, domain, area and targets are all kept |
| 4 | Open the link and the file in lesson materials |  | The link opens and the file opens or downloads |

## RHD-60394 Create a program with its own goal, objectives and targets, then edit the draft

Folder: NextGen Clinical / Settings / Program Library Administration RHD-52755

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Sign in as Program Admin and start creating a program | Program Admin login | The create form opens |
| 2 | Enter a goal and objectives, and add custom targets (not system targets) | A goal, 2 objectives, 2+ custom targets | The values are entered |
| 3 | Save as draft |  | The goal, objectives and targets are saved with the draft |
| 4 | Reopen the draft, change one target, add another and save |  | The changes are kept and Last edited updates |

## RHD-61112 Scheduled sessions list: counts and sessions-to-finalize banner

Folder: NextGen Clinical / Clients / Session Access & Lifecycle RHD-52590

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Sign in as RBT with a client that has scheduled sessions, and open the sessions list. |  | The sessions list opens with the RBT's scheduled sessions. |
| 2 | Check the program and target counts shown for each session against the client's plan. |  | The counts match the client's plan. |
| 3 | Check the "sessions to finalize" banner. |  | The banner counts only that client's sessions. |
| 4 | Sign in as an RBT with no scheduled sessions and open the list. |  | A clear empty state is shown with no error. |

## RHD-61113 Start a scheduled session

Folder: NextGen Clinical / Clients / Session Access & Lifecycle RHD-52590

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT open today's scheduled session and start it. |  | The session starts. |
| 2 | Check which behaviors are selected and which programs are available. |  | The configured programs are available (RHD-57372) and no behaviors are pre-selected (RHD-57662). |
| 3 | Try to start and record a future-dated session. |  | Recording and finalizing a future-dated session is blocked (RHD-57369). |

## RHD-61114 Pause, resume and close a session, and check times

Folder: NextGen Clinical / Clients / Session Access & Lifecycle RHD-52590

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT start a session and record some data. |  | Data records and shows in the session. |
| 2 | Pause, wait a few minutes, then resume. |  | Data recorded before the pause is kept and the session timer does not reset after the pause (legacy RHD-57851). |
| 3 | Close the session and open the session summary. |  | Start and end times reflect real time, including the pause (NGC-92). |

## RHD-61115 Ad-hoc session from RBT home and from a client page

Folder: NextGen Clinical / Clients / Session Access & Lifecycle RHD-52590

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT create a new session from RBT home and choose a client. |  | The session is created for the chosen client. |
| 2 | Create another session from a client page. |  | The client is pre-selected. |
| 3 | Record data in each and conclude them. |  | Both sessions record data and appear in the sessions list. |

## RHD-61116 Group session with two clients

Folder: NextGen Clinical / Clients / Session Access & Lifecycle RHD-52590

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT open a scheduled group appointment for two clients and start it. Also create an ad-hoc group session with two clients that share the RBT. |  | Both group sessions start with both clients listed. |
| 2 | Record data for each client's own programs, switching between the two clients during the session. |  | Each client shows only their own programs and targets, and data is recorded per client with no mixing. |
| 3 | Pause and resume, then conclude the session. |  | Pause and resume apply to the whole session. |
| 4 | Open the summary for each client. |  | Each client has their own summary showing only their data. |

## RHD-61117 Group session with four clients

Folder: NextGen Clinical / Clients / Session Access & Lifecycle RHD-52590

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT create a group session with four clients that share the RBT. |  | All four clients are selectable and each shows only their own programs and targets. |
| 2 | Record data on at least two programs for each of three clients, switching between all four clients several times. |  | Switching clients repeatedly does not mix or lose data, and the screen stays responsive. |
| 3 | Record nothing for the fourth client. |  | No error appears for the fourth client. |
| 4 | Pause, resume and conclude the session. |  | The session pauses, resumes and concludes for all four clients. |
| 5 | Open the summary for each of the four clients. |  | The three clients with data have complete summaries. The fourth shows an empty summary with no error, and the other three are unaffected. |

## RHD-61118 Transfer a session to another staff member

Folder: NextGen Clinical / Clients / Session Access & Lifecycle RHD-52590

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT start a session and record some data. |  | Data records in the session. |
| 2 | Choose Transfer and select another staff member from the picker. |  | A staff picker is used, not free text (NGC-57), and the transfer completes. |
| 3 | Sign in as that staff member and open the session. |  | The other staff member sees the session with the data already recorded. |
| 4 | Check the original RBT's view. |  | The original RBT can no longer record in it. |

## RHD-61119 Backfill a historical session

Folder: NextGen Clinical / Clients / Session Access & Lifecycle RHD-52590

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT start historical entry and choose a past date. |  | The past date is accepted. |
| 2 | Leave the start and end times empty. |  | Start and end times are optional. |
| 3 | Record baseline and intervention data. |  | Both phases record. |
| 4 | Conclude the session and open the program chart. |  | The data appears on the chart under the chosen past date. |
| 5 | Try to choose a future date. |  | A future date is not accepted. |

## RHD-61120 Conclude a session and review the summary, audit list and drafted note

Folder: NextGen Clinical / Clients / Session Closeout & Data Integrity RHD-52595

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT record data across several programs and an ABC entry in a session. |  | Data and the ABC entry record. |
| 2 | Conclude the session. |  | The session concludes. |
| 3 | Review the summary and the audit list. |  | The summary and the audit list match everything that was recorded. |
| 4 | Open the drafted session note. |  | The note is drafted from the account's real template, not placeholder text, and ABC data appears in it (RHD-54773). |

## RHD-61121 Save the note as a draft, then finalize the session

Folder: NextGen Clinical / Clients / Session Closeout & Data Integrity RHD-52595

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Conclude a session and edit the drafted note. |  | The note is editable. |
| 2 | Save it as a draft, leave, and reopen the note. |  | The saved draft shows a timestamp and its content is restored (RHD-56942). |
| 3 | Finalize the session with the note. |  | The wording is correct, with no "removed from this device" message (NGC-86). |
| 4 | Open the appointment and the "sessions to finalize" banner. |  | The appointment shows completed, and the banner count drops by one. |

## RHD-61123 Correct recorded data and review the audit trail

Folder: NextGen Clinical / Clients / Session Closeout & Data Integrity RHD-52595

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT open a concluded session before finalizing it. |  | The session opens for corrections. |
| 2 | Undo or correct a recorded trial. |  | The correction works, with no "unavailable" message (NGC-65). |
| 3 | Correct an existing ABC entry. |  | The ABC correction works, with no "unavailable" message (NGC-65). |
| 4 | Open the audit trail, then the summary and chart. |  | The audit trail records each correction, and the summary and chart update to the corrected values. |

## RHD-61126 Refresh or restart the browser during a session

Folder: NextGen Clinical / Clients / Session Closeout & Data Integrity RHD-52595

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | As RBT start a session and record data on several programs. |  | Data records on each program. |
| 2 | Refresh the page mid-session. |  | The session resumes where it was, with no data lost. |
| 3 | Close the browser, reopen it, and open the session again. |  | The session resumes where it was, with no data lost. |
| 4 | Record more data and conclude the session. |  | New data adds to what was already recorded. |

## RHD-61128 Finalize group sessions per client (two-client and four-client)

Folder: NextGen Clinical / Clients / Session Closeout & Data Integrity RHD-52595

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Conclude the two-client group session with data recorded for both clients. |  | The session concludes with a note and summary per client. |
| 2 | Open the drafted note for the first client, edit it and finalize that client's session. |  | The first client's session is finalized. |
| 3 | Check the second client's note, data and appointment, then finalize the second client's session. |  | The second client's note, data and appointment are unchanged until finalized, then the session finalizes. |
| 4 | Conclude the four-client group session. |  | The session concludes with a note and summary per client. |
| 5 | Finalize the sessions for three of the four clients, one at a time. |  | Each finalize leaves the other clients' notes, data and appointments unchanged. |
| 6 | Leave the fourth client's session unfinalized, and check it. |  | The unfinalized session stays open with its data and draft intact. |
| 7 | Check the "sessions to finalize" banner after each finalize. |  | The banner count drops by one after each finalize and counts each client's session separately. |
