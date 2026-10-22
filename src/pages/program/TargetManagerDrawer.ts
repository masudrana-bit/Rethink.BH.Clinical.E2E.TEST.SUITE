import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '../BasePage';
import { selectPrimeOption, setPrimeCheckbox } from '../../helpers/primeng';
import { BulkTargetPaste } from '../shared/BulkTargetPaste';

export type TargetStatus = 'Not Started' | 'In Progress' | 'Mastered' | 'On Hold' | 'Closed' | string;

/** "Manage Targets" drawer on the program detail page. */
export class TargetManagerDrawer extends BasePage {
  readonly root: Locator;
  readonly newNameInput: Locator;
  readonly addRowButton: Locator;
  readonly setAllPrompts: Locator;
  readonly rows: Locator;
  readonly errorState: Locator;
  readonly newGroupInput: Locator;
  readonly addGroupButton: Locator;
  readonly groupPanel: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly bulk: BulkTargetPaste;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('target-manager');
    this.newNameInput = this.tid('target-manager-new-name-input');
    this.addRowButton = this.tid('target-manager-add-row-button');
    this.setAllPrompts = this.tid('target-manager-set-all-prompts');
    this.rows = this.root.locator('[data-testid^="target-manager-row-"][role=row]');
    this.errorState = this.tid('target-manager-error-state');
    this.newGroupInput = this.tid('target-manager-new-group-input');
    this.addGroupButton = this.tid('target-manager-add-group-button');
    this.groupPanel = this.tid('target-manager-group-panel');
    this.saveButton = this.tid('targets-drawer-save');
    this.cancelButton = this.tid('targets-drawer-cancel');
    this.bulk = new BulkTargetPaste(page, this.root);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.tid('target-manager-loading')).toHaveCount(0, { timeout: 60_000 });
    await expect(this.errorState, "Targets failed to load (\"Couldn't load this program's targets\")").toHaveCount(0);
  }

  async targetNames(): Promise<string[]> {
    const inputs = this.rows.locator('input[data-testid$="-name"]');
    const names: string[] = [];
    for (let i = 0; i < (await inputs.count()); i++) names.push((await inputs.nth(i).inputValue()).trim());
    return names;
  }

  async row(targetName: string): Promise<Locator> {
    const names = await this.targetNames();
    const index = names.indexOf(targetName);
    expect(index, `target "${targetName}" in ${JSON.stringify(names)}`).toBeGreaterThanOrEqual(0);
    return this.rows.nth(index);
  }

  async addTarget(name: string): Promise<void> {
    await this.newNameInput.fill(name);
    await this.addRowButton.click();
    await expect.poll(() => this.targetNames()).toContain(name);
  }

  async bulkAdd(names: string[]): Promise<void> {
    await this.bulk.addTargets(names);
    await expect.poll(() => this.targetNames()).toEqual(expect.arrayContaining(names));
  }

  async renameTarget(oldName: string, newName: string): Promise<void> {
    const row = await this.row(oldName);
    await row.locator('input[data-testid$="-name"]').fill(newName);
  }

  async setField(targetName: string, field: 'prompt' | 'objective' | 'group' | 'status', option: string | RegExp): Promise<void> {
    const row = await this.row(targetName);
    await selectPrimeOption(this.page, row.locator(`[data-testid$="-${field}"]`).first(), option);
  }

  /** A Mastered target's Status dropdown is locked; the row offers an "Unmaster" button instead. */
  async unmaster(targetName: string): Promise<void> {
    const row = await this.row(targetName);
    await row.getByRole('button', { name: /unmaster/i }).click();
    await expect(row.locator('[data-testid$="-status"]').first()).not.toContainText('Mastered');
  }

  async setOnHold(targetName: string, onHold: boolean): Promise<void> {
    const row = await this.row(targetName);
    await setPrimeCheckbox(row.locator('[data-testid$="-on-hold"]').first(), onHold);
  }

  async move(targetName: string, direction: 'up' | 'down'): Promise<void> {
    await this.root.getByRole('button', { name: `Move ${targetName} ${direction}` }).click();
  }

  async remove(targetName: string): Promise<void> {
    await this.root.getByRole('button', { name: `Remove ${targetName}`, exact: true }).click();
  }

  async groupNames(): Promise<string[]> {
    const inputs = this.groupPanel.locator('input[data-testid^="target-manager-group-"][data-testid$="-name"]');
    const names: string[] = [];
    for (let i = 0; i < (await inputs.count()); i++) names.push((await inputs.nth(i).inputValue()).trim());
    return names;
  }

  /** Groups are persisted as soon as they are added (no drawer Save needed). */
  async addGroup(groupName: string): Promise<void> {
    await this.newGroupInput.fill(groupName);
    await this.addGroupButton.click();
    await expect.poll(() => this.groupNames()).toContain(groupName);
  }

  async deleteGroup(groupName: string): Promise<void> {
    const index = (await this.groupNames()).indexOf(groupName);
    expect(index, `group "${groupName}"`).toBeGreaterThanOrEqual(0);
    await this.groupPanel.locator('button[data-testid$="-delete"]').nth(index).click();
    const confirm = this.tid('target-manager-group-delete-confirm').locator('.p-dialog');
    await expect(confirm).toBeVisible();
    await confirm.getByRole('button', { name: /^(confirm|delete|delete group)$/i }).click();
    await expect(confirm).toBeHidden();
  }

  async openStatusHistory(targetName: string): Promise<Locator> {
    const row = await this.row(targetName);
    await row.locator('[data-testid^="target-manager-status-history-"]').click();
    const popup = this.page.locator('.p-popover:visible, .p-dialog:visible').last();
    await expect(popup).toBeVisible();
    return popup;
  }

  async openPhaseChange(targetName: string): Promise<void> {
    const row = await this.row(targetName);
    await row.getByTestId('phase-control-change-phase').click();
    await expect(this.tid('phase-dialog-phase-select')).toBeVisible();
  }

  async phaseOf(targetName: string): Promise<string> {
    const row = await this.row(targetName);
    return (await row.getByTestId('phase-control-phase').innerText()).trim();
  }

  get saveError(): Locator {
    return this.root.getByText(/Something went wrong saving these changes/i);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    if (await this.fillMissingObjectives()) await this.saveButton.click();
    await expect(this.root).toBeHidden({ timeout: 30_000 });
  }

  /** Saves and reports whether the drawer closed (false when the save error banner appears instead). */
  async trySave(): Promise<boolean> {
    await this.saveButton.click();
    if (await this.fillMissingObjectives()) {
      await this.saveButton.click();
      await expect.poll(async () => (await this.root.isHidden()) || (await this.saveError.isVisible()), { timeout: 30_000 }).toBe(true);
    }
    return this.root.isHidden();
  }

  private get missingObjective(): Locator {
    return this.page.getByText(/Choose an objective for /).filter({ visible: true }).first();
  }

  /** Since Oct 20 new targets have no objective and Save asks "Choose an objective for A, B."; picks Objective 1 for them. */
  private async fillMissingObjectives(): Promise<boolean> {
    await expect
      .poll(async () => (await this.root.isHidden()) || (await this.saveError.isVisible()) || (await this.missingObjective.isVisible()), { timeout: 30_000 })
      .toBe(true);
    if (!(await this.missingObjective.isVisible())) return false;
    const message = (await this.missingObjective.innerText()).trim();
    const names = message.replace(/^.*Choose an objective for /, '').replace(/\.$/, '').split(/,\s*/).filter(Boolean);
    test.info().annotations.push({ type: 'objective required', description: `"${message}" — set Objective 1` });
    for (const name of names) await this.setField(name, 'objective', /Objective 1/);
    return true;
  }

  /** Saves when there are pending edits, otherwise closes with Cancel. */
  async close(): Promise<void> {
    if (await this.saveButton.isEnabled()) await this.save();
    else await this.cancel();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await expect(this.root).toBeHidden();
  }
}
