import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { choosePrimeRadio, readPrimeOptions, selectPrimeOption, selectPrimeOptionOrFirst, setPrimeCheckbox } from '../../helpers/primeng';
import { BulkTargetPaste } from '../shared/BulkTargetPaste';
import { LessonMaterialEditor } from '../shared/LessonMaterialEditor';

export interface CustomProgramInput {
  category: string;
  domain?: string;
  area?: string;
  title: string;
  goal: string;
  status: 'current' | 'future';
  objectives?: string[];
  targets?: string[];
  lesson?: { exercise?: string; generalization?: string; errorCorrection?: string; supplies?: string; troubleshooting?: string };
  materialUrl?: { title: string; url: string };
  saveToMyPrograms?: boolean;
}

/** "Create Custom Program" form inside the Add Program dialog. */
export class CustomProgramForm extends BasePage {
  readonly root: Locator;
  readonly category: Locator;
  readonly domain: Locator;
  readonly area: Locator;
  readonly title: Locator;
  readonly goal: Locator;
  readonly newObjective: Locator;
  readonly addObjective: Locator;
  readonly objectives: Locator;
  readonly exercise: Locator;
  readonly generalization: Locator;
  readonly errorCorrection: Locator;
  readonly supplies: Locator;
  readonly troubleshooting: Locator;
  readonly availability: Locator;
  readonly stagedTargets: Locator;
  readonly policyCheckbox: Locator;
  readonly saveButton: Locator;
  readonly bulkTargets: BulkTargetPaste;
  readonly materials: LessonMaterialEditor;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('custom-program-form');
    this.category = this.tid('custom-program-form-category');
    this.domain = this.tid('custom-program-form-domain');
    this.area = this.tid('custom-program-form-area');
    this.title = this.tid('custom-program-form-title');
    this.goal = this.tid('custom-program-form-goal-description');
    this.newObjective = this.tid('custom-program-form-new-objective');
    this.addObjective = this.tid('custom-program-form-add-objective');
    this.objectives = this.tid('custom-program-form-objectives');
    this.exercise = this.tid('custom-program-form-exercise');
    this.generalization = this.tid('custom-program-form-generalization');
    this.errorCorrection = this.tid('custom-program-form-error-correction');
    this.supplies = this.tid('custom-program-form-supplies');
    this.troubleshooting = this.tid('custom-program-form-troubleshooting');
    this.availability = this.tid('custom-program-form-availability');
    this.stagedTargets = this.tid('staged-target-list');
    this.policyCheckbox = page.locator('#custom-program-form-policy-agree');
    this.saveButton = this.tid('custom-program-form-save-button');
    this.bulkTargets = new BulkTargetPaste(page, this.root);
    this.materials = new LessonMaterialEditor(page, 'custom-program-form');
  }

  async domainOptions(category: string): Promise<string[]> {
    await selectPrimeOption(this.page, this.category, category);
    return readPrimeOptions(this.page, this.domain);
  }

  async fill(input: CustomProgramInput): Promise<void> {
    await selectPrimeOption(this.page, this.category, input.category);
    if (input.domain) await selectPrimeOptionOrFirst(this.page, this.domain, input.domain);
    if (input.area) await selectPrimeOptionOrFirst(this.page, this.area, input.area);
    await this.title.fill(input.title);
    await this.goal.fill(input.goal);
    await choosePrimeRadio(this.tid(`custom-program-form-status-${input.status}`));
    for (const objective of input.objectives ?? []) {
      await this.newObjective.fill(objective);
      await this.addObjective.click();
      await expect(this.objectives).toContainText(objective);
    }
    const lesson = input.lesson ?? {};
    if (lesson.exercise) await this.exercise.fill(lesson.exercise);
    if (lesson.generalization) await this.generalization.fill(lesson.generalization);
    if (lesson.errorCorrection) await this.errorCorrection.fill(lesson.errorCorrection);
    if (lesson.supplies) await this.supplies.fill(lesson.supplies);
    if (lesson.troubleshooting) await this.troubleshooting.fill(lesson.troubleshooting);
    if (input.saveToMyPrograms !== undefined) {
      await setPrimeCheckbox(this.availability.locator('p-checkbox, p-toggleswitch, input[type=checkbox]').first(), input.saveToMyPrograms);
    }
    if (input.targets?.length) {
      await this.bulkTargets.addTargets(input.targets);
      for (const target of input.targets) await expect(this.stagedTargets).toContainText(target);
    }
    if (input.materialUrl) await this.materials.addUrl(input.materialUrl.title, input.materialUrl.url);
    await setPrimeCheckbox(this.policyCheckbox, true);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    await this.expectSavedOrSkipOnOutage(this.root, () => this.saveButton.click());
  }
}
