import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { Credentials } from '../../config/env';

/** Legacy Rethink BH sign-in (AngularJS, Healthcare#/Login): user name, Next, then password and Login. */
export class LegacyBhSignInPage extends BasePage {
  readonly userInput: Locator;
  readonly passwordInput: Locator;
  readonly nextButton: Locator;
  readonly loginButton: Locator;
  readonly verificationCode: Locator;
  readonly acceptTerms: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    super(page);
    this.userInput = page.locator('form[name=LoginForm] input[name=User]');
    this.passwordInput = page.locator('form[name=LoginForm] input[name=Password]');
    this.nextButton = page.locator('form[name=LoginForm] [ng-click^="Next("]');
    this.loginButton = page.locator('form[name=LoginForm] [ng-click^="Login("]');
    this.verificationCode = page.locator('input[name=VerificationCode]');
    this.acceptTerms = page.locator('input[type=checkbox][ng-model=IsAcceptedTerms]');
    this.error = page.getByText(/invalid username|invalid password|incorrect/i).first();
  }

  isShown(): Promise<boolean> {
    return this.userInput.isVisible().catch(() => false);
  }

  async signIn(credentials: Credentials): Promise<void> {
    await expect(this.userInput).toBeVisible({ timeout: 30_000 });
    await this.enterPrivately(this.userInput, credentials.username);
    await this.nextButton.click();
    await expect(this.passwordInput.or(this.error).filter({ visible: true }).first()).toBeVisible({ timeout: 30_000 });
    expect(await this.error.isVisible(), `legacy BH accepts the user name (shows "${await this.error.innerText().catch(() => '')}")`).toBe(false);
    await this.enterPrivately(this.passwordInput, credentials.password);
    if (await this.acceptTerms.isVisible().catch(() => false)) await this.acceptTerms.check();
    await this.loginButton.click();
    const signedIn = this.page.locator('[ng-show=UserisLoggedIn]:visible').first();
    await expect(signedIn.or(this.verificationCode).or(this.error).filter({ visible: true }).first()).toBeVisible({ timeout: 60_000 });
    expect(await this.verificationCode.isVisible(), 'legacy BH asks for a two-factor verification code (cannot be automated)').toBe(false);
    expect(await this.error.isVisible(), 'legacy BH accepts the NextGen password').toBe(false);
  }

  /** fill() would put the typed text in the step title, which is published in the HTML report. */
  private async enterPrivately(input: Locator, value: string): Promise<void> {
    await input.click();
    await input.evaluate((el: HTMLInputElement, text) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(el, text);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('keyup', { bubbles: true }));
    }, value);
  }
}
