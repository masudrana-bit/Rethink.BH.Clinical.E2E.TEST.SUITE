import { test, expect } from '../../../src/fixtures/test';

const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

test.describe('US-37 Review behavior & replacement-skill trends side by side', { tag: '@US-37' }, () => {
  test('TC-US37-01 Behavior counts from a session appear in the plan Data tab beside the linked measures', async ({ flows, dataSheet, behavior, workspace, testData }) => {
    test.setTimeout(8 * 60_000);
    const client = testData.clients.seeded;
    const behaviorName = testData.seeded.behavior;
    await flows.signInAs('rbt');

    await test.step(`RBT: record ${behaviorName} twice in a session and finalize`, async () => {
      await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [testData.seeded.obProgram] }, behaviors: { [client]: [behaviorName] } });
      await dataSheet.addBehaviorCount(client, behaviorName);
      await dataSheet.addBehaviorCount(client, behaviorName);
      await expect.poll(() => dataSheet.behaviorValue(client, behaviorName)).toContain('2');
      await flows.concludeAndFinalize();
      await flows.switchRole('bcba');
    });

    await test.step('BCBA: Behavior Support → plan → Data tab', async () => {
      await flows.openClient(client);
      await workspace.openTab('behavior-support');
      await behavior.expectLoaded();
      await behavior.openPlan(behaviorName);
      await behavior.openTab('data');
      await expect(behavior.pairedCoGraph).toBeVisible();
      await expect.soft(behavior.coGraphChart, 'co-graph is labelled with the behavior for screen readers').toHaveAttribute('aria-label', new RegExp(`co-graph for .*${behaviorName}`, 'i'));
    });

    await test.step("Today's session is in Session Data with the count of 2", async () => {
      const first = (await behavior.sessionDataRows.first().innerText()).replace(/\s+/g, ' ');
      test.info().annotations.push({ type: 'latest session data row', description: first });
      expect(first).toMatch(new RegExp(`${behaviorName} Frequency 2\\b`));
      expect.soft(first, "session is dated with the user's local day (after local midnight dev2 shows the UTC day)").toContain(today());
    });

    await test.step('Replacement skill is graphed beside the behavior', async () => {
      const measures = (await behavior.linkedMeasureCount.innerText()).trim();
      const options = await behavior.graphOptions();
      test.info().annotations.push({ type: 'linked measures / graph options', description: `${measures}; ${JSON.stringify(options)}` });
      expect.soft(Number(measures.match(/\d+/)?.[0] ?? 0), 'a replacement skill is linked and graphed with the behavior').toBeGreaterThanOrEqual(2);
      await flows.evidence('behavior-data-tab');
    });
  });
});
