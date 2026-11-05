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
    return (await this.grid.locator('.ag-row [col-id=title]').allInnerTexts()).map((t) => t.trim());
  }

  /** Titles of every row on the current page; AG Grid only renders rows near the viewport, so scroll through it. */
  async allTitles(): Promise<string[]> {
    const viewport = this.grid.locator('.ag-body-viewport').first();
    const seen = new Set<string>();
    await expect
      .poll(async () => (await this.titles()).length > 0 || (await this.shownCount()).shown === 0, { timeout: 15_000 })
      .toBe(true);
    await viewport.evaluate((el) => (el.scrollTop = 0));
    for (let i = 0; i < 100; i++) {
      (await this.titles()).forEach((t) => seen.add(t));
      const atEnd = await viewport.evaluate((el) => {
        const end = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
        el.scrollTop += el.clientHeight * 0.8;
        return end;
      });
      if (atEnd) break;
      await this.page.waitForTimeout(150);
    }
    await viewport.evaluate((el) => (el.scrollTop = 0));
    return [...seen];
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
    const row = this.grid.locator('.ag-row [col-id=title]', { hasText: title }).first();
    if (!(await row.waitFor({ timeout: 15_000 }).then(() => true, () => false))) return 'not listed';
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
    const row = this.grid.locator('.ag-row[row-index]').filter({ has: this.page.locator('[col-id=title]', { hasText: title }) }).first();
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

  /**
   * First active Standard (non-E2E) program on the current grid page. `label` is the title cell including its "(#id)",
   * which tells it apart from same-named copies; `name` is the program name shown to clients.
   */
  async firstStandardProgram(): Promise<{ label: string; name: string }> {
    await expect.poll(async () => (await this.titles()).length, { timeout: 15_000 }).toBeGreaterThan(0);
    for (const label of await this.titles()) {
      if (/^E2E-/.test(label)) continue;
      const row = await this.readRow(label);
      if (row.source === 'Standard' && /^active/i.test(row.status)) return { label, name: label.split('\n')[0].trim() };
    }
    throw new Error('no active Standard program in the catalog');
  }

  /** Runs Duplicate on a row and accepts its confirmation. Returns the confirmation text and whether the editor opened on the copy. */
  async duplicate(title: string | RegExp): Promise<{ confirmation: string; editor: boolean }> {
    await this.runRowAction(title, 'Duplicate');
    const form = this.tid('program-editor-form');
    const dialog = this.page.locator('.p-confirmdialog:visible, .p-dialog:visible').last();
    await expect(form.or(dialog)).toBeVisible({ timeout: 15_000 });
    let confirmation = '';
    if (!(await form.isVisible())) {
      confirmation = (await dialog.innerText()).replace(/\s+/g, ' ').trim();
      await dialog.getByRole('button', { name: /duplicate|yes|confirm/i }).last().click();
    }
    const editor = await form.waitFor({ state: 'visible', timeout: 15_000 }).then(() => true, () => false);
    return { confirmation, editor };
  }

  /** Runs a row action whether it is an inline button or in the overflow menu. */
  async runRowAction(title: string | RegExp, action: string | RegExp): Promise<void> {
    const button = (await this.actions(title)).getByRole('button', { name: action });
    if (await button.first().isVisible().catch(() => false)) await button.first().click();
    else await this.overflowAction(title, action);
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
