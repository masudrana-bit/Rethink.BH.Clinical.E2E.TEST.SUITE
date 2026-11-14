# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stories/02-program-authoring/us-06-edit-archive-delete-program.spec.ts >> US-6 Edit, archive, or delete a program >> TC-US06-01 [RHD-60119] Edit the goal and rename a program from the header
- Location: tests/stories/02-program-authoring/us-06-edit-archive-delete-program.spec.ts:5:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('menuitem', { name: 'Edit', exact: true })
Expected: 1
Received: 0
Timeout:  20000ms

Call log:
  - Expect "toHaveCount" getByRole('menuitem', { name: 'Edit', exact: true }) with timeout 20000ms
  - waiting for getByRole('menuitem', { name: 'Edit', exact: true })
    44 × locator resolved to 0 elements
       - unexpected value "0"

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
            - combobox "!*!Billy!*! !*!Billerson!*!" [ref=f2e19]
            - button "dropdown trigger" [ref=f2e20]
          - generic [ref=f2e23]:
            - generic [ref=f2e24]: DOB
            - text: Jul 19, 2010
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
      - link "Staff" [ref=f2e40] [cursor=pointer]:
        - /url: https://rta-bh-stage-web.azurewebsites.net/core/staff
        - generic [aria-hidden] [ref=f2e41]: 
      - link "Settings" [ref=f2e43] [cursor=pointer]:
        - /url: /settings
        - generic [aria-hidden] [ref=f2e44]: 
      - link "Training" [ref=f2e46] [cursor=pointer]:
        - /url: https://rta-bh-stage-web.azurewebsites.net/Healthcare#/Training
        - generic [aria-hidden] [ref=f2e47]: 
      - link "Reporting" [ref=f2e49] [cursor=pointer]:
        - /url: https://rta-bh-stage-web.azurewebsites.net/Healthcare#/ReportingDashboard
        - generic [aria-hidden] [ref=f2e50]: 
      - link "Template" [ref=f2e52] [cursor=pointer]:
        - /url: /templates
        - generic [aria-hidden] [ref=f2e53]: 
      - link "Schedule" [ref=f2e55] [cursor=pointer]:
        - /url: https://rta-bh-stage-web.azurewebsites.net/core/scheduler/individual
        - generic [aria-hidden] [ref=f2e56]: 
      - link "Notifications" [ref=f2e58] [cursor=pointer]:
        - /url: https://rta-bh-stage-web.azurewebsites.net/Healthcare#/TasksAndNotifications
        - generic [aria-hidden] [ref=f2e59]: 
      - generic "Billing (coming soon)" [ref=f2e61]:
        - generic [aria-hidden] [ref=f2e62]: 
        - generic [ref=f2e63]: Billing
      - link "Analytics" [ref=f2e64] [cursor=pointer]:
        - /url: https://rta-bh-stage-web.azurewebsites.net/core/analytics
        - generic [aria-hidden] [ref=f2e65]: 
      - link "Action Dashboard" [ref=f2e67] [cursor=pointer]:
        - /url: https://rta-bh-stage-web.azurewebsites.net/core/action-dashboard
        - generic [aria-hidden] [ref=f2e68]: 
    - main [ref=f2e70]:
      - generic [ref=f2e71]:
        - navigation "Client sections" [ref=f2e73]:
          - list [ref=f2e74]:
            - listitem [ref=f2e75]:
              - link "Client Info" [ref=f2e76] [cursor=pointer]:
                - /url: https://rta-bh-stage-web.azurewebsites.net/core/clients/394036
            - listitem [ref=f2e77]:
              - link "File Cabinet" [ref=f2e78] [cursor=pointer]:
                - /url: https://rta-bh-stage-web.azurewebsites.net/core/clients/394036/files
            - listitem [ref=f2e79]:
              - link "Assessments" [ref=f2e80] [cursor=pointer]:
                - /url: https://rta-bh-stage-web.azurewebsites.net/core/clients/394036/assessment
            - listitem [ref=f2e81]:
              - link "Sessions" [ref=f2e82] [cursor=pointer]:
                - /url: /clients/394036/sessions
            - listitem [ref=f2e83]:
              - link "Skills Programs" [ref=f2e84] [cursor=pointer]:
                - /url: /clients/394036
            - listitem [ref=f2e85]:
              - link "Behavior Support" [ref=f2e86] [cursor=pointer]:
                - /url: /clients/394036/behavior-support
            - listitem [ref=f2e87]:
              - link "Analyze Data" [ref=f2e88] [cursor=pointer]:
                - /url: /clients/394036/analyze-data
            - listitem [ref=f2e89]:
              - link "Funder Reports" [ref=f2e90] [cursor=pointer]:
                - /url: /clients/394036/reports
        - generic [ref=f2e91]:
          - generic [ref=f2e92]:
            - complementary [ref=f2e94]:
              - generic [ref=f2e95]:
                - group "Program timeline" [ref=f2e96]:
                  - button "Current" [pressed] [ref=f2e97] [cursor=pointer]
                  - button "Inactive" [ref=f2e98] [cursor=pointer]
                - generic [ref=f2e99]:
                  - generic [ref=f2e100]: Domain Filter
                  - generic [ref=f2e101] [cursor=pointer]:
                    - combobox "Domain Filter" [ref=f2e102]: All domains
                    - button "dropdown trigger" [ref=f2e103]
                - generic [ref=f2e106]:
                  - heading "Program List" [level=2] [ref=f2e107]
                  - generic [ref=f2e108]:
                    - button "Add New" [ref=f2e109] [cursor=pointer]:
                      - generic [aria-hidden] [ref=f2e110]: 
                      - text: Add New
                    - button "Search program list" [ref=f2e111] [cursor=pointer]:
                      - generic [aria-hidden] [ref=f2e112]: 
                    - button "Program list options" [ref=f2e113] [cursor=pointer]:
                      - generic [aria-hidden] [ref=f2e114]: 
                - list [ref=f2e115]:
                  - listitem [ref=f2e116]:
                    - 'button "Uncategorized Matching Identical Objects-Older Date Last Recorded: Nov 27, 2024" [ref=f2e117] [cursor=pointer]':
                      - generic [ref=f2e118]: Uncategorized
                      - generic [ref=f2e120]: Matching Identical Objects-Older
                      - generic [ref=f2e121]: "Date Last Recorded: Nov 27, 2024"
                  - listitem [ref=f2e122]:
                    - button "Uncategorized Matching Identical Objects-Younger" [ref=f2e123] [cursor=pointer]:
                      - generic [ref=f2e124]: Uncategorized
                      - generic [ref=f2e126]: Matching Identical Objects-Younger
                  - listitem [ref=f2e127]:
                    - 'button "Uncategorized Waiting to Begin an Activity Date Last Recorded: Jun 30, 2026" [ref=f2e128] [cursor=pointer]':
                      - generic [ref=f2e129]: Uncategorized
                      - generic [ref=f2e131]: Waiting to Begin an Activity
                      - generic [ref=f2e132]: "Date Last Recorded: Jun 30, 2026"
                  - listitem [ref=f2e133]:
                    - button "School Readiness Washing Hands (Task Analysis)" [ref=f2e134] [cursor=pointer]:
                      - generic [ref=f2e135]: School Readiness
                      - generic [ref=f2e137]: Washing Hands (Task Analysis)
                  - listitem [ref=f2e138]:
                    - 'button "School Readiness E2E-2610221010-xxbx Duration Program Date Last Recorded: Oct 22, 2026" [ref=f2e139] [cursor=pointer]':
                      - generic [ref=f2e140]: School Readiness
                      - generic [ref=f2e142]: E2E-2610221010-xxbx Duration Program
                      - generic [ref=f2e143]: "Date Last Recorded: Oct 22, 2026"
                  - listitem [ref=f2e144]:
                    - button "School Readiness E2E-2610221125-zgnz Mastery Program" [ref=f2e145] [cursor=pointer]:
                      - generic [ref=f2e146]: School Readiness
                      - generic [ref=f2e148]: E2E-2610221125-zgnz Mastery Program
                  - listitem [ref=f2e149]:
                    - 'button "School Readiness Requesting preferred items Date Last Recorded: Nov 7, 2026" [ref=f2e150] [cursor=pointer]':
                      - generic [ref=f2e151]: School Readiness
                      - generic [ref=f2e153]: Requesting preferred items
                      - generic [ref=f2e154]: "Date Last Recorded: Nov 7, 2026"
                  - listitem [ref=f2e155]:
                    - button "School Readiness E2E-2610221618-t6rj Opportunity Based Program" [ref=f2e156] [cursor=pointer]:
                      - generic [ref=f2e157]: School Readiness
                      - generic [ref=f2e159]: E2E-2610221618-t6rj Opportunity Based Program
                  - listitem [ref=f2e160]:
                    - button "School Readiness E2E-2611050814-zfxx Editable Program" [ref=f2e161] [cursor=pointer]:
                      - generic [ref=f2e162]: School Readiness
                      - generic [ref=f2e164]: E2E-2611050814-zfxx Editable Program
                  - listitem [ref=f2e165]:
                    - 'button "School Readiness E2E-2611060431-nuwm Opportunity Based Program Date Last Recorded: Nov 5, 2026" [ref=f2e166] [cursor=pointer]':
                      - generic [ref=f2e167]: School Readiness
                      - generic [ref=f2e169]: E2E-2611060431-nuwm Opportunity Based Program
                      - generic [ref=f2e170]: "Date Last Recorded: Nov 5, 2026"
                  - listitem [ref=f2e171]:
                    - button "School Readiness E2E-2611060436-v4ps Percentage Program" [ref=f2e172] [cursor=pointer]:
                      - generic [ref=f2e173]: School Readiness
                      - generic [ref=f2e175]: E2E-2611060436-v4ps Percentage Program
                  - listitem [ref=f2e176]:
                    - button "School Readiness E2E-2611060436-rest Numeric Program" [ref=f2e177] [cursor=pointer]:
                      - generic [ref=f2e178]: School Readiness
                      - generic [ref=f2e180]: E2E-2611060436-rest Numeric Program
                  - listitem [ref=f2e181]:
                    - button "School Readiness E2E-2611060436-x4mk Rating Scale Program" [ref=f2e182] [cursor=pointer]:
                      - generic [ref=f2e183]: School Readiness
                      - generic [ref=f2e185]: E2E-2611060436-x4mk Rating Scale Program
                  - listitem [ref=f2e186]:
                    - button "School Readiness E2E-2611060436-56nt Number of Occurrences Program" [ref=f2e187] [cursor=pointer]:
                      - generic [ref=f2e188]: School Readiness
                      - generic [ref=f2e190]: E2E-2611060436-56nt Number of Occurrences Program
                  - listitem [ref=f2e191]:
                    - button "School Readiness E2E-2611060440-sw4t Percentage Program" [ref=f2e192] [cursor=pointer]:
                      - generic [ref=f2e193]: School Readiness
                      - generic [ref=f2e195]: E2E-2611060440-sw4t Percentage Program
                  - listitem [ref=f2e196]:
                    - button "School Readiness E2E-2611060440-qbut Numeric Program" [ref=f2e197] [cursor=pointer]:
                      - generic [ref=f2e198]: School Readiness
                      - generic [ref=f2e200]: E2E-2611060440-qbut Numeric Program
                  - listitem [ref=f2e201]:
                    - button "School Readiness E2E-2611060440-j460 Rating Scale Program" [ref=f2e202] [cursor=pointer]:
                      - generic [ref=f2e203]: School Readiness
                      - generic [ref=f2e205]: E2E-2611060440-j460 Rating Scale Program
                  - listitem [ref=f2e206]:
                    - button "School Readiness E2E-2611060440-qxvi Number of Occurrences Program" [ref=f2e207] [cursor=pointer]:
                      - generic [ref=f2e208]: School Readiness
                      - generic [ref=f2e210]: E2E-2611060440-qxvi Number of Occurrences Program
                  - listitem [ref=f2e211]:
                    - button "School Readiness E2E-2611060443-s0jd Percentage Program" [ref=f2e212] [cursor=pointer]:
                      - generic [ref=f2e213]: School Readiness
                      - generic [ref=f2e215]: E2E-2611060443-s0jd Percentage Program
                  - listitem [ref=f2e216]:
                    - button "School Readiness E2E-2611060443-t6v0 Numeric Program" [ref=f2e217] [cursor=pointer]:
                      - generic [ref=f2e218]: School Readiness
                      - generic [ref=f2e220]: E2E-2611060443-t6v0 Numeric Program
                  - listitem [ref=f2e221]:
                    - button "School Readiness E2E-2611060443-nh1l Rating Scale Program" [ref=f2e222] [cursor=pointer]:
                      - generic [ref=f2e223]: School Readiness
                      - generic [ref=f2e225]: E2E-2611060443-nh1l Rating Scale Program
                  - listitem [ref=f2e226]:
                    - button "School Readiness E2E-2611060443-vprf Number of Occurrences Program" [ref=f2e227] [cursor=pointer]:
                      - generic [ref=f2e228]: School Readiness
                      - generic [ref=f2e230]: E2E-2611060443-vprf Number of Occurrences Program
                  - listitem [ref=f2e231]:
                    - button "School Readiness E2E-2611060504-kska Opportunity Based Program" [ref=f2e232] [cursor=pointer]:
                      - generic [ref=f2e233]: School Readiness
                      - generic [ref=f2e235]: E2E-2611060504-kska Opportunity Based Program
                  - listitem [ref=f2e236]:
                    - button "School Readiness E2E-2611060506-w178 Opportunity Based Program" [ref=f2e237] [cursor=pointer]:
                      - generic [ref=f2e238]: School Readiness
                      - generic [ref=f2e240]: E2E-2611060506-w178 Opportunity Based Program
                  - listitem [ref=f2e241]:
                    - button "School Readiness E2E-2611060508-9dsn Opportunity Based Program" [ref=f2e242] [cursor=pointer]:
                      - generic [ref=f2e243]: School Readiness
                      - generic [ref=f2e245]: E2E-2611060508-9dsn Opportunity Based Program
                  - listitem [ref=f2e246]:
                    - button "School Readiness E2E-2611060513-f5ut Mastery Program" [ref=f2e247] [cursor=pointer]:
                      - generic [ref=f2e248]: School Readiness
                      - generic [ref=f2e250]: E2E-2611060513-f5ut Mastery Program
                  - listitem [ref=f2e251]:
                    - button "School Readiness E2E-2611060515-frmc Mastery Program" [ref=f2e252] [cursor=pointer]:
                      - generic [ref=f2e253]: School Readiness
                      - generic [ref=f2e255]: E2E-2611060515-frmc Mastery Program
                  - listitem [ref=f2e256]:
                    - button "School Readiness E2E-2611060517-nwz0 Mastery Program" [ref=f2e257] [cursor=pointer]:
                      - generic [ref=f2e258]: School Readiness
                      - generic [ref=f2e260]: E2E-2611060517-nwz0 Mastery Program
                  - listitem [ref=f2e261]:
                    - button "School Readiness E2E-2611070413-z4jm Percentage Program" [ref=f2e262] [cursor=pointer]:
                      - generic [ref=f2e263]: School Readiness
                      - generic [ref=f2e265]: E2E-2611070413-z4jm Percentage Program
                  - listitem [ref=f2e266]:
                    - button "School Readiness E2E-2611070413-yl73 Numeric Program" [ref=f2e267] [cursor=pointer]:
                      - generic [ref=f2e268]: School Readiness
                      - generic [ref=f2e270]: E2E-2611070413-yl73 Numeric Program
                  - listitem [ref=f2e271]:
                    - button "School Readiness E2E-2611070413-jq9q Rating Scale Program" [ref=f2e272] [cursor=pointer]:
                      - generic [ref=f2e273]: School Readiness
                      - generic [ref=f2e275]: E2E-2611070413-jq9q Rating Scale Program
                  - listitem [ref=f2e276]:
                    - button "School Readiness E2E-2611070413-s8dr Number of Occurrences Program" [ref=f2e277] [cursor=pointer]:
                      - generic [ref=f2e278]: School Readiness
                      - generic [ref=f2e280]: E2E-2611070413-s8dr Number of Occurrences Program
                  - listitem [ref=f2e281]:
                    - button "School Readiness E2E-2611070417-c9vp Percentage Program" [ref=f2e282] [cursor=pointer]:
                      - generic [ref=f2e283]: School Readiness
                      - generic [ref=f2e285]: E2E-2611070417-c9vp Percentage Program
                  - listitem [ref=f2e286]:
                    - button "School Readiness E2E-2611070417-kr5y Numeric Program" [ref=f2e287] [cursor=pointer]:
                      - generic [ref=f2e288]: School Readiness
                      - generic [ref=f2e290]: E2E-2611070417-kr5y Numeric Program
                  - listitem [ref=f2e291]:
                    - button "School Readiness E2E-2611070417-7mhc Rating Scale Program" [ref=f2e292] [cursor=pointer]:
                      - generic [ref=f2e293]: School Readiness
                      - generic [ref=f2e295]: E2E-2611070417-7mhc Rating Scale Program
                  - listitem [ref=f2e296]:
                    - button "School Readiness E2E-2611070417-rsx3 Number of Occurrences Program" [ref=f2e297] [cursor=pointer]:
                      - generic [ref=f2e298]: School Readiness
                      - generic [ref=f2e300]: E2E-2611070417-rsx3 Number of Occurrences Program
                  - listitem [ref=f2e301]:
                    - button "School Readiness E2E-2611070421-5sxm Percentage Program" [ref=f2e302] [cursor=pointer]:
                      - generic [ref=f2e303]: School Readiness
                      - generic [ref=f2e305]: E2E-2611070421-5sxm Percentage Program
                  - listitem [ref=f2e306]:
                    - button "School Readiness E2E-2611070421-mr5b Numeric Program" [ref=f2e307] [cursor=pointer]:
                      - generic [ref=f2e308]: School Readiness
                      - generic [ref=f2e310]: E2E-2611070421-mr5b Numeric Program
                  - listitem [ref=f2e311]:
                    - button "School Readiness E2E-2611070421-ec8m Rating Scale Program" [ref=f2e312] [cursor=pointer]:
                      - generic [ref=f2e313]: School Readiness
                      - generic [ref=f2e315]: E2E-2611070421-ec8m Rating Scale Program
                  - listitem [ref=f2e316]:
                    - button "School Readiness E2E-2611070421-5u9t Number of Occurrences Program" [ref=f2e317] [cursor=pointer]:
                      - generic [ref=f2e318]: School Readiness
                      - generic [ref=f2e320]: E2E-2611070421-5u9t Number of Occurrences Program
                  - listitem [ref=f2e321]:
                    - button "School Readiness E2E-2611070425-89jy Frequency/Rate Program" [ref=f2e322] [cursor=pointer]:
                      - generic [ref=f2e323]: School Readiness
                      - generic [ref=f2e325]: E2E-2611070425-89jy Frequency/Rate Program
                  - listitem [ref=f2e326]:
                    - button "School Readiness E2E-2611070425-y6zd Interval Program" [ref=f2e327] [cursor=pointer]:
                      - generic [ref=f2e328]: School Readiness
                      - generic [ref=f2e330]: E2E-2611070425-y6zd Interval Program
                  - listitem [ref=f2e331]:
                    - button "School Readiness E2E-2611070425-03r1 Duration Program" [ref=f2e332] [cursor=pointer]:
                      - generic [ref=f2e333]: School Readiness
                      - generic [ref=f2e335]: E2E-2611070425-03r1 Duration Program
                  - listitem [ref=f2e336]:
                    - button "School Readiness E2E-2611070425-s6cv Frequency + Duration Program" [ref=f2e337] [cursor=pointer]:
                      - generic [ref=f2e338]: School Readiness
                      - generic [ref=f2e340]: E2E-2611070425-s6cv Frequency + Duration Program
                  - listitem [ref=f2e341]:
                    - button "School Readiness E2E-2611070429-2hie Frequency/Rate Program" [ref=f2e342] [cursor=pointer]:
                      - generic [ref=f2e343]: School Readiness
                      - generic [ref=f2e345]: E2E-2611070429-2hie Frequency/Rate Program
                  - listitem [ref=f2e346]:
                    - button "School Readiness E2E-2611070429-5spu Interval Program" [ref=f2e347] [cursor=pointer]:
                      - generic [ref=f2e348]: School Readiness
                      - generic [ref=f2e350]: E2E-2611070429-5spu Interval Program
                  - listitem [ref=f2e351]:
                    - button "School Readiness E2E-2611070429-si6d Duration Program" [ref=f2e352] [cursor=pointer]:
                      - generic [ref=f2e353]: School Readiness
                      - generic [ref=f2e355]: E2E-2611070429-si6d Duration Program
                  - listitem [ref=f2e356]:
                    - button "School Readiness E2E-2611070429-w8tm Frequency + Duration Program" [ref=f2e357] [cursor=pointer]:
                      - generic [ref=f2e358]: School Readiness
                      - generic [ref=f2e360]: E2E-2611070429-w8tm Frequency + Duration Program
                  - listitem [ref=f2e361]:
                    - button "School Readiness E2E-2611070434-6ds0 Frequency/Rate Program" [ref=f2e362] [cursor=pointer]:
                      - generic [ref=f2e363]: School Readiness
                      - generic [ref=f2e365]: E2E-2611070434-6ds0 Frequency/Rate Program
                  - listitem [ref=f2e366]:
                    - button "School Readiness E2E-2611070434-p12i Interval Program" [ref=f2e367] [cursor=pointer]:
                      - generic [ref=f2e368]: School Readiness
                      - generic [ref=f2e370]: E2E-2611070434-p12i Interval Program
                  - listitem [ref=f2e371]:
                    - button "School Readiness E2E-2611070434-fixo Duration Program" [ref=f2e372] [cursor=pointer]:
                      - generic [ref=f2e373]: School Readiness
                      - generic [ref=f2e375]: E2E-2611070434-fixo Duration Program
                  - listitem [ref=f2e376]:
                    - button "School Readiness E2E-2611070434-x40r Frequency + Duration Program" [ref=f2e377] [cursor=pointer]:
                      - generic [ref=f2e378]: School Readiness
                      - generic [ref=f2e380]: E2E-2611070434-x40r Frequency + Duration Program
                  - listitem [ref=f2e381]:
                    - button "School Readiness E2E-2611070459-1hf8 Opportunity Based Program" [ref=f2e382] [cursor=pointer]:
                      - generic [ref=f2e383]: School Readiness
                      - generic [ref=f2e385]: E2E-2611070459-1hf8 Opportunity Based Program
                  - listitem [ref=f2e386]:
                    - button "School Readiness E2E-2611070501-3zuq Opportunity Based Program" [ref=f2e387] [cursor=pointer]:
                      - generic [ref=f2e388]: School Readiness
                      - generic [ref=f2e390]: E2E-2611070501-3zuq Opportunity Based Program
                  - listitem [ref=f2e391]:
                    - button "School Readiness E2E-2611070503-svra Opportunity Based Program" [ref=f2e392] [cursor=pointer]:
                      - generic [ref=f2e393]: School Readiness
                      - generic [ref=f2e395]: E2E-2611070503-svra Opportunity Based Program
                  - listitem [ref=f2e396]:
                    - button "School Readiness E2E-2611070511-6l31 Mastery Program" [ref=f2e397] [cursor=pointer]:
                      - generic [ref=f2e398]: School Readiness
                      - generic [ref=f2e400]: E2E-2611070511-6l31 Mastery Program
                  - listitem [ref=f2e401]:
                    - button "School Readiness E2E-2611070513-2pzm Mastery Program" [ref=f2e402] [cursor=pointer]:
                      - generic [ref=f2e403]: School Readiness
                      - generic [ref=f2e405]: E2E-2611070513-2pzm Mastery Program
                  - listitem [ref=f2e406]:
                    - button "School Readiness E2E-2611070516-okcu Mastery Program" [ref=f2e407] [cursor=pointer]:
                      - generic [ref=f2e408]: School Readiness
                      - generic [ref=f2e410]: E2E-2611070516-okcu Mastery Program
                  - listitem [ref=f2e411]:
                    - button "School Readiness E2E-2611080346-zuor Percentage Program" [ref=f2e412] [cursor=pointer]:
                      - generic [ref=f2e413]: School Readiness
                      - generic [ref=f2e415]: E2E-2611080346-zuor Percentage Program
                  - listitem [ref=f2e416]:
                    - button "School Readiness E2E-2611080346-jf0z Numeric Program" [ref=f2e417] [cursor=pointer]:
                      - generic [ref=f2e418]: School Readiness
                      - generic [ref=f2e420]: E2E-2611080346-jf0z Numeric Program
                  - listitem [ref=f2e421]:
                    - button "School Readiness E2E-2611080346-mksj Rating Scale Program" [ref=f2e422] [cursor=pointer]:
                      - generic [ref=f2e423]: School Readiness
                      - generic [ref=f2e425]: E2E-2611080346-mksj Rating Scale Program
                  - listitem [ref=f2e426]:
                    - button "School Readiness E2E-2611080346-zqy6 Number of Occurrences Program" [ref=f2e427] [cursor=pointer]:
                      - generic [ref=f2e428]: School Readiness
                      - generic [ref=f2e430]: E2E-2611080346-zqy6 Number of Occurrences Program
                  - listitem [ref=f2e431]:
                    - button "School Readiness E2E-2611080350-vs0q Percentage Program" [ref=f2e432] [cursor=pointer]:
                      - generic [ref=f2e433]: School Readiness
                      - generic [ref=f2e435]: E2E-2611080350-vs0q Percentage Program
                  - listitem [ref=f2e436]:
                    - button "School Readiness E2E-2611080350-nhgz Numeric Program" [ref=f2e437] [cursor=pointer]:
                      - generic [ref=f2e438]: School Readiness
                      - generic [ref=f2e440]: E2E-2611080350-nhgz Numeric Program
                  - listitem [ref=f2e441]:
                    - button "School Readiness E2E-2611080350-wj6q Rating Scale Program" [ref=f2e442] [cursor=pointer]:
                      - generic [ref=f2e443]: School Readiness
                      - generic [ref=f2e445]: E2E-2611080350-wj6q Rating Scale Program
                  - listitem [ref=f2e446]:
                    - button "School Readiness E2E-2611080350-5cfq Number of Occurrences Program" [ref=f2e447] [cursor=pointer]:
                      - generic [ref=f2e448]: School Readiness
                      - generic [ref=f2e450]: E2E-2611080350-5cfq Number of Occurrences Program
                  - listitem [ref=f2e451]:
                    - button "School Readiness E2E-2611080354-f7kz Percentage Program" [ref=f2e452] [cursor=pointer]:
                      - generic [ref=f2e453]: School Readiness
                      - generic [ref=f2e455]: E2E-2611080354-f7kz Percentage Program
                  - listitem [ref=f2e456]:
                    - button "School Readiness E2E-2611080354-acke Numeric Program" [ref=f2e457] [cursor=pointer]:
                      - generic [ref=f2e458]: School Readiness
                      - generic [ref=f2e460]: E2E-2611080354-acke Numeric Program
                  - listitem [ref=f2e461]:
                    - button "School Readiness E2E-2611080354-oaie Rating Scale Program" [ref=f2e462] [cursor=pointer]:
                      - generic [ref=f2e463]: School Readiness
                      - generic [ref=f2e465]: E2E-2611080354-oaie Rating Scale Program
                  - listitem [ref=f2e466]:
                    - button "School Readiness E2E-2611080354-h6r5 Number of Occurrences Program" [ref=f2e467] [cursor=pointer]:
                      - generic [ref=f2e468]: School Readiness
                      - generic [ref=f2e470]: E2E-2611080354-h6r5 Number of Occurrences Program
                  - listitem [ref=f2e471]:
                    - button "School Readiness E2E-2611080358-s5gv Frequency/Rate Program" [ref=f2e472] [cursor=pointer]:
                      - generic [ref=f2e473]: School Readiness
                      - generic [ref=f2e475]: E2E-2611080358-s5gv Frequency/Rate Program
                  - listitem [ref=f2e476]:
                    - button "School Readiness E2E-2611080358-6n0q Interval Program" [ref=f2e477] [cursor=pointer]:
                      - generic [ref=f2e478]: School Readiness
                      - generic [ref=f2e480]: E2E-2611080358-6n0q Interval Program
                  - listitem [ref=f2e481]:
                    - button "School Readiness E2E-2611080358-ydg2 Duration Program" [ref=f2e482] [cursor=pointer]:
                      - generic [ref=f2e483]: School Readiness
                      - generic [ref=f2e485]: E2E-2611080358-ydg2 Duration Program
                  - listitem [ref=f2e486]:
                    - button "School Readiness E2E-2611080358-je8b Frequency + Duration Program" [ref=f2e487] [cursor=pointer]:
                      - generic [ref=f2e488]: School Readiness
                      - generic [ref=f2e490]: E2E-2611080358-je8b Frequency + Duration Program
                  - listitem [ref=f2e491]:
                    - button "School Readiness E2E-2611080402-qsdj Frequency/Rate Program" [ref=f2e492] [cursor=pointer]:
                      - generic [ref=f2e493]: School Readiness
                      - generic [ref=f2e495]: E2E-2611080402-qsdj Frequency/Rate Program
                  - listitem [ref=f2e496]:
                    - button "School Readiness E2E-2611080402-b7d8 Interval Program" [ref=f2e497] [cursor=pointer]:
                      - generic [ref=f2e498]: School Readiness
                      - generic [ref=f2e500]: E2E-2611080402-b7d8 Interval Program
                  - listitem [ref=f2e501]:
                    - button "School Readiness E2E-2611080402-qf04 Duration Program" [ref=f2e502] [cursor=pointer]:
                      - generic [ref=f2e503]: School Readiness
                      - generic [ref=f2e505]: E2E-2611080402-qf04 Duration Program
                  - listitem [ref=f2e506]:
                    - button "School Readiness E2E-2611080402-4duu Frequency + Duration Program" [ref=f2e507] [cursor=pointer]:
                      - generic [ref=f2e508]: School Readiness
                      - generic [ref=f2e510]: E2E-2611080402-4duu Frequency + Duration Program
                  - listitem [ref=f2e511]:
                    - button "School Readiness E2E-2611080406-72tt Frequency/Rate Program" [ref=f2e512] [cursor=pointer]:
                      - generic [ref=f2e513]: School Readiness
                      - generic [ref=f2e515]: E2E-2611080406-72tt Frequency/Rate Program
                  - listitem [ref=f2e516]:
                    - button "School Readiness E2E-2611080406-afk3 Interval Program" [ref=f2e517] [cursor=pointer]:
                      - generic [ref=f2e518]: School Readiness
                      - generic [ref=f2e520]: E2E-2611080406-afk3 Interval Program
                  - listitem [ref=f2e521]:
                    - button "School Readiness E2E-2611080406-7lqb Duration Program" [ref=f2e522] [cursor=pointer]:
                      - generic [ref=f2e523]: School Readiness
                      - generic [ref=f2e525]: E2E-2611080406-7lqb Duration Program
                  - listitem [ref=f2e526]:
                    - button "School Readiness E2E-2611080406-4enr Frequency + Duration Program" [ref=f2e527] [cursor=pointer]:
                      - generic [ref=f2e528]: School Readiness
                      - generic [ref=f2e530]: E2E-2611080406-4enr Frequency + Duration Program
                  - listitem [ref=f2e531]:
                    - button "School Readiness E2E-2611080436-igce Opportunity Based Program" [ref=f2e532] [cursor=pointer]:
                      - generic [ref=f2e533]: School Readiness
                      - generic [ref=f2e535]: E2E-2611080436-igce Opportunity Based Program
                  - listitem [ref=f2e536]:
                    - button "School Readiness E2E-2611080438-dusn Opportunity Based Program" [ref=f2e537] [cursor=pointer]:
                      - generic [ref=f2e538]: School Readiness
                      - generic [ref=f2e540]: E2E-2611080438-dusn Opportunity Based Program
                  - listitem [ref=f2e541]:
                    - button "School Readiness E2E-2611080440-62mj Opportunity Based Program" [ref=f2e542] [cursor=pointer]:
                      - generic [ref=f2e543]: School Readiness
                      - generic [ref=f2e545]: E2E-2611080440-62mj Opportunity Based Program
                  - listitem [ref=f2e546]:
                    - button "School Readiness E2E-2611080446-evsm Mastery Program" [ref=f2e547] [cursor=pointer]:
                      - generic [ref=f2e548]: School Readiness
                      - generic [ref=f2e550]: E2E-2611080446-evsm Mastery Program
                  - listitem [ref=f2e551]:
                    - button "School Readiness E2E-2611080449-ysh8 Mastery Program" [ref=f2e552] [cursor=pointer]:
                      - generic [ref=f2e553]: School Readiness
                      - generic [ref=f2e555]: E2E-2611080449-ysh8 Mastery Program
                  - listitem [ref=f2e556]:
                    - button "School Readiness E2E-2611080451-t1gu Mastery Program" [ref=f2e557] [cursor=pointer]:
                      - generic [ref=f2e558]: School Readiness
                      - generic [ref=f2e560]: E2E-2611080451-t1gu Mastery Program
            - main [ref=f2e561]:
              - generic [ref=f2e563]:
                - generic [ref=f2e564]:
                  - generic [ref=f2e565]:
                    - heading "Matching Identical Objects-Older" [level=2] [ref=f2e567]
                    - generic [ref=f2e568]:
                      - button "Record data" [ref=f2e569] [cursor=pointer]
                      - button "Edit this program" [ref=f2e573] [cursor=pointer]:
                        - generic [aria-hidden] [ref=f2e574]: 
                      - button "Add a target to this program" [ref=f2e575] [cursor=pointer]:
                        - generic [aria-hidden] [ref=f2e576]: 
                      - button "Print Skills Plan" [ref=f2e577] [cursor=pointer]:
                        - generic [aria-hidden] [ref=f2e578]: 
                      - button "Program actions" [active] [ref=f2e579] [cursor=pointer]:
                        - generic [aria-hidden] [ref=f2e580]: 
                  - navigation [ref=f2e581]:
                    - button "Program Details" [pressed] [ref=f2e582] [cursor=pointer]
                    - button "Lesson Information" [ref=f2e583] [cursor=pointer]
                    - button "Data" [ref=f2e584] [cursor=pointer]
                  - generic [ref=f2e585]:
                    - generic [ref=f2e586]:
                      - generic [ref=f2e587]:
                        - heading "Goals and Objectives" [level=3] [ref=f2e588]
                        - paragraph [ref=f2e589]: The student will match by placing identical objects together within a larger set.
                      - button "Edit" [ref=f2e590] [cursor=pointer]:
                        - generic [aria-hidden] [ref=f2e591]: 
                    - article [ref=f2e595]:
                      - generic [ref=f2e596]:
                        - generic [ref=f2e597]:
                          - heading "Objective 1" [level=4] [ref=f2e598]
                          - text: 2 Targets
                        - generic [ref=f2e599]: Not Started
                      - paragraph [ref=f2e600]: Objective 1
                  - generic [ref=f2e601]:
                    - generic [ref=f2e602]:
                      - generic [ref=f2e603]:
                        - heading "Data Settings" [level=3] [ref=f2e604]
                        - paragraph [ref=f2e605]: Collection preferences, mastery rules, and maintenance behavior.
                      - button "Manage Data Collection" [ref=f2e606] [cursor=pointer]:
                        - generic [aria-hidden] [ref=f2e607]: 
                    - article [ref=f2e609]:
                      - generic [ref=f2e610]:
                        - strong [ref=f2e611]: Opportunity Based
                        - text: No optional dimensions
                    - paragraph [ref=f2e612]: No mastery criteria configured. Use the Data Collection editor to set the mastery rule, generalization, and maintenance behavior.
                  - generic [ref=f2e613]:
                    - generic [ref=f2e614]:
                      - generic [ref=f2e615]:
                        - heading "Targets" [level=3] [ref=f2e616]
                        - paragraph [ref=f2e617]: Track active targets, teaching status, and mastery dates.
                        - generic [ref=f2e618]: All eligible targets available
                      - button "Manage Targets" [ref=f2e619] [cursor=pointer]:
                        - generic [aria-hidden] [ref=f2e620]: 
                    - table "Targets" [ref=f2e623]:
                      - row [ref=f2e624]:
                        - columnheader "Target" [ref=f2e625]
                        - columnheader "Objective" [ref=f2e626]
                        - columnheader "Group" [ref=f2e627]
                        - columnheader "Status" [ref=f2e628]
                        - columnheader "Phase" [ref=f2e629]
                        - columnheader "Date Opened" [ref=f2e630]
                        - columnheader "Date Mastered" [ref=f2e631]
                        - columnheader "Action" [ref=f2e632]
                      - row [ref=f2e633]:
                        - cell "t1" [ref=f2e634]
                        - cell "Objective 1" [ref=f2e635]
                        - cell "—" [ref=f2e636]
                        - cell "Mastered" [ref=f2e637]
                        - cell "—" [ref=f2e638]
                        - cell "Nov 26, 2024" [ref=f2e639]
                        - cell "Nov 26, 2024" [ref=f2e640]
                        - cell [ref=f2e641]:
                          - button "Unmaster t1" [ref=f2e642] [cursor=pointer]:
                            - generic [ref=f2e643]: 
                            - generic [ref=f2e644]: Unmaster
                      - row [ref=f2e645]:
                        - cell "t2" [ref=f2e646]
                        - cell "Objective 1" [ref=f2e647]
                        - cell "—" [ref=f2e648]
                        - cell "In Progress" [ref=f2e649]
                        - cell "—" [ref=f2e650]
                        - cell "Nov 26, 2024" [ref=f2e651]
                        - cell "—" [ref=f2e652]
                        - cell "–" [ref=f2e653]
                  - generic [ref=f2e655]:
                    - heading "Pending mastery determinations" [level=3] [ref=f2e656]
                    - paragraph [ref=f2e657]: No mastery determinations are waiting for review.
                - generic "Delete target group"
                - generic "Delete Program"
          - generic:
            - generic "Already on Plan"
