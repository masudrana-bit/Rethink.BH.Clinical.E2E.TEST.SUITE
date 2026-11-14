# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stories/03-target-criteria/us-07-manage-targets.spec.ts >> US-7 Manage targets / steps within a program >> TC-US07-01 Add, bulk add, rename, reorder and assign objective and group
- Location: tests/stories/03-target-criteria/us-07-manage-targets.spec.ts:7:7

# Error details

```
Error: rename + group/objective changes in one save (412 Conflict/StaleVersion on PATCH target)

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [ref=f2e3]:
  - generic [ref=f2e4]:
    - link "Back to Rethink BH (opens in new tab)" [ref=f2e6] [cursor=pointer]:
      - /url: https://rta-bh-stage-web.azurewebsites.net/Healthcare#/Main
      - generic [aria-hidden] [ref=f2e7]: 
    - generic "Rethink Clinical" [ref=f2e8]:
      - banner [ref=f2e9]:
        - heading "Rethink Clinical" [level=1] [ref=f2e13]
        - generic [ref=f2e16]:
          - generic [ref=f2e17]: Client
          - generic [ref=f2e18] [cursor=pointer]:
            - combobox "AppClient AppClient" [ref=f2e19]
            - button "dropdown trigger" [ref=f2e20]
          - generic [ref=f2e23]:
            - generic [ref=f2e24]: DOB
            - text: Oct 4, 2020
        - button "Account menu" [ref=f2e28] [cursor=pointer]:
          - generic [aria-hidden] [ref=f2e29]: DD
          - generic [ref=f2e30]:
            - generic [ref=f2e31]: *** ***
            - generic [ref=f2e32]: Role 4.
          - generic [aria-hidden] [ref=f2e33]: 
  - generic [ref=f2e34]:
    - navigation "Application navigation" [ref=f2e36]:
      - text: 
      - link "Clients" [ref=f2e37] [cursor=pointer]:
        - /url: /clients
        - generic [aria-hidden] [ref=f2e38]: 
      - generic "Staff (coming soon)" [ref=f2e40]:
        - generic [aria-hidden] [ref=f2e41]: 
        - generic [ref=f2e42]: Staff
      - generic "Supervision (coming soon)" [ref=f2e43]:
        - generic [aria-hidden] [ref=f2e44]: 
        - generic [ref=f2e45]: Supervision
      - link "Settings" [ref=f2e46] [cursor=pointer]:
        - /url: /settings
        - generic [aria-hidden] [ref=f2e47]: 
      - generic "Training (coming soon)" [ref=f2e49]:
        - generic [aria-hidden] [ref=f2e50]: 
        - generic [ref=f2e51]: Training
      - generic "Reporting (coming soon)" [ref=f2e52]:
        - generic [aria-hidden] [ref=f2e53]: 
        - generic [ref=f2e54]: Reporting
      - link "Template" [ref=f2e55] [cursor=pointer]:
        - /url: /templates
        - generic [aria-hidden] [ref=f2e56]: 
      - generic "Schedule (coming soon)" [ref=f2e58]:
        - generic [aria-hidden] [ref=f2e59]: 
        - generic [ref=f2e60]: Schedule
      - generic "Notifications (coming soon)" [ref=f2e61]:
        - generic [aria-hidden] [ref=f2e62]: 
        - generic [ref=f2e63]: Notifications
      - generic "Billing (coming soon)" [ref=f2e64]:
        - generic [aria-hidden] [ref=f2e65]: 
        - generic [ref=f2e66]: Billing
    - main [ref=f2e67]:
      - generic [ref=f2e68]:
        - navigation "Client sections" [ref=f2e70]:
          - list [ref=f2e71]:
            - listitem [ref=f2e72]:
              - link "Client Info (opens in new tab)" [ref=f2e73] [cursor=pointer]:
                - /url: https://rta-bh-stage-web.azurewebsites.net/core/clients/84614
                - text: Client Info
            - listitem [ref=f2e74]:
              - link "File Cabinet (opens in new tab)" [ref=f2e75] [cursor=pointer]:
                - /url: https://rta-bh-stage-web.azurewebsites.net/core/clients/84614/files
                - text: File Cabinet
            - listitem [ref=f2e76]:
              - link "Sessions" [ref=f2e77] [cursor=pointer]:
                - /url: /clients/84614/sessions
            - listitem [ref=f2e78]:
              - link "Skills Programs" [ref=f2e79] [cursor=pointer]:
                - /url: /clients/84614
            - listitem [ref=f2e80]:
              - link "Behavior Support" [ref=f2e81] [cursor=pointer]:
                - /url: /clients/84614/behavior-support
            - listitem [ref=f2e82]:
              - link "Analyze Data" [ref=f2e83] [cursor=pointer]:
                - /url: /clients/84614/analyze-data
            - listitem [ref=f2e84]:
              - link "Funder Reports" [ref=f2e85] [cursor=pointer]:
                - /url: /clients/84614/reports
        - generic [ref=f2e86]:
          - generic [ref=f2e87]:
            - complementary [ref=f2e89]:
              - generic [ref=f2e90]:
                - group "Program timeline" [ref=f2e91]:
                  - button "Current" [pressed] [ref=f2e92] [cursor=pointer]
                  - button "Inactive" [ref=f2e93] [cursor=pointer]
                - generic [ref=f2e94]:
                  - generic [ref=f2e95]: Domain Filter
                  - generic [ref=f2e96] [cursor=pointer]:
                    - combobox "Domain Filter" [ref=f2e97]: All domains
                    - button "dropdown trigger" [ref=f2e98]
                - generic [ref=f2e101]:
                  - heading "Program List" [level=2] [ref=f2e102]
                  - generic [ref=f2e103]:
                    - button "Add New" [ref=f2e104] [cursor=pointer]:
                      - generic [aria-hidden] [ref=f2e105]: 
                      - text: Add New
                    - button "Search program list" [ref=f2e106] [cursor=pointer]:
                      - generic [aria-hidden] [ref=f2e107]: 
                    - button "Program list options" [ref=f2e108] [cursor=pointer]:
                      - generic [aria-hidden] [ref=f2e109]: 
                - list [ref=f2e110]:
                  - listitem [ref=f2e111]:
                    - 'button "Uncategorized SK - Opportunity Based with prompts Date Last Recorded: Oct 15, 2026" [ref=f2e112] [cursor=pointer]':
                      - generic [ref=f2e113]: Uncategorized
                      - generic [ref=f2e115]: SK - Opportunity Based with prompts
                      - generic [ref=f2e116]: "Date Last Recorded: Oct 15, 2026"
                  - listitem [ref=f2e117]:
                    - 'button "Uncategorized SK - Opportunity Based without prompts Date Last Recorded: Jul 27, 2026" [ref=f2e118] [cursor=pointer]':
                      - generic [ref=f2e119]: Uncategorized
                      - generic [ref=f2e121]: SK - Opportunity Based without prompts
                      - generic [ref=f2e122]: "Date Last Recorded: Jul 27, 2026"
                  - listitem [ref=f2e123]:
                    - 'button "Uncategorized SK-Frequency Date Last Recorded: Aug 2, 2023" [ref=f2e124] [cursor=pointer]':
                      - generic [ref=f2e125]: Uncategorized
                      - generic [ref=f2e127]: SK-Frequency
                      - generic [ref=f2e128]: "Date Last Recorded: Aug 2, 2023"
                  - listitem [ref=f2e129]:
                    - 'button "Uncategorized SK-Duration Date Last Recorded: Mar 12, 2026" [ref=f2e130] [cursor=pointer]':
                      - generic [ref=f2e131]: Uncategorized
                      - generic [ref=f2e133]: SK-Duration
                      - generic [ref=f2e134]: "Date Last Recorded: Mar 12, 2026"
                  - listitem [ref=f2e135]:
                    - 'button "Uncategorized SK- Interval Partial Date Last Recorded: Oct 25, 2023" [ref=f2e136] [cursor=pointer]':
                      - generic [ref=f2e137]: Uncategorized
                      - generic [ref=f2e139]: SK- Interval Partial
                      - generic [ref=f2e140]: "Date Last Recorded: Oct 25, 2023"
                  - listitem [ref=f2e141]:
                    - 'button "Uncategorized SK- Interval Whole Date Last Recorded: Jan 22, 2025" [ref=f2e142] [cursor=pointer]':
                      - generic [ref=f2e143]: Uncategorized
                      - generic [ref=f2e145]: SK- Interval Whole
                      - generic [ref=f2e146]: "Date Last Recorded: Jan 22, 2025"
                  - listitem [ref=f2e147]:
                    - 'button "Uncategorized SK- Interval Momentary Time Sample Date Last Recorded: Nov 7, 2023" [ref=f2e148] [cursor=pointer]':
                      - generic [ref=f2e149]: Uncategorized
                      - generic [ref=f2e151]: SK- Interval Momentary Time Sample
                      - generic [ref=f2e152]: "Date Last Recorded: Nov 7, 2023"
                  - listitem [ref=f2e153]:
                    - 'button "Uncategorized SK-Task Analysis Total Task with prompts Date Last Recorded: Sep 24, 2026" [ref=f2e154] [cursor=pointer]':
                      - generic [ref=f2e155]: Uncategorized
                      - generic [ref=f2e157]: SK-Task Analysis Total Task with prompts
                      - generic [ref=f2e158]: "Date Last Recorded: Sep 24, 2026"
                  - listitem [ref=f2e159]:
                    - 'button "Uncategorized SK-Task Analysis Total Task without prompts Date Last Recorded: Sep 24, 2026" [ref=f2e160] [cursor=pointer]':
                      - generic [ref=f2e161]: Uncategorized
                      - generic [ref=f2e163]: SK-Task Analysis Total Task without prompts
                      - generic [ref=f2e164]: "Date Last Recorded: Sep 24, 2026"
                  - listitem [ref=f2e165]:
                    - 'button "Uncategorized SK-Task Analysis Backward chain without prompts Date Last Recorded: Jun 26, 2026" [ref=f2e166] [cursor=pointer]':
                      - generic [ref=f2e167]: Uncategorized
                      - generic [ref=f2e169]: SK-Task Analysis Backward chain without prompts
                      - generic [ref=f2e170]: "Date Last Recorded: Jun 26, 2026"
                  - listitem [ref=f2e171]:
                    - 'button "Uncategorized SK-Task Analysis Backward chain with prompts Date Last Recorded: Sep 9, 2026" [ref=f2e172] [cursor=pointer]':
                      - generic [ref=f2e173]: Uncategorized
                      - generic [ref=f2e175]: SK-Task Analysis Backward chain with prompts
                      - generic [ref=f2e176]: "Date Last Recorded: Sep 9, 2026"
                  - listitem [ref=f2e177]:
                    - 'button "Uncategorized SK-Task Analysis Forward chain with prompts Date Last Recorded: Sep 9, 2026" [ref=f2e178] [cursor=pointer]':
                      - generic [ref=f2e179]: Uncategorized
                      - generic [ref=f2e181]: SK-Task Analysis Forward chain with prompts
                      - generic [ref=f2e182]: "Date Last Recorded: Sep 9, 2026"
                  - listitem [ref=f2e183]:
                    - 'button "Uncategorized SK-Task Analysis Forward chain without prompts Date Last Recorded: Jun 26, 2026" [ref=f2e184] [cursor=pointer]':
                      - generic [ref=f2e185]: Uncategorized
                      - generic [ref=f2e187]: SK-Task Analysis Forward chain without prompts
                      - generic [ref=f2e188]: "Date Last Recorded: Jun 26, 2026"
                  - listitem [ref=f2e189]:
                    - button "Uncategorized Matching Identical Objects-Younger" [ref=f2e190] [cursor=pointer]:
                      - generic [ref=f2e191]: Uncategorized
                      - generic [ref=f2e193]: Matching Identical Objects-Younger
                  - listitem [ref=f2e194]:
                    - button "Uncategorized Initiating Joint Attention" [ref=f2e195] [cursor=pointer]:
                      - generic [ref=f2e196]: Uncategorized
                      - generic [ref=f2e198]: Initiating Joint Attention
                  - listitem [ref=f2e199]:
                    - button "Uncategorized Showing Objects to People" [ref=f2e200] [cursor=pointer]:
                      - generic [ref=f2e201]: Uncategorized
                      - generic [ref=f2e203]: Showing Objects to People
                  - listitem [ref=f2e204]:
                    - button "Uncategorized Giving Compliments" [ref=f2e205] [cursor=pointer]:
                      - generic [ref=f2e206]: Uncategorized
                      - generic [ref=f2e208]: Giving Compliments
                  - listitem [ref=f2e209]:
                    - button "Uncategorized Completing Seatwork Independently" [ref=f2e210] [cursor=pointer]:
                      - generic [ref=f2e211]: Uncategorized
                      - generic [ref=f2e213]: Completing Seatwork Independently
                  - listitem [ref=f2e214]:
                    - button "Uncategorized Matching Identical Pictures" [ref=f2e215] [cursor=pointer]:
                      - generic [ref=f2e216]: Uncategorized
                      - generic [ref=f2e218]: Matching Identical Pictures
                  - listitem [ref=f2e219]:
                    - button "Uncategorized Keeping Hands Appropriate while Sitting - Younger" [ref=f2e220] [cursor=pointer]:
                      - generic [ref=f2e221]: Uncategorized
                      - generic [ref=f2e223]: Keeping Hands Appropriate while Sitting - Younger
                  - listitem [ref=f2e224]:
                    - button "Uncategorized Imitating Block Structures" [ref=f2e225] [cursor=pointer]:
                      - generic [ref=f2e226]: Uncategorized
                      - generic [ref=f2e228]: Imitating Block Structures
                  - listitem [ref=f2e229]:
                    - 'button "Uncategorized Matching Letters Date Last Recorded: Aug 27, 2026" [ref=f2e230] [cursor=pointer]':
                      - generic [ref=f2e231]: Uncategorized
                      - generic [ref=f2e233]: Matching Letters
                      - generic [ref=f2e234]: "Date Last Recorded: Aug 27, 2026"
                  - listitem [ref=f2e235]:
                    - button "Uncategorized Visually Tracking a Person" [ref=f2e236] [cursor=pointer]:
                      - generic [ref=f2e237]: Uncategorized
                      - generic [ref=f2e239]: Visually Tracking a Person
                  - listitem [ref=f2e240]:
                    - button "Uncategorized Custom without objectives" [ref=f2e241] [cursor=pointer]:
                      - generic [ref=f2e242]: Uncategorized
                      - generic [ref=f2e244]: Custom without objectives
                  - listitem [ref=f2e245]:
                    - button "Uncategorized Waiting for Preferred Items" [ref=f2e246] [cursor=pointer]:
                      - generic [ref=f2e247]: Uncategorized
                      - generic [ref=f2e249]: Waiting for Preferred Items
                  - listitem [ref=f2e250]:
                    - button "Uncategorized Matching Identical Objects-Older" [ref=f2e251] [cursor=pointer]:
                      - generic [ref=f2e252]: Uncategorized
                      - generic [ref=f2e254]: Matching Identical Objects-Older
                  - listitem [ref=f2e255]:
                    - button "Uncategorized Custom Task Analysis Total with prompts" [ref=f2e256] [cursor=pointer]:
                      - generic [ref=f2e257]: Uncategorized
                      - generic [ref=f2e259]: Custom Task Analysis Total with prompts
                  - listitem [ref=f2e260]:
                    - button "Uncategorized Custom Opportunity based with prompts 2" [ref=f2e261] [cursor=pointer]:
                      - generic [ref=f2e262]: Uncategorized
                      - generic [ref=f2e264]: Custom Opportunity based with prompts 2
                  - listitem [ref=f2e265]:
                    - 'button "Uncategorized custom lesson without goal or exercise Date Last Recorded: May 22, 2024" [ref=f2e266] [cursor=pointer]':
                      - generic [ref=f2e267]: Uncategorized
                      - generic [ref=f2e269]: custom lesson without goal or exercise
                      - generic [ref=f2e270]: "Date Last Recorded: May 22, 2024"
                  - listitem [ref=f2e271]:
                    - 'button "Uncategorized Baseline - Whole Interval Date Last Recorded: Oct 15, 2026" [ref=f2e272] [cursor=pointer]':
                      - generic [ref=f2e273]: Uncategorized
                      - generic [ref=f2e275]: Baseline - Whole Interval
                      - generic [ref=f2e276]: "Date Last Recorded: Oct 15, 2026"
                  - listitem [ref=f2e277]:
                    - 'button "Uncategorized Baseline - TA with prompts Date Last Recorded: Nov 25, 2024" [ref=f2e278] [cursor=pointer]':
                      - generic [ref=f2e279]: Uncategorized
                      - generic [ref=f2e281]: Baseline - TA with prompts
                      - generic [ref=f2e282]: "Date Last Recorded: Nov 25, 2024"
                  - listitem [ref=f2e283]:
                    - 'button "Uncategorized Baseline - TA without prompts Date Last Recorded: Nov 25, 2024" [ref=f2e284] [cursor=pointer]':
                      - generic [ref=f2e285]: Uncategorized
                      - generic [ref=f2e287]: Baseline - TA without prompts
                      - generic [ref=f2e288]: "Date Last Recorded: Nov 25, 2024"
                  - listitem [ref=f2e289]:
                    - button "Uncategorized Lining Up" [ref=f2e290] [cursor=pointer]:
                      - generic [ref=f2e291]: Uncategorized
                      - generic [ref=f2e293]: Lining Up
                  - listitem [ref=f2e294]:
                    - button "Uncategorized Making Eye Contact when Name is Called from a Distance" [ref=f2e295] [cursor=pointer]:
                      - generic [ref=f2e296]: Uncategorized
                      - generic [ref=f2e298]: Making Eye Contact when Name is Called from a Distance
                  - listitem [ref=f2e299]:
                    - button "Uncategorized TA w/ no correct prompt test" [ref=f2e300] [cursor=pointer]:
                      - generic [ref=f2e301]: Uncategorized
                      - generic [ref=f2e303]: TA w/ no correct prompt test
                  - listitem [ref=f2e304]:
                    - button "Uncategorized Keeping Hands Appropriate while Standing" [ref=f2e305] [cursor=pointer]:
                      - generic [ref=f2e306]: Uncategorized
                      - generic [ref=f2e308]: Keeping Hands Appropriate while Standing
                  - listitem [ref=f2e309]:
                    - button "Uncategorized Gang is here" [ref=f2e310] [cursor=pointer]:
                      - generic [ref=f2e311]: Uncategorized
                      - generic [ref=f2e313]: Gang is here
                  - listitem [ref=f2e314]:
                    - button "Uncategorized Imitating Sounds" [ref=f2e315] [cursor=pointer]:
                      - generic [ref=f2e316]: Uncategorized
                      - generic [ref=f2e318]: Imitating Sounds
                  - listitem [ref=f2e319]:
                    - button "Uncategorized TA Forward with Prompts test" [ref=f2e320] [cursor=pointer]:
                      - generic [ref=f2e321]: Uncategorized
                      - generic [ref=f2e323]: TA Forward with Prompts test
                  - listitem [ref=f2e324]:
                    - button "Uncategorized TA Total without prompts" [ref=f2e325] [cursor=pointer]:
                      - generic [ref=f2e326]: Uncategorized
                      - generic [ref=f2e328]: TA Total without prompts
                  - listitem [ref=f2e329]:
                    - button "Uncategorized Waiting to Begin an Activity" [ref=f2e330] [cursor=pointer]:
                      - generic [ref=f2e331]: Uncategorized
                      - generic [ref=f2e333]: Waiting to Begin an Activity
                  - listitem [ref=f2e334]:
                    - button "Uncategorized Many Targets 1" [ref=f2e335] [cursor=pointer]:
                      - generic [ref=f2e336]: Uncategorized
                      - generic [ref=f2e338]: Many Targets 1
                  - listitem [ref=f2e339]:
                    - button "Uncategorized Many targets 2" [ref=f2e340] [cursor=pointer]:
                      - generic [ref=f2e341]: Uncategorized
                      - generic [ref=f2e343]: Many targets 2
                  - listitem [ref=f2e344]:
                    - button "Uncategorized Many targets with prompts" [ref=f2e345] [cursor=pointer]:
                      - generic [ref=f2e346]: Uncategorized
                      - generic [ref=f2e348]: Many targets with prompts
                  - listitem [ref=f2e349]:
                    - button "Uncategorized Imitating Sounds & Words" [ref=f2e350] [cursor=pointer]:
                      - generic [ref=f2e351]: Uncategorized
                      - generic [ref=f2e353]: Imitating Sounds & Words
                  - listitem [ref=f2e354]:
                    - button "Uncategorized Imitating Fine Motor Movements" [ref=f2e355] [cursor=pointer]:
                      - generic [ref=f2e356]: Uncategorized
                      - generic [ref=f2e358]: Imitating Fine Motor Movements
                  - listitem [ref=f2e359]:
                    - button "Uncategorized Bold Italics Underlined Exercise Details" [ref=f2e360] [cursor=pointer]:
                      - generic [ref=f2e361]: Uncategorized
                      - generic [ref=f2e363]: Bold Italics Underlined Exercise Details
                  - listitem [ref=f2e364]:
                    - button "Uncategorized Brushing Teeth" [ref=f2e365] [cursor=pointer]:
                      - generic [ref=f2e366]: Uncategorized
                      - generic [ref=f2e368]: Brushing Teeth
                  - listitem [ref=f2e369]:
                    - 'button "Uncategorized Tying Shoes Date Last Recorded: Oct 15, 2024" [ref=f2e370] [cursor=pointer]':
                      - generic [ref=f2e371]: Uncategorized
                      - generic [ref=f2e373]: Tying Shoes
                      - generic [ref=f2e374]: "Date Last Recorded: Oct 15, 2024"
                  - listitem [ref=f2e375]:
                    - button "Uncategorized Completing a Pattern" [ref=f2e376] [cursor=pointer]:
                      - generic [ref=f2e377]: Uncategorized
                      - generic [ref=f2e379]: Completing a Pattern
                  - listitem [ref=f2e380]:
                    - button "Uncategorized Frequency Check" [ref=f2e381] [cursor=pointer]:
                      - generic [ref=f2e382]: Uncategorized
                      - generic [ref=f2e384]: Frequency Check
                  - listitem [ref=f2e385]:
                    - 'button "Uncategorized Baseline - Opp Based Date Last Recorded: Jul 1, 2026" [ref=f2e386] [cursor=pointer]':
                      - generic [ref=f2e387]: Uncategorized
                      - generic [ref=f2e389]: Baseline - Opp Based
                      - generic [ref=f2e390]: "Date Last Recorded: Jul 1, 2026"
                  - listitem [ref=f2e391]:
                    - button "Uncategorized Srikant Custom Program April 7 Updated by Dec20Staff adklfakld1" [ref=f2e392] [cursor=pointer]:
                      - generic [ref=f2e393]: Uncategorized
                      - generic [ref=f2e395]: Srikant Custom Program April 7 Updated by Dec20Staff adklfakld1
                  - listitem [ref=f2e396]:
                    - button "Uncategorized TA Intervention Check App" [ref=f2e397] [cursor=pointer]:
                      - generic [ref=f2e398]: Uncategorized
                      - generic [ref=f2e400]: TA Intervention Check App
                  - listitem [ref=f2e401]:
                    - 'button "Uncategorized Imitating Sequenced Actions with Objects - renamed again Date Last Recorded: Oct 15, 2026" [ref=f2e402] [cursor=pointer]':
                      - generic [ref=f2e403]: Uncategorized
                      - generic [ref=f2e405]: Imitating Sequenced Actions with Objects - renamed again
                      - generic [ref=f2e406]: "Date Last Recorded: Oct 15, 2026"
                  - listitem [ref=f2e407]:
                    - 'button "Uncategorized Duplicate Imitated Sequenced Actions with objects renamed Date Last Recorded: Oct 15, 2026" [ref=f2e408] [cursor=pointer]':
                      - generic [ref=f2e409]: Uncategorized
                      - generic [ref=f2e411]: Duplicate Imitated Sequenced Actions with objects renamed
                      - generic [ref=f2e412]: "Date Last Recorded: Oct 15, 2026"
                  - listitem [ref=f2e413]:
                    - 'button "Uncategorized Imitating Sequenced Actions with Objects - renamed again_V2 Date Last Recorded: Jul 2, 2019" [ref=f2e414] [cursor=pointer]':
                      - generic [ref=f2e415]: Uncategorized
                      - generic [ref=f2e417]: Imitating Sequenced Actions with Objects - renamed again_V2
                      - generic [ref=f2e418]: "Date Last Recorded: Jul 2, 2019"
                  - listitem [ref=f2e419]:
                    - 'button "Uncategorized Probe Mastery Opp with prompts Date Last Recorded: May 23, 2024" [ref=f2e420] [cursor=pointer]':
                      - generic [ref=f2e421]: Uncategorized
                      - generic [ref=f2e423]: Probe Mastery Opp with prompts
                      - generic [ref=f2e424]: "Date Last Recorded: May 23, 2024"
                  - listitem [ref=f2e425]:
                    - 'button "Uncategorized Probe Mastery Opp without prompts Date Last Recorded: May 23, 2024" [ref=f2e426] [cursor=pointer]':
                      - generic [ref=f2e427]: Uncategorized
                      - generic [ref=f2e429]: Probe Mastery Opp without prompts
                      - generic [ref=f2e430]: "Date Last Recorded: May 23, 2024"
                  - listitem [ref=f2e431]:
                    - 'button "Uncategorized TA Data Check Date Last Recorded: Sep 18, 2024" [ref=f2e432] [cursor=pointer]':
                      - generic [ref=f2e433]: Uncategorized
                      - generic [ref=f2e435]: TA Data Check
                      - generic [ref=f2e436]: "Date Last Recorded: Sep 18, 2024"
                  - listitem [ref=f2e437]:
                    - 'button "Uncategorized SK- Interval Momentary Time Sample_V2 Date Last Recorded: Jan 22, 2025" [ref=f2e438] [cursor=pointer]':
                      - generic [ref=f2e439]: Uncategorized
                      - generic [ref=f2e441]: SK- Interval Momentary Time Sample_V2
                      - generic [ref=f2e442]: "Date Last Recorded: Jan 22, 2025"
                  - listitem [ref=f2e443]:
                    - 'button "Uncategorized TA STep order Check Date Last Recorded: Feb 27, 2024" [ref=f2e444] [cursor=pointer]':
                      - generic [ref=f2e445]: Uncategorized
                      - generic [ref=f2e447]: TA STep order Check
                      - generic [ref=f2e448]: "Date Last Recorded: Feb 27, 2024"
                  - listitem [ref=f2e449]:
                    - button "Uncategorized Custom May 10 updated again" [ref=f2e450] [cursor=pointer]:
                      - generic [ref=f2e451]: Uncategorized
                      - generic [ref=f2e453]: Custom May 10 updated again
                  - listitem [ref=f2e454]:
                    - 'button "Uncategorized Matching Words to Objects Date Last Recorded: Jun 6, 2026" [ref=f2e455] [cursor=pointer]':
                      - generic [ref=f2e456]: Uncategorized
                      - generic [ref=f2e458]: Matching Words to Objects
                      - generic [ref=f2e459]: "Date Last Recorded: Jun 6, 2026"
                  - listitem [ref=f2e460]:
                    - button "Uncategorized Total Task with prompts - Teli Natsis" [ref=f2e461] [cursor=pointer]:
                      - generic [ref=f2e462]: Uncategorized
                      - generic [ref=f2e464]: Total Task with prompts - Teli Natsis
                  - listitem [ref=f2e465]:
                    - button "Uncategorized Matching Identical Objects-Older1" [ref=f2e466] [cursor=pointer]:
                      - generic [ref=f2e467]: Uncategorized
                      - generic [ref=f2e469]: Matching Identical Objects-Older1
                  - listitem [ref=f2e470]:
                    - button "Uncategorized Maint-Task Analysis Forward chain without prompts" [ref=f2e471] [cursor=pointer]:
                      - generic [ref=f2e472]: Uncategorized
                      - generic [ref=f2e474]: Maint-Task Analysis Forward chain without prompts
                  - listitem [ref=f2e475]:
                    - button "Uncategorized Maint-Task Analysis Backward chain with prompts" [ref=f2e476] [cursor=pointer]:
                      - generic [ref=f2e477]: Uncategorized
                      - generic [ref=f2e479]: Maint-Task Analysis Backward chain with prompts
                  - listitem [ref=f2e480]:
                    - button "Uncategorized Maint-Task Analysis Total Task without prompts" [ref=f2e481] [cursor=pointer]:
                      - generic [ref=f2e482]: Uncategorized
                      - generic [ref=f2e484]: Maint-Task Analysis Total Task without prompts
                  - listitem [ref=f2e485]:
                    - 'button "Uncategorized Matching Categories Date Last Recorded: Sep 22, 2026" [ref=f2e486] [cursor=pointer]':
                      - generic [ref=f2e487]: Uncategorized
                      - generic [ref=f2e489]: Matching Categories
                      - generic [ref=f2e490]: "Date Last Recorded: Sep 22, 2026"
                  - listitem [ref=f2e491]:
                    - button "Uncategorized Matching Categories_V2test" [ref=f2e492] [cursor=pointer]:
                      - generic [ref=f2e493]: Uncategorized
                      - generic [ref=f2e495]: Matching Categories_V2test
                  - listitem [ref=f2e496]:
                    - button "Uncategorized Making Requests By Giving a Picture Card" [ref=f2e497] [cursor=pointer]:
                      - generic [ref=f2e498]: Uncategorized
                      - generic [ref=f2e500]: Making Requests By Giving a Picture Card
                  - listitem [ref=f2e501]:
                    - 'button "Uncategorized Keeping Hands Appropriate while Sitting - Younger_V2 Date Last Recorded: Feb 19, 2025" [ref=f2e502] [cursor=pointer]':
                      - generic [ref=f2e503]: Uncategorized
                      - generic [ref=f2e505]: Keeping Hands Appropriate while Sitting - Younger_V2
                      - generic [ref=f2e506]: "Date Last Recorded: Feb 19, 2025"
                  - listitem [ref=f2e507]:
                    - 'button "Uncategorized Saying “I don’t understand”_V2 Date Last Recorded: Sep 22, 2026" [ref=f2e508] [cursor=pointer]':
                      - generic [ref=f2e509]: Uncategorized
                      - generic [ref=f2e511]: Saying “I don’t understand”_V2
                      - generic [ref=f2e512]: "Date Last Recorded: Sep 22, 2026"
                  - listitem [ref=f2e513]:
                    - 'button "Uncategorized Saying “I don’t understand”_V4 Date Last Recorded: Oct 15, 2026" [ref=f2e514] [cursor=pointer]':
                      - generic [ref=f2e515]: Uncategorized
                      - generic [ref=f2e517]: Saying “I don’t understand”_V4
                      - generic [ref=f2e518]: "Date Last Recorded: Oct 15, 2026"
                  - listitem [ref=f2e519]:
                    - 'button "Uncategorized Baseline to Teaching - Frequency Date Last Recorded: Dec 4, 2023" [ref=f2e520] [cursor=pointer]':
                      - generic [ref=f2e521]: Uncategorized
                      - generic [ref=f2e523]: Baseline to Teaching - Frequency
                      - generic [ref=f2e524]: "Date Last Recorded: Dec 4, 2023"
                  - listitem [ref=f2e525]:
                    - 'button "Uncategorized Saying “I don’t understand” Date Last Recorded: Jul 15, 2026" [ref=f2e526] [cursor=pointer]':
                      - generic [ref=f2e527]: Uncategorized
                      - generic [ref=f2e529]: Saying “I don’t understand”
                      - generic [ref=f2e530]: "Date Last Recorded: Jul 15, 2026"
                  - listitem [ref=f2e531]:
                    - 'button "Uncategorized Asking for Clarification Date Last Recorded: Jan 16, 2026" [ref=f2e532] [cursor=pointer]':
                      - generic [ref=f2e533]: Uncategorized
                      - generic [ref=f2e535]: Asking for Clarification
                      - generic [ref=f2e536]: "Date Last Recorded: Jan 16, 2026"
                  - listitem [ref=f2e537]:
                    - 'button "Uncategorized Raising Hand to Ask for Help Date Last Recorded: Jan 16, 2026" [ref=f2e538] [cursor=pointer]':
                      - generic [ref=f2e539]: Uncategorized
                      - generic [ref=f2e541]: Raising Hand to Ask for Help
                      - generic [ref=f2e542]: "Date Last Recorded: Jan 16, 2026"
                  - listitem [ref=f2e543]:
                    - 'button "Uncategorized Saying “I don’t understand”_V3 Date Last Recorded: Sep 9, 2026" [ref=f2e544] [cursor=pointer]':
                      - generic [ref=f2e545]: Uncategorized
                      - generic [ref=f2e547]: Saying “I don’t understand”_V3
                      - generic [ref=f2e548]: "Date Last Recorded: Sep 9, 2026"
                  - listitem [ref=f2e549]:
                    - 'button "Uncategorized SK-Task Analysis Forward chain without prompts_V3 Date Last Recorded: Feb 20, 2025" [ref=f2e550] [cursor=pointer]':
                      - generic [ref=f2e551]: Uncategorized
                      - generic [ref=f2e553]: SK-Task Analysis Forward chain without prompts_V3
                      - generic [ref=f2e554]: "Date Last Recorded: Feb 20, 2025"
                  - listitem [ref=f2e555]:
                    - 'button "Uncategorized SK-Task Analysis Forward chain with prompts_V2 Date Last Recorded: Jul 27, 2026" [ref=f2e556] [cursor=pointer]':
                      - generic [ref=f2e557]: Uncategorized
                      - generic [ref=f2e559]: SK-Task Analysis Forward chain with prompts_V2
                      - generic [ref=f2e560]: "Date Last Recorded: Jul 27, 2026"
                  - listitem [ref=f2e561]:
                    - 'button "Uncategorized Baseline to Teaching - Frequency_V2 Date Last Recorded: Dec 4, 2024" [ref=f2e562] [cursor=pointer]':
                      - generic [ref=f2e563]: Uncategorized
                      - generic [ref=f2e565]: Baseline to Teaching - Frequency_V2
                      - generic [ref=f2e566]: "Date Last Recorded: Dec 4, 2024"
                  - listitem [ref=f2e567]:
                    - 'button "Uncategorized SK - Opportunity Based without prompts_V2 Date Last Recorded: Sep 5, 2024" [ref=f2e568] [cursor=pointer]':
                      - generic [ref=f2e569]: Uncategorized
                      - generic [ref=f2e571]: SK - Opportunity Based without prompts_V2
                      - generic [ref=f2e572]: "Date Last Recorded: Sep 5, 2024"
                  - listitem [ref=f2e573]:
                    - button "Uncategorized SK-Task Analysis Forward chain without prompts_V4" [ref=f2e574] [cursor=pointer]:
                      - generic [ref=f2e575]: Uncategorized
                      - generic [ref=f2e577]: SK-Task Analysis Forward chain without prompts_V4
                  - listitem [ref=f2e578]:
                    - 'button "Uncategorized Momentary Timer - 30 seconds Date Last Recorded: May 13, 2026" [ref=f2e579] [cursor=pointer]':
                      - generic [ref=f2e580]: Uncategorized
                      - generic [ref=f2e582]: Momentary Timer - 30 seconds
                      - generic [ref=f2e583]: "Date Last Recorded: May 13, 2026"
                  - listitem [ref=f2e584]:
                    - 'button "Uncategorized Matching Non-Identical Objects Date Last Recorded: Sep 22, 2026" [ref=f2e585] [cursor=pointer]':
                      - generic [ref=f2e586]: Uncategorized
                      - generic [ref=f2e588]: Matching Non-Identical Objects
                      - generic [ref=f2e589]: "Date Last Recorded: Sep 22, 2026"
                  - listitem [ref=f2e590]:
                    - 'button "Uncategorized Master all objectives, leave target in maint Date Last Recorded: Sep 30, 2024" [ref=f2e591] [cursor=pointer]':
                      - generic [ref=f2e592]: Uncategorized
                      - generic [ref=f2e594]: Master all objectives, leave target in maint
                      - generic [ref=f2e595]: "Date Last Recorded: Sep 30, 2024"
                  - listitem [ref=f2e596]:
                    - 'button "Uncategorized SK-Task Analysis Forward chain with prompts_V3 Date Last Recorded: May 2, 2025" [ref=f2e597] [cursor=pointer]':
                      - generic [ref=f2e598]: Uncategorized
                      - generic [ref=f2e600]: SK-Task Analysis Forward chain with prompts_V3
                      - generic [ref=f2e601]: "Date Last Recorded: May 2, 2025"
                  - listitem [ref=f2e602]:
                    - 'button "Uncategorized BL Criteria - Opp Based Date Last Recorded: Oct 15, 2026" [ref=f2e603] [cursor=pointer]':
                      - generic [ref=f2e604]: Uncategorized
                      - generic [ref=f2e606]: BL Criteria - Opp Based
                      - generic [ref=f2e607]: "Date Last Recorded: Oct 15, 2026"
                  - listitem [ref=f2e608]:
                    - button "Uncategorized Backward TA check active steps" [ref=f2e609] [cursor=pointer]:
                      - generic [ref=f2e610]: Uncategorized
                      - generic [ref=f2e612]: Backward TA check active steps
                  - listitem [ref=f2e613]:
                    - button "Uncategorized Forward TA check active steps" [ref=f2e614] [cursor=pointer]:
                      - generic [ref=f2e615]: Uncategorized
                      - generic [ref=f2e617]: Forward TA check active steps
                  - listitem [ref=f2e618]:
                    - 'button "Uncategorized automastery - opp based with prompts, autofade OFF Date Last Recorded: Apr 11, 2025" [ref=f2e619] [cursor=pointer]':
                      - generic [ref=f2e620]: Uncategorized
                      - generic [ref=f2e622]: automastery - opp based with prompts, autofade OFF
                      - generic [ref=f2e623]: "Date Last Recorded: Apr 11, 2025"
                  - listitem [ref=f2e624]:
                    - 'button "Uncategorized Saying “I don’t understand”_V5 Date Last Recorded: May 26, 2026" [ref=f2e625] [cursor=pointer]':
                      - generic [ref=f2e626]: Uncategorized
                      - generic [ref=f2e628]: Saying “I don’t understand”_V5
                      - generic [ref=f2e629]: "Date Last Recorded: May 26, 2026"
                  - listitem [ref=f2e630]:
                    - 'button "Uncategorized only goals Date Last Recorded: Jul 17, 2026" [ref=f2e631] [cursor=pointer]':
                      - generic [ref=f2e632]: Uncategorized
                      - generic [ref=f2e634]: only goals
                      - generic [ref=f2e635]: "Date Last Recorded: Jul 17, 2026"
                  - listitem [ref=f2e636]:
                    - 'button "Uncategorized baseline - frequency new Date Last Recorded: Oct 15, 2026" [ref=f2e637] [cursor=pointer]':
                      - generic [ref=f2e638]: Uncategorized
                      - generic [ref=f2e640]: baseline - frequency new
                      - generic [ref=f2e641]: "Date Last Recorded: Oct 15, 2026"
                  - listitem [ref=f2e642]:
                    - 'button "Uncategorized Duration Date Last Recorded: Aug 27, 2026" [ref=f2e643] [cursor=pointer]':
                      - generic [ref=f2e644]: Uncategorized
                      - generic [ref=f2e646]: Duration
                      - generic [ref=f2e647]: "Date Last Recorded: Aug 27, 2026"
                  - listitem [ref=f2e648]:
                    - button "Uncategorized SK - Opportunity Based without prompts_V8" [ref=f2e649] [cursor=pointer]:
                      - generic [ref=f2e650]: Uncategorized
                      - generic [ref=f2e652]: SK - Opportunity Based without prompts_V8
                  - listitem [ref=f2e653]:
                    - 'button "Uncategorized Matching Identical Objects-Younger3 Date Last Recorded: Dec 26, 2025" [ref=f2e654] [cursor=pointer]':
                      - generic [ref=f2e655]: Uncategorized
                      - generic [ref=f2e657]: Matching Identical Objects-Younger3
                      - generic [ref=f2e658]: "Date Last Recorded: Dec 26, 2025"
                  - listitem [ref=f2e659]:
                    - 'button "Uncategorized testing Date Last Recorded: Jun 18, 2026" [ref=f2e660] [cursor=pointer]':
                      - generic [ref=f2e661]: Uncategorized
                      - generic [ref=f2e663]: testing
                      - generic [ref=f2e664]: "Date Last Recorded: Jun 18, 2026"
                  - listitem [ref=f2e665]:
                    - 'button "Uncategorized Mark - Duration Date Last Recorded: Oct 15, 2026" [ref=f2e666] [cursor=pointer]':
                      - generic [ref=f2e667]: Uncategorized
                      - generic [ref=f2e669]: Mark - Duration
                      - generic [ref=f2e670]: "Date Last Recorded: Oct 15, 2026"
                  - listitem [ref=f2e671]:
                    - 'button "Uncategorized Mark - Whole Interval Date Last Recorded: Sep 18, 2026" [ref=f2e672] [cursor=pointer]':
                      - generic [ref=f2e673]: Uncategorized
                      - generic [ref=f2e675]: Mark - Whole Interval
                      - generic [ref=f2e676]: "Date Last Recorded: Sep 18, 2026"
                  - listitem [ref=f2e677]:
                    - 'button "Uncategorized Mark - Partial Interval Date Last Recorded: Aug 11, 2026" [ref=f2e678] [cursor=pointer]':
                      - generic [ref=f2e679]: Uncategorized
                      - generic [ref=f2e681]: Mark - Partial Interval
                      - generic [ref=f2e682]: "Date Last Recorded: Aug 11, 2026"
                  - listitem [ref=f2e683]:
                    - 'button "Uncategorized Mark - Momentary Interval Date Last Recorded: Jun 1, 2026" [ref=f2e684] [cursor=pointer]':
                      - generic [ref=f2e685]: Uncategorized
                      - generic [ref=f2e687]: Mark - Momentary Interval
                      - generic [ref=f2e688]: "Date Last Recorded: Jun 1, 2026"
                  - listitem [ref=f2e689]:
                    - 'button "Uncategorized baseline - TA check Date Last Recorded: Sep 22, 2026" [ref=f2e690] [cursor=pointer]':
                      - generic [ref=f2e691]: Uncategorized
                      - generic [ref=f2e693]: baseline - TA check
                      - generic [ref=f2e694]: "Date Last Recorded: Sep 22, 2026"
                  - listitem [ref=f2e695]:
                    - 'button "Uncategorized autoswitch on and automastery on, goals & obj Date Last Recorded: Oct 15, 2026" [ref=f2e696] [cursor=pointer]':
                      - generic [ref=f2e697]: Uncategorized
                      - generic [ref=f2e699]: autoswitch on and automastery on, goals & obj
                      - generic [ref=f2e700]: "Date Last Recorded: Oct 15, 2026"
                  - listitem [ref=f2e701]:
                    - button "Uncategorized SK-Task Analysis Forward chain with prompts_V4" [ref=f2e702] [cursor=pointer]:
                      - generic [ref=f2e703]: Uncategorized
                      - generic [ref=f2e705]: SK-Task Analysis Forward chain with prompts_V4
                  - listitem [ref=f2e706]:
                    - button "Uncategorized SK-Task Analysis Forward chain with prompts_V5" [ref=f2e707] [cursor=pointer]:
                      - generic [ref=f2e708]: Uncategorized
                      - generic [ref=f2e710]: SK-Task Analysis Forward chain with prompts_V5
                  - listitem [ref=f2e711]:
                    - button "Uncategorized SK-Task Analysis Forward chain with prompts_Test" [ref=f2e712] [cursor=pointer]:
                      - generic [ref=f2e713]: Uncategorized
                      - generic [ref=f2e715]: SK-Task Analysis Forward chain with prompts_Test
                  - listitem [ref=f2e716]:
                    - button "Uncategorized SK-Task Analysis Forward chain with prompts_V7" [ref=f2e717] [cursor=pointer]:
                      - generic [ref=f2e718]: Uncategorized
                      - generic [ref=f2e720]: SK-Task Analysis Forward chain with prompts_V7
                  - listitem [ref=f2e721]:
                    - button "Uncategorized SK-Task Analysis Forward chain with prompts_V8" [ref=f2e722] [cursor=pointer]:
                      - generic [ref=f2e723]: Uncategorized
                      - generic [ref=f2e725]: SK-Task Analysis Forward chain with prompts_V8
                  - listitem [ref=f2e726]:
                    - 'button "Uncategorized autoswitch on and automastery on, goals & obj_V2 Date Last Recorded: Oct 15, 2026" [ref=f2e727] [cursor=pointer]':
                      - generic [ref=f2e728]: Uncategorized
                      - generic [ref=f2e730]: autoswitch on and automastery on, goals & obj_V2
                      - generic [ref=f2e731]: "Date Last Recorded: Oct 15, 2026"
                  - listitem [ref=f2e732]:
                    - button "Uncategorized Baseline - TA with prompts_V2" [ref=f2e733] [cursor=pointer]:
                      - generic [ref=f2e734]: Uncategorized
                      - generic [ref=f2e736]: Baseline - TA with prompts_V2
                  - listitem [ref=f2e737]:
                    - 'button "Uncategorized Praveen - F Chain TA with prompts Date Last Recorded: Sep 14, 2026" [ref=f2e738] [cursor=pointer]':
                      - generic [ref=f2e739]: Uncategorized
                      - generic [ref=f2e741]: Praveen - F Chain TA with prompts
                      - generic [ref=f2e742]: "Date Last Recorded: Sep 14, 2026"
                  - listitem [ref=f2e743]:
                    - 'button "Uncategorized Praveen - B Chain TA with prompts Date Last Recorded: Sep 22, 2026" [ref=f2e744] [cursor=pointer]':
                      - generic [ref=f2e745]: Uncategorized
                      - generic [ref=f2e747]: Praveen - B Chain TA with prompts
                      - generic [ref=f2e748]: "Date Last Recorded: Sep 22, 2026"
                  - listitem [ref=f2e749]:
                    - 'button "Uncategorized QA: baseline - frequency new Date Last Recorded: Oct 15, 2026" [ref=f2e750] [cursor=pointer]':
                      - generic [ref=f2e751]: Uncategorized
                      - generic [ref=f2e753]: "QA: baseline - frequency new"
                      - generic [ref=f2e754]: "Date Last Recorded: Oct 15, 2026"
                  - listitem [ref=f2e755]:
                    - button "Uncategorized QA-Task Analysis Forward chain with prompts_Mobile" [ref=f2e756] [cursor=pointer]:
                      - generic [ref=f2e757]: Uncategorized
                      - generic [ref=f2e759]: QA-Task Analysis Forward chain with prompts_Mobile
                  - listitem [ref=f2e760]:
                    - 'button "Uncategorized Mark - TA with prompts Date Last Recorded: Oct 15, 2026" [ref=f2e761] [cursor=pointer]':
                      - generic [ref=f2e762]: Uncategorized
                      - generic [ref=f2e764]: Mark - TA with prompts
                      - generic [ref=f2e765]: "Date Last Recorded: Oct 15, 2026"
                  - listitem [ref=f2e766]:
                    - 'button "Uncategorized PK - Whole Interval NEW Date Last Recorded: Oct 7, 2026" [ref=f2e767] [cursor=pointer]':
                      - generic [ref=f2e768]: Uncategorized
                      - generic [ref=f2e770]: PK - Whole Interval NEW
                      - generic [ref=f2e771]: "Date Last Recorded: Oct 7, 2026"
                  - listitem [ref=f2e772]:
                    - button "School Readiness Requesting preferred items" [ref=f2e773] [cursor=pointer]:
                      - generic [ref=f2e774]: School Readiness
                      - generic [ref=f2e776]: Requesting preferred items
                  - listitem [ref=f2e777]:
                    - button "School Readiness Washing Hands (Task Analysis)" [ref=f2e778] [cursor=pointer]:
                      - generic [ref=f2e779]: School Readiness
                      - generic [ref=f2e781]: Washing Hands (Task Analysis)
                  - listitem [ref=f2e782]:
                    - button "School Readiness E2E-2610220601-emad Opportunity Based Program" [ref=f2e783] [cursor=pointer]:
                      - generic [ref=f2e784]: School Readiness
                      - generic [ref=f2e786]: E2E-2610220601-emad Opportunity Based Program
                  - listitem [ref=f2e787]:
                    - button "School Readiness E2E-2610220605-ibr9 Opportunity Based Program" [ref=f2e788] [cursor=pointer]:
                      - generic [ref=f2e789]: School Readiness
                      - generic [ref=f2e791]: E2E-2610220605-ibr9 Opportunity Based Program
                  - listitem [ref=f2e792]:
                    - button "School Readiness E2E-2610220607-kf5v Opportunity Based Program" [ref=f2e793] [cursor=pointer]:
                      - generic [ref=f2e794]: School Readiness
                      - generic [ref=f2e796]: E2E-2610220607-kf5v Opportunity Based Program
                  - listitem [ref=f2e797]:
                    - button "School Readiness E2E-2610220610-e5yh Task Analysis Program" [ref=f2e798] [cursor=pointer]:
                      - generic [ref=f2e799]: School Readiness
                      - generic [ref=f2e801]: E2E-2610220610-e5yh Task Analysis Program
                  - listitem [ref=f2e802]:
                    - button "School Readiness E2E-2610220612-wwtb Task Analysis Program" [ref=f2e803] [cursor=pointer]:
                      - generic [ref=f2e804]: School Readiness
                      - generic [ref=f2e806]: E2E-2610220612-wwtb Task Analysis Program
                  - listitem [ref=f2e807]:
                    - button "School Readiness E2E-2610220614-tmvk Task Analysis Program" [ref=f2e808] [cursor=pointer]:
                      - generic [ref=f2e809]: School Readiness
                      - generic [ref=f2e811]: E2E-2610220614-tmvk Task Analysis Program
                  - listitem [ref=f2e812]:
                    - button "School Readiness E2E-2610220616-fgku PEAK Scoring Program" [ref=f2e813] [cursor=pointer]:
                      - generic [ref=f2e814]: School Readiness
                      - generic [ref=f2e816]: E2E-2610220616-fgku PEAK Scoring Program
                  - listitem [ref=f2e817]:
                    - button "School Readiness E2E-2610220619-2ppk PEAK Scoring Program" [ref=f2e818] [cursor=pointer]:
                      - generic [ref=f2e819]: School Readiness
                      - generic [ref=f2e821]: E2E-2610220619-2ppk PEAK Scoring Program
                  - listitem [ref=f2e822]:
                    - button "School Readiness E2E-2610220621-3lmj PEAK Scoring Program" [ref=f2e823] [cursor=pointer]:
                      - generic [ref=f2e824]: School Readiness
                      - generic [ref=f2e826]: E2E-2610220621-3lmj PEAK Scoring Program
                  - listitem [ref=f2e827]:
                    - button "School Readiness E2E-2610220623-us6v Percentage Program" [ref=f2e828] [cursor=pointer]:
                      - generic [ref=f2e829]: School Readiness
                      - generic [ref=f2e831]: E2E-2610220623-us6v Percentage Program
                  - listitem [ref=f2e832]:
                    - button "School Readiness E2E-2610220623-f2pi Numeric Program" [ref=f2e833] [cursor=pointer]:
                      - generic [ref=f2e834]: School Readiness
                      - generic [ref=f2e836]: E2E-2610220623-f2pi Numeric Program
                  - listitem [ref=f2e837]:
                    - button "School Readiness E2E-2610220623-wfk5 Rating Scale Program" [ref=f2e838] [cursor=pointer]:
                      - generic [ref=f2e839]: School Readiness
                      - generic [ref=f2e841]: E2E-2610220623-wfk5 Rating Scale Program
                  - listitem [ref=f2e842]:
                    - button "School Readiness E2E-2610220623-0m41 Number of Occurrences Program" [ref=f2e843] [cursor=pointer]:
                      - generic [ref=f2e844]: School Readiness
                      - generic [ref=f2e846]: E2E-2610220623-0m41 Number of Occurrences Program
                  - listitem [ref=f2e847]:
                    - button "School Readiness E2E-2610220628-0zdh Percentage Program" [ref=f2e848] [cursor=pointer]:
                      - generic [ref=f2e849]: School Readiness
                      - generic [ref=f2e851]: E2E-2610220628-0zdh Percentage Program
                  - listitem [ref=f2e852]:
                    - button "School Readiness E2E-2610220628-qhph Numeric Program" [ref=f2e853] [cursor=pointer]:
                      - generic [ref=f2e854]: School Readiness
                      - generic [ref=f2e856]: E2E-2610220628-qhph Numeric Program
                  - listitem [ref=f2e857]:
                    - button "School Readiness E2E-2610220628-s686 Rating Scale Program" [ref=f2e858] [cursor=pointer]:
                      - generic [ref=f2e859]: School Readiness
                      - generic [ref=f2e861]: E2E-2610220628-s686 Rating Scale Program
                  - listitem [ref=f2e862]:
                    - button "School Readiness E2E-2610220628-ur85 Number of Occurrences Program" [ref=f2e863] [cursor=pointer]:
                      - generic [ref=f2e864]: School Readiness
                      - generic [ref=f2e866]: E2E-2610220628-ur85 Number of Occurrences Program
                  - listitem [ref=f2e867]:
                    - button "School Readiness E2E-2610220632-k803 Percentage Program" [ref=f2e868] [cursor=pointer]:
                      - generic [ref=f2e869]: School Readiness
                      - generic [ref=f2e871]: E2E-2610220632-k803 Percentage Program
                  - listitem [ref=f2e872]:
                    - button "School Readiness E2E-2610220632-3wub Numeric Program" [ref=f2e873] [cursor=pointer]:
                      - generic [ref=f2e874]: School Readiness
                      - generic [ref=f2e876]: E2E-2610220632-3wub Numeric Program
                  - listitem [ref=f2e877]:
                    - button "School Readiness E2E-2610220632-udm3 Rating Scale Program" [ref=f2e878] [cursor=pointer]:
                      - generic [ref=f2e879]: School Readiness
                      - generic [ref=f2e881]: E2E-2610220632-udm3 Rating Scale Program
                  - listitem [ref=f2e882]:
                    - button "School Readiness E2E-2610220632-c7eg Number of Occurrences Program" [ref=f2e883] [cursor=pointer]:
                      - generic [ref=f2e884]: School Readiness
                      - generic [ref=f2e886]: E2E-2610220632-c7eg Number of Occurrences Program
                  - listitem [ref=f2e887]:
                    - button "School Readiness E2E-2610220637-6fjq Frequency/Rate Program" [ref=f2e888] [cursor=pointer]:
                      - generic [ref=f2e889]: School Readiness
                      - generic [ref=f2e891]: E2E-2610220637-6fjq Frequency/Rate Program
                  - listitem [ref=f2e892]:
                    - button "School Readiness E2E-2610220637-kx5m Interval Program" [ref=f2e893] [cursor=pointer]:
                      - generic [ref=f2e894]: School Readiness
                      - generic [ref=f2e896]: E2E-2610220637-kx5m Interval Program
                  - listitem [ref=f2e897]:
                    - button "School Readiness E2E-2610220637-eiw8 Duration Program" [ref=f2e898] [cursor=pointer]:
                      - generic [ref=f2e899]: School Readiness
                      - generic [ref=f2e901]: E2E-2610220637-eiw8 Duration Program
                  - listitem [ref=f2e902]:
                    - button "School Readiness E2E-2610220637-3mgc Frequency + Duration Program" [ref=f2e903] [cursor=pointer]:
                      - generic [ref=f2e904]: School Readiness
                      - generic [ref=f2e906]: E2E-2610220637-3mgc Frequency + Duration Program
                  - listitem [ref=f2e907]:
                    - button "School Readiness E2E-2610220641-ymq2 Frequency/Rate Program" [ref=f2e908] [cursor=pointer]:
                      - generic [ref=f2e909]: School Readiness
                      - generic [ref=f2e911]: E2E-2610220641-ymq2 Frequency/Rate Program
                  - listitem [ref=f2e912]:
                    - button "School Readiness E2E-2610220641-cmsr Interval Program" [ref=f2e913] [cursor=pointer]:
                      - generic [ref=f2e914]: School Readiness
                      - generic [ref=f2e916]: E2E-2610220641-cmsr Interval Program
                  - listitem [ref=f2e917]:
                    - button "School Readiness E2E-2610220641-kpez Duration Program" [ref=f2e918] [cursor=pointer]:
                      - generic [ref=f2e919]: School Readiness
                      - generic [ref=f2e921]: E2E-2610220641-kpez Duration Program
                  - listitem [ref=f2e922]:
                    - button "School Readiness E2E-2610220641-djzg Frequency + Duration Program" [ref=f2e923] [cursor=pointer]:
                      - generic [ref=f2e924]: School Readiness
                      - generic [ref=f2e926]: E2E-2610220641-djzg Frequency + Duration Program
                  - listitem [ref=f2e927]:
                    - button "School Readiness E2E-2610220646-9f5q Frequency/Rate Program" [ref=f2e928] [cursor=pointer]:
                      - generic [ref=f2e929]: School Readiness
                      - generic [ref=f2e931]: E2E-2610220646-9f5q Frequency/Rate Program
                  - listitem [ref=f2e932]:
                    - button "School Readiness E2E-2610220646-lfzq Interval Program" [ref=f2e933] [cursor=pointer]:
                      - generic [ref=f2e934]: School Readiness
                      - generic [ref=f2e936]: E2E-2610220646-lfzq Interval Program
                  - listitem [ref=f2e937]:
                    - button "School Readiness E2E-2610220646-8il6 Duration Program" [ref=f2e938] [cursor=pointer]:
                      - generic [ref=f2e939]: School Readiness
                      - generic [ref=f2e941]: E2E-2610220646-8il6 Duration Program
                  - listitem [ref=f2e942]:
                    - button "School Readiness E2E-2610220646-v66o Frequency + Duration Program" [ref=f2e943] [cursor=pointer]:
                      - generic [ref=f2e944]: School Readiness
                      - generic [ref=f2e946]: E2E-2610220646-v66o Frequency + Duration Program
                  - listitem [ref=f2e947]:
                    - button "School Readiness E2E-2610220651-idwb Toileting Program" [ref=f2e948] [cursor=pointer]:
                      - generic [ref=f2e949]: School Readiness
                      - generic [ref=f2e951]: E2E-2610220651-idwb Toileting Program
                  - listitem [ref=f2e952]:
                    - button "School Readiness E2E-2610220653-2v92 Toileting Program" [ref=f2e953] [cursor=pointer]:
                      - generic [ref=f2e954]: School Readiness
                      - generic [ref=f2e956]: E2E-2610220653-2v92 Toileting Program
                  - listitem [ref=f2e957]:
                    - button "School Readiness E2E-2610220655-2ir6 Toileting Program" [ref=f2e958] [cursor=pointer]:
                      - generic [ref=f2e959]: School Readiness
                      - generic [ref=f2e961]: E2E-2610220655-2ir6 Toileting Program
                  - listitem [ref=f2e962]:
                    - button "School Readiness E2E-2610220657-3rry Duration Program" [ref=f2e963] [cursor=pointer]:
                      - generic [ref=f2e964]: School Readiness
                      - generic [ref=f2e966]: E2E-2610220657-3rry Duration Program
                  - listitem [ref=f2e967]:
                    - button "School Readiness E2E-2610220700-h7q6 Duration Program" [ref=f2e968] [cursor=pointer]:
                      - generic [ref=f2e969]: School Readiness
                      - generic [ref=f2e971]: E2E-2610220700-h7q6 Duration Program
                  - listitem [ref=f2e972]:
                    - button "School Readiness E2E-2610220702-itru Duration Program" [ref=f2e973] [cursor=pointer]:
                      - generic [ref=f2e974]: School Readiness
                      - generic [ref=f2e976]: E2E-2610220702-itru Duration Program
                  - listitem [ref=f2e977]:
                    - button "School Readiness E2E-2610220704-nima Frequency/Rate Program" [ref=f2e978] [cursor=pointer]:
                      - generic [ref=f2e979]: School Readiness
                      - generic [ref=f2e981]: E2E-2610220704-nima Frequency/Rate Program
                  - listitem [ref=f2e982]:
                    - button "School Readiness E2E-2610220704-etbh Interval Program" [ref=f2e983] [cursor=pointer]:
                      - generic [ref=f2e984]: School Readiness
                      - generic [ref=f2e986]: E2E-2610220704-etbh Interval Program
                  - listitem [ref=f2e987]:
                    - button "School Readiness E2E-2610220707-8dug Frequency/Rate Program" [ref=f2e988] [cursor=pointer]:
                      - generic [ref=f2e989]: School Readiness
                      - generic [ref=f2e991]: E2E-2610220707-8dug Frequency/Rate Program
                  - listitem [ref=f2e992]:
                    - button "School Readiness E2E-2610220707-82uk Interval Program" [ref=f2e993] [cursor=pointer]:
                      - generic [ref=f2e994]: School Readiness
                      - generic [ref=f2e996]: E2E-2610220707-82uk Interval Program
                  - listitem [ref=f2e997]:
                    - button "School Readiness E2E-2610220710-mo3y Frequency/Rate Program" [ref=f2e998] [cursor=pointer]:
                      - generic [ref=f2e999]: School Readiness
                      - generic [ref=f2e1001]: E2E-2610220710-mo3y Frequency/Rate Program
                  - listitem [ref=f2e1002]:
                    - button "School Readiness E2E-2610220710-ox1i Interval Program" [ref=f2e1003] [cursor=pointer]:
                      - generic [ref=f2e1004]: School Readiness
                      - generic [ref=f2e1006]: E2E-2610220710-ox1i Interval Program
                  - listitem [ref=f2e1007]:
                    - button "School Readiness E2E-2610220752-f7o2 Opportunity Based Program" [ref=f2e1008] [cursor=pointer]:
                      - generic [ref=f2e1009]: School Readiness
                      - generic [ref=f2e1011]: E2E-2610220752-f7o2 Opportunity Based Program
                  - listitem [ref=f2e1012]:
                    - button "School Readiness E2E-2610220754-myy6 Opportunity Based Program" [ref=f2e1013] [cursor=pointer]:
                      - generic [ref=f2e1014]: School Readiness
                      - generic [ref=f2e1016]: E2E-2610220754-myy6 Opportunity Based Program
                  - listitem [ref=f2e1017]:
                    - button "School Readiness E2E-2610220757-h08a Opportunity Based Program" [ref=f2e1018] [cursor=pointer]:
                      - generic [ref=f2e1019]: School Readiness
                      - generic [ref=f2e1021]: E2E-2610220757-h08a Opportunity Based Program
                  - listitem [ref=f2e1022]:
                    - button "School Readiness E2E-2610220819-axat Mastery Program" [ref=f2e1023] [cursor=pointer]:
                      - generic [ref=f2e1024]: School Readiness
                      - generic [ref=f2e1026]: E2E-2610220819-axat Mastery Program
                  - listitem [ref=f2e1027]:
                    - button "School Readiness E2E-2610220822-64m0 Mastery Program" [ref=f2e1028] [cursor=pointer]:
                      - generic [ref=f2e1029]: School Readiness
                      - generic [ref=f2e1031]: E2E-2610220822-64m0 Mastery Program
                  - listitem [ref=f2e1032]:
                    - button "School Readiness E2E-2610220824-48l9 Mastery Program" [ref=f2e1033] [cursor=pointer]:
                      - generic [ref=f2e1034]: School Readiness
                      - generic [ref=f2e1036]: E2E-2610220824-48l9 Mastery Program
            - main [ref=f2e1037]:
              - generic [ref=f2e1039]:
                - paragraph [ref=f2e1043]: This program could not be found.
                - generic "Delete target group"
                - generic "Delete Program"
          - generic:
            - generic "Already on Plan"
```

