import { test, expect } from '../../../src/fixtures/test';

const T = 'Touch nose';

test.describe('US-20 Record duration-intensity behavior data', { tag: '@US-20' }, () => {
  test('TC-US20-01 Duration-intensity segments per level survive a pause @rbt', async ({ page, flows, dataSheet, closeSession, rbtSessions, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    let program = '';
    await flows.signInAs('bcba');
    await flows.openClient(client);

    await test.step('BCBA: Duration program', async () => {
      program = await flows.createCollectionProgram('duration');
    });

    let clientName = '';
    await test.step('RBT: start a session; no active timer', async () => {
      await flows.switchRole('rbt');
      await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] } });
      clientName = await dataSheet.title();
      const row = dataSheet.durationIntensityRow(await dataSheet.showProgram(program), T);
      await expect(row.getByTestId('duration-intensity-active-segment')).toHaveText('No active timer');
      expect(await dataSheet.durationTotal(program, T)).toBe(0);
    });

    let levels = false;
    await test.step('Recorder offers High / Medium / Low intensity levels', async () => {
      levels = await dataSheet.intensityLevelsOffered(program, T);
      test.info().annotations.push({ type: 'duration recorder', description: levels ? 'intensity levels offered' : 'plain Start / Stop timer, no intensity levels' });
      expect.soft(levels, 'Duration recorder offers High / Medium / Low intensity levels (offered on Oct 19, missing on Oct 20)').toBe(true);
    });

    let beforePause = { high: 0, medium: 0, low: 0, total: 0 };
    await test.step('Time a segment (High, then switch to Low when levels are offered)', async () => {
      await dataSheet.startDurationTimer(program, T, 'High');
      await page.waitForTimeout(3_000);
      if (levels) {
        await dataSheet.switchIntensity(program, T, 'Low');
        await page.waitForTimeout(3_000);
      }
      await dataSheet.stopDurationTimer(program, T);
      beforePause = await dataSheet.intensityTotals(program, T);
      expect(beforePause.total).toBeGreaterThan(0);
      if (levels) {
        expect(beforePause.high).toBeGreaterThan(0);
        expect(beforePause.low).toBeGreaterThan(0);
        expect(Math.abs(beforePause.total - (beforePause.high + beforePause.low))).toBeLessThanOrEqual(1);
      }
    });

    await test.step('Pause and resume keep the totals', async () => {
      await dataSheet.openCloseSession();
      await closeSession.pause();
      await rbtSessions.expectLoaded();
      await rbtSessions.resume(clientName);
      await dataSheet.expectLoaded();
      await expect.poll(() => dataSheet.intensityTotals(program, T)).toEqual(beforePause);
    });

    await test.step('A segment after the pause adds to the total; earlier time unchanged', async () => {
      await dataSheet.startDurationTimer(program, T, 'Medium');
      await page.waitForTimeout(2_000);
      await dataSheet.stopDurationTimer(program, T);
      const after = await dataSheet.intensityTotals(program, T);
      expect(after.total).toBeGreaterThan(beforePause.total);
      if (levels) {
        expect(after.medium).toBeGreaterThan(0);
        expect(after.high).toBe(beforePause.high);
        expect(after.low).toBe(beforePause.low);
      }
    });

    await test.step('Conclude and finalize', async () => {
      await flows.concludeToSummary();
      await flows.evidence('duration-intensity-summary');
      await sessionClose.finalize();
    });

    await test.step('Clean-up', async () => {
      await flows.deleteCreatedPrograms();
    });
  });

  test('TC-US20-02 Plan behavior offers the duration-intensity recorder @rbt', async ({ page, flows, dataSheet, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    const behavior = testData.seeded.durationIntensityBehavior;
    test.skip(!behavior, `no duration-intensity behavior seeded (set SEEDED_DI_BEHAVIOR); "${testData.seeded.behavior}" is Frequency/Rate`);
    await flows.signInAs('rbt');
    await flows.startLiveSessionAsRbt({ clientIds: [client], behaviors: { [client]: [behavior] } });

    const row = dataSheet.behaviorRow(client, behavior);
    await test.step('Behavior row offers the duration-intensity recorder (NGC-35)', async () => {
      await expect(row).toBeVisible();
      await expect(row.getByTestId('duration-intensity-recorder')).toBeVisible();
    });

    await test.step('Record a High segment', async () => {
      await row.getByTestId('duration-intensity-picker-toggle').click();
      await row.getByRole('button', { name: 'Start High intensity timer' }).click();
      await page.waitForTimeout(2_000);
      await row.getByTestId('duration-intensity-picker-toggle').click();
      await row.getByTestId('duration-intensity-stop-button').click();
      await expect(row.getByTestId('duration-intensity-level-total-high')).not.toContainText('0:00');
    });

    await test.step('Conclude and finalize', async () => {
      await flows.concludeToSummary();
      await sessionClose.finalize();
    });
  });
});
