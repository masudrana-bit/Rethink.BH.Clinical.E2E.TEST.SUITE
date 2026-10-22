import { test, expect } from '../../../src/fixtures/test';

test.describe('US-16 Record task-analysis attempts', { tag: '@US-16' }, () => {
  test('TC-US16-01 Score every step, start a new series at step 1, see % in the summary @rbt', async ({ flows, programDetails, dataSheet, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    let program = '';
    await flows.signInAs('bcba');
    await flows.openClient(client);

    await test.step('BCBA: Task Analysis program with 3 steps', async () => {
      program = await flows.createCollectionProgram('task-analysis');
      await expect(programDetails.dataSettings).toContainText('3 steps');
    });

    await test.step('RBT: start a session; card shows chain, opportunity and progress', async () => {
      await flows.switchRole('rbt');
      await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] } });
      const card = await dataSheet.showProgram(program);
      await expect(card.locator('[data-testid^="data-sheet-chain-badge-"]')).toHaveText('Total Task');
      await expect(card.getByTestId('task-analysis-series-1-button')).toHaveAttribute('aria-pressed', 'true');
      expect(await dataSheet.taskAnalysisProgress(program)).toBe('0/3 steps');
    });

    const card = dataSheet.card(program);
    await test.step('Steps are recorded in order', async () => {
      await dataSheet.expandTaskAnalysisSteps(program);
      await expect(dataSheet.taskAnalysisStepButton(card, 1)).toBeEnabled();
      await expect(dataSheet.taskAnalysisStepButton(card, 2)).toBeDisabled();
      await expect(dataSheet.taskAnalysisStepButton(card, 3)).toBeDisabled();
      await dataSheet.recordTaskAnalysisStep(program, 1, 'Independent');
      await expect(dataSheet.taskAnalysisStepButton(card, 2)).toBeEnabled();
    });

    await test.step('Finish the series: 3/3 steps and a series %', async () => {
      await dataSheet.recordTaskAnalysisStep(program, 2, 'Independent');
      await dataSheet.recordTaskAnalysisStep(program, 3, 'Full Physical');
      expect(await dataSheet.taskAnalysisProgress(program)).toBe('3/3 steps');
      expect(await dataSheet.taskAnalysisPercent(program)).toMatch(/^\d+%$/);
    });

    await test.step('A new series starts at step 1; the first one is kept', async () => {
      await dataSheet.startNextTaskAnalysisSeries(program);
      await expect(card.getByTestId('task-analysis-series-2-button')).toHaveAttribute('aria-pressed', 'true');
      expect(await dataSheet.taskAnalysisProgress(program)).toBe('0/3 steps');
      await expect(dataSheet.taskAnalysisStepButton(card, 1)).toBeEnabled();
      await expect(dataSheet.taskAnalysisStepButton(card, 2)).toBeDisabled();
      await card.getByTestId('task-analysis-series-1-button').click();
      await expect.poll(() => dataSheet.taskAnalysisProgress(program)).toBe('3/3 steps');
    });

    await test.step('Summary shows % correct (NGC-88), then finalize', async () => {
      await flows.concludeToSummary();
      const percent = (await sessionClose.overallPercent.innerText().catch(() => '')).trim();
      expect.soft(percent, 'task-analysis % correct in the session summary (NGC-88)').toMatch(/^\d+%$/);
      await flows.evidence('task-analysis-summary');
      await sessionClose.finalize();
    });

    await test.step('Clean-up', async () => {
      await flows.deleteCreatedPrograms();
    });
  });
});
