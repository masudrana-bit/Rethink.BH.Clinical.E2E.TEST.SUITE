import { test, expect } from '../../../src/fixtures/test';
import { clockToSeconds } from '../../../src/pages/sessions/DataSheetPage';

test.describe('US-19 Record a toileting visit', { tag: '@US-19' }, () => {
  test('TC-US19-01 Time a sit, pick an outcome, submit, and see it in the metrics @rbt', async ({ page, flows, dataSheet, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    let program = '';
    await flows.signInAs('bcba');
    await flows.openClient(client);

    await test.step('BCBA: Toileting program', async () => {
      program = await flows.createCollectionProgram('toileting');
    });

    await test.step('RBT: start a session; no active visit', async () => {
      await flows.switchRole('rbt');
      await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] } });
      const card = await dataSheet.showProgram(program);
      await expect(card.getByTestId('toileting-status')).toContainText('No active visit');
      await expect(card.getByTestId('toileting-score-value')).toHaveText('--');
    });

    const card = dataSheet.card(program);
    await test.step('Sit timer counts up', async () => {
      await dataSheet.startToiletingVisit(program);
      await page.waitForTimeout(3_000);
      expect(clockToSeconds(await card.getByTestId('toileting-status').innerText())).toBeGreaterThanOrEqual(2);
    });

    await test.step('Selected outcome is highlighted', async () => {
      const urine = dataSheet.toiletingOutcome(card, 'urine');
      await urine.click();
      await expect(urine).toHaveAttribute('aria-pressed', 'true');
      await expect(urine).toHaveClass(/--selected/);
      for (const other of ['bm', 'both', 'no_elimination'] as const) await expect(dataSheet.toiletingOutcome(card, other)).toHaveAttribute('aria-pressed', 'false');
    });

    await test.step('Submit the visit: log and metrics update', async () => {
      await dataSheet.submitToiletingVisit(card);
      await expect(card.getByTestId('toileting-score-value')).toHaveText('1/1');
      await expect(card.locator('[data-testid^="toileting-log-row-"]')).toHaveCount(1);
      await expect(card.locator('[data-testid^="toileting-log-row-"]').first()).toContainText(/Bathroom visit\s*Urine/);
      await expect(card.getByTestId('toileting-metric-visits')).toContainText(/^\s*1\s/);
      await expect(card.getByTestId('toileting-metric-continent-voids')).toContainText(/^\s*1\s/);
      expect(clockToSeconds(await card.getByTestId('toileting-metric-avg-visit').innerText())).toBeGreaterThan(0);
    });

    await test.step('Conclude and finalize', async () => {
      await flows.concludeToSummary();
      await flows.evidence('toileting-summary');
      await sessionClose.finalize();
    });

    await test.step('Clean-up', async () => {
      await flows.deleteCreatedPrograms();
    });
  });
});
