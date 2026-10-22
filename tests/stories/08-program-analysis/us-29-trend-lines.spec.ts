import { test, expect } from '../../../src/fixtures/test';

test.describe("US-29 Add trend lines to a program's chart", { tag: '@US-29' }, () => {
  test('TC-US29-01 Trend line is added to a chart with 3+ points and removed again', async ({ flows, programDetails, programData, testData }) => {
    const client = testData.clients.seeded;
    await flows.signInAs('bcba');
    await flows.openClient(client);
    await flows.openProgram(testData.seeded.obProgram);
    await programData.open(client, await programDetails.programId());
    const chart = programData.combinedChart.getByTestId('clinical-chart-canvas');

    await test.step('Chart has at least three session points', async () => {
      expect(await programData.pointCount(chart)).toBeGreaterThanOrEqual(3);
    });

    let baseLines = 0;
    await test.step('Trend control is found under Display (NGC-42) and adds a trend line', async () => {
      baseLines = await programData.lineCount(chart);
      if (!(await programData.trendToggle.isVisible())) {
        test.info().annotations.push({ type: 'NGC-42', description: 'trend control only inside the Display panel' });
        await programData.openDisplay();
      }
      await programData.setTrendLines(true);
      await expect.poll(() => programData.lineCount(chart)).toBe(baseLines + 1);
      await flows.evidence('trend-line-on');
    });

    await test.step('Turning it off removes the trend line', async () => {
      await programData.setTrendLines(false);
      await expect.poll(() => programData.lineCount(chart)).toBe(baseLines);
    });
  });

  test('TC-US29-02 With fewer than 3 points the trend control explains why no line is drawn (NGC-85)', async ({ page, flows, programDetails, programData, testData }) => {
    const client = testData.clients.seeded;
    await flows.signInAs('bcba');
    await flows.openClient(client);

    let programId = '';
    await test.step('BCBA: a new program with no sessions yet', async () => {
      await flows.createCollectionProgram('opportunity-based');
      programId = await programDetails.programId();
    });

    await test.step('Trend line request on an empty chart shows a hint', async () => {
      await page.goto(`/clients/${client}/programs/${programId}?tab=data`);
      await expect(programData.root).toBeVisible({ timeout: 60_000 });
      if (!(await programData.trendToggle.isVisible())) await programData.openDisplay();
      const enabled = await programData.trendToggle.locator('input').isEnabled().catch(() => true);
      if (enabled) await programData.setTrendLines(true);
      const hint = page.getByText(/at least (3|three)|3 or more|need(s)? more (data|points|sessions)/i).first();
      const hintText = (await hint.isVisible().catch(() => false)) ? await hint.innerText() : '';
      test.info().annotations.push({ type: 'trend hint', description: `toggle enabled: ${enabled}; hint: "${hintText}"` });
      expect.soft(hintText, 'hint explains that 3+ points are needed (NGC-85)').not.toBe('');
      await flows.evidence('trend-hint-empty-program');
    });
  });
});
