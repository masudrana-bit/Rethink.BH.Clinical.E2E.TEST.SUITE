import { test, expect } from '../../../src/fixtures/test';

test.describe('US-43 Find a program in the catalog', { tag: '@US-43' }, () => {
  test('TC-US43-01 Search by name, filter by category / domain / area, and clear back to the full catalog', async ({ page, flows, programLibrary }) => {
    await flows.signInAs('admin');
    await programLibrary.open();
    const { total } = await programLibrary.shownCount();
    const titles = (await programLibrary.titles()).slice(0, 10);
    const rows = [];
    for (const title of titles) rows.push(await programLibrary.readRow(title));
    const categorized = (r: { category: string }) => Boolean(r.category) && r.category !== '—';
    // A blank category is shown as "—" but the Category filter has no such option.
    let first = rows.find((r) => categorized(r) && r.domain && r.domain !== '—') ?? rows.find(categorized) ?? rows[0];
    if (!categorized(first)) {
      const category = (await programLibrary.filterOptions('category')).find((o) => o && !/^All /.test(o));
      if (category) first = { ...first, category, domain: '' };
    }
    const keyword = first.title.split(/\s+/).find((w) => w.length > 4) ?? first.title;

    await test.step(`Search "${keyword}" narrows the grid to matching programs`, async () => {
      await programLibrary.typeSearch(keyword);
      const unmatched = async () => (await programLibrary.titles()).filter((t) => !t.toLowerCase().includes(keyword.toLowerCase()));
      await expect.poll(unmatched, { message: `every listed program mentions "${keyword}"`, timeout: 30_000 }).toEqual([]);
      const titles = await programLibrary.titles();
      test.info().annotations.push({ type: 'search results', description: `${titles.length}: ${JSON.stringify(titles.slice(0, 5))}` });
      expect(titles.length).toBeGreaterThan(0);
    });

    await test.step('No match shows an empty grid', async () => {
      await programLibrary.typeSearch('zzz-no-such-program-zzz');
      await expect(programLibrary.rows).toHaveCount(0);
      expect((await programLibrary.shownCount()).shown).toBe(0);
    });

    await test.step('Clear the search: full catalog again', async () => {
      await programLibrary.typeSearch('');
      await expect.poll(async () => (await programLibrary.shownCount()).shown).toBe(total);
    });

    await test.step(`Category "${first.category}" filter keeps only that category`, async () => {
      await programLibrary.filterBy('category', first.category);
      const shownCategories = async () => [...new Set(await programLibrary.columnValues('category'))].filter((c) => c && c !== 'Category');
      await expect.poll(shownCategories, { message: `only "${first.category}" programs listed`, timeout: 120_000 }).toEqual([first.category]);
    });

    await test.step('Domain and area filters offer options for the chosen category (NGC-23, NGC-69)', async () => {
      const domains = (await programLibrary.filterOptions('domain')).filter((o) => !/^All /.test(o));
      const areas = (await programLibrary.filterOptions('area')).filter((o) => !/^All /.test(o));
      test.info().annotations.push({ type: 'filters', description: `domains ${JSON.stringify(domains.slice(0, 10))}; areas ${JSON.stringify(areas.slice(0, 10))}` });
      expect(domains.length).toBeGreaterThan(0);
      expect.soft(areas.length, 'area filter has options').toBeGreaterThan(0);
      if (first.domain && first.domain !== '—') {
        await programLibrary.filterBy('domain', first.domain);
        const shownDomains = async () => [...new Set(await programLibrary.columnValues('domain'))].filter((d) => d && d !== 'Domain');
        await expect.poll(shownDomains, { message: `only "${first.domain}" programs listed`, timeout: 120_000 }).toEqual([first.domain]);
      }
      await flows.evidence('catalog-filtered');
    });
  });
});
