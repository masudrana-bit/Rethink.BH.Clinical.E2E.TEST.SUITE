import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { readPrimeOptions, selectFirstPrimeOption, selectPrimeOption, setPrimeCheckbox } from '../../helpers/primeng';

export const COLLECTION_TYPES = {
  structured: ['opportunity-based', 'task-analysis', 'frequency-rate', 'duration', 'frequency-duration', 'interval'],
  quickEntry: ['percentage', 'numeric', 'percentage-numeric', 'rating-scale', 'number-of-occurrences', 'number-of-prompts'],
  specialized: ['toileting', 'peak'],
} as const;

export type CollectionType =
  | (typeof COLLECTION_TYPES.structured)[number]
  | (typeof COLLECTION_TYPES.quickEntry)[number]
  | (typeof COLLECTION_TYPES.specialized)[number];

export const COLLECTION_TYPE_LABELS: Record<CollectionType, string> = {
  'opportunity-based': 'Opportunity Based',
  'task-analysis': 'Task Analysis',
  'frequency-rate': 'Frequency/Rate',
  duration: 'Duration',
  'frequency-duration': 'Frequency + Duration',
  interval: 'Interval',
  percentage: 'Percentage',
  numeric: 'Numeric',
  'percentage-numeric': 'Percentage + Numeric',
  'rating-scale': 'Rating Scale',
  'number-of-occurrences': 'Number of Occurrences',
  'number-of-prompts': 'Number of Prompts',
  toileting: 'Toileting',
  peak: 'PEAK Scoring',
};

export type Dimension = 'prompts' | 'latency' | 'intensity' | 'antecedents-consequences' | 'location';

export interface MasteryInput {
  skipBaseline?: boolean;
  baselineDirection?: 'At Least' | 'At Most';
  baselineThreshold?: number;
  interventionMode?: 'Automatic with Confirmation' | 'Clinician Attestation' | string;
  interventionThreshold?: number;
  minTrials?: number;
  sessionCount?: number;
  maintenance?: boolean;
  /** Turns on "Use Custom Criteria" for maintenance and sets its threshold. */
  maintenanceCustomThreshold?: number;
  generalization?: boolean;
}

