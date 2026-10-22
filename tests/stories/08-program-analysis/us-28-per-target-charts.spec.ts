import { test, expect } from '../../../src/fixtures/test';

test.describe('US-28 Review each target on its own chart', { tag: '@US-28' }, () => {
  test('TC-US28-01 Each target gets its own chart with its session data; a phase change shows on that chart (NGC-61)', async ({ flows, programDetails, targets, phaseDialog, programData, dataSheet, testData }) => {
    test.setTimeout(10 * 60_000);
    const client = testData.clients.seeded;
    let program = '';
    let programId = '';
    await flows.signInAs('bcba');
    await flows.openClient(client);

    await test.step('BCBA: create an Opportunity Based program with three targets', async () => {
      program = await flows.createCollectionProgram('opportunity-based');
      programId = await programDetails.programId();
    });

    await test.step('RBT: record trials on two of the targets and finalize', async () => {
      await flows.switchRole('rbt');
      await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] } });
      await dataSheet.showProgram(program);
      await dataSheet.recordTrial(program, 'Touch nose', 'Independent');
      await dataSheet.recordTrial(program, 'Touch nose', 'Full Physical');
      await dataSheet.recordTrial(program, 'Clap hands', 'Independent');
      await flows.concludeAndFinalize();
      await flows.switchRole('bcba');
    });

    await test.step('BCBA: Targets view shows one chart per target with its own points', async () => {
      await programData.open(client, programId);
      await programData.showView('targets');
      await expect(programData.targetSmallMultiples).toBeVisible();
      await expect.poll(async () => (await programData.targetChartDescriptions()).join(' | '), { timeout: 60_000 }).toMatch(/Touch nose: 1 recorded point/);
      const descriptions = await programData.targetChartDescriptions();
      test.info().annotations.push({ type: 'target charts', description: JSON.stringify(descriptions) });
      expect(descriptions.some((d) => /Clap hands: 1 recorded point/.test(d))).toBe(true);
      if (!descriptions.some((d) => /Stand up/.test(d))) test.info().annotations.push({ type: 'observation', description: 'targets without data get no chart' });
    });

    await test.step('BCBA: move Touch nose to Intervention', async () => {
      await flows.openProgram(program);
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      await targets.openPhaseChange('Touch nose');
      await phaseDialog.changePhase('Intervention', 'E2E: baseline complete');
      await expect.poll(() => targets.phaseOf('Touch nose')).toBe('Intervention');
      await targets.close();
    });

    await test.step('Touch nose chart reflects the phase change (NGC-61)', async () => {
      await programData.open(client, programId);
      await programData.showView('targets');
      const chart = programData.targetChart('Touch nose');
      const description = await programData.chartDescription(chart.getByTestId('clinical-chart-canvas'));
      const phaseLines = await chart.locator('.highcharts-plot-line, .highcharts-plot-band').count();
      test.info().annotations.push({ type: 'phase on chart', description: `plot lines/bands ${phaseLines}; ${description}` });
      expect.soft(phaseLines > 0 || /intervention|phase/i.test(description), 'phase change line on the target chart (NGC-61)').toBe(true);
      await flows.evidence('target-chart-after-phase-change');
    });
  });
});
