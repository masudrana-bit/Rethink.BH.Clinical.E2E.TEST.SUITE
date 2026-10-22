import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { readPrimeOptions, selectPrimeOption } from '../../helpers/primeng';

export type SessionRange = 'today' | 'this-week' | 'last-week' | 'next-week' | 'all' | 'custom';

/** RBT "Sessions" list: /rbt/sessions (US-11). */
export class RbtSessionsPage extends BasePage {
  readonly root: Locator;
  readonly rangeLabel: Locator;
  readonly filteredCount: Locator;
  readonly startLiveButton: Locator;
  readonly postSessionEntry: Locator;
  readonly clientFilter: Locator;
  readonly statusFilter: Locator;
  readonly noteFilter: Locator;
  readonly scheduledRows: Locator;
  readonly resumableRows: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('rbt-sessions-page');
    this.rangeLabel = this.tid('rbt-sessions-range-label');
    this.filteredCount = this.tid('rbt-sessions-filtered-count');
    this.startLiveButton = this.tid('rbt-sessions-new-session-button');
    this.postSessionEntry = this.tid('rbt-sessions-post-session-entry');
    this.clientFilter = this.tid('rbt-sessions-client-filter');
    this.statusFilter = this.tid('rbt-sessions-status-filter');
    this.noteFilter = this.tid('rbt-sessions-note-filter');
    this.scheduledRows = this.tid('scheduled-sessions-list').locator('[data-testid^="scheduled-sessions-row-"]');
    this.resumableRows = this.tid('resumable-sessions-list').locator('[data-testid^="resumable-sessions-row-"]');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/rbt\/sessions/);
    await expect(this.root).toBeVisible();
    await expect(this.filteredCount).toBeVisible();
  }

  async chooseRange(range: SessionRange): Promise<void> {
    await this.tid(`rbt-sessions-range-${range}`).click();
    await this.waitForLoaded();
  }

  async clientFilterOptions(): Promise<string[]> {
    return (await readPrimeOptions(this.page, this.clientFilter)).filter((o) => !/^all clients$/i.test(o));
  }

  async filterClient(name: string | RegExp): Promise<void> {
    await selectPrimeOption(this.page, this.clientFilter, name);
  }

  async sessionCount(): Promise<number> {
    return Number((await this.filteredCount.innerText()).match(/(\d+)/)?.[1] ?? 0);
  }

  resumableFor(clientName: string | RegExp): Locator {
    return this.resumableRows.filter({ hasText: clientName }).first();
  }

  async resume(clientName: string | RegExp): Promise<void> {
    await this.resumableFor(clientName).locator('[data-testid^="resumable-sessions-resume-button-"]').click();
    await expect(this.page).toHaveURL(/\/sessions\/[0-9a-f-]{36}\/run/);
  }

  scheduledFor(clientName: string | RegExp): Locator {
    return this.scheduledRows.filter({ hasText: clientName }).first();
  }

  async rowClientNames(): Promise<string[]> {
    return (await this.scheduledRows.allInnerTexts()).map((t) => t.replace(/\s+/g, ' '));
  }
}
