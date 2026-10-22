import { test, expect } from '../../../src/fixtures/test';

test.describe('US-36 Review every program & behavior graph in one report', { tag: '@US-36' }, () => {
  test('TC-US36-01 Bulk Graphs lists every program and behavior, then respects a narrowed selection (NGC-89)', async ({ flows, workspace, analyze, testData }) => {
    const program = testData.seeded.obProgram;
    const behaviorName = testData.seeded.behavior;
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await workspace.openTab('analyze-data');
    await analyze.expectLoaded();

    let total = 0;
    await test.step('All programs and behaviors are in the report', async () => {
      await analyze.openMode('bulk');
      await analyze.chooseScope('both');
      await expect(analyze.bulkCount).toContainText(/program\(s\) and \d+ behavior\(s\)/);
      const text = await analyze.bulkCount.innerText();
      const [programs, behaviors] = [...text.matchAll(/(\d+)/g)].map((m) => Number(m[1]));
      total = programs + behaviors;
      test.info().annotations.push({ type: 'bulk count', description: text });
      expect(behaviors, 'behavior graphs included').toBeGreaterThan(0);
      await expect.poll(() => analyze.bulkCards.count(), { timeout: 30_000 }).toBeGreaterThan(0);
      expect(await analyze.seriesOptions(), 'program is selectable in the report').toEqual(expect.arrayContaining([expect.stringContaining(program)]));
    });

    await test.step('Narrow the selection to one program and one behavior', async () => {
      await analyze.selectOnlySeries([program, behaviorName]);
      await expect.soft(analyze.bulkCount, 'count follows the selection (NGC-89)').toContainText(/1 program\(s\) and 1 behavior\(s\)/);
      const titles = await analyze.bulkCardTitles();
      test.info().annotations.push({ type: 'cards after narrowing', description: `${titles.length} of ${total}: ${JSON.stringify(titles.slice(0, 5))}` });
      expect.soft(titles.length, 'only the selected graphs are shown (NGC-89)').toBe(2);
      expect(titles).toContain(program);
    });

    await test.step('Render all for printing', async () => {
      await analyze.bulkRenderAll.click();
      await expect(analyze.bulkCards.first()).toBeVisible();
      await flows.evidence('bulk-graphs');
    });
  });
});
