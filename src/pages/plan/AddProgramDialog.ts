import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { choosePrimeRadio, readPrimeOptions, selectPrimeOption } from '../../helpers/primeng';

export type ProgramSource = 'System Programs' | 'My Programs';
export type PlanStatus = 'current' | 'future';

/** "Add Program" library dialog opened from the treatment plan. */
export class AddProgramDialog extends BasePage {
  readonly root: Locator;
  readonly sources: Locator;
  readonly search: Locator;
  readonly categorySelect: Locator;
  readonly domainSelect: Locator;
  readonly areaSelect: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  readonly loading: Locator;
  readonly createCustomButton: Locator;
  readonly closeButton: Locator;
  readonly duplicateDialog: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('add-program-dialog');
    this.sources = this.tid('add-program-dialog-sources');
    this.search = this.tid('add-program-dialog-search');
    this.categorySelect = this.tid('add-program-dialog-category-select');
    this.domainSelect = this.tid('add-program-dialog-domain-select');
    this.areaSelect = this.tid('add-program-dialog-area-select');
    this.table = this.tid('add-program-dialog-table');
    this.rows = this.root.locator('tr[data-testid^="add-program-dialog-row-"]');
    this.loading = this.tid('add-program-dialog-loading');
    this.createCustomButton = this.tid('add-program-dialog-create-custom-button');
    this.closeButton = this.tid('add-program-dialog-close-button');
    this.duplicateDialog = this.tid('add-program-duplicate');
  }

  get duplicateWarning(): Locator {
    return this.duplicateDialog.locator('.p-dialog');
  }

  row(programName: string | RegExp): Locator {
    return this.rows.filter({ has: this.page.locator('[data-testid^="add-program-dialog-name-"]', { hasText: programName }) }).first();
  }

  alreadyAddedChip(programName: string | RegExp): Locator {
    return this.row(programName).locator('[data-testid^="add-program-dialog-added-"]');
  }

  addButton(programName: string | RegExp): Locator {
    return this.row(programName).locator('[data-testid^="add-program-dialog-add-"]');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.search).toBeVisible();
    await expect(this.loading).toHaveCount(0, { timeout: 60_000 });
    await expect(this.rows.first()).toBeVisible();
  }

  async chooseSource(source: ProgramSource): Promise<void> {
    await this.sources.getByText(source, { exact: true }).click();
    await this.expectLoaded();
  }

  async chooseStatus(status: PlanStatus): Promise<void> {
    await choosePrimeRadio(this.tid(`add-program-dialog-catalog-status-${status}`));
  }

  async searchFor(keyword: string): Promise<void> {
    await this.search.fill(keyword);
    await expect(this.rows.first()).toContainText(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), { timeout: 30_000 });
  }

  /** Searches the current source tab and reports whether `programName` is offered. */
  async offers(programName: string): Promise<boolean> {
    await this.search.fill(programName);
    await expect
      .poll(async () => (await this.row(programName).count()) > 0 || (await this.root.getByText(/no (programs|results)|nothing (found|matches)/i).count()) > 0, { timeout: 30_000 })
      .toBe(true)
      .catch(() => undefined);
    return (await this.row(programName).count()) > 0;
  }

  async filterBy(filter: 'category' | 'domain' | 'area', option: string | RegExp): Promise<void> {
    const select = { category: this.categorySelect, domain: this.domainSelect, area: this.areaSelect }[filter];
    await selectPrimeOption(this.page, select, option);
  }

  async filterOptions(filter: 'category' | 'domain' | 'area'): Promise<string[]> {
    const select = { category: this.categorySelect, domain: this.domainSelect, area: this.areaSelect }[filter];
    return readPrimeOptions(this.page, select);
  }

  async rowCells(programName: string | RegExp): Promise<string[]> {
    return (await this.row(programName).locator('td').allInnerTexts()).map((c) => c.replace(/\s+/g, ' ').trim());
  }

  async preview(programName: string | RegExp): Promise<Locator> {
    const before = await this.page.locator('.p-dialog:visible').count();
    await this.row(programName).locator('[data-testid^="add-program-dialog-preview-"]').click();
    await expect(this.page.locator('.p-dialog:visible')).toHaveCount(before + 1).catch(() => undefined);
    const preview = this.page.locator('.p-dialog:visible').last();
    await expect(preview).toBeVisible();
    return preview;
  }

  async closePreview(preview: Locator): Promise<void> {
    await preview.getByRole('button', { name: /close|back|cancel/i }).last().click();
    await expect(this.search).toBeVisible();
  }

  /** Adds a library program; returns true when the duplicate warning was shown. */
  async addProgram(programName: string | RegExp, status: PlanStatus): Promise<boolean> {
    await this.chooseStatus(status);
    await this.row(programName).locator('[data-testid^="add-program-dialog-add-"]').click();
    const duplicate = await this.duplicateWarning.waitFor({ state: 'visible', timeout: 3_000 }).then(() => true).catch(() => false);
    if (!duplicate) await this.expectToast(/added|program/i).catch(() => undefined);
    return duplicate;
  }

  async openCreateCustom(): Promise<void> {
    await this.createCustomButton.click();
    await expect(this.tid('custom-program-form')).toBeVisible();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await expect(this.search).toBeHidden();
  }
}
