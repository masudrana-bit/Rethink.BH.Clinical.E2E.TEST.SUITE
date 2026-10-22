import { test, expect } from '../../../src/fixtures/test';
import { exportWithConsent } from '../../../src/helpers/download';

const BRITISH = /\b(behaviour|colour|organisation|analyse|generalisation|programme|categorised|uncategorised)\b/i;

test.describe('US-39 Produce a funder-ready graph', { tag: '@US-39' }, () => {
  test('TC-US39-01 Funder (payor) graph of a program exports as PNG and PDF with dated x-axis labels and US spelling', async ({ page, flows, programDetails, programData, testData }) => {
    const client = testData.clients.seeded;
    await flows.signInAs('bcba');
    await flows.openClient(client);
    await flows.openProgram(testData.seeded.obProgram);
    await programData.open(client, await programDetails.programId());

    await test.step('Payor view shows the funder graph with profile, styling and export actions', async () => {
      await programData.showView('payor');
      const chart = page.getByTestId('payor-chart');
      await expect(chart).toBeVisible();
      await expect(page.getByTestId('payor-profile-select')).toBeVisible();
      await expect(page.getByTestId('payor-export-actions')).toContainText(/Export PDF/);
      const description = await programData.chartDescription(chart.getByTestId('clinical-chart-canvas').or(chart).first());
      test.info().annotations.push({ type: 'funder chart', description: description.slice(0, 300) });
      expect((await programData.sessionPoints(chart.getByTestId('clinical-chart-canvas').or(chart).first())).length, 'x-axis labels carry session dates').toBeGreaterThan(0);
    });

    await test.step('Export PNG and PDF', async () => {
      const actions = page.getByTestId('payor-export-actions');
      for (const [label, ext] of [['Export PNG', /\.png$/i], ['Export PDF', /\.pdf$/i]] as const) {
        const download = await exportWithConsent(page, actions.getByRole('button', { name: label }));
        test.info().annotations.push({ type: label, description: download.suggestedFilename() });
        expect(download.suggestedFilename()).toMatch(ext);
      }
    });

    await test.step('US spelling on the funder view (NGC-67)', async () => {
      const text = await programData.root.innerText();
      const match = text.match(BRITISH)?.[0] ?? '';
      expect.soft(match, `British spelling on the funder view: "${match}" (NGC-67)`).toBe('');
      await flows.evidence('funder-graph');
    });
  });

  test('TC-US39-02 Funder report opens in the editor with required fields marked', async ({ page, flows, workspace, funderReports, testData }) => {
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await workspace.openTab('reports');
    await funderReports.expectLoaded();

    await test.step('Reports list shows drafts and submitted reports', async () => {
      const listed = await funderReports.items.first().waitFor({ timeout: 15_000 }).then(() => true, () => false);
      test.skip(!listed, `${testData.name} test data: the seeded client has no funder reports`);
      const statuses = await page.getByTestId('funder-reports-status').allInnerTexts();
      test.info().annotations.push({ type: 'report statuses', description: [...new Set(statuses)].join(', ') });
    });

    await test.step('Open the latest draft: the editor loads', async () => {
      const drafts = funderReports.items.filter({ hasText: 'Draft' });
      test.skip(!(await drafts.count()), `${testData.name} test data: the seeded client has no draft funder report`);
      await drafts.first().getByTestId('funder-reports-open').click();
      await expect(page).toHaveURL(/\/reports\/\d+/);
      await expect(page.getByTestId('funder-report-editor')).toBeVisible();
      await expect(page.getByTestId('report-editor-loading'), 'report editor finishes loading').toBeHidden({ timeout: 60_000 });
    });

    await test.step('Required fields are marked and spelling is US English (NGC-67)', async () => {
      const required = await funderReports.requiredFieldLabels();
      test.info().annotations.push({ type: 'required fields', description: JSON.stringify(required) });
      expect.soft(required.length, 'required fields marked').toBeGreaterThan(0);
      const match = (await page.getByTestId('funder-report-editor').innerText()).match(BRITISH)?.[0] ?? '';
      expect.soft(match, `British spelling in the report: "${match}" (NGC-67)`).toBe('');
      await flows.evidence('funder-report-editor');
    });
  });
});
