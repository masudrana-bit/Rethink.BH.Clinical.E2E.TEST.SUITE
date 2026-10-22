import { test, expect } from '../../../src/fixtures/test';
import { libraryProgramInput } from '../../../src/data/programs';

test.describe('US-44 Create a new program', { tag: '@US-44' }, () => {
  test('TC-US44-01 Create a program with objectives, targets and a link material and save it as a draft', async ({ flows, programLibrary, programEditor }) => {
    const input = libraryProgramInput('Library Draft');
    await flows.signInAs('admin');
    await programLibrary.open();

    await test.step('New Program explains Draft vs Publish and marks required fields', async () => {
      await programLibrary.openNewProgram();
      await expect(programEditor.createNotice).toContainText(/Save as Draft keeps this program here in Settings only/i);
      const required = await programEditor.requiredLabels();
      test.info().annotations.push({ type: 'required fields', description: JSON.stringify(required) });
      expect(required.join(' | ')).toMatch(/title|name/i);
      expect.soft(required.join(' | '), 'Category marked required').toMatch(/category/i);
    });

    await test.step('Every category offers domains', async () => {
      const categories = await programEditor.categories();
      const empty: string[] = [];
      for (const category of categories) if (!(await programEditor.domainsFor(category)).length) empty.push(category);
      test.info().annotations.push({ type: 'categories', description: `${JSON.stringify(categories)}; without domains: ${JSON.stringify(empty)}` });
      expect.soft(empty, 'categories with an empty Domain list (blocks save)').toEqual([]);
    });

    await test.step('Fill the program: goal, 2 objectives, 3 targets, a link material', async () => {
      await programEditor.fill(input);
    });

    await test.step('Save as Draft: listed in the catalog as Draft', async () => {
      await programEditor.saveDraft();
      await programLibrary.typeSearch(input.title);
      const row = await programLibrary.readRow(input.title);
      test.info().annotations.push({ type: 'draft row', description: JSON.stringify(row) });
      expect(row.status).toMatch(/draft/i);
      expect(row.category).toBe(input.category);
      await flows.evidence('library-draft');
    });

    await test.step('Reopen: values were kept', async () => {
      await programLibrary.edit(input.title);
      await expect(programEditor.title).toHaveValue(input.title);
      await expect(programEditor.goal).toHaveValue(input.goal);
      for (const t of input.targets ?? []) await expect(programEditor.form).toContainText(t);
      await expect(programEditor.form).toContainText(input.materialUrl!.title);
      await programEditor.cancel();
    });

    await test.step('Clean-up', async () => {
      test.info().annotations.push({ type: 'cleanup', description: await programLibrary.retire(input.title) });
    });
  });
});