```

# Test source

```ts
  1  | import { test, expect } from '../../../src/fixtures/test';
  2  | import { customProgramInput } from '../../../src/data/programs';
  3  | 
  4  | test.describe('US-6 Edit, archive, or delete a program', { tag: '@US-6' }, () => {
  5  |   test('TC-US06-01 [RHD-60119] Edit the goal and rename a program from the header', { tag: ['@xray', '@RHD-60119'] }, async ({ page, flows, plan, programDetails, testData }) => {
  6  |     const program = customProgramInput('Editable Program');
  7  |     const renamed = `${program.title} (renamed)`;
  8  |     await flows.signInAs('bcba');
  9  |     await flows.openClient(testData.clients.seeded);
  10 |     await flows.createCustomProgram(program);
  11 | 
  12 |     await test.step('Edit goal', async () => {
  13 |       await programDetails.editGoal('Updated goal: responds independently in 90% of opportunities.');
  14 |     });
  15 | 
  16 |     await test.step('Rename from the header', async () => {
  17 |       await programDetails.renameProgram(renamed);
  18 |       await expect(plan.railItem(renamed)).toBeVisible();
  19 |     });
  20 | 
  21 |     await test.step('Program actions menu lists each action once (RHD-58952)', async () => {
  22 |       await programDetails.actionsMenu.click();
  23 |       for (const action of ['Edit', 'Duplicate', 'Update Status', 'Delete']) {
> 24 |         await expect(page.getByRole('menuitem', { name: action, exact: true })).toHaveCount(1);
     |                                                                                 ^ Error: expect(locator).toHaveCount(expected) failed
  25 |       }
  26 |       await page.keyboard.press('Escape');
  27 |     });
  28 | 
  29 |     await test.step('Clean-up', async () => {
  30 |       await programDetails.deleteProgram(renamed);
  31 |     });
  32 |   });
  33 | 
  34 |   test('TC-US06-02 [RHD-60120] Discontinue (archive) a program, then delete it with confirmation', { tag: ['@xray', '@RHD-60120'] }, async ({ flows, plan, programDetails, testData }) => {
  35 |     const program = customProgramInput('Archive Program');
  36 |     await flows.signInAs('bcba');
  37 |     await flows.openClient(testData.clients.seeded);
  38 |     await flows.createCustomProgram(program);
  39 | 
  40 |     await test.step('Discontinue moves the program to Inactive', async () => {
  41 |       await programDetails.updateStatus(/Discontinu|Inactive/);
  42 |       await plan.expectProgramNotListed(program.title, 'current');
  43 |       await plan.expectProgramListed(program.title, 'inactive');
  44 |     });
  45 | 
  46 |     await test.step('Delete asks for confirmation', async () => {
  47 |       await plan.openProgram(program.title);
  48 |       const message = await programDetails.deleteProgram(program.title);
  49 |       expect(message, 'delete confirmation names the program').toMatch(/delete/i);
  50 |     });
  51 | 
  52 |     await test.step('Program is gone from every list', async () => {
  53 |       await plan.expectProgramNotListed(program.title, 'inactive');
  54 |       await plan.expectProgramNotListed(program.title, 'current');
  55 |     });
  56 |   });
  57 | });
  58 | 
```