import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { selectPrimeOption } from '../../helpers/primeng';

export type Phase = 'Baseline' | 'Intervention' | 'Generalization' | 'Maintenance' | 'Mastered' | string;

/** "Change phase" dialog opened from a target's phase control (US-32). */
export class PhaseChangeDialog extends BasePage {
  readonly target: Locator;
  readonly phaseSelect: Locator;
  readonly effectiveDate: Locator;
  readonly reason: Locator;
  readonly history: Locator;
  readonly historyItems: Locator;
  readonly blockedReason: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.target = this.tid('phase-dialog-target');
    this.phaseSelect = this.tid('phase-dialog-phase-select');
    this.effectiveDate = this.tid('phase-dialog-effective-date-input');
    this.reason = this.tid('phase-dialog-reason-input');
    this.history = this.tid('phase-history-panel');
    this.historyItems = this.tid('phase-history-item');
    this.blockedReason = this.tid('phase-dialog-blocked-reason');
    this.saveButton = this.tid('phase-dialog-save');
    this.cancelButton = this.tid('phase-dialog-cancel');
  }

  async changePhase(phase: Phase, reason: string, effectiveDate?: string): Promise<void> {
    await selectPrimeOption(this.page, this.phaseSelect, phase);
    if (effectiveDate) await this.effectiveDate.fill(effectiveDate);
    await this.reason.fill(reason);
    await expect(this.saveButton).toBeEnabled();
    await this.saveButton.click();
    await expect(this.phaseSelect).toBeHidden();
  }
}
