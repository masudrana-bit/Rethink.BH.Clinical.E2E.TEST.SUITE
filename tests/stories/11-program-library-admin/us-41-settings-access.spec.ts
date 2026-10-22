import { test, expect } from '../../../src/fixtures/test';

const SECTIONS = ['program-library', 'data-collection-types', 'locations', 'custom-domains', 'abc-settings'] as const;

test.describe('US-41 Reach the clinical settings area', { tag: '@US-41' }, () => {
  test('TC-US41-01 Admin opens Settings from the navigation; every clinical section and the Locations list load', async ({ page, flows, shell, settings }) => {
    await flows.signInAs('admin');

    await test.step('Settings in the navigation opens the Program Library', async () => {
      await shell.goToNav('Settings');
      await expect(page).toHaveURL(/\/settings\/clinical\/program-library/);
      await settings.expectLoaded();
    });

    await test.step('Every clinical section is listed and opens', async () => {
      for (const section of SECTIONS) await expect(settings.section(section)).toBeVisible();
      for (const section of SECTIONS) await settings.openSection(section);
    });

    await test.step('Locations lists the organization locations (no test data)', async () => {
      await settings.openSection('locations');
      const names = await settings.locationNames();
      test.info().annotations.push({ type: 'locations', description: JSON.stringify(names.slice(0, 15)) });
      expect(names.length).toBeGreaterThan(0);
      expect.soft(names.filter((n) => /\btest\b|e2e|qa\b/i.test(n)), 'no test locations in the list').toEqual([]);
      await flows.evidence('settings-locations');
    });
  });

  test('TC-US41-02 Settings is not offered in the RBT view', async ({ page, flows, shell, settings }) => {
    await flows.signInAs('rbt');

    await test.step('RBT navigation has no Settings', async () => {
      await expect(shell.navLink('Settings')).toHaveCount(0);
    });

    await test.step('Typing the Settings URL does not open the admin area', async () => {
      await page.goto('/settings/clinical/program-library');
      await page.waitForLoadState('networkidle').catch(() => undefined);
      const opened = await settings.root.isVisible().catch(() => false);
      test.info().annotations.push({ type: 'RBT direct Settings URL', description: `${page.url()} — settings shell visible: ${opened}` });
      expect.soft(opened, 'Settings blocked for a non-admin role').toBe(false);
    });
  });
});
