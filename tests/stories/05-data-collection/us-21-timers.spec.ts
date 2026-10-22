import { test, expect } from '../../../src/fixtures/test';

const T = 'Touch nose';

test.describe('US-21 Track session and program timers', { tag: '@US-21' }, () => {
  test('TC-US21-01 Session, program and interval timers run, pause and stop @rbt', async ({ page, flows, dataSheet, sessionClose, testData }) => {
    test.setTimeout(10 * 60_000);
    const client = testData.clients.seeded;
    let frequency = '';
    let interval = '';
    await flows.signInAs('bcba');
    await flows.openClient(client);

    await test.step('BCBA: Frequency/Rate and Interval programs', async () => {
      frequency = await flows.createCollectionProgram('frequency-rate');
      interval = await flows.createCollectionProgram('interval');
    });

    await test.step('RBT: start a session; session clock runs', async () => {
      await flows.switchRole('rbt');
      await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [frequency, interval] } });
      const start = await dataSheet.clockSeconds();
      await page.waitForTimeout(3_000);
      expect(await dataSheet.clockSeconds()).toBeGreaterThanOrEqual(start + 2);
    });

    await test.step('Program timer runs and shows in the dock', async () => {
      const card = await dataSheet.showProgram(frequency);
      await dataSheet.programTimerButton(card, 'Start', T).click();
      await expect(dataSheet.programTimerButton(card, 'Pause', T)).toBeVisible();
      await expect(dataSheet.programTimerButton(card, 'Stop', T)).toBeVisible();
      await expect(dataSheet.dockTimer('program-timer', frequency)).toBeVisible();
      await expect.poll(() => dataSheet.dockTimerSeconds('program-timer', frequency)).toBeGreaterThanOrEqual(2);
    });

    await test.step('Pause holds the program timer; resume continues it', async () => {
      const card = dataSheet.card(frequency);
      await dataSheet.programTimerButton(card, 'Pause', T).click();
      await expect(dataSheet.programTimerButton(card, 'Resume', T)).toBeVisible();
      await expect(dataSheet.dockTimer('program-timer', frequency)).toContainText('Paused');
      const paused = await dataSheet.dockTimerSeconds('program-timer', frequency);
      await page.waitForTimeout(2_500);
      expect(await dataSheet.dockTimerSeconds('program-timer', frequency)).toBe(paused);
      await dataSheet.programTimerButton(card, 'Resume', T).click();
      await expect.poll(() => dataSheet.dockTimerSeconds('program-timer', frequency)).toBeGreaterThan(paused);
    });

    await test.step('Stop ends the program timer', async () => {
      const card = dataSheet.card(frequency);
      await dataSheet.programTimerButton(card, 'Stop', T).click();
      await expect(dataSheet.programTimerButton(card, 'Start', T)).toBeVisible();
      await expect(dataSheet.dockTimer('program-timer', frequency)).toHaveCount(0);
    });

    await test.step('Interval timer counts down and records a full interval', async () => {
      const card = await dataSheet.showProgram(interval);
      await card.getByRole('button', { name: `Start Interval for ${T}`, exact: true }).click();
      await expect(card.getByRole('button', { name: `Mark occurred in this interval for ${T}` })).toBeVisible();
      await expect(dataSheet.dockTimer('interval', interval)).toBeVisible();
      const first = await dataSheet.dockTimerSeconds('interval', interval);
      expect(first).toBeGreaterThan(50);
      await expect.poll(() => dataSheet.dockTimerSeconds('interval', interval)).toBeLessThan(first);
      await expect.poll(() => dataSheet.simpleScore(interval, T), { timeout: 90_000, intervals: [5_000] }).toBe('0% (0/1)');
    });

    await test.step('Stop the interval timer', async () => {
      const card = dataSheet.card(interval);
      await card.getByRole('button', { name: `Stop interval timer for ${T}`, exact: true }).click();
      await expect(card.getByRole('button', { name: `Start Next Interval for ${T}` })).toBeVisible();
      await expect(dataSheet.dockTimer('interval', interval)).toHaveCount(0);
    });

    await test.step('Conclude and finalize', async () => {
      await flows.concludeToSummary();
      await sessionClose.finalize();
    });

    await test.step('Clean-up', async () => {
      await flows.deleteCreatedPrograms();
    });
  });
});
