import { test, expect } from '../../../src/fixtures/test';
import { uniqueName } from '../../../src/helpers/data-factory';

test.describe('US-35 Build a custom cross-program comparison graph', { tag: '@US-35' }, () => {
  test('TC-US35-01 Two programs and a behavior plotted on one time axis; the report can be exported and saved', async ({ flows, workspace, analyze, testData }) => {
    const program = testData.seeded.obProgram;
    const behaviorName = testData.seeded.behavior;
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await workspace.openTab('analyze-data');
    await analyze.expectLoaded();

    let second = '';
    await test.step('Custom Graph starts empty with export disabled', async () => {
      await analyze.openMode('custom');
      await expect(analyze.comparisonEmpty).toBeVisible();
      await expect(analyze.actionsUnavailable).toContainText(/choose at least one program/i);
      expect(await analyze.availableSeries()).toBeGreaterThan(1);
    });

    await test.step('Select two programs: both are plotted on one chart', async () => {
      const options = await analyze.seriesOptions();
      second = options.find((o) => o !== program && !/^select/i.test(o))!;
      await analyze.selectSeries([program, second]);
      await expect(analyze.comparisonEmpty).toBeHidden();
      const chart = analyze.comparisonGraph.getByTestId('clinical-chart-canvas').first();
      await expect(chart).toBeVisible();
      const description = (await chart.getAttribute('aria-label')) ?? '';
      test.info().annotations.push({ type: 'comparison chart', description: description.slice(0, 300) });
      await expect(analyze.comparisonGraph).toContainText(program);
      await expect(analyze.comparisonGraph).toContainText(second);
      await expect(analyze.actionsUnavailable).toBeHidden();
    });

    await test.step('Programs + behaviors: the behavior graph can be added', async () => {
      await analyze.chooseScope('both');
      const options = await analyze.seriesOptions();
      test.info().annotations.push({ type: 'series with behaviors', description: `${options.length} options; behavior offered: ${options.some((o) => o.includes(behaviorName))}` });
      expect(options.some((o) => o.includes(behaviorName)), 'behavior offered in the comparison').toBe(true);
      await analyze.selectSeries([behaviorName]);
      await expect(analyze.comparisonGraph).toContainText(behaviorName);
      await expect.soft(analyze.comparisonGraph, 'behavior graph is available (not "not available yet")').not.toContainText(/not available yet/i);
    });

    await test.step('Export PNG and save the report', async () => {
      const download = await analyze.export('png');
      expect(download.suggestedFilename()).toMatch(/\.png$/i);
      const name = uniqueName('Comparison');
      await analyze.saveCurrentReport(name);
      await flows.evidence('custom-comparison');
    });
  });
});
