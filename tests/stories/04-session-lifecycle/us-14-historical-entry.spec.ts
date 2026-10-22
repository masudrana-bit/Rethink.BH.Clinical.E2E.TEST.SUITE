import { test, expect } from '../../../src/fixtures/test';
import { clockPatterns, daysFromToday, dayPattern, displayDate, isoDate } from '../../../src/data/dates';

test.describe('US-14 Enter historical / backfill session data', { tag: '@US-14' }, () => {
  test('TC-US14-01 Backfill a past date with times left blank and see it in the program data', async ({ page, flows, shell, rbtSessions, newSession, bulkEntry, sessionClose, programDetails, programData, testData }) => {
    const client = testData.clients.seeded;
    const program = testData.seeded.obProgram;
    const target = testData.seeded.obTarget;
    const observed = daysFromToday(-7);
    await flows.signInAs('rbt');

    await test.step('Post-Session Entry opens the HISTORICAL wizard; future dates are blocked', async () => {
      await shell.goToNav('Sessions');
      await rbtSessions.expectLoaded();
      await rbtSessions.postSessionEntry.click();
      await expect(page).toHaveURL(/\/sessions\/historical\/new/);
      await newSession.expectOpen('HISTORICAL');
      await expect(newSession.observationDate).toHaveAttribute('max', isoDate(daysFromToday(0)));
    });

    await test.step('Choose a date 7 days ago, the client and a program', async () => {
      await newSession.fillSetup({ observationDate: isoDate(observed), clientIds: [client], programs: { [client]: [program] } });
      await expect(newSession.confirmStep).toContainText(isoDate(observed));
    });

    await test.step('Begin: bulk-entry sheet with the chosen date and optional times', async () => {
      expect(await newSession.submit()).toBe('bulk-entry');
      await bulkEntry.expectLoaded();
      await expect(page.getByTestId('session-focus-header')).toContainText(displayDate(observed));
      await expect(bulkEntry.startTime).toHaveValue('');
      await expect(bulkEntry.endTime).toHaveValue('');
      await expect(bulkEntry.startTime).not.toHaveAttribute('required', /.*/);
    });

    await test.step('Enter trial counts', async () => {
      await bulkEntry.enterCounts(target, { correct: 3, incorrect: 1 });
      await expect.poll(() => bulkEntry.enteredPoints()).toBe(4);
      await expect.poll(() => bulkEntry.score(program)).toBe('75%');
    });

    await test.step('Review and move to the summary', async () => {
      const enteredAt = new Date();
      await bulkEntry.reviewAndMoveToSummary();
      await sessionClose.expectLoaded();
      await expect(sessionClose.historicalTag).toBeVisible();
      await expect(page.getByTestId('session-focus-header')).toContainText(displayDate(observed));
      await expect(sessionClose.overallPercent).toHaveText('75%');
      await expect(sessionClose.scoredTotal).toHaveText(/\b4\b/);
      const times = (await page.getByTestId('session-audit-times-section').innerText()).replace(/\s+/g, ' ');
      const now = clockPatterns(enteredAt).concat(clockPatterns(new Date(enteredAt.getTime() - 60_000)));
      expect.soft(now.some((t) => times.includes(t)), `blank session times should not default to the entry time (${times})`).toBe(false);
    });

    await test.step('Finalize', async () => {
      await sessionClose.finalize();
    });

    await test.step('BCBA: the program data includes the chosen date', async () => {
      if (testData.accounts.rbt.usesRoleToggle) await shell.switchView('bcba');
      else await flows.signInAs('bcba');
      await flows.openClient(client);
      await flows.openProgram(program);
      await programDetails.openTab('data');
      await programData.expectLoaded();
      await expect(programData.observationRows.filter({ hasText: dayPattern(observed) }).first()).toBeVisible({ timeout: 30_000 });
      await flows.evidence('program data with backfilled date');
    });
  });
});
