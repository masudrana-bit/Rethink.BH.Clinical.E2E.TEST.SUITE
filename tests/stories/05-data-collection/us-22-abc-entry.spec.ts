import { test, expect } from '../../../src/fixtures/test';
import { uniqueName } from '../../../src/helpers/data-factory';

test.describe('US-22 Record an in-session ABC entry', { tag: '@US-22' }, () => {
  test('TC-US22-01 Record a plan-defined and a novel behavior; audit shows context names @rbt', async ({ flows, dataSheet, abc, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    const behavior = testData.seeded.behavior;
    const novel = uniqueName('Novel Behavior');
    await flows.signInAs('rbt');
    await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [testData.seeded.obProgram] }, behaviors: { [client]: [behavior] } });
    const clientName = await dataSheet.title();

    await test.step('Dialog opens for the session client and suggests plan behaviors', async () => {
      await dataSheet.openAbcEntry();
      if (await abc.clientSelect.count()) expect(await abc.selectedClient()).toBe(clientName);
      expect(await abc.suggestedBehaviors()).toContain(behavior);
    });

    await test.step('Save an ABC entry for the plan-defined behavior', async () => {
      await abc.record({ behavior, context: 'Academics', antecedents: ['Task/command given'], consequences: ['Ignored'], functions: ['Avoiding something'], note: 'E2E plan-defined ABC entry' });
    });

    await test.step('Save an ABC entry for a novel (emerging) behavior', async () => {
      await dataSheet.openAbcEntry();
      await abc.record({ behavior: novel, isNovel: true, context: 'Home', antecedents: ['Denied access to item'], consequences: ['Redirected to activity'] });
    });

    await test.step('Audit list names both entries with their context', async () => {
      await flows.concludeToSummary();
      await expect(sessionClose.auditEntry(behavior)).toBeVisible();
      await expect(sessionClose.auditEntry(novel)).toBeVisible();
      const entries = await sessionClose.auditEntries();
      const abcEntries = entries.filter((e) => e.includes(behavior) || e.includes(novel));
      for (const entry of abcEntries) expect.soft(entry, 'ABC context shown by name, not id').not.toMatch(/Context:\s*\d+\b/);
      expect.soft(abcEntries.some((e) => e.includes('Academics')), `"Academics" in ${JSON.stringify(abcEntries)}`).toBe(true);
      expect.soft(abcEntries.some((e) => e.includes('Home')), `"Home" in ${JSON.stringify(abcEntries)}`).toBe(true);
      await flows.evidence('abc-audit');
    });

    await test.step('Finalize', async () => {
      await sessionClose.finalize();
    });
  });

  test('TC-US22-02 In a group session, Record ABC Data from a client\'s card targets that client @rbt', async ({ flows, dataSheet, abc, sessionClose, testData }) => {
    const seeded = testData.clients.seeded;
    const group = testData.clients.group;
    const program = testData.seeded.obProgram;
    const behavior = testData.seeded.behavior;
    await flows.signInAs('rbt');
    await flows.startLiveSessionAsRbt({ clientIds: [group, seeded], programs: { [group]: [program], [seeded]: [program] }, behaviors: { [seeded]: [behavior] } });
    const seededName = await dataSheet.clientName(seeded);

    await test.step('Record ABC Data from the seeded client\'s card pre-selects that client', async () => {
      await dataSheet.openAbcEntryFor(seeded);
      const selected = await abc.selectedClient();
      expect.soft(selected, 'ABC dialog opened from a client card should target that client').toBe(seededName);
      if (selected !== seededName) {
        test.info().annotations.push({ type: 'workaround', description: `dialog pre-selected "${selected}"; picked "${seededName}" manually` });
        await abc.chooseClient(seededName);
      }
    });

    await test.step('Save the entry for the plan behavior', async () => {
      await abc.record({ behavior, context: 'Lunch/recess' });
    });

    await test.step('Summary lists the entry under the seeded client', async () => {
      await flows.concludeToSummary();
      await sessionClose.showClient(seeded);
      await expect(sessionClose.auditEntry(behavior)).toBeVisible();
    });

    await test.step('Finalize every client', async () => {
      await flows.finalizeAll();
    });
  });
});
