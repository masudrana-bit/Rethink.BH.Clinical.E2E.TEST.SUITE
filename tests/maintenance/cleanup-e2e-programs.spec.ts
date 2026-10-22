import { test, expect } from '../../src/fixtures/test';

/** Removes programs left behind by interrupted runs: only titles starting "E2E-<run id>-" on the test clients. */
test('Delete leftover E2E programs from the test clients', async ({ page, flows, plan, programDetails, testData }) => {
  test.setTimeout(30 * 60_000);
  await flows.signInAs('bcba');
  for (const clientId of new Set(Object.values(testData.clients))) {
    await flows.openClient(clientId);
    for (const timeline of ['current', 'inactive'] as const) {
      await plan.showTimeline(timeline);
      const leftovers = plan.railMatches(/E2E-\d{10}-/);
      while ((await leftovers.count()) > 0) {
        const title = (await leftovers.first().innerText()).split('\n').map((s) => s.trim()).find((s) => /^E2E-\d{10}-/.test(s))!;
        await plan.openProgram(title);
        await programDetails.deleteProgram(title);
        test.info().annotations.push({ type: 'deleted', description: `${clientId}: ${title}` });
        await page.goto(`/clients/${clientId}`);
        await plan.expectLoaded();
        await plan.showTimeline(timeline);
      }
      await expect(leftovers).toHaveCount(0);
    }
  }
});
