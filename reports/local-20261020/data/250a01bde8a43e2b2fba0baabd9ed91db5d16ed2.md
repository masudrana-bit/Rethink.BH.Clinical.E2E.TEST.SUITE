# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stories\09-clinical-decisioning\us-32-phase-change.spec.ts >> US-32 Change a target's phase and see its history >> TC-US32-01 Move a target from Baseline to Intervention and then Maintenance with reasons; history and the program-level phase follow
- Location: tests\stories\09-clinical-decisioning\us-32-phase-change.spec.ts:4:7

# Error details

```
Error: history names the user who made each change

expect(received).not.toMatch(expected)

Expected pattern: not /\bUnknown\b/
Received string:      "Maintenance MANUAL Oct 20, 2026 Jennifer Gregory E2E: criteria met, move to maintenance Intervention MANUAL Oct 20, 2026 Jennifer Gregory E2E: baseline stable over 3 sessions Status: Not Started MANUAL Oct 20, 2026, 9:29 PM Unknown"
```

# Page snapshot

```yaml
- generic [ref=f3e3]:
  - generic [ref=f3e4]:
    - link "Back to Rethink BH (opens in new tab)" [ref=f3e6] [cursor=pointer]:
      - /url: https://rta-bh-dev-analytics-web.azurewebsites.net/Healthcare#/Main
      - generic [aria-hidden] [ref=f3e7]: 
    - generic "Rethink Clinical" [ref=f3e8]:
      - banner [ref=f3e9]:
        - heading "Rethink Clinical" [level=1] [ref=f3e13]
        - generic [ref=f3e16]:
          - generic [ref=f3e17]: Client
          - generic [ref=f3e18] [cursor=pointer]:
            - combobox "Benson Moon" [ref=f3e19]
            - button "dropdown trigger" [ref=f3e20]
          - generic [ref=f3e23]:
            - generic [ref=f3e24]: DOB
            - text: Feb 14, 2018
        - button "Account menu" [ref=f3e28] [cursor=pointer]:
          - generic [aria-hidden] [ref=f3e29]: JG
          - generic [ref=f3e30]:
            - generic [ref=f3e31]: Jennifer Gregory
            - generic [ref=f3e32]: Role 4 a
          - generic [aria-hidden] [ref=f3e33]: 
  - generic [ref=f3e34]:
    - navigation "Application navigation" [ref=f3e36]:
      - text: 
      - link "Clients" [ref=f3e37] [cursor=pointer]:
        - /url: /clients
        - generic [aria-hidden] [ref=f3e38]: 
      - generic "Staff (coming soon)" [ref=f3e40]:
        - generic [aria-hidden] [ref=f3e41]: 
        - generic [ref=f3e42]: Staff
      - generic "Supervision (coming soon)" [ref=f3e43]:
        - generic [aria-hidden] [ref=f3e44]: 
        - generic [ref=f3e45]: Supervision
      - link "Settings" [ref=f3e46] [cursor=pointer]:
        - /url: /settings
        - generic [aria-hidden] [ref=f3e47]: 
      - generic "Training (coming soon)" [ref=f3e49]:
        - generic [aria-hidden] [ref=f3e50]: 
        - generic [ref=f3e51]: Training
      - generic "Reporting (coming soon)" [ref=f3e52]:
        - generic [aria-hidden] [ref=f3e53]: 
        - generic [ref=f3e54]: Reporting
      - link "Template" [ref=f3e55] [cursor=pointer]:
        - /url: /templates
        - generic [aria-hidden] [ref=f3e56]: 
      - generic "Schedule (coming soon)" [ref=f3e58]:
        - generic [aria-hidden] [ref=f3e59]: 
        - generic [ref=f3e60]: Schedule
      - generic "Notifications (coming soon)" [ref=f3e61]:
        - generic [aria-hidden] [ref=f3e62]: 
        - generic [ref=f3e63]: Notifications
      - generic "Billing (coming soon)" [ref=f3e64]:
        - generic [aria-hidden] [ref=f3e65]: 
        - generic [ref=f3e66]: Billing
    - main [ref=f3e67]:
      - generic [ref=f3e68]:
        - navigation "Client sections" [ref=f3e70]:
          - list [ref=f3e71]:
            - listitem [ref=f3e72]:
              - link "Client Info (opens in new tab)" [ref=f3e73] [cursor=pointer]:
                - /url: https://rta-bh-dev-analytics-web.azurewebsites.net/core/clients/472748
                - text: Client Info
            - listitem [ref=f3e74]:
              - link "File Cabinet (opens in new tab)" [ref=f3e75] [cursor=pointer]:
                - /url: https://rta-bh-dev-analytics-web.azurewebsites.net/core/clients/472748/files
                - text: File Cabinet
            - listitem [ref=f3e76]:
              - link "Sessions" [ref=f3e77] [cursor=pointer]:
                - /url: /clients/472748/sessions
            - listitem [ref=f3e78]:
              - link "Skills Programs" [ref=f3e79] [cursor=pointer]:
                - /url: /clients/472748
            - listitem [ref=f3e80]:
              - link "Behavior Support" [ref=f3e81] [cursor=pointer]:
                - /url: /clients/472748/behavior-support
            - listitem [ref=f3e82]:
              - link "Analyze Data" [ref=f3e83] [cursor=pointer]:
                - /url: /clients/472748/analyze-data
            - listitem [ref=f3e84]:
              - link "Funder Reports" [ref=f3e85] [cursor=pointer]:
                - /url: /clients/472748/reports
        - generic [ref=f3e86]:
          - generic [ref=f3e87]:
            - complementary [ref=f3e89]:
              - generic [ref=f3e90]:
                - group "Program timeline" [ref=f3e91]:
                  - button "Current" [pressed] [ref=f3e92] [cursor=pointer]
                  - button "Inactive" [ref=f3e93] [cursor=pointer]
                - generic [ref=f3e94]:
                  - generic [ref=f3e95]: Domain Filter
                  - generic [ref=f3e96] [cursor=pointer]:
                    - combobox "Domain Filter" [ref=f3e97]: All domains
                    - button "dropdown trigger" [ref=f3e98]
                - generic [ref=f3e101]:
                  - heading "Program List" [level=2] [ref=f3e102]
                  - generic [ref=f3e103]:
                    - button "Add New" [ref=f3e104] [cursor=pointer]:
                      - generic [aria-hidden] [ref=f3e105]: 
                      - text: Add New
                    - button "Search program list" [ref=f3e106] [cursor=pointer]:
                      - generic [aria-hidden] [ref=f3e107]: 
                    - button "Program list options" [ref=f3e108] [cursor=pointer]:
                      - generic [aria-hidden] [ref=f3e109]: 
                - list [ref=f3e110]:
                  - listitem [ref=f3e111]:
                    - button "Uncategorized Manding in Full Phrases" [ref=f3e112] [cursor=pointer]:
                      - generic [ref=f3e113]: Uncategorized
                      - generic [ref=f3e115]: Manding in Full Phrases
                  - listitem [ref=f3e116]:
                    - button "Expressive Language Labeling Objects" [ref=f3e117] [cursor=pointer]:
                      - generic [ref=f3e118]: Expressive Language
                      - generic [ref=f3e120]: Labeling Objects
                  - listitem [ref=f3e121]:
                    - button "Expressive Language Labeling Body Parts in Pictures" [ref=f3e122] [cursor=pointer]:
                      - generic [ref=f3e123]: Expressive Language
                      - generic [ref=f3e125]: Labeling Body Parts in Pictures
                  - listitem [ref=f3e126]:
                    - button "Pre-Academic Waiting for Preferred Items" [ref=f3e127] [cursor=pointer]:
                      - generic [ref=f3e128]: Pre-Academic
                      - generic [ref=f3e130]: Waiting for Preferred Items
                  - listitem [ref=f3e131]:
                    - button "Social Initiating Greetings" [ref=f3e132] [cursor=pointer]:
                      - generic [ref=f3e133]: Social
                      - generic [ref=f3e135]: Initiating Greetings
                  - listitem [ref=f3e136]:
                    - button "Uncategorized Accepting \"No\"" [ref=f3e137] [cursor=pointer]:
                      - generic [ref=f3e138]: Uncategorized
                      - generic [ref=f3e140]: Accepting "No"
                  - listitem [ref=f3e141]:
                    - 'button "Uncategorized Parent Training: Prompting Mands" [ref=f3e142] [cursor=pointer]':
                      - generic [ref=f3e143]: Uncategorized
                      - generic [ref=f3e145]: "Parent Training: Prompting Mands"
                  - listitem [ref=f3e146]:
                    - button "Uncategorized Requesting in Full Phrases" [ref=f3e147] [cursor=pointer]:
                      - generic [ref=f3e148]: Uncategorized
                      - generic [ref=f3e150]: Requesting in Full Phrases
                  - listitem [ref=f3e151]:
                    - button "Uncategorized Intraverbal Personal Questions" [ref=f3e152] [cursor=pointer]:
                      - generic [ref=f3e153]: Uncategorized
                      - generic [ref=f3e155]: Intraverbal Personal Questions
                  - listitem [ref=f3e156]:
                    - button "Uncategorized Transitioning Between Activities" [ref=f3e157] [cursor=pointer]:
                      - generic [ref=f3e158]: Uncategorized
                      - generic [ref=f3e160]: Transitioning Between Activities
                  - listitem [ref=f3e161]:
                    - button "Group Participation Following Multistep Instructions" [ref=f3e162] [cursor=pointer]:
                      - generic [ref=f3e163]: Group Participation
                      - generic [ref=f3e165]: Following Multistep Instructions
                  - listitem [ref=f3e166]:
                    - button "Uncategorized Requesting Escape" [ref=f3e167] [cursor=pointer]:
                      - generic [ref=f3e168]: Uncategorized
                      - generic [ref=f3e170]: Requesting Escape
                  - listitem [ref=f3e171]:
                    - button "Pre-Academic Imitating Block Structures" [ref=f3e172] [cursor=pointer]:
                      - generic [ref=f3e173]: Pre-Academic
                      - generic [ref=f3e175]: Imitating Block Structures
                  - listitem [ref=f3e176]:
                    - 'button "Uncategorized Washing Hands (Task Analysis) Date Last Recorded: Oct 14, 2026" [ref=f3e177] [cursor=pointer]':
                      - generic [ref=f3e178]: Uncategorized
                      - generic [ref=f3e180]: Washing Hands (Task Analysis)
                      - generic [ref=f3e181]: "Date Last Recorded: Oct 14, 2026"
                  - listitem [ref=f3e182]:
                    - button "Uncategorized Washing Hands (Task Analysis) Without Prompts" [ref=f3e183] [cursor=pointer]:
                      - generic [ref=f3e184]: Uncategorized
                      - generic [ref=f3e186]: Washing Hands (Task Analysis) Without Prompts
                  - listitem [ref=f3e187]:
                    - button "Expressive Language Making Requests by Using Word or Sound Approximations" [ref=f3e188] [cursor=pointer]:
                      - generic [ref=f3e189]: Expressive Language
                      - generic [ref=f3e191]: Making Requests by Using Word or Sound Approximations
                  - listitem [ref=f3e192]:
                    - button "Social/Emotional Requesting from Peer" [ref=f3e193] [cursor=pointer]:
                      - generic [ref=f3e194]: Social/Emotional
                      - generic [ref=f3e196]: Requesting from Peer
                  - listitem [ref=f3e197]:
                    - button "School Readiness Completing Tasks within a Time Period" [ref=f3e198] [cursor=pointer]:
                      - generic [ref=f3e199]: School Readiness
                      - generic [ref=f3e201]: Completing Tasks within a Time Period
                  - listitem [ref=f3e202]:
                    - button "Play/Leisure Taking Turns" [ref=f3e203] [cursor=pointer]:
                      - generic [ref=f3e204]: Play/Leisure
                      - generic [ref=f3e206]: Taking Turns
                  - listitem [ref=f3e207]:
                    - button "Play/Leisure Engaging in Pretend Actions" [ref=f3e208] [cursor=pointer]:
                      - generic [ref=f3e209]: Play/Leisure
                      - generic [ref=f3e211]: Engaging in Pretend Actions
                  - listitem [ref=f3e212]:
                    - button "Expressive Language Modulating Voice Volume" [ref=f3e213] [cursor=pointer]:
                      - generic [ref=f3e214]: Expressive Language
                      - generic [ref=f3e216]: Modulating Voice Volume
                  - listitem [ref=f3e217]:
                    - button "Expressive Language Labeling Function of Body Parts" [ref=f3e218] [cursor=pointer]:
                      - generic [ref=f3e219]: Expressive Language
                      - generic [ref=f3e221]: Labeling Function of Body Parts
                  - listitem [ref=f3e222]:
                    - button "Expressive Language Labeling Rooms in Pictures" [ref=f3e223] [cursor=pointer]:
                      - generic [ref=f3e224]: Expressive Language
                      - generic [ref=f3e226]: Labeling Rooms in Pictures
                  - listitem [ref=f3e227]:
                    - 'button "Uncategorized Requesting preferred items Date Last Recorded: Oct 20, 2026" [ref=f3e228] [cursor=pointer]':
                      - generic [ref=f3e229]: Uncategorized
                      - generic [ref=f3e231]: Requesting preferred items
                      - generic [ref=f3e232]: "Date Last Recorded: Oct 20, 2026"
                  - listitem [ref=f3e233]:
                    - 'button "Uncategorized Following one-step instructions Date Last Recorded: Oct 1, 2026" [ref=f3e234] [cursor=pointer]':
                      - generic [ref=f3e235]: Uncategorized
                      - generic [ref=f3e237]: Following one-step instructions
                      - generic [ref=f3e238]: "Date Last Recorded: Oct 1, 2026"
                  - listitem [ref=f3e239]:
                    - 'button "Uncategorized Matching identical pictures Date Last Recorded: Oct 1, 2026" [ref=f3e240] [cursor=pointer]':
                      - generic [ref=f3e241]: Uncategorized
                      - generic [ref=f3e243]: Matching identical pictures
                      - generic [ref=f3e244]: "Date Last Recorded: Oct 1, 2026"
                  - listitem [ref=f3e245]:
                    - 'button "Uncategorized Imitating gross motor actions Date Last Recorded: Oct 1, 2026" [ref=f3e246] [cursor=pointer]':
                      - generic [ref=f3e247]: Uncategorized
                      - generic [ref=f3e249]: Imitating gross motor actions
                      - generic [ref=f3e250]: "Date Last Recorded: Oct 1, 2026"
                  - listitem [ref=f3e251]:
                    - 'button "Uncategorized Responding to own name Date Last Recorded: Oct 1, 2026" [ref=f3e252] [cursor=pointer]':
                      - generic [ref=f3e253]: Uncategorized
                      - generic [ref=f3e255]: Responding to own name
                      - generic [ref=f3e256]: "Date Last Recorded: Oct 1, 2026"
                  - listitem [ref=f3e257]:
                    - 'button "Uncategorized Answering what and where questions Date Last Recorded: Oct 1, 2026" [ref=f3e258] [cursor=pointer]':
                      - generic [ref=f3e259]: Uncategorized
                      - generic [ref=f3e261]: Answering what and where questions
                      - generic [ref=f3e262]: "Date Last Recorded: Oct 1, 2026"
                  - listitem [ref=f3e263]:
                    - 'button "Uncategorized Taking turns in play Date Last Recorded: Oct 1, 2026" [ref=f3e264] [cursor=pointer]':
                      - generic [ref=f3e265]: Uncategorized
                      - generic [ref=f3e267]: Taking turns in play
                      - generic [ref=f3e268]: "Date Last Recorded: Oct 1, 2026"
                  - listitem [ref=f3e269]:
                    - 'button "Uncategorized Labeling emotions Date Last Recorded: Oct 1, 2026" [ref=f3e270] [cursor=pointer]':
                      - generic [ref=f3e271]: Uncategorized
                      - generic [ref=f3e273]: Labeling emotions
                      - generic [ref=f3e274]: "Date Last Recorded: Oct 1, 2026"
                  - listitem [ref=f3e275]:
                    - 'button "Uncategorized Washing hands independently Date Last Recorded: Oct 1, 2026" [ref=f3e276] [cursor=pointer]':
                      - generic [ref=f3e277]: Uncategorized
                      - generic [ref=f3e279]: Washing hands independently
                      - generic [ref=f3e280]: "Date Last Recorded: Oct 1, 2026"
                  - listitem [ref=f3e281]:
                    - button "Uncategorized Labeling common objects" [ref=f3e282] [cursor=pointer]:
                      - generic [ref=f3e283]: Uncategorized
                      - generic [ref=f3e285]: Labeling common objects
                  - listitem [ref=f3e286]:
                    - button "Social Communication test 14" [ref=f3e287] [cursor=pointer]:
                      - generic [ref=f3e288]: Social Communication
                      - generic [ref=f3e290]: test 14
                  - listitem [ref=f3e291]:
                    - button "School Readiness E2E-2610201443-7vw1 Opportunity Based Program" [ref=f3e292] [cursor=pointer]:
                      - generic [ref=f3e293]: School Readiness
                      - generic [ref=f3e295]: E2E-2610201443-7vw1 Opportunity Based Program
            - main [ref=f3e296]:
              - generic [ref=f3e298]:
                - generic [ref=f3e299]:
                  - generic [ref=f3e300]:
                    - heading "E2E-2610201443-7vw1 Opportunity Based Program" [level=2] [ref=f3e302]
                    - generic [ref=f3e303]:
                      - button "Edit this program" [ref=f3e304] [cursor=pointer]:
                        - generic [aria-hidden] [ref=f3e305]: 
                      - button "Add a target to this program" [ref=f3e306] [cursor=pointer]:
                        - generic [aria-hidden] [ref=f3e307]: 
                      - button "Print Skills Plan" [ref=f3e308] [cursor=pointer]:
                        - generic [aria-hidden] [ref=f3e309]: 
                      - button "Program actions" [active] [ref=f3e310] [cursor=pointer]:
                        - generic [aria-hidden] [ref=f3e311]: 
                  - navigation [ref=f3e312]:
                    - button "Program Details" [pressed] [ref=f3e313] [cursor=pointer]
                    - button "Lesson Information" [ref=f3e314] [cursor=pointer]
                    - button "Data" [ref=f3e315] [cursor=pointer]
                  - generic [ref=f3e316]:
                    - generic [ref=f3e317]:
                      - generic [ref=f3e318]:
                        - heading "Goals and Objectives" [level=3] [ref=f3e319]
                        - paragraph [ref=f3e320]: Client will respond to the instruction independently in 80% of opportunities across 3 sessions.
                      - button "Edit" [ref=f3e321] [cursor=pointer]:
                        - generic [aria-hidden] [ref=f3e322]: 
                    - generic [ref=f3e325]:
                      - article [ref=f3e326]:
                        - generic [ref=f3e327]:
                          - generic [ref=f3e328]:
                            - heading "Objective 1" [level=4] [ref=f3e329]
                            - text: 3 Targets
                          - generic [ref=f3e330]: Not Started
                        - paragraph [ref=f3e331]: Responds within 5 seconds
                      - article [ref=f3e332]:
                        - generic [ref=f3e333]:
                          - generic [ref=f3e334]:
                            - heading "Objective 2" [level=4] [ref=f3e335]
                            - text: 0 Targets
                          - generic [ref=f3e336]: Not Started
                        - paragraph [ref=f3e337]: Responds across 2 settings
                  - generic [ref=f3e338]:
                    - generic [ref=f3e339]:
                      - generic [ref=f3e340]:
                        - heading "Data Settings" [level=3] [ref=f3e341]
                        - paragraph [ref=f3e342]: Collection preferences, mastery rules, and maintenance behavior.
                      - button "Manage Data Collection" [ref=f3e343] [cursor=pointer]:
                        - generic [aria-hidden] [ref=f3e344]: 
                    - article [ref=f3e346]:
                      - generic [ref=f3e347]:
                        - strong [ref=f3e348]: Opportunity Based
                        - text: 1 optional dimension
                    - table [ref=f3e349]:
                      - rowgroup [ref=f3e350]:
                        - row [ref=f3e351]:
                          - rowheader "Baseline" [ref=f3e352]
                          - cell "at least 80% with at least 5 trials across 3 consecutive sessions" [ref=f3e353]
                        - row [ref=f3e354]:
                          - rowheader "Mastery criteria" [ref=f3e355]
                          - cell "at least 80% with at least 5 trials across 3 consecutive sessions" [ref=f3e356]
                        - row [ref=f3e357]:
                          - rowheader "Mastery decided by" [ref=f3e358]
                          - cell "Rules-based — require BCBA confirmation" [ref=f3e359]
                        - row [ref=f3e360]:
                          - rowheader "Generalization" [ref=f3e361]
                          - cell "Off" [ref=f3e362]
                        - row [ref=f3e363]:
                          - rowheader "Maintenance" [ref=f3e364]
                          - cell "On" [ref=f3e365]
                        - row [ref=f3e366]:
                          - rowheader "Maintenance schedule" [ref=f3e367]
                          - cell "Biweekly" [ref=f3e368]
                        - row [ref=f3e369]:
                          - rowheader "Maintenance criteria" [ref=f3e370]
                          - cell "Same as mastery criteria" [ref=f3e371]
                  - generic [ref=f3e372]:
                    - generic [ref=f3e373]:
                      - generic [ref=f3e374]:
                        - heading "Targets" [level=3] [ref=f3e375]
                        - paragraph [ref=f3e376]: Track active targets, teaching status, and mastery dates.
                      - button "Manage Targets" [ref=f3e377] [cursor=pointer]:
                        - generic [aria-hidden] [ref=f3e378]: 
                    - table "Targets" [ref=f3e381]:
                      - row [ref=f3e382]:
                        - columnheader "Target" [ref=f3e383]
                        - columnheader "Objective" [ref=f3e384]
                        - columnheader "Group" [ref=f3e385]
                        - columnheader "Status" [ref=f3e386]
                        - columnheader "Phase" [ref=f3e387]
                        - columnheader "Date Opened" [ref=f3e388]
                        - columnheader "Date Mastered" [ref=f3e389]
                        - columnheader "Action" [ref=f3e390]
                      - row [ref=f3e391]:
                        - cell "Touch nose" [ref=f3e392]
                        - cell "Objective 1" [ref=f3e393]
                        - cell "—" [ref=f3e394]
                        - cell [ref=f3e395]:
                          - text: Not Started
                          - button "Status changed Oct 20, 2026 by Unknown. Show status history for Touch nose" [ref=f3e397] [cursor=pointer]:
                            - generic [ref=f3e398]: Changed Oct 20, 2026
                            - generic [ref=f3e399]: by Unknown
                        - cell "Maintenance" [ref=f3e400]
                        - cell "Oct 20, 2026" [ref=f3e401]
                        - cell "—" [ref=f3e402]
                        - cell "–" [ref=f3e403]
                      - row [ref=f3e404]:
                        - cell "Clap hands" [ref=f3e405]
                        - cell "Objective 1" [ref=f3e406]
                        - cell "—" [ref=f3e407]
                        - cell [ref=f3e408]:
                          - text: Not Started
                          - button "Status changed Oct 20, 2026 by Unknown. Show status history for Clap hands" [ref=f3e410] [cursor=pointer]:
                            - generic [ref=f3e411]: Changed Oct 20, 2026
                            - generic [ref=f3e412]: by Unknown
                        - cell "Baseline" [ref=f3e413]
                        - cell "Oct 20, 2026" [ref=f3e414]
                        - cell "—" [ref=f3e415]
                        - cell "–" [ref=f3e416]
                      - row [ref=f3e417]:
                        - cell "Stand up" [ref=f3e418]
                        - cell "Objective 1" [ref=f3e419]
                        - cell "—" [ref=f3e420]
                        - cell [ref=f3e421]:
                          - text: Not Started
                          - button "Status changed Oct 20, 2026 by Unknown. Show status history for Stand up" [ref=f3e423] [cursor=pointer]:
                            - generic [ref=f3e424]: Changed Oct 20, 2026
                            - generic [ref=f3e425]: by Unknown
                        - cell "Baseline" [ref=f3e426]
                        - cell "Oct 20, 2026" [ref=f3e427]
                        - cell "—" [ref=f3e428]
                        - cell "–" [ref=f3e429]
                  - generic [ref=f3e431]:
                    - heading "Pending mastery determinations" [level=3] [ref=f3e432]
                    - paragraph [ref=f3e433]: No mastery determinations are waiting for review.
                - generic "Delete target group"
                - generic "Delete Program"
          - generic:
            - generic "Already on Plan"
```

