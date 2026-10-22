import { Download, expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

/** Client "Funder Reports" tab and report editor (US-39). */
export class FunderReportsPage extends BasePage {
  readonly root: Locator;
  readonly createButton: Locator;
  readonly list: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('funder-reports-page');
    this.createButton = this.tid('funder-reports-create');
    this.list = this.tid('funder-reports-list');
    this.items = this.tid('funder-reports-item');
  }

  item(name: string | RegExp): Locator {
    return this.items.filter({ hasText: name }).first();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.createButton).toBeVisible();
  }

  async createReport(name: string): Promise<void> {
    await this.createButton.click();
    const nameBox = this.page.getByRole('textbox', { name: /report name|name|title/i }).first();
    await expect(nameBox).toBeVisible();
    await nameBox.fill(name);
  }

  /** Labels of required fields (marked with * or aria-required) on the open report editor. */
  async requiredFieldLabels(): Promise<string[]> {
    return this.page.locator('[aria-required=true], [required]').evaluateAll((els) =>
      els.map((e) => e.getAttribute('aria-label') ?? (e as HTMLInputElement).labels?.[0]?.innerText ?? e.id),
    );
  }

  async addGraph(programName: string | RegExp): Promise<void> {
    await this.page.getByRole('button', { name: /add (a )?graph/i }).first().click();
    const dialog = this.visibleDialog();
    await dialog.getByText(programName).first().click();
    await dialog.getByRole('button', { name: /add|insert|save/i }).last().click();
  }

  async exportReport(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.getByRole('button', { name: /export|download|pdf/i }).first().click(),
    ]);
    return download;
  }

  async openReport(name: string | RegExp): Promise<void> {
    await this.item(name).getByTestId('funder-reports-open').click();
  }
}
