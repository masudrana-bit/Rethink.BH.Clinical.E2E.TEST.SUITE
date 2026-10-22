import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { readPrimeOptions, selectPrimeOption } from '../../helpers/primeng';

export interface CatalogRow {
  title: string;
  category: string;
  domain: string;
  area: string;
  customDomain: string;
  source: string;
  status: string;
  createdBy: string;
  lastEditedBy: string;
}

/** Settings > Clinical > Program Library catalog (US-42 – US-47). */
export class ProgramLibraryAdminPage extends BasePage {
  readonly root: Locator;
  readonly search: Locator;
  readonly newProgramButton: Locator;
  readonly pageSize: Locator;
  readonly categorySelect: Locator;
  readonly domainSelect: Locator;
  readonly areaSelect: Locator;
  readonly grid: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('program-library-admin');
    this.search = this.tid('program-library-admin-search');
    this.newProgramButton = this.tid('program-library-admin-new');
    this.pageSize = this.tid('program-library-admin-page-size');
    this.categorySelect = this.tid('program-library-admin-category-select');
    this.domainSelect = this.tid('program-library-admin-domain-select');
    this.areaSelect = this.tid('program-library-admin-area-select');
    this.grid = this.tid('program-library-admin-grid');
    this.rows = this.grid.locator('.ag-center-cols-container .ag-row');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.rows.first()).toBeVisible({ timeout: 180_000 });
  }

  async open(): Promise<void> {
    await this.page.goto('/settings/clinical/program-library');
    await this.expectLoaded();
  }

  /** "N of M" shown above the grid. */
  async shownCount(): Promise<{ shown: number; total: number }> {
    const text = await this.root.innerText();
    const pager = text.match(/\d+\s+to\s+\d+\s+of\s+(\d+)/);
    // The grid pages at 50 rows; its "1 to 50 of 52" / "Page 1 of 2" labels are not the catalog count.
    const match = text.replace(/\d+\s+to\s+\d+\s+of\s+\d+/g, '').replace(/Page\s+\d+\s+of\s+\d+/g, '').match(/(\d+)\s+of\s+(\d+)/);
    if (match) return { shown: Number(match[1]), total: Number(match[2]) };
    const rows = Number(pager?.[1] ?? 0);
    return { shown: rows, total: rows };
  }

  async titles(): Promise<string[]> {
    return (await this.grid.locator('.ag-center-cols-container .ag-row [col-id=title], .ag-pinned-left-cols-container .ag-row [col-id=title]').allInnerTexts()).map((t) => t.trim());
  }

  async columnValues(colId: string): Promise<string[]> {
    return (await this.grid.locator(`.ag-row [col-id="${colId}"]`).allInnerTexts()).map((t) => t.trim());
  }

  /** Types into search and waits for the grid to settle (rows may legitimately be empty). */
  async typeSearch(text: string): Promise<void> {
    const before = await this.root.innerText();
    await this.search.fill(text);
    await expect.poll(() => this.root.innerText(), { timeout: 5_000 }).not.toBe(before).catch(() => undefined);
    await this.waitForLoaded();
  }

  async statusOf(title: string | RegExp): Promise<string> {
    return (await this.readRow(title)).status;
  }

  async rowActionLabels(title: string | RegExp): Promise<string[]> {
    const actions = await this.actions(title);
    const inline = (await actions.getByRole('button').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
    await actions.getByTestId('program-row-actions-more').click();
    const overflow = (await this.page.getByRole('menuitem').allInnerTexts()).map((t) => t.trim());
    await this.page.keyboard.press('Escape');
    return [...inline, ...overflow];
  }

  /** Clean-up for E2E programs: Delete when offered, otherwise Deactivate. Returns what was done. */
  async retire(title: string): Promise<string> {
    await this.typeSearch(title);
    if (!(await this.rows.filter({ hasText: title }).count())) return 'not listed';
    const labels = await this.rowActionLabels(title);
    const del = labels.find((l) => /^delete/i.test(l));
    if (del) {
      await this.overflowAction(title, del);
      await this.confirmDialog(/delete|yes|confirm/i).catch(() => '');
      return 'deleted';
    }
    if (labels.includes('Deactivate')) {
      await this.toggleActive(title, 'Deactivate');
      return 'deactivated';
    }
    return `left as is (actions: ${labels.join(', ')})`;
  }

  async columnHeaders(): Promise<string[]> {
    return (await this.grid.locator('.ag-header-cell').allInnerTexts()).map((h) => h.trim());
  }

  /** AG Grid renders pinned columns in separate containers, so a row is addressed by its row-index across them. */
  async rowIndex(title: string | RegExp): Promise<string> {
    const row = this.rows.filter({ has: this.page.locator('[col-id=title]', { hasText: title }) }).first();
    await expect(row).toBeVisible();
    return (await row.getAttribute('row-index'))!;
  }

  rowByIndex(index: string): Locator {
    return this.grid.locator(`.ag-row[row-index="${index}"]`);
  }

  async readRow(title: string | RegExp): Promise<CatalogRow> {
    const idx = await this.rowIndex(title);
    // Optional columns (custom domain, created by, last edited by) are not in every catalog layout.
    const cell = async (col: string) => {
      const target = this.rowByIndex(idx).locator(`[col-id="${col}"]`).first();
      return (await target.count()) ? ((await target.innerText()) || '').trim() : '';
    };
    return {
      title: await cell('title'),
      category: await cell('category'),
      domain: await cell('domain'),
      area: await cell('area'),
      customDomain: await cell('customDomain'),
      source: await cell('source'),
      status: await cell('status'),
      createdBy: await cell('createdBy'),
      lastEditedBy: await cell('lastEditedBy'),
    };
  }

  async actions(title: string | RegExp): Promise<Locator> {
    const idx = await this.rowIndex(title);
    return this.rowByIndex(idx).locator('[col-id=actions]').first();
  }

  async searchFor(text: string): Promise<void> {
    await this.search.fill(text);
    await expect(this.rows.first()).toContainText(text, { timeout: 30_000 });
  }

  async filterBy(filter: 'category' | 'domain' | 'area', option: string | RegExp): Promise<void> {
    const select = { category: this.categorySelect, domain: this.domainSelect, area: this.areaSelect }[filter];
    await selectPrimeOption(this.page, select, option);
  }

  async filterOptions(filter: 'category' | 'domain' | 'area'): Promise<string[]> {
    const select = { category: this.categorySelect, domain: this.domainSelect, area: this.areaSelect }[filter];
    return readPrimeOptions(this.page, select);
  }

  async openNewProgram(): Promise<void> {
    await this.newProgramButton.click();
    await expect(this.tid('program-editor-form')).toBeVisible();
  }

  async edit(title: string | RegExp): Promise<void> {
    await (await this.actions(title)).getByTestId('program-row-actions-edit').click();
    await expect(this.tid('program-editor-form')).toBeVisible();
  }

  get adaptConfirm(): Locator {
    return this.tid('program-library-admin-adapt-confirm').locator('.p-dialog');
  }

  /** Edit on a standard program asks to adapt a copy; returns that message ('' when the editor opened directly). */
  async editOrAdapt(title: string | RegExp): Promise<string> {
    await (await this.actions(title)).getByTestId('program-row-actions-edit').click();
    const form = this.tid('program-editor-form');
    await expect(form.or(this.adaptConfirm)).toBeVisible();
    if (!(await this.adaptConfirm.isVisible())) return '';
    const message = (await this.adaptConfirm.innerText()).replace(/\s+/g, ' ').trim();
    await this.adaptConfirm.getByRole('button', { name: /adapt|copy|continue/i }).last().click();
    await expect(form).toBeVisible();
    return message;
  }

  async overflowAction(title: string | RegExp, action: string | RegExp): Promise<void> {
    await (await this.actions(title)).getByTestId('program-row-actions-more').click();
    await this.page.getByRole('menuitem', { name: action }).click();
  }

  /** Deactivates or reactivates a program and returns the confirmation message (empty when none was shown). */
  async toggleActive(title: string | RegExp, action: 'Deactivate' | 'Reactivate' | 'Activate'): Promise<string> {
    const actions = await this.actions(title);
    const button = actions.getByRole('button', { name: action, exact: true });
    if (await button.isVisible().catch(() => false)) await button.click();
    else await this.overflowAction(title, action);
    const confirm = this.page.locator('.p-confirmdialog:visible, .p-dialog:visible').last();
    let message = '';
    if (await confirm.waitFor({ state: 'visible', timeout: 3_000 }).then(() => true, () => false)) {
      message = (await confirm.innerText()).trim();
      await confirm.getByRole('button', { name: new RegExp(`${action}|yes|confirm`, 'i') }).last().click();
    }
    return message;
  }
}
