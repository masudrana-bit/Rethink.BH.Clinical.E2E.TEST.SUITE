import { test, expect } from '../../../src/fixtures/test';
import { CollectionType } from '../../../src/pages/program/DataCollectionWizard';

const T = 'Touch nose';

test.describe('US-18 Record simple collection data (8 types)', { tag: '@US-18' }, () => {
  test('TC-US18-01 Quick-entry recorders: percentage, numeric, rating, tally @rbt', async ({ flows, dataSheet, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    const types: CollectionType[] = ['percentage', 'numeric', 'rating-scale', 'number-of-occurrences'];
    const programs: Partial<Record<CollectionType, string>> = {};
    await flows.signInAs('bcba');
    await flows.openClient(client);

    await test.step('BCBA: one program per quick-entry type', async () => {
      for (const type of types) programs[type] = await flows.createCollectionProgram(type);
    });

    await test.step('RBT: start a session with the four programs', async () => {
      await flows.switchRole('rbt');
      await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: Object.values(programs) as string[] } });
    });

    await test.step('Percentage: add, add again and undo', async () => {
      await dataSheet.recordQuickEntry(programs.percentage!, T, 'Percentage', 75);
      await expect.poll(() => dataSheet.simpleScore(programs.percentage!, T)).toBe('75% avg');
      await dataSheet.recordQuickEntry(programs.percentage!, T, 'Percentage', 25);
      await expect.poll(() => dataSheet.simpleScore(programs.percentage!, T)).toBe('50% avg');
      await dataSheet.undoSimpleEntry(programs.percentage!, T);
      await expect.poll(() => dataSheet.simpleScore(programs.percentage!, T)).toBe('75% avg');
    });

    await test.step('Numeric', async () => {
      await dataSheet.recordQuickEntry(programs.numeric!, T, 'Numeric value', 7);
      await expect.poll(() => dataSheet.simpleScore(programs.numeric!, T)).toBe('7 avg');
    });

    await test.step('Rating scale', async () => {
      await dataSheet.recordRating(programs['rating-scale']!, T, 3);
      await expect.poll(() => dataSheet.simpleScore(programs['rating-scale']!, T)).toBe('3 avg');
    });

    await test.step('Number of occurrences (tally)', async () => {
      await dataSheet.recordQuickEntry(programs['number-of-occurrences']!, T, 'Count', 3);
      await expect.poll(() => dataSheet.simpleScore(programs['number-of-occurrences']!, T)).toBe('3 avg');
    });

    await test.step('Conclude: summary lists the programs, then finalize', async () => {
      await flows.concludeToSummary();
      await expect.soft(sessionClose.programsTotal, 'programs with data in the summary').toHaveText(new RegExp(`\\b${types.length}\\b`));
      await flows.evidence('quick-entry-summary');
      await sessionClose.finalize();
    });

    await test.step('Clean-up', async () => {
      await flows.deleteCreatedPrograms();
    });
  });

  test('TC-US18-02 Timed recorders: frequency, interval, duration, frequency + duration @rbt', async ({ page, flows, dataSheet, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    const types: CollectionType[] = ['frequency-rate', 'interval', 'duration', 'frequency-duration'];
    const programs: Partial<Record<CollectionType, string>> = {};
    await flows.signInAs('bcba');
    await flows.openClient(client);

    await test.step('BCBA: one program per timed type', async () => {
      for (const type of types) programs[type] = await flows.createCollectionProgram(type);
    });

    await test.step('RBT: start a session with the four programs', async () => {
      await flows.switchRole('rbt');
      await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: Object.values(programs) as string[] } });
    });

    await test.step('Frequency', async () => {
      await dataSheet.recordFrequency(programs['frequency-rate']!, T, 4);
      await expect.poll(() => dataSheet.simpleScore(programs['frequency-rate']!, T)).toBe('4 times');
    });

    await test.step('Interval: two intervals marked "occurred"', async () => {
      await dataSheet.recordInterval(programs.interval!, T, true);
      await expect.poll(() => dataSheet.simpleScore(programs.interval!, T)).toBe('100% (1/1)');
      await dataSheet.recordInterval(programs.interval!, T, true);
      await expect.poll(() => dataSheet.simpleScore(programs.interval!, T)).toBe('100% (2/2)');
    });

    await test.step('Duration timer', async () => {
      await dataSheet.startDurationTimer(programs.duration!, T, 'High');
      await page.waitForTimeout(2_500);
      await dataSheet.stopDurationTimer(programs.duration!, T);
      expect(await dataSheet.durationTotal(programs.duration!, T)).toBeGreaterThan(0);
    });

    await test.step('Frequency + duration', async () => {
      await dataSheet.recordFrequencyDuration(programs['frequency-duration']!, T, 2);
      await expect.poll(() => dataSheet.simpleScore(programs['frequency-duration']!, T)).not.toBe('--');
    });

    await test.step('Conclude and finalize', async () => {
      await flows.concludeToSummary();
      await flows.evidence('timed-summary');
      await sessionClose.finalize();
    });

    await test.step('Clean-up', async () => {
      await flows.deleteCreatedPrograms();
    });
  });
});
