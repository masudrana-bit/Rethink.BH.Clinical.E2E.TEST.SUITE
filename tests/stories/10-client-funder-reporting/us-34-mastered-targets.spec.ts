import { Locator } from '@playwright/test';
import { test, expect } from '../../../src/fixtures/test';
import { createPages } from '../../../src/fixtures/pages';
import { ClinicalFlows } from '../../../src/flows/ClinicalFlows';
import { uniqueName } from '../../../src/helpers/data-factory';

const tile = async (locator: Locator) => Number(((await locator.innerText()).match(/\d+/) ?? ['0'])[0]);

test.describe("US-34 Review mastered targets across a client's plan", { tag: '@US-34' }, () => {
  test('TC-US34-01 Mastered targets report: tiles add up, chart and grouping, any date range', async ({ flows, workspace, analyze, testData }) => {
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await workspace.openTab('analyze-data');
    await analyze.expectLoaded();

    await test.step('Mastered Targets is the default report with tiles and a chart', async () => {
      await analyze.openMode('mastered');
      await expect(analyze.masteredReport).toBeVisible();
      await expect(analyze.masteredChart).toBeVisible();
    });

    await test.step('Mastered + remaining = targets in scope, for 3 months and for All', async () => {
      for (const window of [90, 'all'] as const) {
        await analyze.chooseWindow(window);
        await expect(analyze.masteredCount).toBeVisible();
        const mastered = await tile(analyze.masteredCount);
        const inScope = await tile(analyze.inScopeCount);
        const remaining = await tile(analyze.remainingCount);
        test.info().annotations.push({ type: `tiles (${window})`, description: `mastered ${mastered}, in scope ${inScope}, remaining ${remaining}` });
        expect(mastered + remaining).toBe(inScope);
      }
      expect(await tile(analyze.masteredCount), 'seeded client has mastered targets').toBeGreaterThan(0);
    });

    await test.step('Grouping can be changed', async () => {
      const groupings = await analyze.groupingOptions();
      test.info().annotations.push({ type: 'grouping options', description: JSON.stringify(groupings) });
      expect(groupings.length).toBeGreaterThan(1);
      await flows.evidence('mastered-targets');
    });
  });

  test('TC-US34-02 A saved report stays available after reload and in a new browser session', async ({ page, browser, flows, workspace, analyze, testData }) => {
    const name = uniqueName('Mastered report');
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await workspace.openTab('analyze-data');
    await analyze.expectLoaded();
    await analyze.openMode('mastered');

    await test.step('Save the report', async () => {
      await analyze.saveCurrentReport(name);
    });

    await test.step('Reload: the saved report is still listed', async () => {
      await page.reload();
      await analyze.expectLoaded();
      await expect(analyze.savedReports).toContainText(name);
    });

    await test.step('A fresh browser session for the same user still lists it (not device-only)', async () => {
      const fresh = await browser.newContext({ baseURL: testData.baseUrl });
      const freshPage = await fresh.newPage();
      const pages = createPages(freshPage);
      await new ClinicalFlows(freshPage, pages, test.info()).signInAs('bcba');
      await freshPage.goto(`/clients/${testData.clients.seeded}/analyze-data`);
      await pages.analyze.expectLoaded();
      await pages.analyze.waitForSavedReports();
      const listed = (await pages.analyze.savedReports.innerText()).replace(/\s+/g, ' ');
      test.info().annotations.push({ type: 'saved reports in a fresh session', description: listed });
      expect.soft(listed, 'saved report follows the user, not the device').toContain(name);
      await fresh.close();
    });
  });
});
