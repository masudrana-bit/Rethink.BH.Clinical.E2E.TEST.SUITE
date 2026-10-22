import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '../BasePage';

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** "1:05" / "0:02:10" / "High 0:03" -> seconds. */
export const clockToSeconds = (text: string): number =>
  (text.match(/(\d+:)?\d+:\d{2}/)?.[0] ?? '0').split(':').map(Number).reduce((total, part) => total * 60 + part, 0);

export type PromptLevel = 'Independent' | 'Verbal' | 'Gestural' | 'Model' | 'Partial Physical' | 'Full Physical' | 'N/A';
export const ALL_PROMPT_LEVELS: PromptLevel[] = ['Independent', 'Verbal', 'Gestural', 'Model', 'Partial Physical', 'Full Physical', 'N/A'];

/** Live / historical data sheet: /sessions/:sessionId/run */
export class DataSheetPage extends BasePage {
  readonly header: Locator;
  readonly backButton: Locator;
  readonly clock: Locator;
  readonly clockValue: Locator;
  readonly closeSessionButton: Locator;
  readonly root: Locator;
  readonly standardView: Locator;
  readonly gridView: Locator;
  readonly collapsePrograms: Locator;
  readonly programSearch: Locator;
  readonly programCards: Locator;
  readonly dockMenu: Locator;
  readonly dockRecordAbc: Locator;
  readonly dockQuickNote: Locator;
  readonly dockPrograms: Locator;
  readonly menuDrawer: Locator;