# Test source

```ts
  1   | import { test, expect } from '../../../src/fixtures/test';
  2   | import { customProgramInput } from '../../../src/data/programs';
  3   | 
  4   | const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  5   | 
  6   | test.describe('US-7 Manage targets / steps within a program', { tag: '@US-7' }, () => {
  7   |   test('TC-US07-01 Add, bulk add, rename, reorder and assign objective and group', async ({ flows, programDetails, targets, testData }) => {
  8   |     const program = customProgramInput('Targets Program');
  9   |     await flows.signInAs('bcba');
  10  |     await flows.openClient(testData.clients.seeded);
  11  |     await flows.createCustomProgram(program);
  12  | 
  13  |     await test.step('Add a single target and bulk add two more', async () => {
  14  |       await programDetails.manageTargetsButton.click();
  15  |       await targets.expectLoaded();
  16  |       await targets.addTarget('Point to dog');
  17  |       await targets.bulkAdd(['Wave', 'Jump']);
  18  |       await targets.save();
  19  |       for (const name of [...program.targets!, 'Point to dog', 'Wave', 'Jump']) {
  20  |         await expect(programDetails.targetsSection).toContainText(name);
  21  |       }
  22  |       await expect.soft(programDetails.targetsSection.getByRole('columnheader', { name: /phase/i }), 'phase column (NGC-60)').toBeVisible();
  23  |     });
  24  | 
  25  |     await test.step('Rename, reorder, and assign group and objective to one target', async () => {
  26  |       await programDetails.manageTargetsButton.click();
  27  |       await targets.expectLoaded();
  28  |       await targets.renameTarget('Stand up', 'Stand up tall');
  29  |       await targets.move('Jump', 'up');
  30  |       const names = await targets.targetNames();
  31  |       expect(names.indexOf('Jump')).toBeLessThan(names.indexOf('Wave'));
  32  |       await targets.addGroup('Body parts');
  33  |       await targets.setField('Touch nose', 'group', 'Body parts');
  34  |       await targets.setField('Touch nose', 'objective', /Objective 2/);
  35  |       await flows.evidence('targets edited');
  36  |       const saved = await targets.trySave();
> 37  |       expect.soft(saved, 'rename + group/objective changes in one save (412 Conflict/StaleVersion on PATCH target)').toBe(true);
      |                                                                                                                      ^ Error: rename + group/objective changes in one save (412 Conflict/StaleVersion on PATCH target)
  38  |       if (!saved) {
  39  |         await flows.evidence('save error');
  40  |         await targets.cancel();
  41  |         test.info().annotations.push({ type: 'workaround', description: 'Rename/reorder and group/objective saved separately' });
  42  |         await programDetails.manageTargetsButton.click();
  43  |         await targets.expectLoaded();
  44  |         await targets.renameTarget('Stand up', 'Stand up tall');
  45  |         await targets.move('Jump', 'up');
  46  |         await targets.save();
  47  |         await programDetails.manageTargetsButton.click();
  48  |         await targets.expectLoaded();
  49  |         await targets.setField('Touch nose', 'group', 'Body parts');
  50  |         await targets.setField('Touch nose', 'objective', /Objective 2/);
  51  |         await targets.save();
  52  |       }
  53  |     });
  54  | 
  55  |     await test.step('Changes persisted and only the chosen target is linked (NGC-05)', async () => {
  56  |       await programDetails.manageTargetsButton.click();
  57  |       await targets.expectLoaded();
  58  |       const names = await targets.targetNames();
  59  |       expect(names).toContain('Stand up tall');
  60  |       expect(names).not.toContain('Stand up');
  61  |       expect(names.indexOf('Jump')).toBeLessThan(names.indexOf('Wave'));
  62  |       const touchNose = await targets.row('Touch nose');
  63  |       await expect(touchNose.locator('[data-testid$="-group"]')).toContainText('Body parts');
  64  |       await expect(touchNose.locator('[data-testid$="-objective"]')).toContainText('Objective 2');
  65  |       for (const other of names.filter((n) => n !== 'Touch nose')) {
  66  |         const row = await targets.row(other);
  67  |         await expect.soft(row.locator('[data-testid$="-group"]'), `${other} must not inherit the group`).not.toContainText('Body parts');
  68  |         await expect.soft(row.locator('[data-testid$="-objective"]'), `${other} must not inherit the objective`).not.toContainText('Objective 2');
  69  |       }
  70  |       await targets.cancel();
  71  |     });
  72  | 
  73  |     await test.step('Clean-up', async () => {
  74  |       await programDetails.deleteProgram(program.title);
  75  |     });
  76  |   });
  77  | 
  78  |   test('TC-US07-02 Status lifecycle: In Progress, On hold, Mastered and un-master, with dated history', async ({ page, flows, programDetails, targets, testData }) => {
  79  |     const program = customProgramInput('Status Program');
  80  |     await flows.signInAs('bcba');
  81  |     await flows.openClient(testData.clients.seeded);
  82  |     await flows.createCustomProgram(program);
  83  | 
  84  |     const openHistory = async (target: string) => {
  85  |       await programDetails.manageTargetsButton.click();
  86  |       await targets.expectLoaded();
  87  |       return targets.openStatusHistory(target);
  88  |     };
  89  |     const closeHistory = async () => {
  90  |       await page.keyboard.press('Escape');
  91  |       await targets.cancel();
  92  |     };
  93  | 
  94  |     await test.step('Set In Progress and On hold', async () => {
  95  |       await programDetails.manageTargetsButton.click();
  96  |       await targets.expectLoaded();
  97  |       await targets.setField('Clap hands', 'status', 'In Progress');
  98  |       await targets.setOnHold('Stand up', true);
  99  |       await targets.save();
  100 |       await expect(programDetails.targetsSection.getByRole('row').filter({ hasText: 'Clap hands' })).toContainText('In Progress');
  101 |     });
  102 | 
  103 |     await test.step('History is date-stamped', async () => {
  104 |       const history = await openHistory('Clap hands');
  105 |       await expect(history).toContainText('In Progress');
  106 |       await expect(history).toContainText(today());
  107 |       await closeHistory();
  108 |     });
  109 | 
  110 |     await test.step('Master the target', async () => {
  111 |       await programDetails.manageTargetsButton.click();
  112 |       await targets.expectLoaded();
  113 |       await targets.setField('Clap hands', 'status', 'Mastered');
  114 |       await targets.save();
  115 |       const row = programDetails.targetsSection.getByRole('row').filter({ hasText: 'Clap hands' });
  116 |       await expect(row).toContainText('Mastered');
  117 |       await expect(row).toContainText(today());
  118 |     });
  119 | 
  120 |     await test.step('Un-master the target', async () => {
  121 |       await programDetails.manageTargetsButton.click();
  122 |       await targets.expectLoaded();
  123 |       const row = await targets.row('Clap hands');
  124 |       await expect(row, 'mastered target moves to the Maintenance phase').toContainText('Maintenance');
  125 |       await targets.unmaster('Clap hands');
  126 |       await targets.save();
  127 |       await expect(programDetails.targetsSection.getByRole('row').filter({ hasText: 'Clap hands' })).not.toContainText('Mastered');
  128 |     });
  129 | 
  130 |     await test.step('History lists both changes and On hold persisted', async () => {
  131 |       const history = await openHistory('Clap hands');
  132 |       await expect(history).toContainText('Mastered');
  133 |       await expect(history).toContainText('In Progress');
  134 |       await page.keyboard.press('Escape');
  135 |       const standUp = await targets.row('Stand up');
  136 |       await expect(standUp.locator('input[data-testid$="-on-hold"]')).toBeChecked();
  137 |       await targets.cancel();
```