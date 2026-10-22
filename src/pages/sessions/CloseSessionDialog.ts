import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { readPrimeOptions, selectPrimeOption } from '../../helpers/primeng';

export type CloseOption = 'conclude' | 'pause' | 'transfer';

/** "Close Session" dialog: conclude, pause / step away, transfer to another provider (US-13, US-23). */
export class CloseSessionDialog extends BasePage {
  readonly root: Locator;
  readonly concludeOption: Locator;
  readonly pauseOption: Locator;
  readonly transferOption: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('close-session-dialog');
    this.concludeOption = this.tid('close-session-conclude-radio');
    this.pauseOption = this.tid('close-session-pause-radio');
    this.transferOption = this.tid('close-session-transfer-radio');
    this.confirmButton = this.tid('close-session-confirm-button');
    this.cancelButton = this.tid('close-session-cancel-button');
  }

  option(name: CloseOption): Locator {
    return { conclude: this.concludeOption, pause: this.pauseOption, transfer: this.transferOption }[name];
  }

  async choose(name: CloseOption): Promise<void> {
    await this.option(name).click();
  }

  /** Staff picker shown for transfer (NGC-57 expects a picker, not free text). */
  get receivingStaff(): Locator {
    return this.tid('close-session-receiving-staff-select');
  }

  async pause(): Promise<void> {
    await this.choose('pause');
    await expect(this.confirmButton).toHaveText(/pause session/i);
    await this.confirmButton.click();
    await expect(this.confirmButton).toBeHidden();
    await expect(this.page).toHaveURL(/\/rbt(\/sessions)?(\?|$)/);
  }

  async receivingStaffOptions(): Promise<string[]> {
    await this.choose('transfer');
    return readPrimeOptions(this.page, this.receivingStaff, { closeByClick: true });
  }

  /** Picks the receiving staff member without confirming the handoff. */
  async chooseReceivingStaff(staffName: string | RegExp): Promise<void> {
    await this.choose('transfer');
    await selectPrimeOption(this.page, this.receivingStaff, staffName);
  }

  async transferTo(staffName: string | RegExp): Promise<void> {
    await this.chooseReceivingStaff(staffName);
    await this.confirmButton.click();
    await expect(this.confirmButton).toBeHidden();
  }

  /**
   * After confirming, the app asks to stop any timer still running ("You have 1 timer running …").
   * Accepts that prompt and returns its message, or '' when none appeared.
   */
  private async stopRunningTimers(): Promise<string> {
    const stopTimers = this.page.getByRole('button', { name: 'Stop Timers and Continue', exact: true });
    const appeared = await stopTimers.waitFor({ state: 'visible', timeout: 3_000 }).then(() => true, () => false);
    if (!appeared) return '';
    const message = (await this.visibleDialog(/timers? running/).innerText()).replace(/\s+/g, ' ').trim();
    await stopTimers.click();
    await expect(stopTimers).toBeHidden();
    return message;
  }

  /** Concludes the service; returns the running-timers message if the app had to stop timers first. */
  async concludeToNote(): Promise<string> {
    await this.choose('conclude');
    await expect(this.confirmButton).toHaveText(/session note/i);
    await this.confirmButton.click();
    const runningTimers = await this.stopRunningTimers();
    await expect(this.confirmButton).toBeHidden();
    return runningTimers;
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await expect(this.confirmButton).toBeHidden();
  }
}
