import { test, expect } from '../../../src/fixtures/test';
import { createPages } from '../../../src/fixtures/pages';
import { ClinicalFlows } from '../../../src/flows/ClinicalFlows';

test.describe('US-25 Resume an in-progress session after a refresh', { tag: '@US-25' }, () => {
  test('TC-US25-01 Refresh mid-session: trials, behavior count, ABC entry and clock are kept; recording continues @rbt', async ({ page, flows, dataSheet, abc, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    const program = testData.seeded.obProgram;
    const target = testData.seeded.obTarget;
    const behavior = testData.seeded.behavior;
    await flows.signInAs('rbt');
    const sessionId = await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] }, behaviors: { [client]: [behavior] } });
    const card = dataSheet.card(program);
    let clockBefore = 0;

    await test.step('Record trials, a behavior count and an ABC entry', async () => {
      await dataSheet.recordOutcome(program, target, 'Correct');
      await dataSheet.recordOutcome(program, target, 'Incorrect');
      await dataSheet.addBehaviorCount(client, behavior);
      await expect.poll(() => dataSheet.behaviorValue(client, behavior)).toBe('1');
      await dataSheet.openAbcEntry();
      await abc.record({ behavior, context: 'Home', antecedents: ['Denied access to item'], consequences: ['Redirected to activity'], note: 'E2E before refresh' });
      clockBefore = await dataSheet.clockSeconds();
    });

    await test.step('Refresh the browser', async () => {
      await page.reload();
      await dataSheet.expectLoaded();
      expect(dataSheet.sessionId()).toBe(sessionId);
    });

    await test.step('Nothing is lost and the clock keeps running', async () => {
      await expect.poll(() => dataSheet.targetScore(program, undefined, target)).toBe('50%');
      await expect(card.getByRole('button', { name: `Correct for ${target}, 1 recorded`, exact: true })).toBeVisible();
      await expect(card.getByRole('button', { name: `Incorrect for ${target}, 1 recorded`, exact: true })).toBeVisible();
      await dataSheet.expandTarget(card, target);
      await expect.poll(() => dataSheet.trialHistory(card, target)).toEqual(['Correct', 'Incorrect']);
      await expect.poll(() => dataSheet.behaviorValue(client, behavior)).toBe('1');
      await expect.poll(() => dataSheet.clockSeconds()).toBeGreaterThan(clockBefore);
    });

    await test.step('Recording continues after the refresh', async () => {
      await dataSheet.recordOutcome(program, target, 'Correct');
      await expect.poll(() => dataSheet.targetScore(program, undefined, target)).toBe('67%');
    });

    await test.step('Summary includes data from before and after the refresh', async () => {
      await flows.concludeToSummary();
      await expect.poll(() => sessionClose.scored()).toBe(3);
      await expect(sessionClose.auditAbcEntries.filter({ hasText: 'E2E before refresh' })).toHaveCount(1);
      await expect(sessionClose.auditBehaviorEntries).toHaveCount(1);
      await sessionClose.finalize();
    });
  });

  test('TC-US25-02 Close the tab and come back: RBT Home offers the session under "Resume a session" with its data @rbt', async ({ page, context, flows, dataSheet, testData }, testInfo) => {
    const client = testData.clients.seeded;
    const program = testData.seeded.obProgram;
    const target = testData.seeded.obTarget;
    await flows.signInAs('rbt');
    const sessionId = await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] } });
    const clientName = await dataSheet.title();

    await test.step('Record trials, then close the tab', async () => {
      await dataSheet.recordOutcome(program, target, 'Correct');
      await dataSheet.recordOutcome(program, target, 'Incorrect');
      await expect.poll(() => dataSheet.targetScore(program, undefined, target)).toBe('50%');
    });

    const reopened = await context.newPage();
    await page.close();
    const pages = createPages(reopened);
    const reopenedFlows = new ClinicalFlows(reopened, pages, testInfo);

    await test.step('Open the app again: RBT Home lists the session as in progress', async () => {
      await reopened.goto('/rbt');
      await pages.rbtHome.expectLoaded();
      const row = pages.rbtHome.resumableById(sessionId);
      await expect(row).toContainText(clientName);
      await expect(row).toContainText(/in progress/i);
    });

    await test.step('Continue resumes the same session with its data', async () => {
      await pages.rbtHome.resumeSession(sessionId);
      await pages.dataSheet.expectLoaded();
      await expect.poll(() => pages.dataSheet.targetScore(program, undefined, target)).toBe('50%');
      await expect.poll(() => pages.dataSheet.clockSeconds()).toBeGreaterThan(0);
    });

    await test.step('Conclude and finalize', async () => {
      await reopenedFlows.concludeToSummary();
      await expect.poll(() => pages.sessionClose.scored()).toBe(2);
      await pages.sessionClose.finalize();
    });
  });
});