# Test source

```ts
  1  | import { test, expect } from '../../../src/fixtures/test';
  2  | 
  3  | test.describe("US-32 Change a target's phase and see its history", { tag: '@US-32' }, () => {
  4  |   test("TC-US32-01 Move a target from Baseline to Intervention and then Maintenance with reasons; history and the program-level phase follow", async ({ page, flows, programDetails, targets, phaseDialog, testData }) => {
  5  |     await flows.signInAs('bcba');
  6  |     await flows.openClient(testData.clients.seeded);
  7  |     let targetId = '';
  8  | 
  9  |     await test.step('BCBA: new program; its targets start in Baseline', async () => {
  10 |       await flows.createCollectionProgram('opportunity-based');
  11 |       await programDetails.manageTargetsButton.click();
  12 |       await targets.expectLoaded();
  13 |       expect(await targets.phaseOf('Touch nose')).toBe('Baseline');
  14 |       targetId = ((await (await targets.row('Touch nose')).getAttribute('data-testid')) ?? '').replace('target-manager-row-', '');
  15 |     });
  16 | 
  17 |     let initialHistory = 0;
  18 |     await test.step('Change phase dialog requires a phase and shows the history so far', async () => {
  19 |       await targets.openPhaseChange('Touch nose');
  20 |       await expect(phaseDialog.target).toHaveText('Touch nose');
  21 |       await expect(phaseDialog.blockedReason).toContainText('Choose the phase');
  22 |       await expect(phaseDialog.saveButton).toBeDisabled();
  23 |       await expect(phaseDialog.history).toBeVisible();
  24 |       initialHistory = await phaseDialog.historyItems.count();
  25 |       test.info().annotations.push({ type: 'initial history', description: (await phaseDialog.history.innerText()).replace(/\s+/g, ' ') });
  26 |     });
  27 | 
  28 |     await test.step('Record Intervention with a reason', async () => {
  29 |       await phaseDialog.changePhase('Intervention', 'E2E: baseline stable over 3 sessions');
  30 |       await expect.poll(() => targets.phaseOf('Touch nose')).toBe('Intervention');
  31 |     });
  32 | 
  33 |     await test.step('Move beyond Intervention to Maintenance; history lists both changes with reasons', async () => {
  34 |       await targets.openPhaseChange('Touch nose');
  35 |       await expect(phaseDialog.historyItems).toHaveCount(initialHistory + 1);
  36 |       await expect(phaseDialog.history).toContainText('Intervention');
  37 |       await phaseDialog.changePhase('Maintenance', 'E2E: criteria met, move to maintenance');
  38 |       await expect.poll(() => targets.phaseOf('Touch nose')).toBe('Maintenance');
  39 |       await targets.openPhaseChange('Touch nose');
  40 |       const history = (await phaseDialog.historyItems.allInnerTexts()).map((t) => t.replace(/\s+/g, ' '));
  41 |       test.info().annotations.push({ type: 'phase history', description: JSON.stringify(history) });
  42 |       expect(history).toHaveLength(initialHistory + 2);
  43 |       expect(history.join(' ')).toContain('baseline stable over 3 sessions');
  44 |       expect(history.join(' ')).toContain('move to maintenance');
> 45 |       expect.soft(history.join(' '), 'history names the user who made each change').not.toMatch(/\bUnknown\b/);
     |                                                                                         ^ Error: history names the user who made each change
  46 |       await flows.evidence('phase-history');
  47 |       await phaseDialog.cancelButton.click();
  48 |       await expect(phaseDialog.phaseSelect).toBeHidden();
  49 |     });
  50 | 
  51 |     await test.step('Program-level phase column shows the new phase after reload (NGC-60)', async () => {
  52 |       await targets.close();
  53 |       await page.reload();
  54 |       await programDetails.expectLoaded();
  55 |       const phaseCell = page.getByTestId(`program-details-target-phase-${targetId}`);
  56 |       await expect(phaseCell).toHaveText(/Maintenance/);
  57 |       await programDetails.manageTargetsButton.click();
  58 |       await targets.expectLoaded();
  59 |       expect(await targets.phaseOf('Touch nose'), 'phase persisted').toBe('Maintenance');
  60 |       await targets.cancel();
  61 |     });
  62 |   });
  63 | 
  64 |   test('TC-US32-02 Close baseline moves a target out of Baseline', async ({ page, flows, programDetails, targets, phaseDialog, testData }) => {
  65 |     await flows.signInAs('bcba');
  66 |     await flows.openClient(testData.clients.seeded);
  67 |     await flows.createCollectionProgram('opportunity-based');
  68 |     await programDetails.manageTargetsButton.click();
  69 |     await targets.expectLoaded();
  70 | 
  71 |     await test.step('Close baseline on Clap hands', async () => {
  72 |       const row = await targets.row('Clap hands');
  73 |       await row.getByTestId('phase-control-close-baseline').click();
  74 |       if (await phaseDialog.phaseSelect.isVisible({ timeout: 3_000 }).catch(() => false)) {
  75 |         test.info().annotations.push({ type: 'close baseline', description: 'opens the phase dialog' });
  76 |         await phaseDialog.changePhase('Intervention', 'E2E: close baseline');
  77 |       } else {
  78 |         const confirm = page.locator('.p-dialog:visible, .p-confirmdialog:visible').last();
  79 |         if (await confirm.isVisible({ timeout: 2_000 }).catch(() => false)) {
  80 |           test.info().annotations.push({ type: 'close baseline confirm', description: (await confirm.innerText()).replace(/\s+/g, ' ') });
  81 |           const reason = confirm.locator('textarea');
  82 |           if (await reason.isVisible().catch(() => false)) await reason.fill('E2E: close baseline');
  83 |           await confirm.getByRole('button', { name: /close baseline|confirm|record|save/i }).last().click();
  84 |         }
  85 |       }
  86 |       await expect.poll(() => targets.phaseOf('Clap hands')).not.toBe('Baseline');
  87 |       test.info().annotations.push({ type: 'phase after close baseline', description: await targets.phaseOf('Clap hands') });
  88 |     });
  89 | 
  90 |     await test.step('Other targets stay in Baseline', async () => {
  91 |       expect(await targets.phaseOf('Touch nose')).toBe('Baseline');
  92 |       await targets.close();
  93 |     });
  94 |   });
  95 | });
  96 | 
```