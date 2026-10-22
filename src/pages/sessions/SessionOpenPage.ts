import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

/** Pre-session page shown for scheduled and newly created live sessions: /sessions/:id (US-11, US-12, US-13). */
export class SessionOpenPage extends BasePage {
  readonly root: Locator;
  readonly backLink: Locator;
  readonly time: Locator;
  readonly clientDetails: Locator;
  readonly clientTabs: Locator;
  readonly service: Locator;
  readonly prepCard: Locator;
  readonly prepPrograms: Locator;
  readonly noteTemplate: Locator;
  readonly startButton: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('session-open-page');
    this.backLink = this.tid('session-open-back-link');
    this.time = this.tid('session-open-time');
    this.clientDetails = this.tid('session-open-client-details');
    this.clientTabs = this.tidPrefix('summary-client-rail-tab-');
    this.service = this.tid('session-open-service');
    this.prepCard = this.tid('session-open-prep-card');
    this.prepPrograms = this.tid('session-prep-programs');
    this.noteTemplate = this.tid('session-open-note-template');
    this.startButton = this.tid('session-open-start-button');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/sessions\/[0-9a-f-]{36}(\?|$)/);
    await expect(this.root).toBeVisible();
    await expect(this.startButton).toBeEnabled();
  }

  async chooseNoteTemplate(label: string): Promise<void> {
    await this.noteTemplate.selectOption({ label });
  }

  /** Starts the session and returns how long the data sheet took to appear (ms). */
  async start(): Promise<number> {
    const startedAt = Date.now();
    await this.startButton.click();
    await expect(this.page).toHaveURL(/\/sessions\/[0-9a-f-]{36}\/run/, { timeout: 60_000 });
    await expect(this.tid('session-clock')).toBeVisible({ timeout: 60_000 });
    return Date.now() - startedAt;
  }
}