/** "Manage Data Collection" wizard: step 1 collection type & dimensions, step 2 mastery criteria. */
export class DataCollectionWizard extends BasePage {
  readonly root: Locator;
  readonly step1: Locator;
  readonly step2: Locator;
  readonly nextButton: Locator;
  readonly backButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly promptChoices: Locator;
  readonly addPromptChoice: Locator;
  readonly masteryForm: Locator;
  readonly masteryHeading: Locator;
  readonly baselineSection: Locator;
  readonly interventionSection: Locator;
  readonly generalizationSection: Locator;
  readonly maintenanceSection: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('data-collection-wizard');
    this.step1 = this.tid('data-collection-wizard-step-1');
    this.step2 = this.tid('data-collection-wizard-step-2');
    this.nextButton = this.tid('data-collection-wizard-next');
    this.backButton = this.tid('data-collection-wizard-back');
    this.saveButton = this.tid('data-collection-wizard-save');
    this.cancelButton = this.tid('data-collection-wizard-cancel');
    this.promptChoices = page.locator('input[data-testid^="data-collection-config-form-dimension-prompts-choice-"]:not([data-testid*="abbreviation"])');
    this.addPromptChoice = this.tid('data-collection-config-form-dimension-prompts-add-choice');
    this.masteryForm = this.tid('mastery-criteria-form');
    this.masteryHeading = this.tid('mastery-criteria-form-heading');
    this.baselineSection = this.tid('mastery-criteria-form-baseline-section');
    this.interventionSection = this.tid('mastery-criteria-form-intervention-section');
    this.generalizationSection = this.tid('mastery-criteria-form-generalization-section');
    this.maintenanceSection = this.tid('mastery-criteria-form-maintenance-section');
  }

  typeRadio(type: CollectionType): Locator {
    return this.tid(`data-collection-config-form-type-${type}`);
  }

  dimensionToggle(dimension: Dimension): Locator {
    return this.tid(`data-collection-config-form-dimension-${dimension}`);
  }

  async expectOpen(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.step1).toBeVisible();
  }

  async chooseType(type: CollectionType): Promise<void> {
    // The radio input itself is visually hidden; its row is the click target.
    await this.tid(`data-collection-config-form-type-row-${type}`).click();
    await expect(this.typeRadio(type)).toBeChecked();
  }

  async setDimension(dimension: Dimension, on: boolean): Promise<void> {
    await setPrimeCheckbox(this.dimensionToggle(dimension), on);
  }

  async promptHierarchy(): Promise<string[]> {
    const values: string[] = [];
    for (let i = 0; i < (await this.promptChoices.count()); i++) values.push(await this.promptChoices.nth(i).inputValue());
    return values;
  }

  async goToMastery(): Promise<void> {
    await this.nextButton.click();
    await expect(this.masteryForm).toBeVisible();
  }

  /** Criteria fields use the same test ids in every phase, so always scope them to a phase section. */
  field(section: Locator, name: string): Locator {
    return section.getByTestId(`mastery-phase-criteria-fields-${name}`).first();
  }

  /** Phase sections are <details>; only Intervention starts expanded. */
  async expandSection(section: Locator): Promise<void> {
    if (!(await section.evaluate((el) => (el as HTMLDetailsElement).open))) await section.locator('summary').first().click();
    await expect.poll(() => section.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(true);
  }

  async setMastery(input: MasteryInput): Promise<void> {
    if (input.skipBaseline !== undefined || input.baselineThreshold !== undefined || input.baselineDirection) {
      await this.expandSection(this.baselineSection);
      if (input.skipBaseline !== undefined) await setPrimeCheckbox(this.tid('mastery-criteria-form-baseline-skip'), input.skipBaseline);
      // Skipping baseline blocks Save until a reason is recorded ("Choose why baseline is being skipped").
      if (input.skipBaseline) await selectFirstPrimeOption(this.page, this.baselineSection.locator('p-select:visible').first());
      if (input.baselineDirection) await selectPrimeOption(this.page, this.field(this.baselineSection, 'direction'), input.baselineDirection);
      if (input.baselineThreshold !== undefined) await this.field(this.baselineSection, 'threshold').fill(String(input.baselineThreshold));
    }
    await this.expandSection(this.interventionSection);
    if (input.interventionMode) await selectPrimeOption(this.page, this.field(this.interventionSection, 'mode'), input.interventionMode);
    if (input.interventionThreshold !== undefined) await this.field(this.interventionSection, 'threshold').fill(String(input.interventionThreshold));
    if (input.minTrials !== undefined) await this.field(this.interventionSection, 'min-trials').fill(String(input.minTrials));
    if (input.sessionCount !== undefined) await this.field(this.interventionSection, 'count').fill(String(input.sessionCount));
    if (input.generalization !== undefined) {
      await this.expandSection(this.generalizationSection);
      await setPrimeCheckbox(this.tid('mastery-criteria-form-generalization-enabled'), input.generalization);
    }
    if (input.maintenance !== undefined) {
      await this.expandSection(this.maintenanceSection);
      await setPrimeCheckbox(this.tid('mastery-criteria-form-maintenance-enabled'), input.maintenance);
    }
    if (input.maintenanceCustomThreshold !== undefined) {
      await this.expandSection(this.maintenanceSection);
      await setPrimeCheckbox(this.tid('mastery-criteria-form-maintenance-use-custom-criteria'), true);
      await this.field(this.maintenanceSection, 'threshold').fill(String(input.maintenanceCustomThreshold));
    }
  }

  /** Inline "<Phase>: enter a threshold value." messages that block Save. */
  async blockingMessages(): Promise<string[]> {
    const phaseMessages = (await this.masteryForm.innerText()).match(/[A-Z][a-z]+: enter [^\n.]*\./g) ?? [];
    const fieldErrors = (await this.masteryForm.locator('[data-testid$="-error"]:visible, .p-error:visible, [role=alert]:visible').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
    return [...phaseMessages, ...fieldErrors];
  }

  get interventionThreshold(): Locator {
    return this.field(this.interventionSection, 'threshold');
  }

  get interventionThresholdError(): Locator {
    return this.interventionSection.getByTestId('mastery-phase-criteria-fields-threshold-error');
  }

  async optionsOf(section: Locator, name: 'mode' | 'direction' | 'window' | 'count-unit'): Promise<string[]> {
    await this.expandSection(section);
    return readPrimeOptions(this.page, this.field(section, name));
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    await this.expectSavedOrSkipOnOutage(this.root, () => this.saveButton.click());
  }

  /** Cancel only exists on step 1, so step back first when on the mastery step. */
  async cancel(): Promise<void> {
    if (await this.masteryForm.isVisible()) await this.backButton.click();
    await this.cancelButton.click();
    await expect(this.root).toBeHidden();
  }
}
