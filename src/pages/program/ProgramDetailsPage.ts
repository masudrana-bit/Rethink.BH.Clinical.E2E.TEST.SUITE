import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export type ProgramAction = 'Edit' | 'Duplicate' | 'Update Status' | 'Delete';
export type ProgramDetailsTab = 'program-details' | 'lesson-information' | 'data';

/** Program detail page: /clients/:clientId/programs/:programId */
export class ProgramDetailsPage extends BasePage {
  readonly title: Locator;
  readonly editProgramButton: Locator;
  readonly addTargetButton: Locator;
  readonly printButton: Locator;
  readonly actionsMenu: Locator;
  readonly goalSection: Locator;
  readonly goal: Locator;
  readonly editGoalsButton: Locator;
  readonly dataSettings: Locator;
  readonly manageDataCollectionButton: Locator;
  readonly targetsSection: Locator;
  readonly manageTargetsButton: Locator;
  readonly masteryReview: Locator;
  readonly masteryReviewEmpty: Locator;
  readonly deleteConfirm: Locator;
  readonly updateStatusDialog: Locator;
  readonly editDialog: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('main.client-workspace__detail h2').first();
    this.editProgramButton = this.tid('program-details-edit-program');
    this.addTargetButton = this.tid('program-details-add-target');
    this.printButton = this.tid('program-details-print');
    this.actionsMenu = this.tid('program-details-actions-menu');
    this.goalSection = this.tid('program-details-goals');
    this.goal = this.tid('program-details-goal');
    this.editGoalsButton = this.tid('program-details-edit-goals');
    this.dataSettings = this.tid('program-details-settings');
    this.manageDataCollectionButton = this.tid('program-details-manage-data-collection');
    this.targetsSection = this.tid('program-details-targets');
    this.manageTargetsButton = this.tid('program-details-manage-targets');
    this.masteryReview = this.tid('mastery-evaluation-review');
    this.masteryReviewEmpty = this.tid('mastery-review-empty');
    this.deleteConfirm = this.tid('program-details-delete-confirm');
    this.updateStatusDialog = this.tid('update-status-dialog');
    this.editDialog = this.tid('program-details-edit-dialog');
  }

  tab(name: ProgramDetailsTab): Locator {
    return this.tid(`program-details-tab-${name}`);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/programs\/\d+/);
    await this.recoverLoadErrors(this.goalSection);
  }

  async openTab(name: ProgramDetailsTab): Promise<void> {
    await this.tab(name).click();
    await this.waitForLoaded();
  }

  async programId(): Promise<string> {
    return this.page.url().match(/programs\/(\d+)/)?.[1] ?? '';
  }

  async runAction(action: ProgramAction): Promise<void> {
    const item = this.page.getByRole('menuitem', { name: action, exact: true });
    // The popup menu animates in and can close on a mid-animation click, so retry open + pick together.
    const dialogs = this.page.locator('.p-dialog:visible');
    await expect(async () => {
      if ((await dialogs.count()) > 0) return;
      if (!(await item.isVisible())) await this.actionsMenu.click();
      await item.click({ timeout: 3_000 });
      await expect(item).toBeHidden({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async editGoal(goal: string): Promise<void> {
    await this.editGoalsButton.click();
    const dialog = this.visibleDialog();
    await dialog.getByRole('textbox').first().fill(goal);
    await dialog.getByRole('button', { name: /save/i }).click();
    await expect(this.goal).toContainText(goal);
  }

  async renameProgram(newTitle: string): Promise<void> {
    await this.editProgramButton.click();
    const dialog = this.editDialog.locator('.p-dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('textbox', { name: /title|name/i }).first().fill(newTitle);
    await dialog.getByRole('button', { name: /save/i }).click();
    await expect(dialog).toBeHidden();
  }

  async updateStatus(status: 'Current' | 'Future' | 'Inactive' | 'Discontinued' | 'Mastered' | RegExp): Promise<void> {
    await this.runAction('Update Status');
    const dialog = this.updateStatusDialog.locator('.p-dialog');
    await expect(dialog).toBeVisible();
    const select = dialog.locator('p-select, [role=combobox]').first();
    if (await select.isVisible().catch(() => false)) {
      await select.click();
      await this.page.getByRole('option', { name: status }).click();
    } else {
      await dialog.getByRole('radio', { name: status }).check({ force: true });
    }
    await dialog.getByRole('button', { name: /save|update|confirm/i }).last().click();
    await expect(dialog).toBeHidden();
  }

  /** Deletes the program; returns the confirmation text shown before the delete. */
  /** Deletes the open program. Pass `expectedTitle` to refuse deleting anything else. */
  async deleteProgram(expectedTitle?: string): Promise<string> {
    if (expectedTitle) await expect(this.title).toHaveText(expectedTitle);
    await this.runAction('Delete');
    const dialog = this.deleteConfirm.locator('.p-dialog');
    await expect(dialog).toBeVisible();
    const message = await dialog.innerText();
    await dialog.getByRole('button', { name: /^(confirm|delete)$/i }).click();
    await expect(dialog).toBeHidden();
    return message;
  }

  /** Pending automatic mastery determination for a target (US-33). */
  masteryDetermination(targetName: string | RegExp): Locator {
    return this.masteryReview.locator('li, article, [role=row]').filter({ hasText: targetName }).first();
  }

  async decideMastery(targetName: string | RegExp, decision: 'confirm' | 'reject'): Promise<void> {
    const item = this.masteryDetermination(targetName);
    await item.getByRole('button', { name: decision === 'confirm' ? /confirm|accept|approve/i : /reject|decline/i }).click();
    const dialog = this.page.locator('.p-dialog:visible').last();
    if (await dialog.isVisible().catch(() => false)) {
      const reason = dialog.getByRole('textbox').first();
      if (await reason.isVisible().catch(() => false)) await reason.fill(`E2E ${decision} mastery`);
      await dialog.getByRole('button', { name: /confirm|reject|save|submit/i }).last().click();
    }
    await expect(item).toBeHidden();
  }
}
