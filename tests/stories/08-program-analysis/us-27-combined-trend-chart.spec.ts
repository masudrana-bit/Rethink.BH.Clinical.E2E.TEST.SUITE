import { test, expect } from '../../../src/fixtures/test';

const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

test.describe("US-27 Review a program's combined trend chart", { tag: '@US-27' }, () => {
  test('TC-US27-01 A finalized session appears on the combined chart as a new point dated today', async ({ flows, programDetails, programData, testData }) => {
    test.setTimeout(8 * 60_000);
    const client = testData.clients.seeded;
    const program = testData.seeded.obProgram;
    let programId = '';
    let before = 0;

    await test.step('BCBA: open the program Data tab and note the latest session on the chart', async () => {
      await flows.signInAs('bcba');
      await flows.openClient(client);
      await flows.openProgram(program);
      programId = await programDetails.programId();
      await programData.open(client, programId);
      await programData.showView('combined');
      before = await programData.lastSessionNumber(programData.combinedChart);
      test.info().annotations.push({ type: 'chart before', description: await programData.chartDescription(programData.combinedChart.getByTestId('clinical-chart-canvas')) });
    });

    await test.step('RBT: run and finalize a session with two Correct trials', async () => {
      await flows.runFinalizedSession(client, program, testData.seeded.obTarget, ['Correct', 'Correct']);
    });

    await test.step('BCBA: the chart gains a point for the new session, dated today on the x-axis', async () => {
      await programData.open(client, programId);
      await programData.showView('combined');
      const chart = programData.combinedChart.getByTestId('clinical-chart-canvas');
      await expect.poll(() => programData.lastSessionNumber(chart), { timeout: 60_000 }).toBe(before + 1);
      const points = await programData.sessionPoints(chart);
      expect(points.at(-1)?.date, 'x-axis shows the real session date').toBe(today());
      await expect(programData.summarySessions).toBeVisible();
      await expect(programData.summaryAverage).toBeVisible();
      await flows.evidence('combined-chart-after-session');
    });

    await test.step('Goal line comes from the mastery goal (NGC-59)', async () => {
      const chart = programData.combinedChart.getByTestId('clinical-chart-canvas');
      const description = await programData.chartDescription(chart);
      const plotLines = await chart.locator('.highcharts-plot-line').count();
      test.info().annotations.push({ type: 'goal line', description: `plot lines: ${plotLines}; description: ${description.slice(0, 300)}` });
      expect.soft(plotLines > 0 || /goal|mastery/i.test(description), 'goal line drawn from the mastery criteria (NGC-59)').toBe(true);
    });
  });

  test('TC-US27-02 Date-range filter changes the sessions shown', async ({ flows, programDetails, programData, testData }) => {
    const client = testData.clients.seeded;
    await flows.signInAs('bcba');
    await flows.openClient(client);
    await flows.openProgram(testData.seeded.obProgram);
    await programData.open(client, await programDetails.programId());
    const chart = programData.combinedChart.getByTestId('clinical-chart-canvas');

    let options: string[] = [];
    await test.step('Display panel offers range options', async () => {
      await programData.openDisplay();
      options = await programData.rangeOptions();
      test.info().annotations.push({ type: 'range options', description: JSON.stringify(options) });
      expect(options.length, 'range filter has more than one option').toBeGreaterThan(1);
    });

    await test.step('Last 12 sessions shows at most 12 points; All sessions shows at least as many', async () => {
      await programData.setRange(/Last 12 sessions/);
      await expect.poll(() => programData.pointCount(chart)).toBeGreaterThan(0);
      const last12 = await programData.pointCount(chart);
      expect(last12).toBeLessThanOrEqual(12);
      await programData.setRange(/All sessions/);
      await expect.poll(() => programData.pointCount(chart)).toBeGreaterThanOrEqual(last12);
      const all = await programData.pointCount(chart);
      test.info().annotations.push({ type: 'points', description: `Last 12 sessions: ${last12}; All sessions: ${all}` });
      expect(all, 'seeded program has more than 12 sessions').toBeGreaterThan(last12);
    });
  });
});
