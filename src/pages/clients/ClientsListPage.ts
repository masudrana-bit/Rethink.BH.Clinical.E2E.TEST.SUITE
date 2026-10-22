import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '../BasePage';

export interface ClientRow {
  name: string;
  dob: string;
  clientId: string;
  status: string;
}

export class ClientsListPage extends BasePage {
  readonly root: Locator;
  readonly searchByName: Locator;
  readonly searchById: Locator;
  readonly clearFilters: Locator;
  readonly table: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('clients-list-page');
    this.searchByName = this.tid('clients-list-search-name');
    this.searchById = this.tid('clients-list-search-id');
    this.clearFilters = this.tid('clients-list-clear-filters');
    this.table = this.tid('clients-list-items');
    this.rows = this.table.locator('tbody tr');
  }

  clientLink(clientId: string): Locator {
    return this.tid(`clients-list-link-${clientId}`);
  }

  get caseloadError(): Locator {
    return this.root.getByRole('alert').filter({ hasText: 'Your caseload could not be loaded' });
  }

  /** Caseload loaded on first attempt, without the "could not be loaded" error. */
  async loadedFirstTime(): Promise<boolean> {
    await expect(this.root).toBeVisible();
    await expect(this.rows.first().or(this.caseloadError)).toBeVisible({ timeout: 60_000 });
    return !(await this.caseloadError.isVisible());
  }

  /** Waits for the caseload; if dev3 returns the post-sign-in 401 it retries like a user and records the defect. */
  async expectLoaded(): Promise<void> {
    if (!(await this.loadedFirstTime())) {
      test.info().annotations.push({
        type: 'known-defect',
        description: 'Caseload request returned 401 right after sign-in ("Your caseload could not be loaded"); recovered with Try again.',
      });
      await this.root.getByRole('button', { name: 'Try again' }).click();
    }
    await expect(this.rows.first()).toBeVisible({ timeout: 60_000 });
  }

  async headers(): Promise<string[]> {
    return (await this.table.locator('thead th').allInnerTexts()).map((h) => h.trim()).filter(Boolean);
  }

  async readRow(index: number): Promise<ClientRow> {
    const cells = (await this.rows.nth(index).locator('td').allInnerTexts()).map((c) => c.replace(/\s+/g, ' ').trim());
    const [name, dob, clientId, status] = cells;
    return { name, dob, clientId, status };
  }

  async clientNames(): Promise<string[]> {
    return (await this.root.locator('[data-testid^="clients-list-link-"]').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim());
  }

  async searchName(name: string): Promise<void> {
    await this.searchByName.fill(name);
    await expect(this.rows.first()).toContainText(name);
  }

  async searchClientId(clientNumber: string): Promise<void> {
    await this.searchById.fill(clientNumber);
    await expect(this.rows.first()).toContainText(clientNumber);
  }

  async openClient(clientId: string): Promise<string> {
    const link = this.clientLink(clientId);
    await link.scrollIntoViewIfNeeded();
    const name = (await link.innerText()).replace(/\s+/g, ' ').trim();
    await link.click();
    await expect(this.page).toHaveURL(new RegExp(`/clients/${clientId}`));
    return name;
  }
}
