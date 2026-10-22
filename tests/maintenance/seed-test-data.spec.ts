import { test, expect } from '../../src/fixtures/test';

/**
 * Creates the seeded programs the story tests expect on the seeded and group clients, when they are missing.
 * Idempotent and permanent: programs are renamed from "E2E-…" so cleanup never deletes them.
 * Run: npm run test:dev3 -- tests/maintenance/seed-test-data.spec.ts --project=maintenance
 */
test('seed the test clients with an opportunity-based and a task-analysis program', async ({ flows, plan, programDetails, testData }) => {
  test.setTimeout(20 * 60_000);
  const { obProgram, obTarget, taProgram } = testData.seeded;
  // The session stories score this program with Correct / Incorrect buttons, so it must not collect prompts.
  const ob = { name: obProgram, type: 'opportunity-based' as const, targets: [obTarget, 'Toy items'], prompts: false };
  const ta = { name: taProgram, type: 'task-analysis' as const, targets: ['Turn on water', 'Wet hands', 'Dry hands'] };
  // Only the seeded client is ours to repair; on the group client an existing program is left alone.
  const clients = [
    { id: testData.clients.seeded, seeds: [ob, ta], repair: true },
    { id: testData.clients.group, seeds: [ob], repair: false },
  ];
  await flows.signInAs('bcba');

  for (const client of clients) {
    await flows.openClientByUrl(client.id);
    for (const seed of client.seeds) {
      await plan.showTimeline('current');
      if (client.repair && 'prompts' in seed && (await plan.railMatches(seed.name).count())) {
        await plan.railItem(seed.name).click();
        await programDetails.expectLoaded();
        await expect(programDetails.dataSettings).toContainText(/Opportunity Based/i, { timeout: 30_000 });
        if (/prompt|\b[1-9]\d* optional dimension/i.test(await programDetails.dataSettings.innerText())) {
          await programDetails.deleteProgram(seed.name);
          test.info().annotations.push({ type: 'seed', description: `${client.id}: deleted "${seed.name}", it collected prompts` });
          await flows.openClientByUrl(client.id);
          await plan.showTimeline('current');
        }
      }
      if (await plan.railMatches(seed.name).count()) {
        test.info().annotations.push({ type: 'seed', description: `${client.id}: "${seed.name}" already on the plan` });
        continue;
      }
      await flows.createCollectionProgram(seed.type, { label: seed.name, targets: seed.targets, prompts: 'prompts' in seed ? seed.prompts : undefined });
      await programDetails.renameProgram(seed.name);
      flows.keepCreatedPrograms();
      await expect(programDetails.title).toContainText(seed.name);
      test.info().annotations.push({ type: 'seed', description: `${client.id}: created "${seed.name}" with ${seed.targets.join(', ')}` });
    }
    await flows.openClientByUrl(client.id);
    for (const seed of client.seeds) await expect(plan.railItem(seed.name)).toBeVisible();
  }
});
