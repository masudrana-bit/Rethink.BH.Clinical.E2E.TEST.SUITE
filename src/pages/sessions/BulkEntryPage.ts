import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

/** Post-Session Entry (historical / backfill) sheet: /sessions/:id/bulk-entry (US-14). */
export class BulkEntryPage extends BasePage {
  readonly root: Locator;
  readonly details: Locator;
  readonly dataPointCount: Locator;
  readonly serviceDate: Locator;
  readonly startTime: Locator;
  readonly endTime: Locator;
  readonly modeChip: Locator;
  readonly reviewButton: Locator;
  readonly moveToSummaryButton: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('data-sheet-page');
    this.details = this.tid('bulk-entry-details');
    this.dataPointCount = this.tid('bulk-entry-count');
    this.serviceDate = this.tid('bulk-entry-date');
    this.startTime = this.tid('bulk-entry-start');
    this.endTime = this.tid('bulk-entry-end');
    this.modeChip = this.tid('bulk-entry-mode-chip');
    this.reviewButton = this.tid('bulk-entry-review-button');
    this.moveToSummaryButton = this.tid('bulk-entry-move-to-summary');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/sessions\/[0-9a-f-]{36}\/bulk-entry/, { timeout: 60_000 });
    await expect(this.details).toBeVisible({ timeout: 60_000 });
  }

  card(programName: string | RegExp): Locator {
    return this.root.locator('[data-testid^="data-sheet-program-card-"]').filter({ hasText: programName }).first();
  }

  /** Enters trial counts for one target and applies them. */
  async enterCounts(target: string, counts: { correct?: number; incorrect?: number; na?: number }): Promise<void> {
    const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const labels = { correct: 'Correct', incorrect: 'Incorrect', na: '(N/A|Not applicable)' } as const;
    for (const key of Object.keys(labels) as (keyof typeof labels)[]) {
      const value = counts[key];
      if (value === undefined) continue;
      await this.page.getByRole('spinbutton', { name: new RegExp(`^${labels[key]} count for ${escaped}$`) }).fill(String(value));
    }
    const apply = this.page.getByRole('button', { name: `Apply counts for ${target}` });
    await expect(apply).toBeEnabled();
    await apply.click();
  }

  async enteredPoints(): Promise<number> {
    return Number((await this.dataPointCount.innerText()).match(/(\d+)/)?.[1] ?? 0);
  }

  async score(programName: string | RegExp): Promise<string> {
    return (await this.card(programName).locator('[data-testid^="data-sheet-score-"]').first().innerText()).trim();
  }

  async reviewAndMoveToSummary(): Promise<void> {
    await this.reviewButton.click();
    await expect(this.moveToSummaryButton).toBeVisible();
    await this.moveToSummaryButton.click();
    await expect(this.page).toHaveURL(/\/sessions\/[0-9a-f-]{36}\/summary/, { timeout: 60_000 });
  }
}
