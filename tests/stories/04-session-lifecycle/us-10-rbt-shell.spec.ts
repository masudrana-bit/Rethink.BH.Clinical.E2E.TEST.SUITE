import { test, expect } from '../../../src/fixtures/test';

test.describe('US-10 Access the RBT shell and navigate to sessions', { tag: '@US-10' }, () => {
  test('TC-US10-01 RBT lands on RBT home and navigates the RBT shell', async ({ page, flows, shell, rbtHome, rbtSessions, clientsList }) => {
    let rowsBeforeRefresh = 0;

    await test.step('Sign in and enter the RBT view', async () => {
      await flows.signInAs('rbt', { reloadAfterToggle: false });
      await rbtHome.expectLoaded();
      await expect(page.getByTestId('rbt-shell-header')).toBeVisible();
      await expect(page.getByTestId('app-shell-nav')).toBeHidden();
      for (const item of ['Home', 'Sessions', 'Clients']) await expect(shell.navLink(item)).toBeVisible();
      for (const bcbaOnly of ['Staff', 'Settings']) await expect(shell.navLink(bcbaOnly)).toHaveCount(0);
    });

    await test.step('Today\'s schedule loads without a refresh', async () => {
      await expect(rbtHome.scheduledRows.first().or(page.getByTestId('scheduled-sessions-empty'))).toBeVisible();
      await page.waitForTimeout(5_000);
      rowsBeforeRefresh = await rbtHome.scheduledRows.count();
    });

    await test.step('Refresh keeps the RBT home (NGC-47) and shows the same schedule', async () => {
      await page.reload();
      await rbtHome.expectLoaded();
      await expect(page.getByTestId('rbt-shell-header')).toBeVisible();
      await expect(rbtHome.scheduledRows.first().or(page.getByTestId('scheduled-sessions-empty'))).toBeVisible();
      await page.waitForTimeout(3_000);
      const rowsAfterRefresh = await rbtHome.scheduledRows.count();
      expect.soft(rowsBeforeRefresh, 'schedule should load after switching to the RBT view without a refresh').toBe(rowsAfterRefresh);
      if (rowsBeforeRefresh !== rowsAfterRefresh) {
        test.info().annotations.push({ type: 'defect', description: `RBT Home showed ${rowsBeforeRefresh} scheduled sessions until refreshed (${rowsAfterRefresh} after refresh)` });
      }
    });

    await test.step('Navigate Sessions, Clients and back Home', async () => {
      await shell.goToNav('Sessions');
      await rbtSessions.expectLoaded();
      await expect(rbtSessions.startLiveButton).toBeVisible();
      await expect(rbtSessions.postSessionEntry).toBeVisible();
      await shell.goToNav('Clients');
      await expect(page).toHaveURL(/\/rbt\/clients/);
      await clientsList.expectLoaded();
      await expect(clientsList.root).toContainText('Your assigned clients');
      await shell.goToNav('Home');
      await rbtHome.expectLoaded();
    });
    await flows.evidence('RBT home');
  });

  test('TC-US10-02 RBT view survives refresh on a deep page and re-login', async ({ page, flows, shell, signIn, clientsList, rbtHome, rbtSessions, testData }) => {
    await flows.signInAs('rbt');

    await test.step('Refresh on Sessions stays in the RBT shell (NGC-47)', async () => {
      await shell.goToNav('Sessions');
      await rbtSessions.expectLoaded();
      await page.reload();
      await rbtSessions.expectLoaded();
      await expect(page.getByTestId('rbt-shell-header')).toBeVisible();
    });

    await test.step('Sign out and sign in again', async () => {
      await shell.logOut();
      await signIn.open();
      await signIn.signIn(testData.accounts.rbt);
      await shell.expectSignedIn();
      if (testData.accounts.rbt.usesRoleToggle) {
        test.info().annotations.push({ type: 'observation', description: `after re-login the shared account landed on ${new URL(page.url()).pathname}` });
        if (/\/clients(\?|$)/.test(page.url())) await clientsList.expectLoaded();
        expect.soft(page.url(), 'the RBT view chosen before signing out is kept after re-login (NGC-47)').toMatch(/\/rbt/);
        if (!/\/rbt/.test(page.url())) {
          // The menu still reports the RBT view, so re-select it via the BCBA view.
          await shell.switchView('bcba').catch(() => undefined);
          await shell.switchView('rbt');
          await page.reload();
        }
      }
      await rbtHome.expectLoaded();
      await expect(page.getByTestId('rbt-shell-header')).toBeVisible();
    });
  });
});
