# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stories/04-session-lifecycle/us-13-start-pause-resume-close.spec.ts >> US-13 Start, pause, resume, and close a session >> TC-US13-01 [RHD-61114] Pause and resume keep the timer and recorded data; summary shows real times
- Location: tests/stories/04-session-lifecycle/us-13-start-pause-resume-close.spec.ts:5:7

# Error details

```
Error: Timeout 20000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=f2e4]:
  - banner [ref=f2e6]:
    - generic [ref=f2e7]:
      - button "Back to Sessions" [ref=f2e8] [cursor=pointer]:
        - generic [aria-hidden] [ref=f2e9]: 
        - generic [ref=f2e10]: Sessions
      - generic [ref=f2e11]:
        - generic [ref=f2e12]: "!*!Billy!*! !*!Billerson!*!"
        - generic [ref=f2e13]: Nov 9, 2026
    - generic [ref=f2e16]:
      - timer "Session duration" [ref=f2e18]:
        - strong [ref=f2e20]: "Session Duration: 0:41"
      - button "Close Session" [ref=f2e21] [cursor=pointer]
  - main [ref=f2e22]:
    - heading "Data Sheet" [level=1] [ref=f2e23]
    - group "Data sheet view" [ref=f2e24]:
      - button "Standard View" [pressed] [ref=f2e25] [cursor=pointer]:
        - generic [aria-hidden] [ref=f2e26]: 
      - button "Grid View" [ref=f2e28] [cursor=pointer]:
        - generic [aria-hidden] [ref=f2e29]: 
      - button "Collapse Programs" [ref=f2e31] [cursor=pointer]
    - group "!*!Billy!*! !*!Billerson!*!" [ref=f2e32]:
      - generic [ref=f2e33]:
        - generic [ref=f2e34]:
          - generic [ref=f2e35]:
            - heading "Requesting preferred items" [level=2] [ref=f2e36]
            - generic [ref=f2e37]:
              - generic [ref=f2e38]: Opportunity Based
              - generic [ref=f2e39]: School Readiness
              - generic [ref=f2e40]: Foundational Math
              - button "Open program properties for Requesting preferred items" [ref=f2e41] [cursor=pointer]:
                - generic [aria-hidden] [ref=f2e42]: 
          - generic [ref=f2e43]:
            - generic [ref=f2e44]:
              - generic [ref=f2e46]:
                - button "Move Snack items up" [disabled] [ref=f2e47]:
                  - generic [aria-hidden] [ref=f2e48]: 
                - generic [ref=f2e50]: 
                - button "Move Snack items down" [ref=f2e51] [cursor=pointer]:
                  - generic [aria-hidden] [ref=f2e52]: 
              - button "Expand Snack items" [ref=f2e53] [cursor=pointer]:
                - generic [aria-hidden] [ref=f2e54]: 
              - generic [ref=f2e55]:
                - heading "Snack items" [level=3] [ref=f2e56]
                - generic [ref=f2e57]: Baseline
                - generic [ref=f2e59]:
                  - button "Remove Snack items from this session" [ref=f2e60] [cursor=pointer]: Remove
                  - button "Add note for Snack items" [ref=f2e61] [cursor=pointer]:
                    - generic [aria-hidden] [ref=f2e62]: 
                    - text: Note
              - 'generic "Snack items: 100% correct" [ref=f2e64]': 100%
              - generic [ref=f2e66]:
                - generic [ref=f2e67]:
                  - button "Correct for Snack items, 1 recorded" [ref=f2e68] [cursor=pointer]:
                    - generic [ref=f2e70]: "1"
                  - button "Incorrect for Snack items" [ref=f2e71] [cursor=pointer]
                  - button "Not applicable for Snack items" [ref=f2e73] [cursor=pointer]:
                    - generic [aria-hidden] [ref=f2e74]: N/A
                - button "Undo last trial for Snack items" [ref=f2e75] [cursor=pointer]:
                  - generic [aria-hidden] [ref=f2e76]: 
            - generic [ref=f2e77]:
              - generic [ref=f2e79]:
                - button "Move Toy items up" [ref=f2e80] [cursor=pointer]:
                  - generic [aria-hidden] [ref=f2e81]: 
                - generic [ref=f2e83]: 
                - button "Move Toy items down" [disabled] [ref=f2e84]:
                  - generic [aria-hidden] [ref=f2e85]: 
              - button "Expand Toy items" [ref=f2e86] [cursor=pointer]:
                - generic [aria-hidden] [ref=f2e87]: 
              - generic [ref=f2e88]:
                - heading "Toy items" [level=3] [ref=f2e89]
                - generic [ref=f2e90]: Baseline
                - generic [ref=f2e92]:
                  - button "Remove Toy items from this session" [ref=f2e93] [cursor=pointer]: Remove
                  - button "Add note for Toy items" [ref=f2e94] [cursor=pointer]:
                    - generic [aria-hidden] [ref=f2e95]: 
                    - text: Note
              - 'generic "Toy items: no trials scored yet" [ref=f2e97]': "--"
              - generic [ref=f2e99]:
                - generic [ref=f2e100]:
                  - button "Correct for Toy items" [ref=f2e101] [cursor=pointer]
                  - button "Incorrect for Toy items" [ref=f2e103] [cursor=pointer]
                  - button "Not applicable for Toy items" [ref=f2e105] [cursor=pointer]:
                    - generic [aria-hidden] [ref=f2e106]: N/A
                - button "Undo last trial for Toy items" [disabled] [ref=f2e107]:
                  - generic [aria-hidden] [ref=f2e108]: 
        - status [ref=f2e109]: Loading the other programs…
    - generic [ref=f2e111]:
      - button "Menu" [ref=f2e112] [cursor=pointer]
      - group "Session quick actions" [ref=f2e116]:
        - generic [ref=f2e117]:
          - button "Record ABC Data" [ref=f2e118] [cursor=pointer]:
            - generic [aria-hidden] [ref=f2e119]: 
          - button "Quick Note" [ref=f2e121] [cursor=pointer]:
            - generic [aria-hidden] [ref=f2e122]: 
        - status [ref=f2e125]
      - button "Programs" [ref=f2e126] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '../../../src/fixtures/test';
  2  | import { clockPatterns } from '../../../src/data/dates';
  3  | 
  4  | test.describe('US-13 Start, pause, resume, and close a session', { tag: '@US-13' }, () => {
  5  |   test('TC-US13-01 [RHD-61114] Pause and resume keep the timer and recorded data; summary shows real times', { tag: ['@xray', '@RHD-61114'] }, async ({ page, flows, dataSheet, closeSession, rbtSessions, sessionClose, testData }) => {
  6  |     const client = testData.clients.seeded;
  7  |     const program = testData.seeded.obProgram;
  8  |     const target = testData.seeded.obTarget;
  9  |     await flows.signInAs('rbt');
  10 |     const startedAt = new Date();
  11 |     await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] } });
  12 |     const clientName = await dataSheet.title();
  13 | 
  14 |     let clockBeforePause = 0;
  15 |     let pausedAtMs = 0;
  16 |     await test.step('Record a trial and let the clock run', async () => {
  17 |       await dataSheet.recordOutcome(program, target, 'Correct');
  18 |       await expect.poll(() => dataSheet.targetScore(program)).toBe('100%');
  19 |       await expect.poll(() => dataSheet.clockSeconds(), { timeout: 20_000 }).toBeGreaterThanOrEqual(5);
  20 |     });
  21 | 
  22 |     await test.step('Pause / step away', async () => {
  23 |       clockBeforePause = await dataSheet.clockSeconds();
  24 |       pausedAtMs = Date.now();
  25 |       await dataSheet.openCloseSession();
  26 |       await closeSession.pause();
  27 |       await rbtSessions.expectLoaded();
  28 |       await expect(rbtSessions.resumableFor(clientName)).toContainText(/paused/i);
  29 |     });
  30 | 
  31 |     await test.step('Resume after 5 s: clock continues and data is kept', async () => {
  32 |       await page.waitForTimeout(5_000);
  33 |       await rbtSessions.resume(clientName);
  34 |       await dataSheet.expectLoaded();
  35 |       const clockAfterResume = await dataSheet.clockSeconds();
  36 |       const wallSeconds = Math.round((Date.now() - pausedAtMs) / 1000);
  37 |       expect(clockAfterResume, 'timer survives the pause (not reset)').toBeGreaterThanOrEqual(clockBeforePause);
  38 |       expect.soft(clockAfterResume - clockBeforePause, 'paused time is not counted on the session clock').toBeLessThan(wallSeconds);
> 39 |       await expect.poll(() => dataSheet.targetScore(program)).toBe('100%');
     |                                                               ^ Error: Timeout 20000ms exceeded while waiting on the predicate
  40 |     });
  41 | 
  42 |     await test.step('Summary shows the pause and the real start time (NGC-92)', async () => {
  43 |       await flows.concludeToSummary();
  44 |       await expect(sessionClose.pauseRows).toHaveCount(1);
  45 |       await expect(sessionClose.pausedDuration).not.toHaveText(/^\s*0\s*(s|m)?\s*$/);
  46 |       await expect(page.getByText(/Gross .+ minus .+ paused/).first()).toBeVisible();
  47 |       const startValue = (await sessionClose.startTimeInput.inputValue().catch(async () => sessionClose.startTimeInput.innerText())).trim();
  48 |       const startAudit = await page.getByTestId('session-audit-times-section').innerText();
  49 |       const realStart = clockPatterns(startedAt).concat(clockPatterns(new Date(startedAt.getTime() + 60_000)));
  50 |       expect.soft(realStart.some((t) => startValue.includes(t) || startAudit.includes(t)), `session start shows the real start (${realStart[2]}), got "${startValue}" / "${startAudit.replace(/\s+/g, ' ')}" (NGC-92)`).toBe(true);
  51 |       await expect(sessionClose.scoredTotal).toHaveText(/\b1\b/);
  52 |     });
  53 | 
  54 |     await test.step('Finalize', async () => {
  55 |       await sessionClose.finalize();
  56 |     });
  57 |   });
  58 | 
  59 |   test('TC-US13-02 [RHD-61118] Transfer uses a staff picker; Cancel keeps the session running', { tag: ['@xray', '@RHD-61118'] }, async ({ flows, dataSheet, closeSession, testData }) => {
  60 |     await flows.signInAs('rbt');
  61 |     await flows.startLiveSessionAsRbt({ clientIds: [testData.clients.seeded] });
  62 | 
  63 |     await test.step('Transfer offers a Receiving Staff picker (NGC-57)', async () => {
  64 |       await dataSheet.openCloseSession();
  65 |       let staff = await closeSession.receivingStaffOptions();
  66 |       if (!staff.length) {
  67 |         test.info().annotations.push({ type: 'dev2 load error', description: 'Receiving Staff list empty; cancelled and reopened Close Session' });
  68 |         await closeSession.cancel();
  69 |         await dataSheet.openCloseSession();
  70 |         staff = await closeSession.receivingStaffOptions();
  71 |       }
  72 |       test.skip(!staff.length, 'dev2 environment outage: Receiving Staff list is empty twice (Accounts staff lookup failing)');
  73 |       expect(staff.length, 'Receiving Staff lists staff members (NGC-57)').toBeGreaterThan(0);
  74 |       expect(staff.some((s) => /,\s*(RBT|BCBA)/.test(s)), 'staff are shown with their role').toBe(true);
  75 |       await expect(closeSession.confirmButton).toHaveText(/go to end session/i);
  76 |       await closeSession.chooseReceivingStaff(staff.find((s) => /RBT/.test(s)) ?? staff[0]);
  77 |     });
  78 | 
  79 |     await test.step('Cancel keeps the session running', async () => {
  80 |       const before = await dataSheet.clockSeconds();
  81 |       await closeSession.cancel();
  82 |       await dataSheet.expectLoaded();
  83 |       await expect.poll(() => dataSheet.clockSeconds(), { timeout: 10_000 }).toBeGreaterThan(before);
  84 |     });
  85 | 
  86 |     await test.step('Conclude and finalize', async () => {
  87 |       await flows.concludeAndFinalize();
  88 |     });
  89 |   });
  90 | });
  91 | 
```