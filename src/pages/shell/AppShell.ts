import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { selectPrimeOption } from '../../helpers/primeng';

export type ShellView = 'bcba' | 'rbt';

/** Header, navigation, client switcher and user menu shared by the BCBA shell and the RBT shell. */
export class AppShell extends BasePage {
  readonly header: Locator;
  readonly nav: Locator;
  readonly legacyBhLink: Locator;
  readonly clientSwitcher: Locator;
  readonly clientDob: Locator;
  readonly userMenuTrigger: Locator;
  readonly userName: Locator;
  readonly userRole: Locator;
  readonly viewBcba: Locator;
  readonly viewRbt: Locator;
  readonly signOut: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page.locator('[data-testid=app-shell-header], [data-testid=rbt-shell-header]').first();
    this.nav = page.locator('[data-testid=app-shell-nav], [data-testid=rbt-shell-nav]').first();
    this.legacyBhLink = this.tid('legacy-bh-switch');
    this.clientSwitcher = this.tid('client-switcher-select');
    this.clientDob = this.tid('client-switcher-dob');
    this.userMenuTrigger = this.tid('user-menu-trigger');
    this.userName = this.tid('user-menu-name');
    this.userRole = this.tid('user-menu-role');
    this.viewBcba = this.tid('user-menu-view-bcba');
    this.viewRbt = this.tid('user-menu-view-rbt');
    this.signOut = this.tid('user-menu-sign-out');
  }

  navLink(name: string | RegExp): Locator {
    return this.nav.getByRole('link', { name });
  }

  async goToNav(name: string | RegExp): Promise<void> {
    await this.navLink(name).click();
    await this.waitForLoaded();
  }

  async expectSignedIn(): Promise<void> {
    await expect(this.header).toBeVisible();
    await expect(this.userName).not.toBeEmpty();
  }

  async switchView(view: ShellView): Promise<void> {
    await this.userMenuTrigger.click();
    await (view === 'rbt' ? this.viewRbt : this.viewBcba).click();
    if (view === 'rbt') await expect(this.page).toHaveURL(/\/rbt|\/sessions/);
    else await expect(this.page).not.toHaveURL(/\/rbt(\/|$)/);
    await this.page.keyboard.press('Escape');
  }

  async logOut(): Promise<void> {
    await this.userMenuTrigger.click();
    await this.signOut.click();
    await expect(this.page).toHaveURL(/sign-in|signed-out|logout|rethinkbh/i);
  }

  async switchClient(clientName: string | RegExp): Promise<void> {
    await selectPrimeOption(this.page, this.clientSwitcher, clientName);
    await this.waitForLoaded();
  }

  async currentClientName(): Promise<string> {
    return (await this.clientSwitcher.innerText()).trim();
  }
}
