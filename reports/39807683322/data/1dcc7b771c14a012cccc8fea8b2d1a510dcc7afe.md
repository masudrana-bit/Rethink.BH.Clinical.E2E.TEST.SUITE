# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stories/02-program-authoring/us-06-edit-archive-delete-program.spec.ts >> US-6 Edit, archive, or delete a program >> TC-US06-02 Discontinue (archive) a program, then delete it with confirmation
- Location: tests/stories/02-program-authoring/us-06-edit-archive-delete-program.spec.ts:34:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/sign-in/
Received string:  "https://clinical.dev3.rethinkbhtech.com/clients"
Timeout: 20000ms

Call log:
  - Expect "toHaveURL" with timeout 20000ms
    44 × locator resolved to <html>…</html>
       - unexpected value "https://clinical.dev3.rethinkbhtech.com/clients"

```

```yaml
- text: no healthy upstream
```

# Test source

```ts
  1  | import { expect, Locator, Page, test } from '@playwright/test';
  2  | import { BasePage } from '../BasePage';
  3  | import { Credentials } from '../../config/env';
  4  | 
  5  | export class SignInPage extends BasePage {
  6  |   readonly heading: Locator;
  7  |   readonly previewSignInLink: Locator;
  8  |   readonly usernameInput: Locator;
  9  |   readonly passwordInput: Locator;
  10 |   readonly submitButton: Locator;
  11 | 
  12 |   constructor(page: Page) {
  13 |     super(page);
  14 |     this.heading = page.getByRole('heading', { name: 'Sign in to continue' });
  15 |     this.previewSignInLink = this.tid('sign-in-temp-dev-login');
  16 |     this.usernameInput = page.getByRole('textbox', { name: 'Username' });
  17 |     this.passwordInput = page.getByRole('textbox', { name: 'Password' });
  18 |     this.submitButton = this.tid('temp-dev-login-submit');
  19 |   }
  20 | 
  21 |   async open(returnTo = '/clients'): Promise<void> {
  22 |     await this.page.goto(returnTo);
> 23 |     await expect(this.page).toHaveURL(/\/sign-in/);
     |                             ^ Error: expect(page).toHaveURL(expected) failed
  24 |     await expect(this.heading).toBeVisible();
  25 |   }
  26 | 
  27 |   /** dev2's sign-in handoff fails intermittently ("That sign-in link did not work"), so a failed attempt starts over, up to 3 times. */
  28 |   async signIn(credentials: Credentials, attempts = 3): Promise<void> {
  29 |     const failure = this.page.getByRole('heading', { name: "We couldn't sign you in" });
  30 |     const shellHeader = this.page.locator('[data-testid=app-shell-header], [data-testid=rbt-shell-header]').first();
  31 |     for (let attempt = 1; ; attempt++) {
  32 |       await this.previewSignInLink.click();
  33 |       await expect(this.page).toHaveURL(/\/temp-dev-login/);
  34 |       await this.enterPrivately(this.usernameInput, credentials.username);
  35 |       await this.enterPrivately(this.passwordInput, credentials.password);
  36 |       await this.submitButton.click();
  37 |       const settled = await expect(shellHeader.or(failure)).toBeVisible({ timeout: 60_000 }).then(() => true, () => false);
  38 |       if (settled && !(await failure.isVisible())) return;
  39 |       const reason = settled
  40 |         ? await this.page.getByText(/credential service|returned HTTP|sign-in link did not work/i).first().innerText().catch(() => '')
  41 |         : 'sign-in did not finish within 60 s';
  42 |       if (attempt >= attempts) {
  43 |         test.skip(/sign-in link did not work|did not finish/i.test(reason), `${process.env.TEST_ENV} environment outage: sign-in handoff failed ${attempts} times ("${reason}")`);
  44 |         throw new Error(`Preview sign-in failed ${attempts} times: ${reason || "We couldn't sign you in"}. If other tests signed in, this is a ${process.env.TEST_ENV} sign-in outage; otherwise check .env.`);
  45 |       }
  46 |       test.info().annotations.push({ type: `${process.env.TEST_ENV} sign-in error`, description: `attempt ${attempt}: ${reason || "We couldn't sign you in"}; signing in again` });
  47 |       await this.open();
  48 |     }
  49 |   }
  50 | 
  51 |   /** fill() and type() put the typed text in the step title, which is published in the HTML report. */
  52 |   private async enterPrivately(input: Locator, value: string): Promise<void> {
  53 |     await input.click();
  54 |     await input.evaluate((el: HTMLInputElement, text) => {
  55 |       Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(el, text);
  56 |       el.dispatchEvent(new Event('input', { bubbles: true }));
  57 |       el.dispatchEvent(new Event('change', { bubbles: true }));
  58 |     }, value);
  59 |   }
  60 | }
  61 | 
```