  constructor(page: Page) {
    super(page);
    this.header = this.tid('session-focus-header');
    this.backButton = this.tid('session-focus-header-back-button');
    this.clock = this.tid('session-clock');
    this.clockValue = this.tid('session-clock-value');
    this.closeSessionButton = this.tid('data-sheet-close-session-button');
    this.root = this.tid('data-sheet-page');
    this.standardView = this.tid('data-sheet-view-standard-button');
    this.gridView = this.tid('data-sheet-view-grid-button');
    this.collapsePrograms = this.tid('data-sheet-collapse-programs-button');
    this.programSearch = this.tid('data-sheet-program-search');
    this.programCards = this.root.locator('[data-testid^="data-sheet-program-card-"]');
    this.dockMenu = this.tid('session-dock-menu-button');
    this.dockRecordAbc = this.tid('data-sheet-record-abc-button');
    this.dockQuickNote = this.tid('session-dock-quick-note-button');
    this.dockPrograms = this.tid('session-dock-programs-button');
    this.menuDrawer = this.tid('session-menu-drawer');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/sessions\/[0-9a-f-]{36}\/run/);
    await expect(this.root).toBeVisible({ timeout: 60_000 });
    await expect(this.clock).toBeVisible();
  }

  /** Header title: the client name, or "A, B" for a group session. */
  async title(): Promise<string> {
    const lines = (await this.header.innerText()).split('\n').map((l) => l.trim()).filter(Boolean);
    return lines[lines.indexOf('Sessions') + 1] ?? '';
  }

  sessionId(): string {
    return this.page.url().match(/sessions\/([0-9a-f-]{36})/)?.[1] ?? '';
  }

  /** Session clock in seconds. */
  async clockSeconds(): Promise<number> {
    const parts = (await this.clockValue.innerText()).trim().split(':').map(Number);
    return parts.reduce((total, part) => total * 60 + part, 0);
  }

  clientSection(clientId: string): Locator {
    return this.tid(`data-sheet-client-section-${clientId}`);
  }

  card(programName: string | RegExp, clientId?: string): Locator {
    const scope = clientId ? this.clientSection(clientId) : this.root;
    return scope.locator('[data-testid^="data-sheet-program-card-"]').filter({ hasText: programName }).first();
  }

  /** Makes the program card visible, expanding the "Available to add" group when the program wasn't pre-picked. */
  async showProgram(programName: string | RegExp, clientId?: string): Promise<Locator> {
    const card = this.card(programName, clientId);
    const toggle = clientId ? this.tid(`data-sheet-available-toggle-${clientId}`) : this.root.locator('[data-testid^="data-sheet-available-toggle-"]').first();
    // Scheduled sessions load every plan program as "available"; the list can still be rendering on the first pass.
    await expect(async () => {
      if (await card.isVisible()) return;
      const retry = this.root.getByRole('button', { name: /^(Retry|Try again)$/ }).first();
      if (await retry.isVisible()) {
        test.info().annotations.push({ type: `${process.env.TEST_ENV} load error`, description: "data sheet couldn't load the client's programs; clicked Retry" });
        await retry.click();
      } else if (await toggle.isVisible() && (await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
      else if (typeof programName === 'string' && (await this.programSearch.inputValue()) !== programName) await this.programSearch.fill(programName);
      await expect(card).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
    const cardError = card.getByText(/couldn['’]t load how this program collects data/i);
    for (let attempt = 1; attempt <= 3 && (await cardError.isVisible()); attempt++) {
      test.info().annotations.push({ type: `${process.env.TEST_ENV} load error`, description: "program card couldn't load how the program collects data; clicked Retry" });
      await card.getByRole('button', { name: /^(Retry|Try again)$/ }).click();
      await expect(cardError).toBeHidden({ timeout: 15_000 }).catch(() => {});
    }
    await expect(cardError, 'program card loaded after 3 retries').toBeHidden();
    return card;
  }

  async expandTarget(card: Locator, target: string): Promise<void> {
    const expand = card.getByRole('button', { name: `Expand ${target}`, exact: true });
    if (await expand.isVisible().catch(() => false)) await expand.click();
    await expect(card.getByRole('button', { name: `Collapse ${target}`, exact: true })).toBeVisible();
  }

  promptOption(card: Locator, target: string, level: PromptLevel): Locator {
    return card.getByRole('button', { name: `${level} for ${target}`, exact: true });
  }

  async openPromptPicker(card: Locator, target: string): Promise<void> {
    await this.expandTarget(card, target);
    const trigger = card.getByRole('button', { name: `Record prompt level for ${target}` });
    if ((await trigger.getAttribute('aria-expanded')) !== 'true') await trigger.click();
  }

  async availablePromptLevels(card: Locator, target: string): Promise<string[]> {
    await this.openPromptPicker(card, target);
    const toolbar = card.getByRole('toolbar', { name: `Prompt level for ${target}`, exact: true });
    await expect(toolbar).toBeVisible();
    const labels = await toolbar.getByRole('button').evaluateAll((els, t) => els.map((e) => (e.getAttribute('aria-label') ?? '').replace(` for ${t}`, '')), target);
    return labels.filter(Boolean);
  }

  /** Records one discrete trial at the given prompt level. */
  async recordTrial(programName: string, target: string, level: PromptLevel, clientId?: string): Promise<void> {
    const card = await this.showProgram(programName, clientId);
    await this.openPromptPicker(card, target);
    await this.promptOption(card, target, level).click();
  }

  /** Target names on a card, read from the expand/collapse buttons. */
  async targetNames(card: Locator): Promise<string[]> {
    const labels = await card.locator('[data-testid^="data-sheet-expand-button-"]').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? ''));
    return labels.map((l) => l.replace(/^(Expand|Collapse)\s+/, '').trim()).filter(Boolean);
  }

  /** Records one trial on a program without a prompt dimension (Correct / Incorrect / N/A buttons). */
  async recordOutcome(programName: string, target: string, outcome: 'Correct' | 'Incorrect' | 'Not applicable', clientId?: string): Promise<void> {
    const card = await this.showProgram(programName, clientId);
    await this.expandTarget(card, target);
    await card.getByRole('button', { name: new RegExp(`^${outcome} for ${escapeRegExp(target)}(,|$)`) }).click();
  }

  async undoLastTrial(programName: string, target: string): Promise<void> {
    const card = await this.showProgram(programName);
    await card.getByRole('button', { name: `Undo last trial for ${target}` }).click();
  }

  /** Card score text, e.g. "100%" for "Touch nose: 100% correct". */
  async targetScore(programName: string, clientId?: string, target?: string): Promise<string> {
    const card = await this.showProgram(programName, clientId);
    const scores = card.locator('[data-testid^="data-sheet-score-"]');
    const score = target ? scores.and(this.page.locator(`[aria-label^="${target.replace(/"/g, '\\"')}:"]`)) : scores;
    const text = `${await score.first().getAttribute('aria-label')} ${await score.first().innerText()}`;
    return text.match(/(\d+%)/)?.[1] ?? text.trim();
  }

  // ----- Trial history / correction (US-15, US-24) -----
  trialChips(card: Locator, target: string): Locator {
    return card.getByRole('button', { name: new RegExp(`^Edit trial \\d+ for ${escapeRegExp(target)}:`) });
  }

  /** Chip labels such as "Correct, prompt Independent", in recording order. */
  async trialHistory(card: Locator, target: string): Promise<string[]> {
    const labels = await this.trialChips(card, target).evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? ''));
    return labels.map((l) => l.replace(/^Edit trial \d+ for .+?:\s*/, ''));
  }

  /** Opens the inline edit toolbar of one trial and returns it. */
  async openTrialEditor(card: Locator, target: string, trial: number): Promise<Locator> {
    const toolbar = card.getByRole('toolbar', { name: `Edit trial ${trial}`, exact: true });
    if (!(await toolbar.isVisible())) await card.getByRole('button', { name: new RegExp(`^Edit trial ${trial} for ${escapeRegExp(target)}:`) }).click();
    await expect(toolbar).toBeVisible();
    return toolbar;
  }

  async changeTrialPrompt(card: Locator, target: string, trial: number, level: PromptLevel): Promise<void> {
    const toolbar = await this.openTrialEditor(card, target, trial);
    await toolbar.getByRole('button', { name: `Change trial ${trial} for ${target} to ${level}`, exact: true }).click();
  }

  async deleteTrial(card: Locator, target: string, trial: number): Promise<void> {
    const toolbar = await this.openTrialEditor(card, target, trial);
    await toolbar.getByRole('button', { name: `Delete trial ${trial} for ${target}`, exact: true }).click();
  }

  async setLocation(card: Locator, location: string | RegExp): Promise<void> {
    await card.getByTestId('location-picker-select').first().click();
    await this.page.getByRole('option', { name: location }).first().click();
  }

  // ----- Task analysis (US-16) -----
  async expandTaskAnalysisSteps(programName: string): Promise<Locator> {
    const card = await this.showProgram(programName);
    const toggle = card.getByTestId('task-analysis-steps-toggle-button');
    if ((await toggle.getAttribute('aria-label')) === 'Expand steps') await toggle.click();
    await expect(toggle).toHaveAttribute('aria-label', 'Collapse steps');
    return card;
  }

  /** Step value button (1-based); disabled until the earlier steps of the opportunity are recorded. */
  taskAnalysisStepButton(card: Locator, step: number): Locator {
    return card.getByTestId(`task-analysis-step-${step - 1}-value-button`);
  }

  async recordTaskAnalysisStep(programName: string, step: number, level: PromptLevel): Promise<void> {
    const card = await this.expandTaskAnalysisSteps(programName);
    await this.taskAnalysisStepButton(card, step).click();
    const picker = card.getByTestId(`task-analysis-step-${step - 1}-picker`);
    await expect(picker).toBeVisible();
    await picker.getByRole('button', { name: new RegExp(`^${escapeRegExp(level)} for `) }).click();
    await expect(this.taskAnalysisStepButton(card, step)).toHaveAttribute('aria-label', new RegExp(`currently ${escapeRegExp(level)}$`));
  }

  async taskAnalysisProgress(programName: string): Promise<string> {
    const card = await this.showProgram(programName);
    return (await card.getByTestId('task-analysis-series-progress').innerText()).trim();
  }

  async taskAnalysisPercent(programName: string): Promise<string> {
    const card = await this.showProgram(programName);
    return (await card.getByTestId('task-analysis-series-percent').innerText()).trim();
  }

  async startNextTaskAnalysisSeries(programName: string): Promise<void> {
    const card = await this.showProgram(programName);
    await card.getByTestId('task-analysis-next-series-button').click();
  }

  // ----- PEAK (US-17) -----
  async recordPeak(programName: string, target: string, score: 0 | 2 | 4 | 8 | 10): Promise<void> {
    const card = await this.showProgram(programName);
    const button = card.getByRole('button', { name: `PEAK score ${score} for ${target}`, exact: true });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
  }

  async peakTotal(programName: string): Promise<number> {
    const card = await this.showProgram(programName);
    return Number((await card.getByTestId('peak-total-score').innerText()).match(/(\d+)/)?.[1] ?? NaN);
  }

  peakScoringTab(card: Locator, run: number): Locator {
    return card.getByTestId(`peak-scoring-tab-${run}`);
  }

  // ----- Simple collection (US-18 / US-21) -----
  /** "Recorded" value of one target row, e.g. "75% avg", "4 times", "100% (1/1)". */
  async simpleScore(programName: string, target: string): Promise<string> {
    const card = await this.showProgram(programName);
    const row = card.getByTestId('simple-collection-recorder').filter({ has: this.page.getByRole('button', { name: `Undo last entry for ${target}`, exact: true }) });
    return (await row.getByTestId('simple-collection-score-value').innerText()).trim();
  }

  async recordFrequency(programName: string, target: string, count: number): Promise<void> {
    const card = await this.showProgram(programName);
    await card.getByRole('spinbutton', { name: `How many times for ${target}`, exact: true }).fill(String(count));
    await card.getByRole('button', { name: `Save frequency for ${target}`, exact: true }).click();
  }

  /** Percentage, numeric and number-of-occurrences recorders: value + "Add entry". */
  async recordQuickEntry(programName: string, target: string, kind: 'Percentage' | 'Numeric value' | 'Count', value: number): Promise<void> {
    const card = await this.showProgram(programName);
    await card.getByRole('spinbutton', { name: `${kind} for ${target}`, exact: true }).fill(String(value));
    await card.getByRole('button', { name: `Add entry for ${target}`, exact: true }).click();
  }

  async recordRating(programName: string, target: string, rating: 1 | 2 | 3 | 4 | 5): Promise<void> {
    const card = await this.showProgram(programName);
    await card.getByRole('button', { name: `Record ${rating} for ${target}`, exact: true }).click();
  }

  async undoSimpleEntry(programName: string, target: string): Promise<void> {
    const card = await this.showProgram(programName);
    await card.getByRole('button', { name: `Undo last entry for ${target}`, exact: true }).click();
  }

  programTimerButton(card: Locator, action: 'Start' | 'Pause' | 'Resume' | 'Stop', target: string): Locator {
    return card.getByRole('button', { name: `${action} Program Timer for ${target}`, exact: true });
  }

  /** Partial-interval recorder: start, optionally mark "occurred", then stop the interval. */
  async recordInterval(programName: string, target: string, occurred: boolean, seconds = 1): Promise<void> {
    const card = await this.showProgram(programName);
    await card.getByRole('button', { name: new RegExp(`^Start (Next )?Interval for ${escapeRegExp(target)}$`) }).click();
    await this.page.waitForTimeout(seconds * 1000);
    if (occurred) {
      const mark = card.getByRole('button', { name: `Mark occurred in this interval for ${target}`, exact: true });
      await mark.click();
      await expect(mark).toHaveAttribute('aria-pressed', 'true');
    }
    await card.getByRole('button', { name: `Stop interval timer for ${target}`, exact: true }).click();
  }

  /** Frequency + Duration recorder: tallies and a timed duration; "Save entry" ends the running duration and saves both. */
  async recordFrequencyDuration(programName: string, target: string, tallies: number, seconds = 2): Promise<void> {
    const card = await this.showProgram(programName);
    const tally = card.getByRole('button', { name: `Tally for ${target}`, exact: true });
    for (let i = 0; i < tallies; i++) await tally.click();
    await expect(tally).toContainText(`(${tallies})`);
    const start = card.getByRole('button', { name: `Start Duration for ${target}`, exact: true });
    await start.click();
    await expect(start).toBeDisabled();
    await this.page.waitForTimeout(seconds * 1000);
    await card.getByRole('button', { name: `Save entry for ${target}`, exact: true }).click();
  }

  // ----- Duration-intensity (Duration programs, US-18 / US-20) -----
  durationIntensityRow(card: Locator, target: string): Locator {
    return card.getByTestId('duration-intensity-recorder').filter({ has: this.page.getByRole('button', { name: new RegExp(`timer for ${escapeRegExp(target)}$`) }) });
  }

  /** True when the recorder offers High / Medium / Low levels; otherwise it is a plain Start / Stop timer. */
  async intensityLevelsOffered(programName: string, target: string): Promise<boolean> {
    const row = this.durationIntensityRow(await this.showProgram(programName), target);
    await expect(row.getByTestId('duration-intensity-total')).toBeVisible();
    return (await row.getByTestId('duration-intensity-picker-toggle').count()) > 0;
  }

  /** Starts the target's timer, at `level` when the recorder offers intensity levels. */
  async startDurationTimer(programName: string, target: string, level: 'High' | 'Medium' | 'Low' = 'High'): Promise<void> {
    if (await this.intensityLevelsOffered(programName, target)) return this.startIntensityTimer(programName, target, level);
    const row = this.durationIntensityRow(await this.showProgram(programName), target);
    await row.getByTestId('duration-intensity-start-button').click();
    await expect(row.getByTestId('duration-intensity-active-segment')).not.toHaveText('No active timer');
  }

  async stopDurationTimer(programName: string, target: string): Promise<void> {
    const row = this.durationIntensityRow(await this.showProgram(programName), target);
    const stop = row.getByTestId('duration-intensity-stop-button');
    if (await stop.isVisible()) await stop.click();
    else await (await this.openIntensityChange(row)).getByTestId('duration-intensity-stop-button').click();
    await expect(row.getByTestId('duration-intensity-active-segment')).toHaveText('No active timer');
  }

  async durationTotal(programName: string, target: string): Promise<number> {
    const row = this.durationIntensityRow(await this.showProgram(programName), target);
    return clockToSeconds(await row.getByTestId('duration-intensity-total').innerText());
  }

  async startIntensityTimer(programName: string, target: string, level: 'High' | 'Medium' | 'Low'): Promise<void> {
    const card = await this.showProgram(programName);
    const row = this.durationIntensityRow(card, target);
    const picker = row.getByTestId('duration-intensity-picker');
    if (!(await picker.isVisible())) await row.getByTestId('duration-intensity-picker-toggle').click();
    await picker.getByRole('button', { name: `Start ${level} intensity timer`, exact: true }).click();
    await expect(row.getByTestId('duration-intensity-active-segment')).not.toHaveText('No active timer');
  }

  /** While a segment runs, "Change" opens Switch to High/Medium/Low and End timer. */
  private async openIntensityChange(row: Locator): Promise<Locator> {
    const picker = row.getByTestId('duration-intensity-picker');
    if (!(await picker.isVisible())) await row.getByTestId('duration-intensity-picker-toggle').click();
    await expect(picker).toBeVisible();
    return picker;
  }

  async switchIntensity(programName: string, target: string, level: 'High' | 'Medium' | 'Low'): Promise<void> {
    const row = this.durationIntensityRow(await this.showProgram(programName), target);
    await (await this.openIntensityChange(row)).getByRole('button', { name: `Switch to ${level} intensity`, exact: true }).click();
    await expect(row.getByTestId('duration-intensity-active-segment')).toContainText(level);
  }

  async stopIntensityTimer(programName: string, target: string): Promise<void> {
    const row = this.durationIntensityRow(await this.showProgram(programName), target);
    await (await this.openIntensityChange(row)).getByTestId('duration-intensity-stop-button').click();
    await expect(row.getByTestId('duration-intensity-active-segment')).toHaveText('No active timer');
  }

  // ----- Running timers in the dock (US-21) -----
  /** Dock row for a running/paused program timer or interval, e.g. "Go to <program>, Program Timer, 0:05". */
  dockTimer(kind: 'program-timer' | 'interval', programName: string): Locator {
    return this.tid(`session-timer-display-${kind}-row`).filter({ hasText: programName });
  }

  async dockTimerSeconds(kind: 'program-timer' | 'interval', programName: string): Promise<number> {
    const row = this.dockTimer(kind, programName);
    return clockToSeconds(`${await row.getAttribute('aria-label')} ${await row.innerText()}`);
  }

  /** Seconds per intensity level from the "Session totals" block. */
  async intensityTotals(programName: string, target: string): Promise<Record<'high' | 'medium' | 'low' | 'total', number>> {
    const card = await this.showProgram(programName);
    const row = this.durationIntensityRow(card, target);
    await expect(row.getByTestId('duration-intensity-total')).toBeVisible();
    // Level totals are only rendered once that level has time recorded.
    const seconds = async (id: string) => ((await row.getByTestId(id).count()) ? clockToSeconds(await row.getByTestId(id).innerText()) : 0);
    return {
      high: await seconds('duration-intensity-level-total-high'),
      medium: await seconds('duration-intensity-level-total-medium'),
      low: await seconds('duration-intensity-level-total-low'),
      total: await seconds('duration-intensity-total'),
    };
  }

  // ----- Toileting (US-19) -----
  async startToiletingVisit(programName: string): Promise<Locator> {
    const card = await this.showProgram(programName);
    await card.getByTestId('toileting-start-visit-button').click();
    await expect(card.getByTestId('toileting-status')).toContainText('Visit active');
    return card;
  }

  toiletingOutcome(card: Locator, outcome: 'urine' | 'bm' | 'both' | 'no_elimination'): Locator {
    return card.getByTestId(`toileting-outcome-chip-${outcome}`);
  }

  /** Stops the sit timer and submits the visit. */
  async submitToiletingVisit(card: Locator): Promise<void> {
    await card.getByTestId('toileting-sit-timer-button').click();
    await expect(card.getByTestId('toileting-status')).toContainText(/Sit ended/);
    await card.getByTestId('toileting-confirm-end-visit-button').click();
    await expect(card.getByTestId('toileting-status')).toContainText('No active visit');
  }

  // ----- Behaviors (US-20, US-22) -----
  behaviorsCard(clientId: string): Locator {
    return this.tid(`data-sheet-behaviors-card-${clientId}`);
  }

  async clientName(clientId: string): Promise<string> {
    return (await this.tid(`data-sheet-client-heading-${clientId}`).innerText()).trim();
  }

  /** "Record ABC Data" on one client's behavior support card. */
  async openAbcEntryFor(clientId: string): Promise<void> {
    await this.tid(`data-sheet-behaviors-record-${clientId}`).click();
    await expect(this.tid('abc-entry-save-button')).toBeVisible();
  }

  behaviorRow(clientId: string, behavior: string): Locator {
    return this.behaviorsCard(clientId).locator('[data-testid^="behavior-row-"]').filter({ hasText: behavior }).first();
  }

  async addBehaviorCount(clientId: string, behavior: string): Promise<void> {
    await this.behaviorRow(clientId, behavior).getByRole('button', { name: `Add frequency count for ${behavior}`, exact: true }).click();
  }

  async behaviorValue(clientId: string, behavior: string): Promise<string> {
    return (await this.behaviorRow(clientId, behavior).locator('[data-testid^="behavior-value-"]').innerText()).trim();
  }

  // ----- Dock / dialogs -----
  async openMenu(): Promise<void> {
    await this.dockMenu.click();
    await expect(this.menuDrawer).toBeVisible();
  }

  async openAbcEntry(): Promise<void> {
    await this.dockRecordAbc.click();
    await expect(this.tid('abc-entry-save-button')).toBeVisible();
  }

  async addQuickNote(text: string): Promise<void> {
    await this.dockQuickNote.click();
    const dialog = this.tid('quick-note-dialog').locator('.p-dialog');
    await dialog.getByRole('textbox').first().fill(text);
    await dialog.getByRole('button', { name: /save|add/i }).last().click();
    await expect(dialog).toBeHidden();
  }

  async openCloseSession(): Promise<void> {
    await this.closeSessionButton.click();
    await expect(this.tid('close-session-confirm-button')).toBeVisible();
  }
}
