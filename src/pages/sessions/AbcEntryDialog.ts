import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
export interface AbcEntry {
  behavior: string;
  isNovel?: boolean;
  context?: string;
  antecedents?: string[];
  consequences?: string[];
  functions?: string[];
  note?: string;
}

/** "Record ABC Data" dialog on the data sheet (US-22, US-24). */
export class AbcEntryDialog extends BasePage {
  readonly root: Locator;
  readonly behaviors: Locator;
  readonly behaviorInput: Locator;
  readonly contextChips: Locator;
  readonly antecedentChips: Locator;
  readonly consequenceChips: Locator;
  readonly functionChips: Locator;
  readonly note: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('abc-entry-dialog');
    this.behaviors = this.tid('abc-entry-behaviors');
    this.behaviorInput = this.behaviors.locator('input').first();
    this.contextChips = this.tid('abc-entry-context-chips');
    this.antecedentChips = this.tid('abc-entry-antecedent-chips');
    this.consequenceChips = this.tid('abc-entry-consequence-chips');
    this.functionChips = this.tid('abc-entry-possible-function-chips');
    this.note = this.tid('abc-entry-note-input');
    this.saveButton = this.tid('abc-entry-save-button');
  }

  private chip(group: Locator, label: string): Locator {
    return group.getByRole('button', { name: label, exact: true });
  }

  async expectOpen(): Promise<void> {
    await expect(this.saveButton).toBeVisible();
  }

  /** The Client picker only exists in multi-client sessions. */
  get clientSelect(): Locator {
    return this.tid('abc-entry-client-select');
  }

  async selectedClient(): Promise<string> {
    return (await this.clientSelect.innerText()).trim();
  }

  async chooseClient(clientName: string): Promise<void> {
    if ((await this.selectedClient()) === clientName) return;
    // Behavior chips also carry role=option, so pick from the select's own overlay.
    const combobox = this.clientSelect.getByRole('combobox');
    await combobox.click();
    await this.page.locator('.p-select-overlay').getByRole('option', { name: clientName, exact: true }).click();
    await expect(this.clientSelect).toContainText(clientName);
  }

  /** Behaviors offered by the suggestions list for the selected client (group headers excluded). */
  async suggestedBehaviors(): Promise<string[]> {
    const toggle = this.behaviors.getByRole('button', { name: 'Show behavior suggestions' });
    await toggle.click();
    const options = this.page.locator('.p-autocomplete-option');
    await expect(options.first()).toBeVisible();
    const names = (await options.allInnerTexts()).map((t) => t.trim()).filter(Boolean);
    await toggle.click();
    await expect(options).toHaveCount(0);
    return names;
  }

  /** Plan-defined behaviors are picked from the suggestions; a novel one is added "as emerging behavior" and tagged NEW. */
  async chooseBehavior(behavior: string, isNovel = false): Promise<void> {
    await this.behaviorInput.fill(behavior);
    const options = this.page.locator('.p-autocomplete-option');
    const option = isNovel
      ? options.filter({ hasText: `Add "${behavior}" as emerging behavior` })
      : options.filter({ hasText: new RegExp(`^\\s*${behavior.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`) });
    await option.first().click();
    const chip = this.tid('abc-entry-behavior-chip').filter({ hasText: behavior });
    await expect(chip).toBeVisible();
    if (isNovel) await expect(chip).toContainText(/\bnew\b/i);
  }

  async cancel(): Promise<void> {
    await this.root.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(this.saveButton).toBeHidden();
  }

  async fill(entry: AbcEntry): Promise<void> {
    await this.chooseBehavior(entry.behavior, entry.isNovel);
    if (entry.context) await this.chip(this.contextChips, entry.context).click();
    for (const a of entry.antecedents ?? []) await this.chip(this.antecedentChips, a).click();
    for (const c of entry.consequences ?? []) await this.chip(this.consequenceChips, c).click();
    for (const f of entry.functions ?? []) await this.chip(this.functionChips, f).click();
    if (entry.note) await this.note.fill(entry.note);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    await expect(this.saveButton).toBeHidden();
  }

  async record(entry: AbcEntry): Promise<void> {
    await this.fill(entry);
    await this.save();
  }
}
