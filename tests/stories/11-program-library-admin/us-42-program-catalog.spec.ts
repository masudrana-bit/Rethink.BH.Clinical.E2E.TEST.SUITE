import { test, expect } from '../../../src/fixtures/test';

test.describe("US-42 View the organization's program catalog", { tag: '@US-42' }, () => {
  test('TC-US42-01 Catalog grid shows program details and row actions without side scrolling', async ({ flows, programLibrary }) => {
    await flows.signInAs('admin');
    await programLibrary.open();

    await test.step('Columns: name, category, domain, area, source, status (and author / last edited, NGC-68)', async () => {
      const headers = (await programLibrary.columnHeaders()).filter(Boolean);
      test.info().annotations.push({ type: 'columns', description: JSON.stringify(headers) });
      expect(headers).toEqual(expect.arrayContaining(['Program Name', 'Category', 'Domain', 'Area', 'Source', 'Status']));
      expect.soft(headers.some((h) => /author|created by/i.test(h)), 'author column').toBe(true);
      expect.soft(headers.some((h) => /last edited|updated/i.test(h)), 'last edited column').toBe(true);
    });

    await test.step('Grid lists the catalog with a count', async () => {
      const { shown, total } = await programLibrary.shownCount();
      test.info().annotations.push({ type: 'count', description: `${shown} of ${total}` });
      expect(total).toBeGreaterThan(0);
      expect(await programLibrary.rows.count()).toBeGreaterThan(0);
    });

    await test.step('Domain and area are filled for programs (NGC-68)', async () => {
      const domains = await programLibrary.columnValues('domain');
      const areas = await programLibrary.columnValues('area');
      const blankDomains = domains.filter((d) => !d || d === '—').length;
      const blankAreas = areas.filter((a) => !a || a === '—').length;
      test.info().annotations.push({ type: 'blank domain / area', description: `${blankDomains} / ${blankAreas} of ${domains.length}` });
      expect.soft(blankDomains, 'programs without a domain').toBe(0);
      expect.soft(blankAreas, 'programs without an area').toBe(0);
    });

    await test.step('Row actions are visible without horizontal scrolling (NGC-81)', async () => {
      const gridBox = (await programLibrary.grid.boundingBox())!;
      const firstTitle = (await programLibrary.titles())[0];
      const actions = await programLibrary.actions(firstTitle);
      await expect(actions.getByTestId('program-row-actions-edit')).toBeVisible();
      const box = (await actions.getByTestId('program-row-actions-more').boundingBox())!;
      expect.soft(box.x + box.width, 'actions inside the visible grid width').toBeLessThanOrEqual(gridBox.x + gridBox.width + 1);
      const scrollable = await programLibrary.grid.locator('.ag-body-horizontal-scroll-viewport').evaluate((el) => el.scrollWidth > el.clientWidth).catch(() => false);
      expect.soft(scrollable, 'no horizontal scroll needed').toBe(false);
      await flows.evidence('catalog-grid');
    });
  });
});
