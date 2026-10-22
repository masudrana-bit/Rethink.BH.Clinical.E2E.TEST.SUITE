import { test, expect } from '../../../src/fixtures/test';

const TARGETS = ['Touch nose', 'Clap hands', 'Stand up'];

test.describe('US-17 Record PEAK attempts', { tag: '@US-17' }, () => {
  test('TC-US17-01 Score a PEAK block, see totals, and start another scoring @rbt', async ({ flows, dataSheet, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    let program = '';
    await flows.signInAs('bcba');
    await flows.openClient(client);

    await test.step('BCBA: PEAK Scoring program', async () => {
      program = await flows.createCollectionProgram('peak');
    });

    await test.step('RBT: start a session; Scoring 1 with total 0', async () => {
      await flows.switchRole('rbt');
      await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] } });
      const card = await dataSheet.showProgram(program);
      await expect(dataSheet.peakScoringTab(card, 1)).toHaveAttribute('aria-pressed', 'true');
      expect(await dataSheet.peakTotal(program)).toBe(0);
    });

    const card = dataSheet.card(program);
    await test.step('Targets carry Train/Test labels and stay together in one block', async () => {
      const badges = await card.locator('[data-testid^="peak-method-badge-"]').allInnerTexts();
      expect(badges).toHaveLength(TARGETS.length);
      for (const badge of badges) expect(badge.trim()).toMatch(/^(Train|Test)$/);
      const blocks = card.locator('[data-testid^="peak-block-"]');
      for (const target of TARGETS) await expect(blocks.filter({ hasText: target })).toHaveCount(1);
      await expect(card.locator('[data-testid^="peak-target-score-"]').first()).toHaveText('Unscored');
    });

    await test.step('Score the block: total adds up', async () => {
      await dataSheet.recordPeak(program, 'Touch nose', 8);
      await dataSheet.recordPeak(program, 'Clap hands', 10);
      await dataSheet.recordPeak(program, 'Stand up', 4);
      await expect(card.locator('[data-testid^="peak-target-score-"]').first()).toHaveText('Score: 8');
      await expect.poll(() => dataSheet.peakTotal(program)).toBe(22);
    });

    await test.step('Another scoring starts at 0 and the first is kept', async () => {
      await card.getByTestId('peak-record-another-scoring-button').click();
      await expect(dataSheet.peakScoringTab(card, 2)).toHaveAttribute('aria-pressed', 'true');
      await expect.poll(() => dataSheet.peakTotal(program)).toBe(0);
      await dataSheet.peakScoringTab(card, 1).click();
      await expect.poll(() => dataSheet.peakTotal(program)).toBe(22);
    });

    await test.step('Conclude and finalize', async () => {
      await flows.concludeToSummary();
      await flows.evidence('peak-summary');
      await sessionClose.finalize();
    });

    await test.step('Clean-up', async () => {
      await flows.deleteCreatedPrograms();
    });
  });
});
