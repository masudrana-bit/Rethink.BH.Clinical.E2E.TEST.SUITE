import { test, expect } from '../../../src/fixtures/test';
import { createPages } from '../../../src/fixtures/pages';

test.describe('US-26 Enter the app from a BH tile already authenticated', { tag: '@US-26' }, () => {
  test('TC-US26-01 Signed-out deep link asks for the BH hand-off; after sign-in the session is reused without a second sign-in', async ({ page, context, flows, signIn, shell, workspace, analyze, testData }) => {
    const client = testData.clients.seeded;

    await test.step('Signed-out deep link lands on the sign-in hand-off screen', async () => {
      await page.goto(`/clients/${client}/analyze-data`);
      await expect(page).toHaveURL(/\/sign-in/);
      await expect(signIn.heading).toBeVisible();
      await expect(page.getByText(/Open Clinical from your Rethink dashboard/i)).toBeVisible();
      test.info().annotations.push({ type: 'dev2', description: `sign-in options: ${await signIn.previewSignInLink.innerText()} (no BH tile hand-off, NGC-66)` });
    });

    await test.step('Sign in and open Analyze Data for the client', async () => {
      await flows.signInAs('bcba');
      await expect(shell.userName).not.toBeEmpty();
      await flows.openClient(client);
      await workspace.openTab('analyze-data');
      await analyze.expectLoaded();
    });

    await test.step('Reload keeps the session', async () => {
      await page.reload();
      await expect(page).toHaveURL(/\/analyze-data/);
      await analyze.expectLoaded();
      await expect(signIn.heading).toBeHidden();
    });

    await test.step('A second tab opens signed in', async () => {
      const second = await context.newPage();
      await second.goto('/clients');
      const secondPages = createPages(second);
      await secondPages.clientsList.expectLoaded();
      await expect(secondPages.signIn.heading).toBeHidden();
      await second.close();
      await page.reload();
      await analyze.expectLoaded();
    });
  });

  test('TC-US26-02 The user lands with the correct role; the RBT view lands on RBT Home', async ({ page, flows, shell, rbtHome }) => {
    await test.step('BCBA lands on the clinical shell', async () => {
      await flows.signInAs('bcba');
      await expect(page).not.toHaveURL(/\/rbt(\/|$)/);
      await expect(shell.navLink('Clients')).toBeVisible();
      await shell.userMenuTrigger.click();
      const role = (await shell.userRole.innerText().catch(() => '')).trim();
      test.info().annotations.push({ type: 'user menu role', description: role });
      expect(role, 'user menu shows a role').not.toBe('');
      expect.soft(role, 'role is shown by name, not an internal id').toMatch(/bcba|clinic|supervisor|analyst|admin|director|lead/i);
      await page.keyboard.press('Escape');
    });

    await test.step('RBT view lands on RBT Home after a reload, without BCBA navigation', async () => {
      await flows.switchRole('rbt');
      await expect(page).toHaveURL(/\/rbt/);
      await rbtHome.expectLoaded();
      await expect(shell.navLink('Settings')).toHaveCount(0);
      await page.reload();
      await expect(page).toHaveURL(/\/rbt/);
      await rbtHome.expectLoaded();
    });

    await test.step('Back to the BCBA view', async () => {
      await flows.switchRole('bcba');
      await expect(shell.navLink('Clients')).toBeVisible();
    });
  });

  test('TC-US26-03 Header link back to Rethink BH; the session survives an idle gap', async ({ page, flows, shell, signIn, testData }) => {
    const idleMinutes = Number(process.env.SESSION_IDLE_MINUTES ?? '2');
    test.setTimeout((idleMinutes + 5) * 60_000);
    await flows.signInAs('bcba');

    await test.step('Rethink BH switch opens the BH dashboard in a new tab', async () => {
      await expect(shell.legacyBhLink).toBeVisible();
      const href = (await shell.legacyBhLink.getAttribute('href')) ?? '';
      test.info().annotations.push({ type: 'BH link', description: href });
      expect(href).toMatch(/^https:\/\/.+/);
      expect(href).not.toContain(new URL(testData.baseUrl).host);
      await expect(shell.legacyBhLink).toHaveAttribute('target', '_blank');
    });

    await test.step(`Idle for ${idleMinutes} minute(s), then keep working without signing in again`, async () => {
      await page.waitForTimeout(idleMinutes * 60_000);
      await flows.openClient(testData.clients.seeded);
      await expect(signIn.heading).toBeHidden();
      await expect(page.getByText(/session (has )?expired|signed out/i)).toHaveCount(0);
    });
  });

  test.fixme('TC-US26-04 Launch from the BH dashboard tile — manual: no BH tile hand-off on dev2 (NGC-66)', async () => {});
  test.fixme('TC-US26-05 No forced sign-out over a 90-minute session with idle gaps — manual long-running check', async () => {});
});
