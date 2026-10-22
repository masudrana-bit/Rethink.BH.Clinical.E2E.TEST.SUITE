import * as fs from 'fs';
import { test, expect } from '../../src/fixtures/test';
import { COLLECTION_TYPE_LABELS } from '../../src/pages/program/DataCollectionWizard';

/**
 * Read-only: finds clients on the current environment that can serve as the seeded test data
 * (an active plan with an opportunity-based program, a task-analysis program and a behavior plan).
 * Run: npm run test:dev3 -- tests/maintenance/discover-test-data.spec.ts --project=maintenance
 * Writes reports/<env>-discovery.json after every client; copy the chosen values into .env.<env>.
 */
const MAX_CLIENTS = Number(process.env.DISCOVER_MAX ?? 40);
/** Comma-separated client ids to inspect directly, skipping the scan. */
const ONLY = (process.env.DISCOVER_CLIENTS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
/** Rail text is "<domain> <name> Date Last Recorded: …"; keep the name. */
const programName = (rail: string) => rail.replace(/\s*Date Last Recorded:.*$/, '').replace(/^Uncategorized\s+/, '').trim();
const DEEP = Number(process.env.DISCOVER_DEEP ?? 5);
const LABELS = Object.values(COLLECTION_TYPE_LABELS).sort((a, b) => b.length - a.length);
const firstLine = (e: unknown) => String(e).split('\n')[0].slice(0, 160);

test('discover seeded test data', async ({ page, flows, plan, workspace, programDetails, testData }) => {
  test.setTimeout(60 * 60_000);
  const out = `reports/${testData.name}-discovery.json`;
  const report = { env: testData.name, listed: 0, scanned: [] as unknown[], deep: [] as unknown[] };
  const save = () => fs.writeFileSync(out, JSON.stringify(report, null, 2));

  await flows.signInAs('bcba');
  await page.goto('/clients');
  const links = page.locator('[data-testid^="clients-list-link-"]');
  await expect(links.first()).toBeVisible({ timeout: 60_000 });
  const clients: { id: string; name: string }[] = [];
  for (const link of await links.all()) {
    const id = ((await link.getAttribute('data-testid')) ?? '').replace('clients-list-link-', '');
    if (id && id !== testData.clients.clean) clients.push({ id, name: (await link.innerText()).replace(/\s+/g, ' ').trim() });
  }
  report.listed = clients.length;

  const programsOf = async (id: string): Promise<string[]> => {
    await page.goto(`/clients/${id}`);
    await expect(plan.rail).toBeVisible({ timeout: 30_000 });
    await expect(plan.railItems.first().or(plan.railEmpty)).toBeVisible({ timeout: 30_000 });
    return plan.programNames();
  };

  const scanned: { id: string; name: string; programs: string[] }[] = [];
  const toScan = ONLY.length ? ONLY.map((id) => clients.find((c) => c.id === id) ?? { id, name: '' }) : clients.slice(0, MAX_CLIENTS);
  for (const c of toScan) {
    const programs = await programsOf(c.id).catch((e) => { report.scanned.push({ ...c, error: firstLine(e) }); return null; });
    if (programs) { scanned.push({ ...c, programs }); report.scanned.push({ ...c, programs }); }
    save();
  }

  for (const c of [...scanned].sort((a, b) => b.programs.length - a.programs.length).slice(0, DEEP).filter((c) => c.programs.length)) {
    const programs: unknown[] = [];
    const entry = { ...c, programs, behaviors: [] as string[] };
    report.deep.push(entry);
    try { await programsOf(c.id); } catch (e) { programs.push({ error: firstLine(e) }); save(); continue; }
    for (const [i, rail] of c.programs.slice(0, 20).entries()) {
      const name = programName(rail);
      try {
        const item = plan.railItems.nth(i);
        const id = (await item.getAttribute('data-testid'))?.match(/(\d+)$/)?.[1];
        await item.click();
        if (id) await expect(page).toHaveURL(new RegExp(`/programs/${id}(\\?|$)`));
        await programDetails.expectLoaded();
        await expect(programDetails.title).toContainText(name.slice(0, 20), { timeout: 20_000 }).catch(() => undefined);
        await expect.poll(() => programDetails.dataSettings.innerText().catch(() => ''), { timeout: 20_000 })
          .toMatch(new RegExp(LABELS.map((l) => l.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')).join('|') + '|No data collection configured'))
          .catch(() => undefined);
        const settings = (await programDetails.dataSettings.innerText({ timeout: 15_000 })).replace(/\s+/g, ' ');
        const targets = (await programDetails.targetsSection.innerText({ timeout: 10_000 }).catch(() => ''))
          .split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 8);
        programs.push({ name, type: LABELS.find((l) => settings.includes(l)) ?? 'unknown', targets });
      } catch (e) {
        programs.push({ name, type: 'error', error: firstLine(e) });
      }
      save();
    }
    try {
      await workspace.openTab('behavior-support');
      const cards = page.locator('[data-testid^="plan-card-"]');
      await expect(cards.first()).toBeVisible({ timeout: 20_000 });
      entry.behaviors = (await cards.allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim());
    } catch { /* no behavior plans */ }
    save();
  }
  test.info().annotations.push({ type: 'discovery', description: `${out}: ${clients.length} clients listed, ${scanned.length} scanned, ${report.deep.length} inspected` });
});
