import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '../BasePage';

/** Session summary after "Conclude" / "Move to Summary": times review, collected data, note, audit and finalize (US-13, US-14, US-23, US-24). */
export class SessionClosePage extends BasePage {
  readonly summary: Locator;
  readonly historicalTag: Locator;
  readonly clientTabs: Locator;
  readonly startTimeInput: Locator;
  readonly endTimeInput: Locator;
  readonly netDuration: Locator;
  readonly grossDuration: Locator;
  readonly pausedDuration: Locator;
  readonly pauseRows: Locator;
  readonly pauseReasonInput: Locator;
  readonly pauseReasonSave: Locator;
  readonly timesConfirm: Locator;
  readonly overallPercent: Locator;
  readonly scoredTotal: Locator;
  readonly targetsTotal: Locator;
  readonly programsTotal: Locator;
  readonly noteRegion: Locator;
  readonly noteEditor: Locator;
  readonly auditList: Locator;
  readonly finalizeButton: Locator;
  readonly finalizeConfirmButton: Locator;
  readonly finalizeCancelButton: Locator;
  readonly finalizePrompt: Locator;

  constructor(page: Page) {
    super(page);
    this.summary = this.tid('session-summary-finalize-wrap');
    this.historicalTag = this.tid('session-summary-historical-tag');
    this.clientTabs = this.tidPrefix('summary-client-rail-tab-');
    this.startTimeInput = this.tid('session-times-start-input');
    this.endTimeInput = this.tid('session-times-end-input');
    this.netDuration = this.tid('session-times-net-duration');
    this.grossDuration = this.tid('session-times-gross-duration');
    this.pausedDuration = this.tid('session-times-paused-duration');
    this.pauseRows = this.tid('session-times-pause-interval-row');
    this.pauseReasonInput = this.tid('session-times-pause-reason-input');
    this.pauseReasonSave = this.tid('session-times-pause-reason-save');
    this.timesConfirm = this.tid('session-times-confirm-checkbox');
    this.overallPercent = this.tid('session-data-summary-overall-percent');
    this.scoredTotal = this.tid('session-data-summary-scored-total');
    this.targetsTotal = this.tid('session-data-summary-targets-total');
    this.programsTotal = this.tid('session-data-summary-programs-total');
    this.noteRegion = this.tid('session-note-region');
    this.noteEditor = this.noteRegion.locator('textarea, [contenteditable=true]').first();
    this.auditList = page.locator('[data-testid=session-audit-heading]').locator('xpath=..');
    this.finalizeButton = this.tid('session-summary-finalize-button');
    this.finalizeConfirmButton = this.tid('session-summary-finalize-confirm-button');
    this.finalizeCancelButton = this.tid('session-summary-finalize-cancel-button');
    this.finalizePrompt = this.summary;
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/sessions\/[0-9a-f-]{36}\/summary/, { timeout: 60_000 });
    await expect(this.finalizeButton).toBeVisible({ timeout: 60_000 });
  }

  clientTab(clientId: string): Locator {
    return this.tid(`summary-client-rail-tab-${clientId}`);
  }

  async showClient(clientId: string): Promise<void> {
    await this.clientTab(clientId).click();
    await expect(this.clientTab(clientId)).toHaveAttribute('aria-selected', 'true').catch(() => undefined);
  }

  async scored(): Promise<number> {
    return Number((await this.scoredTotal.innerText()).match(/(\d+)/)?.[1] ?? 0);
  }

  auditEntry(text: string | RegExp): Locator {
    return this.page.getByTestId('audit-entry').filter({ hasText: text }).first();
  }

  async auditEntries(): Promise<string[]> {
    return (await this.page.getByTestId('audit-entry').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim());
  }

  async writeNote(text: string): Promise<void> {
    await this.waitForNoteTemplate();
    await this.noteEditor.click();
    await this.noteEditor.fill(text).catch(async () => {
      await this.page.keyboard.press('ControlOrMeta+a');
      await this.page.keyboard.type(text);
    });
  }

  // ----- Session note (US-23) -----

  get noteTemplateName(): Locator {
    return this.tid('session-note-header-template');
  }

  get noteDraftStamp(): Locator {
    return this.tid('session-note-draft-stamp');
  }

  get noteSubmitButton(): Locator {
    return this.tid('session-note-submit');
  }

  get noteSubmitBlocked(): Locator {
    return this.tid('session-note-submit-blocked');
  }

  /** "Data collected in this session" rows of the note's Daily Summary Sheet. */
  get noteDataRows(): Locator {
    return this.noteRegion.locator('[data-testid^="note-dss-row-"]');
  }

  /** The note template loads a few seconds after the summary; returns its name. */
  async waitForNoteTemplate(): Promise<string> {
    // "Loading the note template…" only appears after a short delay, so wait for the template's fields instead.
    await this.noteRegion.getByTestId('session-note-element').first().waitFor({ timeout: 60_000 }).catch(() => undefined);
    await expect(this.tid('session-note-loading')).toBeHidden({ timeout: 30_000 });
    return (await this.noteTemplateName.innerText()).trim();
  }

  /** Fills every required note field: text areas get `text`, option lists get their first option. */
  async completeRequiredNoteFields(text: string): Promise<void> {
    const element = this.page.getByTestId('session-note-element');
    const fields = this.noteRegion.getByTestId('session-note-element').filter({ hasText: /\*/ }).filter({ hasNot: element });
    for (const field of await fields.all()) {
      const option = field.locator('[data-testid^="note-option-"]').first();
      if (await option.count()) {
        const id = await option.getAttribute('id');
        const label = id ? field.locator(`label[for="${id}"]`) : option.locator('xpath=ancestor::label[1]');
        if (await label.count()) await label.first().click();
        else await option.evaluate((input) => (input as HTMLInputElement).click());
        await expect(option).toBeChecked();
        continue;
      }
      const textbox = field.locator('textarea, input[type=text]').first();
      if (await textbox.count()) {
        await textbox.fill(text);
        continue;
      }
      const select = field.locator('select').first();
      if (await select.count()) {
        await select.selectOption({ index: 1 });
        continue;
      }
      const signature = field.getByTestId('signature-pad-canvas');
      if (await signature.count()) await this.sign(signature);
    }
  }

  private async sign(canvas: Locator): Promise<void> {
    await canvas.scrollIntoViewIfNeeded();
    const box = (await canvas.boundingBox())!;
    const y = box.y + box.height / 2;
    await this.page.mouse.move(box.x + box.width * 0.2, y);
    await this.page.mouse.down();
    for (const [dx, dy] of [[0.35, -0.2], [0.5, 0.2], [0.65, -0.15], [0.8, 0.1]]) {
      await this.page.mouse.move(box.x + box.width * dx, y + box.height * dy, { steps: 5 });
    }
    await this.page.mouse.up();
  }

  /** Labels of required note fields, for reporting what is left when submit stays blocked. */
  async requiredNoteFieldLabels(): Promise<string[]> {
    const element = this.page.getByTestId('session-note-element');
    const fields = this.noteRegion.getByTestId('session-note-element').filter({ hasText: /\*/ }).filter({ hasNot: element });
    return (await fields.allInnerTexts()).map((t) => t.split('\n')[0].trim());
  }

  /** For a note that "has not been started": picks a template whose label starts with `template` and starts the note. Returns the label picked. */
  async startNoteWith(template: string): Promise<string> {
    const picker = this.noteRegion.locator('select').first();
    await expect(picker).toBeVisible();
    const labels = (await picker.locator('option').allInnerTexts()).map((t) => t.trim());
    const label = labels.find((l) => l === template) ?? labels.find((l) => l.startsWith(template)) ?? labels.find((l) => l.includes(template));
    expect(label, `note template "${template}" in ${JSON.stringify(labels)}`).toBeTruthy();
    await picker.selectOption({ label: label! });
    const start = this.tid('session-note-start');
    if (await start.isEnabled().catch(() => false)) await start.click();
    await expect(this.noteTemplateName).not.toHaveText(/no template selected/i, { timeout: 60_000 });
    await this.waitForNoteTemplate();
    return label!;
  }

  async saveNoteDraft(): Promise<void> {
    await this.tid('session-note-save').click();
    await expect(this.noteDraftStamp).toBeVisible();
  }

  // ----- Audit and corrections (US-23, US-24) -----

  get correctionCount(): Locator {
    return this.tid('session-audit-correction-count');
  }

  async corrections(): Promise<number> {
    return Number((await this.correctionCount.innerText()).match(/(\d+)/)?.[1] ?? NaN);
  }

  /** Audit group for a program; trial entries are listed once it is expanded. */
  async auditProgramGroup(programName: string): Promise<Locator> {
    const group = this.tidPrefix('session-audit-program-group-').filter({ hasText: programName }).first();
    const toggle = group.locator('button.audit-view__group-toggle, button').first();
    if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
    await expect(group.getByTestId('audit-entry').first()).toBeVisible();
    return group;
  }

  async auditTrialEntries(programName: string): Promise<Locator> {
    return (await this.auditProgramGroup(programName)).getByTestId('audit-entry');
  }

  get auditAbcEntries(): Locator {
    return this.tid('session-audit-abc-section').getByTestId('audit-entry');
  }

  get auditBehaviorEntries(): Locator {
    return this.tid('session-audit-behaviors-section').getByTestId('audit-entry');
  }

  get auditTimesEntry(): Locator {
    return this.tid('session-audit-times-section').getByTestId('audit-entry').first();
  }

  get correctionDialog(): Locator {
    return this.tid('correction-dialog');
  }

  get correctionUnavailable(): Locator {
    return this.tid('correction-form-unavailable');
  }

  /** Opens "Correct Record" for an audit entry and returns the dialog. */
  async openCorrection(entry: Locator): Promise<Locator> {
    await entry.getByTestId('audit-entry-correct-button').click();
    await expect(this.tid('correction-original-values')).toBeVisible();
    return this.correctionDialog;
  }

  async cancelCorrection(): Promise<void> {
    await this.tid('correction-form-cancel-button').click();
    await expect(this.tid('correction-original-values')).toBeHidden();
  }

  /** Changes a trial's outcome from the audit list; Save stays disabled until a reason is given. */
  async correctTrialOutcome(entry: Locator, outcome: 'correct' | 'incorrect' | 'na', reason: string): Promise<void> {
    await this.openCorrection(entry);
    await this.tid(`outcome-editor-outcome-${outcome}`).click();
    const save = this.tid('correction-form-save-button');
    await expect(save, 'Save Correction needs a reason').toBeDisabled();
    await this.tid('correction-form-reason-input').fill(reason);
    await expect(save).toBeEnabled();
    await save.click();
    await expect(this.tid('correction-original-values')).toBeHidden();
  }

  /** Deletes an audited record (trial, behavior or ABC entry) and returns the confirmation text. */
  async deleteAuditRecord(entry: Locator): Promise<string> {
    await entry.locator('[data-testid^="audit-entry-delete-button-"]').click();
    const dialog = this.tid('remove-record-dialog');
    const confirm = dialog.getByRole('button', { name: /remove|delete|confirm/i }).last();
    await expect(confirm).toBeVisible();
    const message = (await this.visibleDialog().innerText()).replace(/\s+/g, ' ').trim();
    const reason = dialog.locator('textarea:visible, input[type=text]:visible').first();
    if (await reason.count()) await reason.fill('E2E removal');
    await confirm.click();
    await expect(confirm).toBeHidden();
    return message;
  }

  // ----- Finalize -----

  async confirmTimes(): Promise<void> {
    if (await this.finalizeButton.isDisabled()) await this.timesConfirm.click();
    await expect(this.finalizeButton).toBeEnabled();
  }

  /** Confirms the session times, opens the finalize prompt and returns its wording without finalizing. */
  async openFinalizePrompt(): Promise<string> {
    await this.confirmTimes();
    await this.finalizeButton.click();
    await expect(this.finalizeConfirmButton).toBeVisible();
    for (let level = 1; level <= 5; level++) {
      const text = (await this.finalizeConfirmButton.locator(`xpath=ancestor::*[${level}]`).innerText()).replace(/\s+/g, ' ').trim();
      if (text.includes('?')) return text;
    }
    return (await this.summary.innerText()).replace(/\s+/g, ' ').trim();
  }

  /** Confirms times, finalizes and waits to leave the summary. Returns the confirmation wording (NGC-86). */
  async finalize(): Promise<string> {
    const prompt = await this.openFinalizePrompt();
    await this.finalizeConfirmButton.click();
    // dev2 intermittently answers "Skill data could not be saved … try Finalize again."; the app keeps the session, so retry once.
    const retryHint = this.page.getByText(/could not be saved.*try Finalize again/i).filter({ visible: true }).first();
    const settled = await expect.poll(async () => !/\/summary/.test(this.page.url()) || (await retryHint.isVisible()), { timeout: 60_000 })
      .toBe(true).then(() => true, () => false);
    if (!settled && (await this.finalizeButton.isHidden())) {
      test.info().annotations.push({ type: `${process.env.TEST_ENV} blank page`, description: 'summary went blank after Finalize; reloaded' });
      await this.page.reload();
      await expect.poll(async () => !/\/summary/.test(this.page.url()) || (await this.finalizeButton.isVisible()), { timeout: 60_000 }).toBe(true);
      if (!/\/summary/.test(this.page.url())) return prompt;
      await this.openFinalizePrompt();
      await this.finalizeConfirmButton.click();
    } else if (/\/summary/.test(this.page.url()) && (await retryHint.isVisible())) {
      test.info().annotations.push({ type: `${process.env.TEST_ENV} save error`, description: `"${(await retryHint.innerText()).trim()}" — finalized again` });
      await this.openFinalizePrompt();
      await this.finalizeConfirmButton.click();
    }
    await expect(this.page).not.toHaveURL(/\/summary/, { timeout: 60_000 });
    return prompt;
  }
}
