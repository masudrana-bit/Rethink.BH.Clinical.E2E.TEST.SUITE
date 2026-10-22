import { Download, expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { readPrimeOptions } from '../../helpers/primeng';
import { exportWithConsent } from '../../helpers/download';

export type AnalyzeMode = 'mastered' | 'custom' | 'bulk';
export type ReportScope = 'programs' | 'behaviors' | 'both';

/** Client "Analyze Data" tab: mastered targets, custom cross-program graph, bulk graphs (US-34 – US-36, US-40). */
export class AnalyzeDataPage extends BasePage {
  readonly root: Locator;
  readonly printButton: Locator;
  readonly exportPdf: Locator;
  readonly exportPng: Locator;
  readonly paperSize: Locator;
  readonly saveReport: Locator;
  readonly savedReports: Locator;
  readonly savedReportsEmpty: Locator;
  readonly masteredReport: Locator;
  readonly masteredCount: Locator;
  readonly inScopeCount: Locator;
  readonly remainingCount: Locator;
  readonly masteredChart: Locator;
  readonly masteredGrouping: Locator;
  readonly seriesSelect: Locator;
  readonly seriesCount: Locator;
  readonly comparisonGraph: Locator;
  readonly comparisonEmpty: Locator;
  readonly bulkReport: Locator;
  readonly bulkCount: Locator;
  readonly bulkCards: Locator;
  readonly bulkRenderAll: Locator;
  readonly charts: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('analyze-data-page');
    this.printButton = this.tid('report-action-print');
    this.exportPdf = this.tid('report-action-pdf');
    this.exportPng = this.tid('report-action-png');
    this.paperSize = this.tid('report-paper-size');
    this.saveReport = this.tid('analyze-save-report');
    this.savedReports = this.tid('saved-report-controls');
    this.savedReportsEmpty = this.tid('saved-report-empty');
    this.masteredReport = this.tid('mastered-targets-report');
    this.masteredCount = this.tid('mastered-tile-mastered');
    this.inScopeCount = this.tid('mastered-tile-in-scope');
    this.remainingCount = this.tid('mastered-tile-remaining');
    this.masteredChart = this.tid('mastered-report-chart');
    this.masteredGrouping = this.tid('mastered-grouping-select');
    this.seriesSelect = this.tid('report-series-select');
    this.seriesCount = this.tid('report-series-count');
    this.comparisonGraph = this.tid('custom-comparison-graph');
    this.comparisonEmpty = this.tid('comparison-empty');
    this.bulkReport = this.tid('bulk-graph-report');
    this.bulkCount = this.tid('bulk-report-count');
    this.bulkCards = this.tid('bulk-graph-card');
    this.bulkRenderAll = this.tid('bulk-report-render-all');
    this.charts = this.tid('clinical-chart-canvas');
  }

  mode(name: AnalyzeMode): Locator {
    return this.tid(`analyze-mode-${name}`);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.mode('mastered')).toBeVisible();
  }

  async openMode(name: AnalyzeMode): Promise<void> {
    await this.mode(name).click();
    await expect(this.tid('analyze-data-partial')).toHaveCount(0, { timeout: 60_000 });
  }

  async chooseWindow(days: 14 | 30 | 90 | 180 | 'all'): Promise<void> {
    await this.tid(days === 'all' ? 'report-window-all' : `report-window-days:${days}`).click();
  }

  async chooseScope(scope: ReportScope): Promise<void> {
    await this.tid(`report-scope-${scope}`).check({ force: true });
  }

  async availableSeries(): Promise<number> {
    return Number((await this.seriesCount.innerText()).match(/(\d+)/)?.[1] ?? 0);
  }

  private get seriesOptionList(): Locator {
    return this.page.locator('[role=option]:visible');
  }

  /** The series multiselect's inner combobox is visually hidden, so open it from its host. */
  private async openSeries(): Promise<void> {
    if ((await this.seriesOptionList.count()) > 0) return;
    await expect(async () => {
      await this.seriesSelect.click();
      await expect(this.seriesOptionList.first()).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  private async closeSeries(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await expect(this.seriesOptionList).toHaveCount(0);
  }

  async selectSeries(names: (string | RegExp)[]): Promise<void> {
    await this.openSeries();
    for (const name of names) await this.seriesOptionList.filter({ hasText: name }).first().click();
    await this.closeSeries();
  }

  /** Leaves exactly `names` selected (unselects everything else first). */
  async selectOnlySeries(names: (string | RegExp)[]): Promise<void> {
    await this.openSeries();
    const selected = this.page.locator('[role=option][aria-selected=true]:visible');
    const headerToggle = this.page.locator('.p-multiselect-header:visible').locator('.p-checkbox, [role=checkbox]').first();
    if ((await selected.count()) > 0 && (await headerToggle.isVisible().catch(() => false))) await headerToggle.click();
    while ((await selected.count()) > 0) await selected.first().click();
    for (const name of names) await this.seriesOptionList.filter({ hasText: name }).first().click();
    await this.closeSeries();
  }

  async seriesOptions(): Promise<string[]> {
    await this.openSeries();
    const labels = (await this.seriesOptionList.allInnerTexts()).map((t) => t.trim());
    await this.closeSeries();
    return labels;
  }

  async waitForSavedReports(): Promise<void> {
    await expect(this.savedReports).not.toContainText(/Loading saved reports/i, { timeout: 60_000 });
    await this.recoverLoadErrors(this.savedReports);
    await expect(this.savedReports).not.toContainText(/Loading saved reports/i, { timeout: 60_000 });
  }

  async groupingOptions(): Promise<string[]> {
    return readPrimeOptions(this.page, this.masteredGrouping);
  }

  get actionsUnavailable(): Locator {
    return this.tid('report-actions-unavailable');
  }

  async setDisplay(option: 'baseline' | 'goal-line' | 'phase-changes', on: boolean): Promise<void> {
    const toggle = this.tid(`display-${option}`);
    if ((await toggle.isChecked()) !== on) await toggle.click({ force: true });
  }

  bulkCard(name: string | RegExp): Locator {
    return this.bulkCards.filter({ hasText: name }).first();
  }

  async bulkCardTitles(): Promise<string[]> {
    return (await this.bulkCards.allInnerTexts()).map((t) => t.split('\n')[0].trim());
  }

  async saveCurrentReport(name: string): Promise<void> {
    await this.saveReport.click();
    const dialog = this.visibleDialog();
    await dialog.getByRole('textbox').first().fill(name);
    await dialog.getByRole('button', { name: /save/i }).last().click();
    await expect(this.savedReports).toContainText(name);
  }

  async export(kind: 'pdf' | 'png' | 'csv'): Promise<Download> {
    const button = kind === 'pdf' ? this.exportPdf : kind === 'png' ? this.exportPng : this.root.getByRole('button', { name: /export csv/i });
    return exportWithConsent(this.page, button);
  }
}
