import { test, expect } from '../../src/fixtures/test';

/**
 * Creates the seeded programs the story tests expect on the seeded client, when they are missing.
 * Idempotent and permanent: programs are renamed from "E2E-…" so cleanup never deletes them.
 * Run: npm run test:dev3 -- tests/maintenance/seed-test-data.spec.ts --project=maintenance
 */
test('seed the test client with an opportunity-based and a task-analysis program', async ({ flows, plan, programDetails, testData }) => {
  test.setTimeout(15 * 60_000);
  const { obProgram, obTarget, taProgram } = testData.seeded;
  await flows.signInAs('bcba');
  await flows.openClientByUrl(testData.clients.seeded);

  const seeds = [
    { name: obProgram, type: 'opportunity-based' as const, targets: [obTarget, 'Toy items'], prompts: true },
    { name: taProgram, type: 'task-analysis' as const, targets: ['Turn on water', 'Wet hands', 'Dry hands'] },
  ];
  for (const seed of seeds) {
    await plan.showTimeline('current');
    if (await plan.railMatches(seed.name).count()) {
      test.info().annotations.push({ type: 'seed', description: `"${seed.name}" already on the plan` });
      continue;
    }
    await flows.createCollectionProgram(seed.type, { label: seed.name, targets: seed.targets, prompts: seed.prompts });
    await programDetails.renameProgram(seed.name);
    flows.keepCreatedPrograms();
    await expect(programDetails.title).toContainText(seed.name);
    test.info().annotations.push({ type: 'seed', description: `created "${seed.name}" with ${seed.targets.join(', ')}` });
  }
  await flows.openClientByUrl(testData.clients.seeded);
  for (const seed of seeds) await expect(plan.railItem(seed.name)).toBeVisible();
});
