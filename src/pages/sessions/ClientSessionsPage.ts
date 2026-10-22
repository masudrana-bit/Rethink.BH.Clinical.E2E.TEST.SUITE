import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

/** Client "Sessions" tab: finalize banner, live/historical entry points, active and upcoming sessions. */
export class ClientSessionsPage extends BasePage {
  readonly root: Locator;
  readonly finalizeNotice: Locator;
  readonly filter: Locator;
  readonly startLiveLink: Locator;
  readonly postSessionEntryLink: Locator;
  readonly activeSessions: Locator;
  readonly upcomingSessions: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('client-sessions-page');
    this.finalizeNotice = this.tid('client-sessions-finalize-notice');
    this.filter = this.tid('client-sessions-filter');
    this.startLiveLink = this.tid('client-sessions-start-live');
    this.postSessionEntryLink = this.tid('client-sessions-enter-historical');
    this.activeSessions = this.root.locator('article[data-testid^="client-sessions-active-"]');
    this.upcomingSessions = this.root.locator('article[data-testid^="client-sessions-upcoming-"]');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.startLiveLink).toBeVisible();
  }

  async showFilter(name: 'Upcoming' | 'Previous'): Promise<void> {
    await this.filter.getByText(name, { exact: true }).click();
  }

  async finalizeCount(): Promise<number> {
    if (!(await this.finalizeNotice.isVisible().catch(() => false))) return 0;
    return Number((await this.finalizeNotice.innerText()).match(/(\d+)/)?.[1] ?? 0);
  }

  activeSessionById(sessionId: string): Locator {
    return this.tid(`client-sessions-active-${sessionId}`);
  }

  async resume(sessionId: string): Promise<void> {
    await this.tid(`client-sessions-resume-${sessionId}`).click();
    await expect(this.page).toHaveURL(new RegExp(`/sessions/${sessionId}/run`));
  }

  async openFirstUpcoming(): Promise<void> {
    await this.upcomingSessions.first().locator('[data-testid^="client-sessions-open-"]').click();
  }

  async startLive(): Promise<void> {
    await this.startLiveLink.click();
    await expect(this.page).toHaveURL(/\/sessions\/new/);
  }

  async startPostSessionEntry(): Promise<void> {
    await this.postSessionEntryLink.click();
    await expect(this.page).toHaveURL(/\/sessions\/historical\/new/);
  }
}
