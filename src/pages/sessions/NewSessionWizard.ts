import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export interface SessionSetup {
  clientIds: string[];
  observationDate?: string;
  programs?: Record<string, string[]>;
  behaviors?: Record<string, string[]>;
  noteTemplate?: string;
  prepNote?: string;
}

/** Start Live Session / Post-Session Entry wizard: 1. Clients  2. Skills & behaviors  3. Confirm. */
export class NewSessionWizard extends BasePage {
  readonly root: Locator;
  readonly modeBadge: Locator;
  readonly steps: Locator;
  readonly clientSearch: Locator;
  readonly observationDate: Locator;
  readonly selectedCount: Locator;
  readonly nextButton: Locator;
  readonly backButton: Locator;
  readonly programSearch: Locator;
  readonly addAll: Locator;
  readonly clearPicks: Locator;
  readonly sessionOrder: Locator;
  readonly sessionBehaviors: Locator;
  readonly noteTemplate: Locator;
  readonly prepNote: Locator;
  readonly selectionTotal: Locator;
  readonly confirmParticipants: Locator;
  readonly confirmStep: Locator;
  readonly submitButton: Locator;
  readonly exitLink: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('new-session-page');
    this.modeBadge = this.tid('new-session-mode-badge');
    this.steps = this.tid('new-session-step-indicator');
    this.clientSearch = this.tid('new-session-client-search');
    this.observationDate = this.tid('new-session-observation-date-input');
    this.selectedCount = this.tid('new-session-selected-count');
    this.nextButton = this.tid('new-session-next-button');
    this.backButton = this.tid('new-session-back-button');
    this.programSearch = this.tid('new-session-program-search');
    this.addAll = this.tid('new-session-add-all');
    this.clearPicks = this.tid('new-session-clear-picks');
    this.sessionOrder = this.tid('new-session-session-order');
    this.sessionBehaviors = this.tid('new-session-session-behaviors');
    this.noteTemplate = this.tid('new-session-note-template-select');
    this.prepNote = this.tid('new-session-prep-note-input');
    this.selectionTotal = this.tid('new-session-selection-total');
    this.confirmParticipants = this.tid('new-session-confirm-participants');
    this.confirmStep = this.tid('new-session-step-confirm');
    this.submitButton = this.tid('new-session-submit-button');
    this.exitLink = this.tid('new-session-exit-link');
  }

  clientCheckbox(clientId: string): Locator {
    return this.tid(`new-session-client-checkbox-${clientId}`);
  }

  async expectOpen(mode: 'LIVE' | 'HISTORICAL'): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.modeBadge).toHaveText(mode);
  }

  async selectClients(clientIds: string[]): Promise<void> {
    for (const id of clientIds) {
      const box = this.clientCheckbox(id);
      await expect(box, `client ${id} should be offered in the wizard (caseload loaded)`).toBeAttached({ timeout: 30_000 });
      await box.scrollIntoViewIfNeeded();
      if (!(await box.isChecked())) await box.check({ force: true });
    }
    await expect(this.selectedCount).toContainText(`${clientIds.length} / 8`);
  }

  async next(): Promise<void> {
    await this.nextButton.click();
  }

  configureButton(clientId: string): Locator {
    return this.tid(`new-session-config-client-${clientId}`);
  }

  /** Program / behaviour pick in step 2, matched on its exact name. */
  pick(name: string): Locator {
    const exact = new RegExp(`^\\s*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
    return this.tid('new-session-step-programs').locator('li').filter({ has: this.page.locator('label strong').filter({ hasText: exact }) }).first();
  }

  async configureClient(clientId: string, programs: string[] = [], behaviors: string[] = []): Promise<void> {
    await this.configureButton(clientId).click();
    await this.recoverLoadErrors(this.tid('new-session-step-programs').locator('li label strong').first());
    for (const name of [...programs, ...behaviors]) {
      await this.programSearch.fill(name);
      const box = this.pick(name).locator('input[type=checkbox]');
      if (!(await box.isChecked())) await box.check({ force: true });
    }
    await this.programSearch.fill('');
    for (const name of programs) await expect(this.sessionOrder).toContainText(name);
    for (const name of behaviors) await expect(this.sessionBehaviors).toContainText(name);
  }

  /** "Add all" for one client; returns the "N selected" count shown for that client. */
  async addAllFor(clientId: string): Promise<number> {
    const selected = async () => Number((await this.configureButton(clientId).innerText()).match(/(\d+) selected/)?.[1] ?? 0);
    await this.configureButton(clientId).click();
    await this.recoverLoadErrors(this.tid('new-session-step-programs').locator('li label strong').first());
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
    // The pick list can re-render once its programs arrive and drop an early "Add all".
    await expect(async () => {
      if ((await selected()) === 0) await this.addAll.click();
      await this.page.waitForTimeout(1_000);
      expect(await selected()).toBeGreaterThan(0);
    }).toPass({ timeout: 20_000 });
    return selected();
  }

  /** Steps 1-3 up to the confirm step. */
  async fillSetup(setup: SessionSetup): Promise<void> {
    if (setup.observationDate) await this.observationDate.fill(setup.observationDate);
    await this.selectClients(setup.clientIds);
    await this.next();
    await expect(this.tid('new-session-step-programs')).toBeVisible();
    for (const id of setup.clientIds) {
      const programs = setup.programs?.[id] ?? [];
      const behaviors = setup.behaviors?.[id] ?? [];
      if (programs.length || behaviors.length) await this.configureClient(id, programs, behaviors);
    }
    if (setup.noteTemplate) await this.noteTemplate.selectOption({ label: setup.noteTemplate });
    if (setup.prepNote) await this.prepNote.fill(setup.prepNote);
    await this.next();
    await expect(this.tid('new-session-step-confirm')).toBeVisible();
  }

  /** Submits the confirm step; live sessions land on the pre-session page, historical ones on the bulk-entry sheet. */
  async submit(): Promise<'open' | 'bulk-entry'> {
    await this.submitButton.click();
    await expect(this.page).toHaveURL(/\/sessions\/[0-9a-f-]{36}(\/bulk-entry)?(\?|$)/, { timeout: 60_000 });
    return /\/bulk-entry/.test(this.page.url()) ? 'bulk-entry' : 'open';
  }

  /** Runs the whole wizard and starts the session; returns the session id of the data sheet (/run or /bulk-entry). */
  async startSession(setup: SessionSetup): Promise<string> {
    await this.fillSetup(setup);
    if ((await this.submit()) === 'open') {
      await this.tid('session-open-start-button').click();
      await expect(this.page).toHaveURL(/\/sessions\/[0-9a-f-]{36}\/run/, { timeout: 60_000 });
    }
    return this.page.url().match(/sessions\/([0-9a-f-]{36})/)![1];
  }
}
