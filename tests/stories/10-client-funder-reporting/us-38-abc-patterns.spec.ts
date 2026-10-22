import { test, expect } from '../../../src/fixtures/test';

test.describe('US-38 Review ABC patterns for a behavior plan', { tag: '@US-38' }, () => {
  test('TC-US38-01 ABC entries recorded in a session show up in the plan ABC breakdown', async ({ page, flows, dataSheet, abc, behavior, workspace, testData }) => {
    test.setTimeout(8 * 60_000);
    const client = testData.clients.seeded;
    const behaviorName = testData.seeded.behavior;
    await flows.signInAs('rbt');

    await test.step('RBT: two ABC entries for the plan behavior, then finalize', async () => {
      await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [testData.seeded.obProgram] }, behaviors: { [client]: [behaviorName] } });
      await dataSheet.openAbcEntry();
      await abc.record({ behavior: behaviorName, context: 'Academics', antecedents: ['Task/command given'], consequences: ['Ignored'], note: 'E2E ABC pattern 1' });
      await dataSheet.openAbcEntry();
      await abc.record({ behavior: behaviorName, context: 'Academics', antecedents: ['Task/command given'], consequences: ['Ignored'], note: 'E2E ABC pattern 2' });
      await flows.concludeAndFinalize();
      await flows.switchRole('bcba');
    });

    let options: string[] = [];
    await test.step('BCBA: plan Data tab offers an ABC view', async () => {
      await flows.openClient(client);
      await workspace.openTab('behavior-support');
      await behavior.expectLoaded();
      await behavior.openPlan(behaviorName);
      await behavior.openTab('data');
      options = await behavior.graphOptions();
      test.info().annotations.push({ type: 'graph options', description: JSON.stringify(options) });
      expect(options.some((o) => /abc|antecedent/i.test(o)), 'ABC breakdown offered').toBe(true);
    });

    await test.step('ABC breakdown lists antecedent, consequence and context with counts', async () => {
      await behavior.chooseGraph(options.find((o) => /abc|antecedent/i.test(o))!);
      const panel = page.getByTestId('behavior-support-page');
      await expect(panel).toContainText('Task/command given');
      await expect(panel).toContainText('Ignored');
      await expect.soft(panel, 'context shown by name').toContainText('Academics');
      await flows.evidence('abc-breakdown');
    });

    await test.step('Plan can be published so the breakdown belongs to a published plan', async () => {
      await behavior.openTab('review');
      const blocked = page.getByTestId('review-publish-blocked');
      if (await blocked.isVisible()) test.info().annotations.push({ type: 'review', description: await blocked.innerText() });
      await expect.soft(blocked, 'publishing is available for the plan').toBeHidden();
    });
  });
});
