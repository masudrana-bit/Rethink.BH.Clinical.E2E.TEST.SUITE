import { test, expect } from '../../../src/fixtures/test';
import { LIBRARY_PROGRAMS } from '../../../src/data/programs';

test.describe('US-2 Search & browse the program library', { tag: '@US-2' }, () => {
  test('TC-US02-01 Browse System Programs, search by keyword and preview a program @smoke', async ({ page, flows, plan, addProgram, testData }) => {
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);

    await test.step('Open Add Program on System Programs', async () => {
      await plan.openAddProgram();
      await addProgram.expectLoaded();
      await expect(addProgram.sources).toContainText('System Programs');
      await expect(addProgram.sources).toContainText('My Programs');
      const headers = (await addProgram.table.locator('thead th').allInnerTexts()).map((h) => h.trim());
      expect(headers).toEqual(expect.arrayContaining(['Program Name', 'Category', 'Domain', 'Area', 'Author']));
      await expect(addProgram.search).toHaveAttribute('placeholder', /name, category, domain, area/);
    });

    await test.step('Keyword search returns matching rows within 3 seconds', async () => {
      const started = Date.now();
      await addProgram.searchFor(LIBRARY_PROGRAMS.search);
      expect.soft(Date.now() - started, 'library search should respond within 3 s (cross-cutting performance)').toBeLessThan(3_000);
      const names = await addProgram.rows.locator('[data-testid^="add-program-dialog-name-"]').allInnerTexts();
      expect(names.length).toBeGreaterThan(0);
      for (const name of names) expect(name).toMatch(/matching/i);
    });

    await test.step('Every row offers Add and Preview', async () => {
      const count = await addProgram.rows.count();
      await expect(addProgram.rows.locator('[data-testid^="add-program-dialog-add-"]')).toHaveCount(count);
      await expect(addProgram.rows.locator('[data-testid^="add-program-dialog-preview-"]')).toHaveCount(count);
    });

    await test.step('Preview shows the program details', async () => {
      const firstName = (await addProgram.rows.first().locator('[data-testid^="add-program-dialog-name-"]').innerText()).trim();
      const preview = await addProgram.preview(firstName);
      await expect(preview).toContainText(firstName);
      await flows.evidence('library preview');
      await addProgram.closePreview(preview);
    });

    await test.step('System programs have Domain and Area (NGC-22)', async () => {
      await expect(addProgram.row(/Matching Identical Pictures/)).toBeVisible();
      const cells = await addProgram.rowCells(/Matching Identical Pictures/);
      expect.soft(cells[2], 'Domain should not be blank (NGC-22)').not.toMatch(/^—?$/);
      expect.soft(cells[3], 'Area should not be blank (NGC-22)').not.toMatch(/^—?$/);
    });
  });

  test('TC-US02-02 Filter by Category / Domain / Area and switch to My Programs', async ({ flows, plan, addProgram, testData }) => {
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await plan.openAddProgram();
    await addProgram.expectLoaded();

    await test.step('Category filter lists the library categories', async () => {
      const categories = await addProgram.filterOptions('category');
      expect(categories).toEqual(expect.arrayContaining(['Skills']));
    });

    await test.step('Filtering by category narrows rows', async () => {
      await addProgram.filterBy('category', 'Skills');
      const categoryCells = await addProgram.rows.locator('td:nth-child(2)').allInnerTexts();
      for (const cell of categoryCells) expect(cell.trim()).toMatch(/Skills|—/);
    });

    await test.step('Domain filter is usable after a category is chosen', async () => {
      const domains = (await addProgram.filterOptions('domain')).filter((d) => !/^all domains$/i.test(d));
      expect(domains.length, 'Skills should offer domains (NGC-24)').toBeGreaterThan(0);
      await addProgram.filterBy('domain', domains[0]);
    });

    await test.step('Switch to My Programs', async () => {
      await addProgram.sources.getByText('My Programs', { exact: true }).click();
      await expect(addProgram.sources.locator('[aria-pressed=true], .p-highlight, [aria-checked=true]').first()).toContainText('My Programs');
      await addProgram.close();
    });
  });
});
