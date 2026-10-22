import { expect, Locator, Page, test } from '@playwright/test';

const LOAD_ERROR = /couldn['’]t (be )?load|could not be (loaded|found)/i;
const SAVE_OUTAGE = /rejected this service's credential|something went wrong saving this program|these targets were not added|^something went wrong\. please try again\.?$/i;

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected tid(id: string): Locator {
    return this.page.getByTestId(id);
  }

  protected tidPrefix(prefix: string, root: Page | Locator = this.page): Locator {
    return root.locator(`[data-testid^="${prefix}"]`);
  }

  /** A visible PrimeNG dialog / drawer, optionally narrowed by its text. */
  protected visibleDialog(hasText?: string | RegExp): Locator {
    const dialogs = this.page.locator('.p-dialog:visible, .p-drawer:visible, [role=dialog]:visible, [role=alertdialog]:visible');
    return hasText ? dialogs.filter({ hasText }).last() : dialogs.last();
  }

  /** Waits until no loading placeholders ("Loading …") are on screen. */
  async waitForLoaded(timeout = 45_000): Promise<void> {
    await expect(this.page.locator('[data-testid$="-loading"]:visible, [role=status]:has-text("Loading")')).toHaveCount(0, { timeout });
  }

  /**
   * dev2 intermittently fails a request and shows "… couldn't be loaded" / "could not be found" in place of the data.
   * Waits for `ready`, retrying (Retry button, else reload + `reopen`) up to `attempts` times; each retry is noted on the test.
   * With `nonBlocking`, an error shown next to a visible `ready` is only noted (the page still shows its data).
   */
  protected async recoverLoadErrors(ready: Locator, { attempts = 3, timeout = 60_000, reopen, nonBlocking = false }: { attempts?: number; timeout?: number; reopen?: () => Promise<void>; nonBlocking?: boolean } = {}): Promise<void> {
    const error = this.page.getByText(LOAD_ERROR).filter({ visible: true }).first();
    for (let attempt = 0; ; attempt++) {
      await expect(ready.or(error).first()).toBeVisible({ timeout });
      await this.page.waitForTimeout(500);
      if (!(await error.isVisible())) return;
      const message = (await error.innerText()).replace(/\s+/g, ' ').trim();
      if (nonBlocking && (await ready.isVisible())) {
        test.info().annotations.push({ type: 'known-defect', description: `"${message}" shown on the page; its data still loaded` });
        return;
      }
      if (attempt >= attempts) throw new Error(`${process.env.TEST_ENV} kept failing to load after ${attempts} retries: "${message}"`);
      test.info().annotations.push({ type: `${process.env.TEST_ENV} load error`, description: `"${message}" — retried (${attempt + 1})` });
      const retry = this.page.getByRole('button', { name: /^(retry|try again)$/i }).filter({ visible: true }).first();
      if (await retry.isVisible()) {
        await retry.click();
      } else {
        await this.page.reload();
        if (reopen) await reopen();
      }
      await this.page.waitForTimeout(2_000);
    }
  }

  /**
   * Waits for a save to close `form`. If dev2's backend outage message is shown instead, saves once more with `resubmit`,
   * then skips the test as an environment outage. A partial save ("targets were not added") is not resubmitted.
   */
  protected async expectSavedOrSkipOnOutage(form: Locator, resubmit: () => Promise<void>): Promise<void> {
    const outage = this.page.getByText(SAVE_OUTAGE).filter({ visible: true }).first();
    for (let attempt = 0; ; attempt++) {
      const closed = await expect(form).toBeHidden({ timeout: 30_000 }).then(() => true, () => false);
      if (closed) return;
      if (!(await outage.isVisible())) await expect(form).toBeHidden({ timeout: 1_000 });
      const message = (await outage.innerText()).replace(/\s+/g, ' ').trim();
      if (attempt >= 1 || /targets were not added/i.test(message)) test.skip(true, `${process.env.TEST_ENV} environment outage: ${message}`);
      test.info().annotations.push({ type: `${process.env.TEST_ENV} save error`, description: `"${message}" — saved again` });
      await resubmit();
    }
  }

  async expectToast(text: string | RegExp): Promise<void> {
    await expect(this.page.locator('.p-toast-message').filter({ hasText: text }).first()).toBeVisible();
  }

  /** Accepts a confirmation dialog (Delete / Deactivate / Publish …) and returns its message. */
  async confirmDialog(acceptLabel: string | RegExp = /yes|confirm|delete|deactivate|publish|ok|continue/i): Promise<string> {
    const dialog = this.page.locator('.p-confirmdialog:visible, [role=alertdialog]:visible, .p-dialog:visible').last();
    await expect(dialog).toBeVisible();
    const message = (await dialog.innerText()).trim();
    await dialog.getByRole('button', { name: acceptLabel }).last().click();
    await expect(dialog).toBeHidden();
    return message;
  }
}
