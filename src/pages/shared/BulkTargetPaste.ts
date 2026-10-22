import { expect, Locator, Page } from '@playwright/test';

/** "Bulk custom targets" paste box used in the custom program form, target manager and program editor. */
export class BulkTargetPaste {
  readonly input: Locator;
  readonly lineCount: Locator;
  readonly readyCount: Locator;
  readonly addButton: Locator;

  constructor(private readonly page: Page, root: Locator | Page = page) {
    const box = root.getByTestId('bulk-target-paste');
    this.input = box.getByTestId('bulk-target-paste-input');
    this.lineCount = box.getByTestId('bulk-target-paste-line-count');
    this.readyCount = box.getByTestId('bulk-target-paste-ready-count');
    this.addButton = box.getByTestId('bulk-target-paste-add');
  }

  async addTargets(targets: string[]): Promise<void> {
    await this.input.fill(targets.join('\n'));
    await expect(this.readyCount).toContainText(`${targets.length} ready`);
    await this.addButton.click();
  }
}
