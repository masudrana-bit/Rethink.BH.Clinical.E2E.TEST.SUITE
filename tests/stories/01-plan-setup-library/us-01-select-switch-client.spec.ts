import { test, expect } from '../../../src/fixtures/test';

test.describe('US-1 Select / switch active client context', { tag: '@US-1' }, () => {
  test('TC-US01-01 Find a client on the Clients page and open their workspace @smoke', async ({ flows, clientsList, workspace, shell, plan, testData }) => {
    await test.step('Sign in as BCBA and land on Clients', async () => {
      await flows.signInAs('bcba');
      await clientsList.expectLoaded();
    });

    await test.step('Clients table shows name, DOB, ID and status', async () => {
      expect(await clientsList.headers()).toEqual(['Client Name', 'D.O.B.', 'Client ID', 'Status']);
      const first = await clientsList.readRow(0);
      expect(first.name).not.toBe('');
      expect(first.dob).toMatch(/[A-Z][a-z]{2} \d{1,2}, \d{4}/);
      expect(first.status).toMatch(/Active|Inactive/);
    });

    const seededName = (await clientsList.clientLink(testData.clients.seeded).innerText()).replace(/\s+/g, ' ').trim();

    await test.step('Search by name, then clear filters', async () => {
      const total = await clientsList.rows.count();
      await clientsList.searchName(seededName.split(' ')[0]);
      expect(await clientsList.rows.count()).toBeLessThan(total);
      await clientsList.clearFilters.click();
      await expect(clientsList.rows).toHaveCount(total);
    });

    await test.step('Open the client workspace', async () => {
      await clientsList.openClient(testData.clients.seeded);
      await plan.expectLoaded();
      for (const tab of ['client-info', 'file-cabinet', 'sessions', 'skills-programs', 'behavior-support', 'analyze-data', 'reports'] as const) {
        await expect(workspace.tab(tab)).toBeVisible();
      }
    });

    await test.step('Header shows the client name and DOB', async () => {
      await expect(shell.clientSwitcher).toContainText(seededName.split(' ')[0]);
      await expect(shell.clientDob).toHaveText(/DOB [A-Z][a-z]{2} \d{1,2}, \d{4}/);
    });
    await flows.evidence('client workspace');
  });

  test('TC-US01-02 Switch client from the header and every tab reloads for the new client', async ({ page, flows, workspace, shell, plan, testData }) => {
    await flows.signInAs('bcba');
    const seededName = await flows.openClient(testData.clients.seeded);
    const seededPrograms = await plan.programNames();

    await test.step('Go to Sessions and switch to the clean client', async () => {
      await workspace.openTab('sessions');
      await shell.clientSwitcher.click();
      const option = page.getByRole('option').filter({ hasNotText: seededName }).first();
      const targetName = (await option.innerText()).trim();
      await option.click();
      await expect(shell.clientSwitcher).toContainText(targetName.split(' ')[0]);
      await expect(page).toHaveURL(/\/clients\/\d+\/sessions/);
      await expect(page).not.toHaveURL(new RegExp(`/clients/${testData.clients.seeded}/`));
      await expect(shell.clientDob).toBeVisible();
    });

    await test.step('Every tab is scoped to the new client', async () => {
      const newClientId = page.url().match(/clients\/(\d+)/)![1];
      for (const tab of ['skills-programs', 'behavior-support', 'analyze-data'] as const) {
        await workspace.openTab(tab);
        await expect(page).toHaveURL(new RegExp(`/clients/${newClientId}`));
      }
      await workspace.openTab('skills-programs');
      await plan.expectLoaded();
      const programs = await plan.programNames();
      // Clients may share program titles, so require the lists to differ rather than to be disjoint.
      expect(programs).not.toEqual(seededPrograms);
      expect(seededPrograms.filter((name) => !programs.includes(name)).length).toBeGreaterThan(0);
    });

    await test.step('Switch back to the seeded client', async () => {
      await shell.switchClient(new RegExp(seededName.split(' ')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      await plan.expectLoaded();
      expect(await plan.programNames()).toEqual(seededPrograms);
    });
  });

  test('TC-US01-03 Search by Client ID and hand-off to legacy BH', async ({ page, flows, clientsList, workspace }) => {
    await flows.signInAs('bcba');
    await clientsList.expectLoaded();

    const withNumber = page.locator('[data-testid^="clients-list-client-number-"]').filter({ hasText: /\d+/ }).first();
    const clientNumber = (await withNumber.innerText()).trim();
    const internalId = (await withNumber.getAttribute('data-testid'))!.replace('clients-list-client-number-', '');

    await test.step('Search by Client ID', async () => {
      await clientsList.searchClientId(clientNumber);
      const ids = await page.locator('[data-testid^="clients-list-client-number-"]').allInnerTexts();
      for (const id of ids) expect(id).toContain(clientNumber);
    });

    await test.step('Client Info and File Cabinet open legacy BH for the same client in a new tab', async () => {
      await clientsList.openClient(internalId);
      expect(await workspace.openLegacyTab('client-info')).toMatch(new RegExp(`/core/clients/${internalId}$`));
      expect(await workspace.openLegacyTab('file-cabinet')).toMatch(new RegExp(`/core/clients/${internalId}/files`));
    });
  });
});
