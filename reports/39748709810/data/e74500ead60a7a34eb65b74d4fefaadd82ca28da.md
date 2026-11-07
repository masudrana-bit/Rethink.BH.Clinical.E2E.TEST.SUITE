# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stories/04-session-lifecycle/us-14-historical-entry.spec.ts >> US-14 Enter historical / backfill session data >> TC-US14-01 Backfill a past date with times left blank and see it in the program data
- Location: tests/stories/04-session-lifecycle/us-14-historical-entry.spec.ts:5:7

# Error details

```
TimeoutError: locator.fill: Timeout 20000ms exceeded.
Call log:
  - waiting for getByRole('spinbutton', { name: /^Correct count for Snack items$/ })

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
        - generic [ref=f2e12]: AppClient AppClient
        - generic [ref=f2e13]: Oct 15, 2026
    - generic [ref=f2e16]:
      - generic [ref=f2e17]: Post-Session Entry
      - button "Review Entry" [ref=f2e18] [cursor=pointer]
  - main [ref=f2e19]:
    - heading "Post-Session Entry" [level=1] [ref=f2e20]
    - region [ref=f2e22]:
      - generic [ref=f2e23]:
        - heading "Post-Session Entry for Scheduled Session" [level=2] [ref=f2e24]
        - generic [ref=f2e25]: 0 data points entered
      - generic [ref=f2e26]:
        - generic [ref=f2e27]:
          - generic [ref=f2e28]: Client
          - textbox "Client" [ref=f2e29]: AppClient AppClient
        - generic [ref=f2e30]:
          - generic [ref=f2e31]: Service date
          - textbox "Service date" [ref=f2e32]: 2026-10-15
        - generic [ref=f2e33]:
          - generic [ref=f2e34]: Service
          - textbox "Service" [ref=f2e35]: Post-Session Entry
        - generic [ref=f2e36]:
          - generic [ref=f2e37]: Setting
          - textbox "Setting" [ref=f2e38]
        - generic [ref=f2e39]:
          - generic [ref=f2e40]: Location
          - textbox "Location" [ref=f2e41]
        - generic [ref=f2e42]:
          - generic [ref=f2e43]: Staff
          - textbox "Staff" [ref=f2e44]: *** ***
        - generic [ref=f2e45]:
          - generic [ref=f2e46]: Session start
          - textbox "Session start" [ref=f2e47]
        - generic [ref=f2e48]:
          - generic [ref=f2e49]: Session end
          - textbox "Session end" [ref=f2e50]
    - group "Data sheet view" [ref=f2e51]:
      - button "Standard View" [pressed] [ref=f2e52] [cursor=pointer]:
        - generic [aria-hidden] [ref=f2e53]: 
      - button "Grid View" [ref=f2e55] [cursor=pointer]:
        - generic [aria-hidden] [ref=f2e56]: 
      - button "Collapse Programs" [ref=f2e58] [cursor=pointer]
      - generic [ref=f2e59]:
        - generic [aria-hidden] [ref=f2e60]: 
        - text: Entered outside session
    - generic [ref=f2e62]:
      - button "Menu" [ref=f2e63] [cursor=pointer]
      - group "Session quick actions" [ref=f2e67]:
        - generic [ref=f2e68]:
          - button "Record ABC Data" [ref=f2e69] [cursor=pointer]:
            - generic [aria-hidden] [ref=f2e70]: 
          - button "Quick Note" [ref=f2e72] [cursor=pointer]:
            - generic [aria-hidden] [ref=f2e73]: 
        - status [ref=f2e76]
      - button "Programs" [ref=f2e77] [cursor=pointer]
```

# Test source

```ts
  1  | import { expect, Locator, Page } from '@playwright/test';
  2  | import { BasePage } from '../BasePage';
  3  | 
  4  | /** Post-Session Entry (historical / backfill) sheet: /sessions/:id/bulk-entry (US-14). */
  5  | export class BulkEntryPage extends BasePage {
  6  |   readonly root: Locator;
  7  |   readonly details: Locator;
  8  |   readonly dataPointCount: Locator;
  9  |   readonly serviceDate: Locator;
  10 |   readonly startTime: Locator;
  11 |   readonly endTime: Locator;
  12 |   readonly modeChip: Locator;
  13 |   readonly reviewButton: Locator;
  14 |   readonly moveToSummaryButton: Locator;
  15 | 
  16 |   constructor(page: Page) {
  17 |     super(page);
  18 |     this.root = this.tid('data-sheet-page');
  19 |     this.details = this.tid('bulk-entry-details');
  20 |     this.dataPointCount = this.tid('bulk-entry-count');
  21 |     this.serviceDate = this.tid('bulk-entry-date');
  22 |     this.startTime = this.tid('bulk-entry-start');
  23 |     this.endTime = this.tid('bulk-entry-end');
  24 |     this.modeChip = this.tid('bulk-entry-mode-chip');
  25 |     this.reviewButton = this.tid('bulk-entry-review-button');
  26 |     this.moveToSummaryButton = this.tid('bulk-entry-move-to-summary');
  27 |   }
  28 | 
  29 |   async expectLoaded(): Promise<void> {
  30 |     await expect(this.page).toHaveURL(/\/sessions\/[0-9a-f-]{36}\/bulk-entry/, { timeout: 60_000 });
  31 |     await expect(this.details).toBeVisible({ timeout: 60_000 });
  32 |   }
  33 | 
  34 |   card(programName: string | RegExp): Locator {
  35 |     return this.root.locator('[data-testid^="data-sheet-program-card-"]').filter({ hasText: programName }).first();
  36 |   }
  37 | 
  38 |   /** Enters trial counts for one target and applies them. */
  39 |   async enterCounts(target: string, counts: { correct?: number; incorrect?: number; na?: number }): Promise<void> {
  40 |     const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  41 |     const labels = { correct: 'Correct', incorrect: 'Incorrect', na: '(N/A|Not applicable)' } as const;
  42 |     for (const key of Object.keys(labels) as (keyof typeof labels)[]) {
  43 |       const value = counts[key];
  44 |       if (value === undefined) continue;
> 45 |       await this.page.getByRole('spinbutton', { name: new RegExp(`^${labels[key]} count for ${escaped}$`) }).fill(String(value));
     |                                                                                                              ^ TimeoutError: locator.fill: Timeout 20000ms exceeded.
  46 |     }
  47 |     const apply = this.page.getByRole('button', { name: `Apply counts for ${target}` });
  48 |     await expect(apply).toBeEnabled();
  49 |     await apply.click();
  50 |   }
  51 | 
  52 |   async enteredPoints(): Promise<number> {
  53 |     return Number((await this.dataPointCount.innerText()).match(/(\d+)/)?.[1] ?? 0);
  54 |   }
  55 | 
  56 |   async score(programName: string | RegExp): Promise<string> {
  57 |     return (await this.card(programName).locator('[data-testid^="data-sheet-score-"]').first().innerText()).trim();
  58 |   }
  59 | 
  60 |   async reviewAndMoveToSummary(): Promise<void> {
  61 |     await this.reviewButton.click();
  62 |     await expect(this.moveToSummaryButton).toBeVisible();
  63 |     await this.moveToSummaryButton.click();
  64 |     await expect(this.page).toHaveURL(/\/sessions\/[0-9a-f-]{36}\/summary/, { timeout: 60_000 });
  65 |   }
  66 | }
  67 | 
```