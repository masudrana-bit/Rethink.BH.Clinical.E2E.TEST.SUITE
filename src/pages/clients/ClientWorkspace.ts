import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export type ClientTab =
  | 'client-info'
  | 'file-cabinet'
  | 'sessions'
  | 'skills-programs'
  | 'behavior-support'
  | 'analyze-data'
  | 'reports';

const tabPath: Record<ClientTab, RegExp> = {
  'client-info': /core\/clients\/\d+$/,
  'file-cabinet': /core\/clients\/\d+\/files/,
  sessions: /\/sessions$/,
  'skills-programs': /\/clients\/\d+(\/programs\/\d+)?(\?.*)?$/,
  'behavior-support': /\/behavior-support/,
  'analyze-data': /\/analyze-data/,
  reports: /\/reports/,
};

/** Top tab bar shown once a client is selected. */
export class ClientWorkspace extends BasePage {
  readonly tabBar: Locator;

  constructor(page: Page) {
    super(page);
    this.tabBar = this.tid('client-top-tab-bar');
  }

  tab(name: ClientTab): Locator {
    return this.tid(`client-tab-${name}`);
  }

  async openTab(name: ClientTab): Promise<void> {
    await this.tab(name).click();
    await expect(this.page).toHaveURL(tabPath[name]);
    await this.waitForLoaded();
  }

  /** Where a legacy tab (Client Info / File Cabinet) points and whether it is set to open in a new browser tab. */
  async legacyLink(name: 'client-info' | 'file-cabinet'): Promise<{ href: string; newTab: boolean }> {
    const link = this.tab(name);
    return { href: (await link.getAttribute('href')) ?? '', newTab: (await link.getAttribute('target')) === '_blank' };
  }

  /**
   * Opens a legacy tab in a separate browser tab and returns it, leaving this page on NextGen.
   * Links without target=_blank would replace NextGen, so their address is opened in a new tab instead.
   */
  async openLegacyInNewTab(name: 'client-info' | 'file-cabinet'): Promise<Page> {
    const { href, newTab } = await this.legacyLink(name);
    let legacy: Page;
    if (newTab) {
      [legacy] = await Promise.all([this.page.context().waitForEvent('page'), this.tab(name).click()]);
    } else {
      legacy = await this.page.context().newPage();
      await legacy.goto(href);
    }
    await legacy.waitForLoadState('domcontentloaded').catch(() => undefined);
    return legacy;
  }

  /** Opens a legacy tab in a new browser tab and returns the address it was opened with. */
  async openLegacyTab(name: 'client-info' | 'file-cabinet'): Promise<string> {
    const { href } = await this.legacyLink(name);
    const legacy = await this.openLegacyInNewTab(name);
    await legacy.close();
    return href;
  }
}
