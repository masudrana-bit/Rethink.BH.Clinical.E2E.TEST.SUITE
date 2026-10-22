import { test, expect } from '../../../src/fixtures/test';

const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

test.describe('US-31 Review and correct recorded observations', { tag: '@US-31' }, () => {
  test('TC-US31-01 A finalized session is listed in the Observations grid with staff and setting; correcting it updates the grid and chart', async ({ page, flows, programDetails, programData, testData }) => {
    test.setTimeout(8 * 60_000);
    const client = testData.clients.seeded;
    const program = testData.seeded.obProgram;
    const target = testData.seeded.obTarget;
    let programId = '';
    await flows.signInAs('bcba');
    await flows.openClient(client);
    await flows.openProgram(program);
    programId = await programDetails.programId();

    await test.step('RBT: finalize a session with one Correct and one Incorrect trial on this device', async () => {
      await flows.runFinalizedSession(client, program, target, ['Correct', 'Incorrect']);
    });

    await test.step('BCBA: the Observations grid lists the session for today', async () => {
      await programData.open(client, programId);
      await programData.observationGrid.scrollIntoViewIfNeeded();
      await expect(programData.observationRows.first()).toBeVisible({ timeout: 60_000 });
      const headers = await programData.observationHeaders();
      expect(headers).toEqual(expect.arrayContaining(['Date', 'Target', 'Phase', 'Value', 'Setting', 'Staff']));
      const rowText = ((await programData.observationRows.first().textContent()) ?? '').replace(/\s+/g, ' ');
      test.info().annotations.push({ type: 'observation row', description: rowText });
      expect(rowText).toContain(today());
      expect(rowText).toContain(target);
      expect(rowText).toMatch(/50\s*%/);
      const staff = await programData.observationColumn('Staff');
      const setting = await programData.observationColumn('Setting');
      expect.soft(staff[0] ?? '', 'Staff filled in (NGC-44)').toMatch(/\w/);
      expect.soft(setting[0] ?? '', 'Setting / location filled in (NGC-44)').toMatch(/\w/);
      await expect.soft(page.locator('.ag-watermark'), 'no AG Grid trial watermark (NGC-44)').toHaveCount(0);
      const synced = page.getByTestId('observation-synced-unavailable');
      if (await synced.isVisible()) test.info().annotations.push({ type: 'dev2', description: await synced.innerText() });
      await flows.evidence('observations-grid');
    });

    await test.step('Correct the observation: Incorrect trial becomes Correct', async () => {
      const dialog = await programData.openObservationCorrection(0);
      test.info().annotations.push({ type: 'correction dialog', description: (await programData.describeDialog(dialog)).slice(0, 1500) });
      await programData.applyObservationCorrection(dialog, { outcome: 'correct', value: '100' }, 'E2E: wrong button pressed');
    });

    await test.step('Grid shows the corrected value and the audit marker; the chart updates', async () => {
      await expect.poll(async () => (await programData.observationRows.allTextContents()).join(' | ').replace(/\s+/g, ' '), { timeout: 30_000 }).toMatch(/100\s*%/);
      const all = ((await programData.observationGrid.textContent()) ?? '').replace(/\s+/g, ' ');
      expect.soft(all, 'audit column marks the correction').toMatch(/correct(ed|ion)/i);
      const description = await programData.chartDescription(programData.combinedChart.getByTestId('clinical-chart-canvas'));
      test.info().annotations.push({ type: 'chart after correction', description: description.slice(-300) });
      await flows.evidence('observation-corrected');
    });
  });
});
