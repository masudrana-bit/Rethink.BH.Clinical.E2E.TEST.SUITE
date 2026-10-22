import { test, expect } from '../../../src/fixtures/test';
import { ALL_PROMPT_LEVELS } from '../../../src/pages/sessions/DataSheetPage';

test.describe('US-15 Record standard discrete-trial attempts', { tag: '@US-15' }, () => {
  test('TC-US15-01 Every prompt level is recordable, shown trial by trial; on-hold targets stay off the sheet @rbt', async ({ flows, programDetails, targets, dataSheet, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    let program = '';
    await flows.signInAs('bcba');
    await flows.openClient(client);

    await test.step('BCBA: Opportunity Based program with prompts; one target on hold', async () => {
      program = await flows.createCollectionProgram('opportunity-based', { prompts: true });
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      await targets.setOnHold('Stand up', true);
      await targets.save();
    });

    await test.step('RBT: start a session with the program', async () => {
      await flows.switchRole('rbt');
      await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] } });
    });

    const card = dataSheet.card(program);
    await test.step('On-hold target is not on the data sheet', async () => {
      await dataSheet.showProgram(program);
      const names = await dataSheet.targetNames(card);
      expect(names).toEqual(expect.arrayContaining(['Touch nose', 'Clap hands']));
      expect.soft(names, 'on-hold target "Stand up" should be hidden from collection').not.toContain('Stand up');
    });

    let levels: string[] = [];
    await test.step('Prompt picker offers every level incl. Model, N/A last (NGC-90)', async () => {
      levels = await dataSheet.availablePromptLevels(card, 'Touch nose');
      expect(levels[0]).toBe('Independent');
      expect(levels.at(-1)).toBe('N/A');
      expect.soft(levels, 'Model prompt level on the data sheet (NGC-90)').toContain('Model');
      expect(levels.every((l) => (ALL_PROMPT_LEVELS as string[]).includes(l)), `levels ${JSON.stringify(levels)}`).toBe(true);
    });

    await test.step('Record one trial at every offered level; history shows each prompt', async () => {
      for (const level of levels) await dataSheet.recordTrial(program, 'Touch nose', level as (typeof ALL_PROMPT_LEVELS)[number]);
      await expect(dataSheet.trialChips(card, 'Touch nose')).toHaveCount(levels.length);
      const history = await dataSheet.trialHistory(card, 'Touch nose');
      levels.forEach((level, i) => expect(history[i], `trial ${i + 1}`).toContain(`prompt ${level}`));
      expect(history[0]).toMatch(/^Correct/);
      await expect(card.getByRole('button', { name: 'Undo last trial for Touch nose' })).toBeEnabled();
    });

    await test.step('Independent on another target scores 100%', async () => {
      await dataSheet.recordTrial(program, 'Clap hands', 'Independent');
      await expect.poll(() => dataSheet.targetScore(program, undefined, 'Clap hands')).toBe('100%');
    });

    await test.step('Summary counts every scored trial (N/A is not scored), then finalize', async () => {
      await flows.concludeToSummary();
      await expect.poll(() => sessionClose.scored()).toBe(levels.filter((l) => l !== 'N/A').length + 1);
      await sessionClose.finalize();
    });

    await test.step('Clean-up', async () => {
      await flows.deleteCreatedPrograms();
    });
  });

  test('TC-US15-02 Change and delete a recorded trial from the trial-by-trial view @rbt', async ({ page, flows, dataSheet, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    let program = '';
    await flows.signInAs('bcba');
    await flows.openClient(client);

    await test.step('BCBA: Opportunity Based program with prompts', async () => {
      program = await flows.createCollectionProgram('opportunity-based', { prompts: true });
    });

    await test.step('RBT: record Verbal for Touch nose', async () => {
      await flows.switchRole('rbt');
      await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] } });
      await dataSheet.recordTrial(program, 'Touch nose', 'Verbal');
      await expect.poll(() => dataSheet.targetScore(program, undefined, 'Touch nose')).toBe('0%');
    });

    const card = dataSheet.card(program);
    await test.step('Edit toolbar is fully visible and marks the current level', async () => {
      const toolbar = await dataSheet.openTrialEditor(card, 'Touch nose', 1);
      const box = await toolbar.boundingBox();
      const viewport = page.viewportSize()!;
      expect(box, 'edit toolbar has a box').not.toBeNull();
      expect.soft(box!.x >= 0 && box!.y >= 0 && box!.x + box!.width <= viewport.width && box!.y + box!.height <= viewport.height, `toolbar ${JSON.stringify(box)} inside ${JSON.stringify(viewport)}`).toBe(true);
      await expect(toolbar.getByRole('button', { name: 'Change trial 1 for Touch nose to Verbal' })).toHaveAttribute('aria-pressed', 'true');
    });

    await test.step('Change the trial to Independent', async () => {
      await dataSheet.changeTrialPrompt(card, 'Touch nose', 1, 'Independent');
      await expect.poll(() => dataSheet.trialHistory(card, 'Touch nose')).toEqual(['Correct, prompt Independent']);
      await expect.poll(() => dataSheet.targetScore(program, undefined, 'Touch nose')).toBe('100%');
    });

    await test.step('Record Gestural, then delete it', async () => {
      await dataSheet.recordTrial(program, 'Touch nose', 'Gestural');
      await expect(dataSheet.trialChips(card, 'Touch nose')).toHaveCount(2);
      await dataSheet.deleteTrial(card, 'Touch nose', 2);
      await expect(dataSheet.trialChips(card, 'Touch nose')).toHaveCount(1);
      await expect.poll(() => dataSheet.targetScore(program, undefined, 'Touch nose')).toBe('100%');
    });

    await test.step('Summary reflects the corrected trial, then finalize', async () => {
      await flows.concludeToSummary();
      await expect.poll(() => sessionClose.scored()).toBe(1);
      await expect(sessionClose.overallPercent).toHaveText('100%');
      await sessionClose.finalize();
    });

    await test.step('Clean-up', async () => {
      await flows.deleteCreatedPrograms();
    });
  });
});
