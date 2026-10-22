import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export type SettingsSection = 'program-library' | 'data-collection-types' | 'locations' | 'custom-domains' | 'abc-settings';

/** Settings shell: /settings/clinical/* (US-41). */
export class SettingsPage extends BasePage {
  readonly root: Locator;
  readonly clinicalTab: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('settings-shell');
    this.clinicalTab = this.tid('settings-tab-clinical');
  }

  section(name: SettingsSection): Locator {
    return this.tid(`settings-section-${name}`);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/settings/);
    await expect(this.root).toBeVisible();
  }

  async openSection(name: SettingsSection): Promise<void> {
    await this.section(name).click();
    await expect(this.page).toHaveURL(new RegExp(`/settings/clinical/${name}`));
    await this.waitForLoaded();
  }

  /** Names listed on the Locations section. */
  async locationNames(): Promise<string[]> {
    const rows = this.root.locator('.ag-center-cols-container .ag-row, tbody tr, li[data-testid*="location"]');
    await expect(rows.first()).toBeVisible();
    return (await rows.allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim());
  }
}
