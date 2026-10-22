import { test, expect } from '../../../src/fixtures/test';
import { customProgramInput } from '../../../src/data/programs';

const TARGETS = ['Touch nose', 'Clap hands', 'Stand up'] as const;

test.describe('US-33 Review and confirm automatic mastery determinations', { tag: '@US-33' }, () => {
  test('TC-US33-01 Meeting the criteria raises a determination; confirm masters one target and reject keeps the other in progress', async ({ page, flows, programDetails, dataCollection, targets, phaseDialog, dataSheet, testData }) => {
    test.setTimeout(12 * 60_000);
    const client = testData.clients.seeded;
    const input = customProgramInput('Mastery Program', { targets: [...TARGETS] });
    const program = input.title;
    let programId = '';
    await flows.signInAs('bcba');
    await flows.openClient(client);

    await test.step('BCBA: program with automatic-with-confirmation mastery at 80% over 1 session', async () => {
      await flows.createCustomProgram(input);
      programId = await programDetails.programId();
      expect(programId, 'program id in the URL').not.toBe('');
      await expect(programDetails.title).toHaveText(program);
      test.info().annotations.push({ type: 'created program', description: `${program} -> ${page.url()}` });
      await programDetails.manageDataCollectionButton.click();
      await dataCollection.expectOpen();
      await dataCollection.chooseType('opportunity-based');
      await dataCollection.goToMastery();
      await dataCollection.setMastery({ skipBaseline: true, interventionMode: 'Automatic with Confirmation', interventionThreshold: 80, minTrials: 1, sessionCount: 1 });
      await expect(dataCollection.saveButton, `Save blocked by ${JSON.stringify(await dataCollection.blockingMessages())}`).toBeEnabled();
      await dataCollection.save();
      await expect(programDetails.dataSettings).toContainText(/require BCBA confirmation/i);
      await expect(programDetails.masteryReviewEmpty).toBeVisible();
    });

    await test.step('BCBA: targets are in Intervention (moved there if skipping baseline left them in Baseline)', async () => {
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      const phases = await Promise.all(TARGETS.map((t) => targets.phaseOf(t)));
      test.info().annotations.push({ type: 'phases after skipping baseline', description: JSON.stringify(phases) });
      expect.soft(phases, 'skip baseline starts targets in Intervention').toEqual(TARGETS.map(() => 'Intervention'));
      for (const [i, target] of TARGETS.entries()) {
        if (phases[i] !== 'Baseline') continue;
        await targets.openPhaseChange(target);
        await phaseDialog.changePhase('Intervention', 'E2E: baseline skipped');
        await expect.poll(() => targets.phaseOf(target)).toBe('Intervention');
      }
      await targets.close();
    });

    await test.step('RBT: 3/3 correct on Touch nose and Clap hands, finalize', async () => {
      await flows.switchRole('rbt');
      await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] } });
      await dataSheet.showProgram(program);
      for (const target of ['Touch nose', 'Clap hands']) {
        for (let i = 0; i < 3; i++) await dataSheet.recordTrial(program, target, 'Independent');
      }
      await flows.concludeAndFinalize();
      await flows.switchRole('bcba');
    });

    await test.step('BCBA: determinations are waiting for review', async () => {
      await expect(async () => {
        await flows.openClientByUrl(client);
        await flows.openProgram(program);
        await expect(programDetails.title).toHaveText(program, { timeout: 30_000 });
        await expect(page).toHaveURL(new RegExp(`/programs/${programId}`));
        await programDetails.expectLoaded();
        await expect(programDetails.masteryDetermination('Touch nose')).toBeVisible({ timeout: 10_000 });
      }).toPass({ timeout: 120_000 }).catch(async (error) => {
        const settings = (await programDetails.dataSettings.innerText().catch(() => '')).replace(/\s+/g, ' ');
        const review = (await programDetails.masteryReview.innerText().catch(() => '')).replace(/\s+/g, ' ');
        test.info().annotations.push({ type: 'no determination raised', description: `${page.url()} | settings: ${settings} | review: ${review}` });
        throw error;
      });
      test.info().annotations.push({ type: 'mastery review', description: (await programDetails.masteryReview.innerText()).replace(/\s+/g, ' ') });
      await expect(programDetails.masteryDetermination('Clap hands')).toBeVisible();
      await expect(programDetails.masteryDetermination('Stand up')).toHaveCount(0);
      await flows.evidence('mastery-determinations');
    });

    await test.step('Confirm Touch nose, reject Clap hands', async () => {
      await programDetails.decideMastery('Touch nose', 'confirm');
      await programDetails.decideMastery('Clap hands', 'reject');
      await expect(programDetails.masteryReviewEmpty).toBeVisible();
    });

    await test.step('Target statuses: Touch nose Mastered with a date, Clap hands still In Progress', async () => {
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      const touch = await targets.row('Touch nose');
      await expect(touch.locator('[data-testid$="-status"]').first()).toContainText('Mastered');
      await expect(touch.locator('[data-testid$="-mastered"]')).not.toHaveText('—');
      const clap = await targets.row('Clap hands');
      await expect(clap.locator('[data-testid$="-status"]').first()).not.toContainText('Mastered');
      await targets.cancel();
    });

    await test.step('RBT: the mastered target is no longer on the data sheet', async () => {
      await flows.switchRole('rbt');
      await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] } });
      const card = await dataSheet.showProgram(program);
      const names = await dataSheet.targetNames(card);
      test.info().annotations.push({ type: 'targets on sheet', description: JSON.stringify(names) });
      expect.soft(names, 'mastered target leaves the data sheet').not.toContain('Touch nose');
      expect(names).toContain('Clap hands');
      await dataSheet.recordTrial(program, 'Clap hands', 'Independent');
      await flows.concludeAndFinalize();
    });
  });

  test('TC-US33-02 Program without pending determinations shows the empty review state', async ({ flows, programDetails, testData }) => {
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await flows.openProgram(testData.seeded.obProgram);
    await expect(programDetails.masteryReview).toBeVisible();
    await expect(programDetails.masteryReviewEmpty).toHaveText(/No mastery determinations are waiting for review/i);
  });
});
