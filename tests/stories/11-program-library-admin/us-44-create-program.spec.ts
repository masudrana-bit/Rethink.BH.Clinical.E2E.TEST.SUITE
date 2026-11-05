import { test, expect } from '../../../src/fixtures/test';
import { libraryProgramInput } from '../../../src/data/programs';

test.describe('US-44 Create a new program', { tag: '@US-44' }, () => {
  test('TC-US44-01 [RHD-60124, RHD-60393, RHD-60394] Create a program with objectives, targets and a link material and save it as a draft', { tag: ['@xray', '@RHD-60124', '@RHD-60393', '@RHD-60394'] }, async ({ flows, programLibrary, programEditor }) => {
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

  test('TC-US44-02 [RHD-60393, RHD-60394] A saved draft reopens after a refresh with every field; changed targets are kept and Last edited updates', { tag: ['@xray', '@RHD-60393', '@RHD-60394'] }, async ({ page, flows, programLibrary, programEditor }) => {
    test.setTimeout(8 * 60_000);
    const input = libraryProgramInput('Library Draft Reopen');
    const [kept1, kept2, removed] = input.targets!;
    const added = 'Step four';
    const rowText = async () => (await programLibrary.rowByIndex(await programLibrary.rowIndex(input.title)).allInnerTexts()).join(' | ').replace(/\s+/g, ' ');
    let domain = '';
    let area = '';
    let before = '';

    await test.step('Create with category, domain, area, goal, 2 objectives, 3 custom targets and a link; save as draft', async () => {
      await flows.signInAs('admin');
      await programLibrary.open();
      await programLibrary.openNewProgram();
      await programEditor.fill(input);
      domain = (await programEditor.domain.innerText()).trim();
      area = (await programEditor.area.innerText()).trim();
      await programEditor.saveDraft();
      await programLibrary.typeSearch(input.title);
      expect(await programLibrary.statusOf(input.title)).toMatch(/draft/i);
      before = await rowText();
      test.info().annotations.push({ type: 'columns', description: JSON.stringify(await programLibrary.columnHeaders()) });
      test.info().annotations.push({ type: 'row after create', description: before });
      test.info().annotations.push({ type: 'file material', description: 'not offered: lesson materials take links only' });
    });

    await test.step('Refresh and reopen the draft: every field was kept', async () => {
      await page.reload();
      await programLibrary.expectLoaded();
      await programLibrary.typeSearch(input.title);
      await programLibrary.edit(input.title);
      await expect(programEditor.title).toHaveValue(input.title);
      await expect(programEditor.goal).toHaveValue(input.goal);
      await expect(programEditor.category).toContainText(input.category);
      await expect(programEditor.domain).toHaveText(domain);
      await expect(programEditor.area).toHaveText(area);
      const fieldValues = await programEditor.form.locator('input, textarea').evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value));
      test.info().annotations.push({ type: 'field values after reopen', description: JSON.stringify(fieldValues.filter(Boolean)) });
      expect(fieldValues).toEqual(expect.arrayContaining(input.objectives!));
      for (const target of input.targets!) await expect(programEditor.targetCatalog).toContainText(target);
      await expect(programEditor.form).toContainText(input.materialUrl!.title);
    });

    await test.step(`Change the targets (remove "${removed}", add "${added}") and save`, async () => {
      await page.getByTestId(`staged-target-remove-${removed}`).click();
      await expect(programEditor.targetCatalog).not.toContainText(removed);
      await programEditor.bulkTargets.addTargets([added]);
      await expect(programEditor.targetCatalog).toContainText(added);
      await programEditor.saveChanges();
    });

    await test.step('Reopen: the target changes were kept and Last edited updated', async () => {
      await programLibrary.typeSearch(input.title);
      const after = await rowText();
      test.info().annotations.push({ type: 'row after edit', description: after });
      expect.soft(after, 'Last edited changes after saving the draft again').not.toBe(before);
      await programLibrary.edit(input.title);
      for (const target of [kept1, kept2, added]) await expect(programEditor.targetCatalog).toContainText(target);
      await expect(programEditor.targetCatalog).not.toContainText(removed);
      await flows.evidence('draft-reopened-after-edit');
    });

    await test.step('Clean-up: publish, then deactivate (drafts cannot be deleted)', async () => {
      await programEditor.publish();
      await expect.poll(async () => {
        await programLibrary.typeSearch(input.title);
        return programLibrary.statusOf(input.title);
      }, { timeout: 60_000 }).toMatch(/active|published/i);
      test.info().annotations.push({ type: 'cleanup', description: await programLibrary.retire(input.title) });
    });
  });
});
