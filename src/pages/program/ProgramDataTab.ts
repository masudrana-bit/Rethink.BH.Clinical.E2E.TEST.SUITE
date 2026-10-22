import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { readPrimeOptions, selectPrimeOption, setPrimeCheckbox } from '../../helpers/primeng';

export type ProgramDataView = 'combined' | 'targets' | 'payor';

/** Program "Data" tab: trend charts, annotations, filters, summary tiles and the observations grid. */
export class ProgramDataTab extends BasePage {
  readonly root: Locator;
  readonly trendToggle: Locator;
  readonly addAnnotationButton: Locator;
  readonly displayToggle: Locator;
  readonly plotBy: Locator;
  readonly range: Locator;
  readonly graphType: Locator;
  readonly targetFilter: Locator;
  readonly combinedChart: Locator;
  readonly charts: Locator;
  readonly annotationRail: Locator;
  readonly annotationCount: Locator;
  readonly annotationsVisible: Locator;
  readonly summarySessions: Locator;
  readonly summaryTargets: Locator;
  readonly summaryAverage: Locator;
  readonly summaryMastered: Locator;
  readonly observationGrid: Locator;
  readonly observationRows: Locator;
  readonly observationLayout: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.tid('program-data-tab');
    this.trendToggle = this.tid('trend-visible-toggle');
    this.addAnnotationButton = this.tid('annotation-create-button');
    this.displayToggle = this.tid('analysis-filter-toggle');
    this.plotBy = this.tid('analysis-filter-plot-by');
    this.range = this.tid('analysis-filter-range');
    this.graphType = this.tid('analysis-filter-graph-type');
    this.targetFilter = this.tid('analysis-filter-target');
    this.combinedChart = this.tid('combined-trend-chart');
    this.charts = this.tid('clinical-chart-canvas');
    this.annotationRail = this.tid('annotation-rail');
    this.annotationCount = this.tid('annotation-rail-count');
    this.annotationsVisible = this.tid('annotations-visible-toggle');
    this.summarySessions = this.tid('analysis-summary-sessions');
    this.summaryTargets = this.tid('analysis-summary-targets');
    this.summaryAverage = this.tid('analysis-summary-average');
    this.summaryMastered = this.tid('analysis-summary-mastered');
    this.observationGrid = this.tid('observation-grid');
    this.observationRows = this.observationGrid.locator('.ag-center-cols-container .ag-row');
    this.observationLayout = this.tid('observation-layout');
  }

  view(name: ProgramDataView): Locator {
    return this.tid(`program-data-view-${name}`);
  }

  async expectLoaded(): Promise<void> {
    await this.recoverLoadErrors(this.charts.first(), {
      nonBlocking: true,
      reopen: () => this.tid('program-details-tab-data').click({ timeout: 30_000 }).catch(() => undefined),
    });
    await expect(this.root).toBeVisible();
  }

  async showView(name: ProgramDataView): Promise<void> {
    await this.view(name).click();
    await expect(this.charts.first()).toBeVisible();
  }

  /** Accessible description Highcharts renders for the chart: the host label plus the screen-reader region (series count, axis labels). */
  async chartDescription(chart: Locator = this.charts.first()): Promise<string> {
    const label = (await chart.getAttribute('aria-label')) ?? '';
    const text = (await chart.textContent()) ?? '';
    return `${label} ${text}`.replace(/\s+/g, ' ').trim();
  }

  async xAxisLabels(chart: Locator = this.charts.first()): Promise<string[]> {
    return (await chart.locator('.highcharts-xaxis-labels text').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  }

  async seriesNames(chart: Locator = this.charts.first()): Promise<string[]> {
    return (await chart.locator('.highcharts-legend-item text').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  }

  goalLine(chart: Locator = this.charts.first()): Locator {
    return chart.locator('.highcharts-plot-line, [class*=goal]').first();
  }

  async setRange(option: string | RegExp): Promise<void> {
    await selectPrimeOption(this.page, this.range, option);
  }

  async setTrendLines(on: boolean): Promise<void> {
    await setPrimeCheckbox(this.trendToggle, on);
  }

  trendSeries(chart: Locator = this.charts.first()): Locator {
    return chart.locator('.highcharts-series[class*=trend], .highcharts-series-group path[class*=trend], .highcharts-legend-item:has-text("Trend")');
  }

  get annotationTitle(): Locator {
    return this.tid('annotation-title-input');
  }

  get annotationStartDate(): Locator {
    return this.tid('annotation-start-date').locator('input');
  }

  get annotationSave(): Locator {
    return this.tid('annotation-save-button');
  }

  async openAnnotationDialog(): Promise<void> {
    await this.addAnnotationButton.click();
    await expect(this.annotationTitle).toBeVisible();
  }

  async annotationTypes(): Promise<string[]> {
    return readPrimeOptions(this.page, this.tid('annotation-type-select'), { closeByClick: true });
  }

  /** The rail starts collapsed to a count; expand it to see the annotations. */
  async expandAnnotationRail(): Promise<void> {
    const toggle = this.tid('annotation-rail-toggle');
    if (/expand/i.test((await toggle.innerText().catch(() => '')) || '')) await toggle.click();
  }

  /**
   * Types the start date (MM/DD/YYYY); when the field clears itself (NGC-43) picks today from the calendar instead.
   * Returns false when typing did not stick.
   */
  async setAnnotationStartDate(date: Date): Promise<boolean> {
    const typed = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
    await this.annotationStartDate.click();
    await this.annotationStartDate.pressSequentially(typed, { delay: 30 });
    await this.annotationTitle.click();
    if ((await this.annotationStartDate.inputValue()).trim()) return true;
    await this.annotationStartDate.click();
    await this.page.locator('.p-datepicker-panel:visible, .p-datepicker:visible').last()
      .locator('.p-datepicker-today, td.p-datepicker-today span, [data-date]').filter({ hasText: new RegExp(`^${date.getDate()}$`) }).first()
      .click();
    await expect(this.annotationStartDate).not.toHaveValue('');
    return false;
  }

  /** Adds an annotation from the dialog; returns false when the typed start date was cleared and the calendar was used. */
  async addAnnotation({ title, detail, type, startDate = new Date() }: { title: string; detail?: string; type?: string | RegExp; startDate?: Date }): Promise<boolean> {
    await this.openAnnotationDialog();
    await this.annotationTitle.fill(title);
    if (detail) await this.tid('annotation-detail-input').fill(detail);
    if (type) await selectPrimeOption(this.page, this.tid('annotation-type-select'), type);
    const typedDateKept = await this.setAnnotationStartDate(startDate);
    await this.annotationSave.click();
    await expect(this.annotationTitle).toBeHidden({ timeout: 15_000 });
    return typedDateKept;
  }

  async cancelAnnotation(): Promise<void> {
    await this.tid('annotation-cancel-button').click();
    await expect(this.annotationTitle).toBeHidden();
  }

  annotationItem(title: string | RegExp): Locator {
    return this.annotationRail.locator('[data-testid^="annotation-rail-row-"]').filter({ hasText: title }).first();
  }

  async annotationTotal(): Promise<number> {
    return Number((await this.annotationCount.innerText()).trim() || '0');
  }

  /** Opens the annotation from the rail (edit dialog) and deletes it. */
  async deleteAnnotation(title: string | RegExp): Promise<void> {
    await this.expandAnnotationRail();
    await this.annotationItem(title).click();
    await expect(this.annotationTitle).toBeVisible();
    await this.tid('annotation-delete-button').click();
    const confirm = this.page.getByRole('dialog', { name: 'Delete annotation' });
    await expect(confirm).toContainText('will be removed permanently');
    await confirm.getByRole('button', { name: 'Confirm' }).click();
    await expect(this.annotationTitle).toBeHidden();
    await expect(this.annotationItem(title)).toHaveCount(0);
  }

  async open(clientId: string, programId: string): Promise<void> {
    await this.page.goto(`/clients/${clientId}/programs/${programId}?tab=data`);
    await this.expectLoaded();
  }

  /** The Display panel holds the trend, annotation and filter controls (NGC-42). */
  async openDisplay(): Promise<void> {
    const panel = this.tid('analysis-filter-more');
    if (!(await panel.isVisible())) await this.displayToggle.click();
    await expect(panel).toBeVisible();
  }

  async rangeOptions(): Promise<string[]> {
    return readPrimeOptions(this.page, this.range);
  }

  /** Session points named in the chart's accessible description, e.g. [{ label: 'S45', date: 'Oct 19' }]. */
  async sessionPoints(chart: Locator = this.charts.first()): Promise<{ label: string; date: string }[]> {
    const labels = await chart.locator('.highcharts-xaxis-labels text, .highcharts-xaxis-labels span').allTextContents();
    return labels
      .map((l) => l.match(/(S\d+)\s*([A-Z][a-z]{2} \d{1,2})/))
      .filter((m): m is RegExpMatchArray => !!m)
      .map((m) => ({ label: m[1], date: m[2] }));
  }

  /** Plotted data points (Highcharts thins x-axis labels when crowded, so count the accessible points instead). */
  async pointCount(chart: Locator = this.charts.first()): Promise<number> {
    return chart.locator('path[aria-label^="x, "], .highcharts-point[aria-label]').count();
  }

  /** Line series drawn on the chart (data lines plus any trend line). */
  async lineCount(chart: Locator = this.charts.first()): Promise<number> {
    return chart.locator('path.highcharts-graph').count();
  }

  async lastSessionNumber(chart: Locator = this.charts.first()): Promise<number> {
    const points = await this.sessionPoints(chart);
    return Math.max(0, ...points.map((p) => Number(p.label.slice(1))));
  }

  get targetSmallMultiples(): Locator {
    return this.tid('target-small-multiples');
  }

  /** Small-multiple chart whose accessible description starts with the target name. */
  targetChart(targetName: string): Locator {
    return this.page.locator('[data-testid^="small-multiple-chart-"]').filter({ hasText: `${targetName}:` }).first();
  }

  async targetChartDescriptions(): Promise<string[]> {
    const charts = this.targetSmallMultiples.getByTestId('clinical-chart-canvas');
    const texts: string[] = [];
    for (let i = 0; i < (await charts.count()); i++) texts.push(await this.chartDescription(charts.nth(i)));
    return texts;
  }

  observationRow(text: string | RegExp): Locator {
    return this.observationRows.filter({ hasText: text }).first();
  }

  /** AG Grid keeps pinned action cells outside the row container, so the buttons are addressed grid-wide. */
  get observationCorrectButtons(): Locator {
    return this.observationGrid.getByTestId('observation-correct-button');
  }

  async openObservationCorrection(index = 0): Promise<Locator> {
    await this.observationCorrectButtons.nth(index).click();
    const dialog = this.visibleDialog();
    await expect(dialog).toBeVisible();
    return dialog;
  }

  /**
   * Corrects an observation from the grid: picks the outcome when the dialog offers the outcome editor,
   * otherwise overwrites the first numeric value. Returns the dialog text seen before saving.
   */
  async correctObservation(index: number, change: { outcome?: 'correct' | 'incorrect' | 'na'; value?: string }, reason = 'E2E correction'): Promise<string> {
    return this.applyObservationCorrection(await this.openObservationCorrection(index), change, reason);
  }

  /** Text and test ids of an open correction dialog, for reporting what the dialog offers. */
  async describeDialog(dialog: Locator): Promise<string> {
    const text = (await dialog.innerText()).replace(/\s+/g, ' ');
    const ids = await dialog.locator('[data-testid]').evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')));
    return `${text} || test ids: ${[...new Set(ids)].join(', ')}`;
  }

  async applyObservationCorrection(dialog: Locator, change: { outcome?: 'correct' | 'incorrect' | 'na'; value?: string }, reason = 'E2E correction'): Promise<string> {
    const text = (await dialog.innerText()).replace(/\s+/g, ' ');
    const outcome = dialog.getByTestId(`outcome-editor-outcome-${change.outcome ?? 'correct'}`);
    const trialResults = dialog.getByTestId('trial-set-result');
    if (change.outcome && (await trialResults.count()) > 0) {
      const wanted = { correct: 'Correct', incorrect: 'Incorrect', na: 'N/A' }[change.outcome];
      const other = (await trialResults.allInnerTexts()).findIndex((t) => t.trim() !== wanted);
      expect(other, `a trial that is not already ${wanted}`).toBeGreaterThanOrEqual(0);
      const combobox = dialog.getByRole('combobox', { name: `Result for trial ${other + 1}` });
      await expect(async () => {
        await combobox.click();
        await this.page.getByRole('option', { name: wanted, exact: true }).click({ timeout: 3_000 });
        await expect(combobox).toHaveText(wanted, { timeout: 3_000 });
      }).toPass({ timeout: 30_000 });
    } else if (change.outcome && (await outcome.isVisible().catch(() => false))) await outcome.click();
    else if (change.value !== undefined) await dialog.locator('input[type=number], p-inputnumber input').first().fill(change.value);
    const reasonBox = dialog.getByTestId('correction-form-reason-input').or(dialog.locator('textarea')).first();
    if (await reasonBox.isVisible().catch(() => false)) await reasonBox.fill(reason);
    await dialog.getByTestId('correction-form-save-button').or(dialog.getByRole('button', { name: /save|apply/i })).last().click();
    await expect(dialog).toBeHidden({ timeout: 15_000 });
    return text;
  }

  async observationColumnValues(colId: string): Promise<string[]> {
    return (await this.observationGrid.locator(`.ag-row [col-id="${colId}"]`).allTextContents()).map((t) => t.trim());
  }

  /** Header labels without the sort-order digit AG Grid appends (e.g. "Date 1"). */
  async observationHeaders(): Promise<string[]> {
    return (await this.observationGrid.locator('.ag-header-cell').allTextContents()).map((t) => t.trim().replace(/\s+\d+$/, '')).filter(Boolean);
  }

  /** Values of the column whose header reads `header`. */
  async observationColumn(header: string): Promise<string[]> {
    const colId = await this.observationGrid.locator('.ag-header-cell').evaluateAll(
      (els, name) => els.find((e) => (e.textContent ?? '').trim().replace(/\s+\d+$/, '') === name)?.getAttribute('col-id') ?? '',
      header,
    );
    return colId ? this.observationColumnValues(colId) : [];
  }
}
