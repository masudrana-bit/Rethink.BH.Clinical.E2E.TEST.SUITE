import { expect, Locator, Page } from '@playwright/test';

/** "Add lesson materials" block (links only - file upload is not available yet). `prefix` is the owning form's test-id prefix. */
export class LessonMaterialEditor {
  readonly root: Locator;
  readonly openButton: Locator;
  readonly urlInput: Locator;
  readonly nameInput: Locator;
  readonly addButton: Locator;
  readonly cancelButton: Locator;
  readonly empty: Locator;

  constructor(private readonly page: Page, prefix: 'custom-program-form' | 'program-editor') {
    const tid = (suffix: string) => page.getByTestId(`${prefix}-material-${suffix}`);
    this.root = tid('editor');
    this.openButton = tid('open');
    this.urlInput = tid('url');
    this.nameInput = tid('name');
    this.addButton = tid('add');
    this.cancelButton = tid('cancel');
    this.empty = tid('empty');
  }

  async addUrl(title: string, url: string): Promise<void> {
    if (!(await this.urlInput.isVisible())) await this.openButton.click();
    await this.urlInput.fill(url);
    await this.nameInput.fill(title);
    await this.addButton.click();
    await expect(this.root).toContainText(title);
    await expect(this.empty).toHaveCount(0);
  }
}
