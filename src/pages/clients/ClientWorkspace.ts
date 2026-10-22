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

  /** Client Info / File Cabinet open legacy BH in a new tab; returns that tab's URL. */
  async openLegacyTab(name: 'client-info' | 'file-cabinet'): Promise<string> {
    const [popup] = await Promise.all([this.page.context().waitForEvent('page'), this.tab(name).click()]);
    await popup.waitForLoadState('domcontentloaded').catch(() => undefined);
    const url = popup.url();
    await popup.close();
    return url;
  }
}
