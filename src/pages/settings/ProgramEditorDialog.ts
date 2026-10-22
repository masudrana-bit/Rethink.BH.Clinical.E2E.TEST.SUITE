import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { readPrimeOptions, selectPrimeOption, selectPrimeOptionOrFirst, setPrimeCheckbox } from '../../helpers/primeng';
import { BulkTargetPaste } from '../shared/BulkTargetPaste';
import { LessonMaterialEditor } from '../shared/LessonMaterialEditor';

export interface LibraryProgramInput {
  category: string;
  domain?: string;
  area?: string;
  title: string;
  goal: string;
  objectives?: string[];
  targets?: string[];
  keywords?: string;
  materialUrl?: { title: string; url: string };
}

/** Program editor dialog in Settings > Program Library (create / edit / adapt). */
export class ProgramEditorDialog extends BasePage {
  readonly form: Locator;
  readonly createNotice: Locator;
  readonly category: Locator;
  readonly domain: Locator;
  readonly area: Locator;
  readonly title: Locator;
  readonly goal: Locator;
  readonly newObjective: Locator;
  readonly addObjective: Locator;
  readonly targetCatalog: Locator;
  readonly keywords: Locator;
  readonly legal: Locator;
  readonly cancelButton: Locator;
  readonly saveDraftButton: Locator;
  readonly publishButton: Locator;
  readonly bulkTargets: BulkTargetPaste;
  readonly materials: LessonMaterialEditor;

  constructor(page: Page) {
    super(page);
    this.form = this.tid('program-editor-form');
    this.createNotice = this.tid('program-editor-dialog-create-notice');
    this.category = this.tid('program-editor-category');
    this.domain = this.tid('program-editor-domain');
    this.area = this.tid('program-editor-area');
    this.title = this.tid('program-editor-title');
    this.goal = this.tid('program-editor-goal-description');
    this.newObjective = this.tid('program-editor-new-objective');
    this.addObjective = this.tid('program-editor-add-objective');
    this.targetCatalog = this.tid('program-editor-target-catalog');
    this.keywords = this.tid('program-editor-keywords');
    this.legal = this.tid('program-editor-legal');
    this.cancelButton = this.tid('program-editor-dialog-cancel');
    this.saveDraftButton = this.tid('program-editor-dialog-save-draft');
    this.publishButton = this.tid('program-editor-dialog-publish');
    this.bulkTargets = new BulkTargetPaste(page, this.form);
    this.materials = new LessonMaterialEditor(page, 'program-editor');
  }

  async categories(): Promise<string[]> {
    return readPrimeOptions(this.page, this.category, { closeByClick: true });
  }

  async domainsFor(category: string): Promise<string[]> {
    await selectPrimeOption(this.page, this.category, category);
    return readPrimeOptions(this.page, this.domain, { closeByClick: true });
  }

  async requiredLabels(): Promise<string[]> {
    return (await this.form.locator('label').allInnerTexts()).filter((l) => l.includes('*')).map((l) => l.replace('*', '').trim());
  }

  async fill(input: LibraryProgramInput): Promise<void> {
    await selectPrimeOption(this.page, this.category, input.category);
    if (input.domain) await selectPrimeOptionOrFirst(this.page, this.domain, input.domain);
    if (input.area) await selectPrimeOptionOrFirst(this.page, this.area, input.area);
    await this.title.fill(input.title);
    await this.goal.fill(input.goal);
    for (const objective of input.objectives ?? []) {
      await this.newObjective.fill(objective);
      await this.addObjective.click();
    }
    if (input.targets?.length) {
      await this.bulkTargets.addTargets(input.targets);
      for (const t of input.targets) await expect(this.targetCatalog).toContainText(t);
    }
    if (input.materialUrl) await this.materials.addUrl(input.materialUrl.title, input.materialUrl.url);
    if (input.keywords) await this.keywords.fill(input.keywords);
    await setPrimeCheckbox(this.legal, true);
  }

  async saveDraft(): Promise<void> {
    await this.saveDraftButton.click();
    await this.expectSavedOrSkipOnOutage(this.form, () => this.saveDraftButton.click());
  }

  /** Publishes; returns the confirmation text shown before publishing (US-46 expects one). */
  async publish(): Promise<string> {
    await this.publishButton.click();
    const confirm = this.page.locator('.p-confirmdialog:visible, [role=alertdialog]:visible').last();
    let message = '';
    if (await confirm.waitFor({ state: 'visible', timeout: 3_000 }).then(() => true, () => false)) {
      message = (await confirm.innerText()).trim();
      await confirm.getByRole('button', { name: /publish|yes|confirm/i }).last().click();
    }
    await expect(this.form).toBeHidden({ timeout: 30_000 });
    return message;
  }

  /** Cancel; confirms the "discard changes" prompt when one appears. */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
    const discard = this.tid('program-editor-discard-confirm').locator('.p-dialog');
    if (await discard.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await discard.getByRole('button', { name: /discard|yes|leave/i }).last().click();
    }
    await expect(this.form).toBeHidden();
  }
}
