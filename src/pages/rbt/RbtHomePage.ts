import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

/** RBT shell landing page: /rbt (US-10, US-11, US-25). */
export class RbtHomePage extends BasePage {
  readonly root: Locator;
  readonly incompleteAlert: Locator;
  readonly incompleteCount: Locator;
  readonly concludedRows: Locator;
  readonly resumeSection: Locator;
  readonly resumableRows: Locator;
  readonly todayList: Locator;
  readonly newSessionButton: Locator;
  readonly scheduledRows: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('rbt-home-page');
    this.incompleteAlert = this.tid('rbt-home-incomplete-alert');
    this.incompleteCount = this.tid('rbt-home-incomplete-count');
    this.concludedRows = this.tid('concluded-sessions-list').locator('[data-testid^="concluded-sessions-row-"]');
    this.resumeSection = this.tid('rbt-home-resume');
    this.resumableRows = this.tid('resumable-sessions-list').locator('[data-testid^="resumable-sessions-row-"]');
    this.todayList = this.tid('rbt-home-today-list');
    this.newSessionButton = this.tid('rbt-home-new-session-button');
    this.scheduledRows = this.tid('scheduled-sessions-list').locator('[data-testid^="scheduled-sessions-row-"]');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/rbt$/);
    await expect(this.root).toBeVisible();
    await expect(this.todayList).toBeVisible();
  }

  scheduledFor(clientName: string | RegExp): Locator {
    return this.scheduledRows.filter({ hasText: clientName }).first();
  }

  resumableFor(clientName: string | RegExp): Locator {
    return this.resumableRows.filter({ hasText: clientName }).first();
  }

  resumableById(sessionId: string): Locator {
    return this.tid(`resumable-sessions-row-${sessionId}`);
  }

  async openScheduled(clientName: string | RegExp): Promise<void> {
    await this.scheduledFor(clientName).locator('[data-testid^="scheduled-sessions-open-button-"]').click();
    await expect(this.page).toHaveURL(/\/sessions\/[0-9a-f-]{36}(\?|$)/);
  }

  /** "12 programs / 11 targets" on a scheduled row. */
  async scheduledCounts(clientName: string | RegExp): Promise<{ programs: number; targets: number }> {
    const counts = this.scheduledFor(clientName).locator('[data-testid^="scheduled-sessions-counts-"]');
    // Counts are fetched after the row renders.
    await expect(counts).toHaveText(/\d+\s*programs?\s*\/\s*\d+\s*targets?/i, { timeout: 30_000 });
    const text = await counts.innerText();
    const [, programs, targets] = text.match(/(\d+)\s*programs?\s*\/\s*(\d+)\s*targets?/i) ?? [];
    return { programs: Number(programs ?? NaN), targets: Number(targets ?? NaN) };
  }

  /** Client name of a scheduled row (the first line that is not a time or duration, without its status badge). */
  async rowClientName(row: Locator): Promise<string> {
    const line = (await row.innerText()).split('\n').map((l) => l.trim()).find((l) => /[A-Za-z]/.test(l) && !/\b(AM|PM|hr|min)\b/.test(l)) ?? '';
    return line.replace(/\s+(Missed|Paused|In progress|Completed)$/i, '').trim();
  }

  concludedFor(clientName: string | RegExp): Locator {
    return this.concludedRows.filter({ hasText: clientName });
  }

  async reviewConcluded(clientName: string | RegExp): Promise<void> {
    await this.concludedFor(clientName).first().locator('[data-testid^="concluded-sessions-review-button-"]').click();
    await expect(this.page).toHaveURL(/\/sessions\/[0-9a-f-]{36}\/summary/);
  }

  async resumeSession(sessionId: string): Promise<void> {
    await this.tid(`resumable-sessions-resume-button-${sessionId}`).click();
    await expect(this.page).toHaveURL(new RegExp(`/sessions/${sessionId}/run`));
  }

  async startNewSession(): Promise<void> {
    await this.newSessionButton.click();
    await expect(this.page).toHaveURL(/\/sessions\/new/);
  }
}
