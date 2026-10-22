import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { selectPrimeOption } from '../../helpers/primeng';

export type PlanTimeline = 'current' | 'inactive';

/** Skills Programs tab: program rail (left) and treatment-plan list / empty state. */
export class TreatmentPlanPage extends BasePage {
  readonly rail: Locator;
  readonly railItems: Locator;
  readonly railEmpty: Locator;
  readonly railAdd: Locator;
  readonly railDomainFilter: Locator;
  readonly railSearchToggle: Locator;
  readonly railMenuToggle: Locator;
  readonly planAddButton: Locator;
  readonly planSearch: Locator;
  readonly planEmpty: Locator;

  constructor(page: Page) {
    super(page);
    this.rail = this.tid('program-rail');
    this.railItems = this.tidPrefix('program-rail-item-');
    this.railEmpty = this.tid('program-rail-empty');
    this.railAdd = this.tid('program-rail-add');
    this.railDomainFilter = this.tid('program-rail-domain-filter');
    this.railSearchToggle = this.tid('program-rail-search-toggle');
    this.railMenuToggle = this.tid('program-rail-menu-toggle');
    this.planAddButton = this.tid('treatment-plan-add-button');
    this.planSearch = this.tid('treatment-plan-search-input');
    this.planEmpty = this.tid('treatment-plan-empty');
  }

  railTab(timeline: PlanTimeline): Locator {
    return this.tid(`program-rail-tab-${timeline}`);
  }

  /** Rail items whose name matches; strings match case-sensitively because clients often hold look-alike custom programs. */
  railMatches(programName: string | RegExp): Locator {
    const pattern = typeof programName === 'string' ? new RegExp(programName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) : programName;
    return this.railItems.filter({ hasText: pattern });
  }

  railItem(programName: string | RegExp): Locator {
    return this.railMatches(programName).first();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.rail).toBeVisible();
    await expect(this.tid('treatment-plan-loading')).toHaveCount(0, { timeout: 60_000 });
    await this.recoverLoadErrors(this.railItems.first().or(this.railEmpty));
  }

  async showTimeline(timeline: PlanTimeline): Promise<void> {
    await this.railTab(timeline).click();
    await expect(this.railTab(timeline)).toHaveAttribute('aria-pressed', 'true').catch(() => undefined);
    await this.waitForLoaded();
  }

  async filterDomain(domain: string | RegExp): Promise<void> {
    await selectPrimeOption(this.page, this.railDomainFilter, domain);
  }

  async programNames(): Promise<string[]> {
    return (await this.railItems.allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim());
  }

  async openProgram(programName: string | RegExp): Promise<void> {
    const item = this.railItem(programName);
    const programId = (await item.getAttribute('data-testid'))?.match(/(\d+)$/)?.[1];
    await item.click();
    // The workspace auto-opens the first program, so wait for this program's id specifically.
    await expect(this.page).toHaveURL(programId ? new RegExp(`/programs/${programId}(\\?|$)`) : /\/programs\/\d+/);
    await this.waitForLoaded();
  }

  async openAddProgram(): Promise<void> {
    await this.expectLoaded();
    const search = this.tid('add-program-dialog-search');
    // The empty-plan button is swapped for the rail button once the program list loads.
    await expect(async () => {
      const addButton = (await this.planAddButton.isVisible()) ? this.planAddButton : this.railAdd;
      await addButton.click({ timeout: 5_000 });
      await expect(search).toBeVisible({ timeout: 5_000 });
    }).toPass({ timeout: 30_000 });
  }

  async expectProgramListed(programName: string | RegExp, timeline: PlanTimeline = 'current'): Promise<void> {
    await this.showTimeline(timeline);
    await expect(this.railItem(programName)).toBeVisible();
  }

  async expectProgramNotListed(programName: string | RegExp, timeline: PlanTimeline = 'current'): Promise<void> {
    await this.showTimeline(timeline);
    await expect(this.railMatches(programName)).toHaveCount(0);
  }
}
