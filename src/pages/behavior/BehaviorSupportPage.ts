import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { readPrimeOptions, selectPrimeOption } from '../../helpers/primeng';

export type BehaviorTab = 'plan' | 'quick-reference' | 'data' | 'review';

/** Client "Behavior Support" tab: plan rail, emerging behaviours, plan detail, data and review (US-37, US-38, E2E-05). */
export class BehaviorSupportPage extends BasePage {
  readonly root: Locator;
  readonly timeline: Locator;
  readonly addNew: Locator;
  readonly planCards: Locator;
  readonly novelPanel: Locator;
  readonly novelToggle: Locator;
  readonly novelCount: Locator;
  readonly novelEmpty: Locator;
  readonly planName: Locator;
  readonly recordData: Locator;
  readonly statePill: Locator;
  readonly stateMeta: Locator;
  readonly startRevision: Locator;
  readonly goal: Locator;
  readonly functionSummary: Locator;
  readonly linkedSkillsEmpty: Locator;
  readonly linkedMeasureCards: Locator;
  readonly pairedCoGraph: Locator;
  readonly graphSelect: Locator;
  readonly behaviorSelect: Locator;
  readonly sessionDataRows: Locator;
  readonly sessionDataExport: Locator;
  readonly versions: Locator;
  readonly reviewLog: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('behavior-support-page');
    this.timeline = this.tid('plan-rail-timeline');
    this.addNew = this.tid('behavior-support-add-new');
    this.planCards = this.root.locator('[data-testid^="plan-card-"]');
    this.novelPanel = this.tid('novel-behaviors-panel');
    this.novelToggle = this.tid('novel-behaviors-toggle');
    this.novelCount = this.tid('novel-behaviors-count');
    this.novelEmpty = this.tid('novel-behaviors-empty');
    this.planName = this.tid('plan-detail-name');
    this.recordData = this.tid('plan-record-data');
    this.statePill = this.tid('plan-state-pill');
    this.stateMeta = this.tid('plan-state-meta');
    this.startRevision = this.tid('plan-start-revision');
    this.goal = this.tid('plan-goal');
    this.functionSummary = this.tid('plan-function-summary');
    this.linkedSkillsEmpty = this.tid('plan-skills-empty');
    this.linkedMeasureCards = this.tid('linked-measure-cards');
    this.pairedCoGraph = this.tid('paired-co-graph');
    this.graphSelect = this.tid('data-filter-graph');
    this.behaviorSelect = this.tid('data-filter-behavior');
    this.sessionDataRows = this.tid('session-data').locator('[data-testid^="session-data-row-"]');
    this.sessionDataExport = this.tid('session-data-export');
    this.versions = this.root.locator('[data-testid^="review-version-"]:not([data-testid*="author"])');
    this.reviewLog = this.tid('review-log');
  }

  tab(name: BehaviorTab): Locator {
    return this.tid(`behavior-support-tab-${name}`);
  }

  planCard(name: string | RegExp): Locator {
    return this.planCards.filter({ hasText: name }).first();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.planCards.first().or(this.novelPanel).first()).toBeVisible({ timeout: 60_000 });
  }

  /** Plan header shows the plan's own name (e.g. "SIB"), which can differ from the behavior on the card, so match by plan id. */
  async openPlan(name: string | RegExp): Promise<string> {
    const card = this.planCard(name);
    const planId = ((await card.getAttribute('data-testid')) ?? '').replace('plan-card-', '');
    await card.click();
    await expect(this.page).toHaveURL(new RegExp(`/behavior-support/${planId}`));
    await expect(this.planName).toBeVisible();
    return planId;
  }

  async graphOptions(): Promise<string[]> {
    return readPrimeOptions(this.page, this.graphSelect);
  }

  get linkedMeasureCount(): Locator {
    return this.tid('linked-measures-count');
  }

  get coGraphChart(): Locator {
    return this.pairedCoGraph.getByTestId('clinical-chart-canvas');
  }

  async openTab(name: BehaviorTab): Promise<void> {
    await this.tab(name).click();
    if (name !== 'plan') await expect(this.page).toHaveURL(new RegExp(`[?&]tab=${name}`));
    await this.waitForLoaded();
  }

  novelBehavior(name: string | RegExp): Locator {
    return this.novelPanel.locator('li, article, [data-testid^="novel-behavior-"]').filter({ hasText: name }).first();
  }

  /** Emerging behaviour from a session -> "Start a Plan" (E2E-05). */
  async startPlanFromNovel(name: string | RegExp): Promise<void> {
    if ((await this.novelToggle.getAttribute('aria-expanded')) === 'false') await this.novelToggle.click();
    await this.novelBehavior(name).getByRole('button', { name: /start (a )?plan/i }).click();
    await expect(this.planName).toContainText(name, { timeout: 30_000 });
  }

  /** Edits a section of the draft plan (goal / functions / strategies) using its inline Edit control. */
  async editSection(section: RegExp, text: string): Promise<void> {
    const block = this.tid('plan-tab').locator('section, div').filter({ has: this.page.getByText(section) }).first();
    await block.getByRole('button', { name: /edit|add/i }).first().click();
    const editor = this.page.locator('.p-dialog:visible, .p-drawer:visible').last().or(block);
    await editor.locator('textarea:visible, input[type=text]:visible').first().fill(text);
    await editor.getByRole('button', { name: /save|done|apply/i }).last().click();
  }

  async addFunction(fn: string | RegExp): Promise<void> {
    const block = this.tid('plan-tab').locator('section, div').filter({ has: this.page.getByText(/function/i) }).first();
    await block.getByRole('button', { name: /add|edit/i }).first().click();
    const editor = this.page.locator('.p-dialog:visible, .p-drawer:visible').last();
    await editor.getByRole('button', { name: fn }).or(editor.getByRole('checkbox', { name: fn })).first().click();
    await editor.getByRole('button', { name: /save|done|apply/i }).last().click();
  }

  async linkReplacementSkill(programName: string | RegExp): Promise<void> {
    const block = this.tid('plan-tab').locator('section, div').filter({ has: this.linkedSkillsEmpty.or(this.page.getByText(/replacement skill|linked skill/i)) }).first();
    await block.getByRole('button', { name: /link|add/i }).first().click();
    const dialog = this.page.locator('.p-dialog:visible, .p-drawer:visible').last();
    await dialog.getByText(programName).first().click();
    await dialog.getByRole('button', { name: /link|save|add/i }).last().click();
  }

  async publish(note = 'E2E publish'): Promise<void> {
    await this.openTab('review');
    await this.root.getByRole('button', { name: /^publish/i }).first().click();
    const dialog = this.page.locator('.p-dialog:visible, .p-confirmdialog:visible').last();
    if (await dialog.waitFor({ state: 'visible', timeout: 3_000 }).then(() => true, () => false)) {
      const box = dialog.locator('textarea, input[type=text]').first();
      if (await box.isVisible().catch(() => false)) await box.fill(note);
      await dialog.getByRole('button', { name: /publish|confirm/i }).last().click();
    }
    await expect(this.statePill).toContainText(/in effect|published/i);
  }

  async chooseGraph(option: string | RegExp): Promise<void> {
    await selectPrimeOption(this.page, this.graphSelect, option);
  }
}
