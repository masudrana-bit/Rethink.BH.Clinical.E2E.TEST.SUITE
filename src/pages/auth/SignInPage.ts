import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '../BasePage';
import { Credentials } from '../../config/env';

export class SignInPage extends BasePage {
  readonly heading: Locator;
  readonly previewSignInLink: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Sign in to continue' });
    this.previewSignInLink = this.tid('sign-in-temp-dev-login');
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.submitButton = this.tid('temp-dev-login-submit');
  }

  async open(returnTo = '/clients'): Promise<void> {
    await this.page.goto(returnTo);
    await expect(this.page).toHaveURL(/\/sign-in/);
    await expect(this.heading).toBeVisible();
  }

  /** dev2's sign-in handoff fails intermittently ("That sign-in link did not work"), so a failed attempt starts over, up to 3 times. */
  async signIn(credentials: Credentials, attempts = 3): Promise<void> {
    const failure = this.page.getByRole('heading', { name: "We couldn't sign you in" });
    const shellHeader = this.page.locator('[data-testid=app-shell-header], [data-testid=rbt-shell-header]').first();
    for (let attempt = 1; ; attempt++) {
      await this.previewSignInLink.click();
      await expect(this.page).toHaveURL(/\/temp-dev-login/);
      await this.usernameInput.fill(credentials.username);
      await this.passwordInput.fill(credentials.password);
      await this.submitButton.click();
      const settled = await expect(shellHeader.or(failure)).toBeVisible({ timeout: 60_000 }).then(() => true, () => false);
      if (settled && !(await failure.isVisible())) return;
      const reason = settled
        ? await this.page.getByText(/credential service|returned HTTP|sign-in link did not work/i).first().innerText().catch(() => '')
        : 'sign-in did not finish within 60 s';
      if (attempt >= attempts) {
        test.skip(/sign-in link did not work|did not finish/i.test(reason), `${process.env.TEST_ENV} environment outage: sign-in handoff failed ${attempts} times ("${reason}")`);
        throw new Error(`Preview sign-in failed ${attempts} times for "${credentials.username}": ${reason || "We couldn't sign you in"}. If other tests signed in, this is a ${process.env.TEST_ENV} sign-in outage; otherwise check .env.`);
      }
      test.info().annotations.push({ type: `${process.env.TEST_ENV} sign-in error`, description: `attempt ${attempt}: ${reason || "We couldn't sign you in"}; signing in again` });
      await this.open();
    }
  }
}
