import { test, expect } from '../../../src/fixtures/test';
import { libraryProgramInput } from '../../../src/data/programs';

test.describe('US-46 Publish a draft', { tag: '@US-46' }, () => {
  test('TC-US46-01 [RHD-60126] A draft is not offered to clients; publishing asks for confirmation and makes it available in Add Program', { tag: ['@xray', '@RHD-60126'] }, async ({ flows, programLibrary, programEditor, testData }) => {
    test.setTimeout(8 * 60_000);
    const input = libraryProgramInput('Library Publish');
    const client = testData.clients.clean;
    await flows.signInAs('admin');
    await programLibrary.open();

    await test.step('Create and save a draft', async () => {
      await programLibrary.openNewProgram();
      await programEditor.fill(input);
      await programEditor.saveDraft();
      await programLibrary.typeSearch(input.title);
      expect(await programLibrary.statusOf(input.title)).toMatch(/draft/i);
    });

    await test.step('Draft is not in the client Add Program catalog', async () => {
      const offered = await flows.addProgramCatalogOffers(client, input.title);
      expect(offered, 'draft offered to clients').toEqual([]);
    });

    await test.step('Publish from the editor: confirmation first', async () => {
      await programLibrary.open();
      await programLibrary.typeSearch(input.title);
      await programLibrary.edit(input.title);
      const confirmation = await programEditor.publish();
      test.info().annotations.push({ type: 'publish confirmation', description: confirmation || '(none)' });
      expect.soft(confirmation, 'confirmation before publishing').not.toBe('');
      await programLibrary.typeSearch(input.title);
      expect(await programLibrary.statusOf(input.title)).toMatch(/active|published/i);
    });

    await test.step('Published program is offered in the client Add Program catalog', async () => {
      const offered = await flows.addProgramCatalogOffers(client, input.title);
      test.info().annotations.push({ type: 'offered in', description: JSON.stringify(offered) });
      expect(offered.length, 'published program offered to clients').toBeGreaterThan(0);
      await flows.evidence('published-in-catalog');
    });

    await test.step('Clean-up', async () => {
      await programLibrary.open();
      test.info().annotations.push({ type: 'cleanup', description: await programLibrary.retire(input.title) });
    });
  });

  test('TC-US46-02 [RHD-60388] Publish a revision of a published program; clients see the updated version', { tag: ['@xray', '@RHD-60388'] }, async ({ page, flows, programLibrary, programEditor, plan, addProgram, testData }) => {
    test.setTimeout(10 * 60_000);
    const input = libraryProgramInput('Library Revision');
    const addedTarget = 'Step four';
    const client = testData.clients.clean;
    await flows.signInAs('admin');
    await programLibrary.open();

    await test.step('Create and publish a program', async () => {
      await programLibrary.openNewProgram();
      await programEditor.fill(input);
      await programEditor.publish();
      await expect.poll(async () => {
        await programLibrary.typeSearch(input.title);
        return programLibrary.statusOf(input.title);
      }, { timeout: 60_000 }).toMatch(/active|published/i);
    });

    await test.step('Open a draft revision and add a target', async () => {
      const labels = await programLibrary.rowActionLabels(input.title);
      test.info().annotations.push({ type: 'published row actions', description: JSON.stringify(labels) });
      const revision = labels.find((l) => /revision/i.test(l));
      if (revision) await programLibrary.runRowAction(input.title, revision);
      else await programLibrary.edit(input.title);
      await expect(programEditor.form).toBeVisible();
      await programEditor.bulkTargets.addTargets([addedTarget]);
      await expect(programEditor.targetCatalog).toContainText(addedTarget);
    });

    await test.step('Save the revision: the published program shows "Draft pending"', async () => {
      const { mode } = await programEditor.publishOrSaveChanges();
      if (mode === 'saved') {
        await programLibrary.typeSearch(input.title);
        await expect.poll(async () => (await programLibrary.readRow(input.title)).title).toMatch(/draft pending/i);
      }
    });

    await test.step('Publish the revision: confirmation first, then Published with no draft pending', async () => {
      if (/draft pending/i.test((await programLibrary.readRow(input.title)).title)) {
        await programLibrary.edit(input.title);
        await expect(programEditor.targetCatalog).toContainText(addedTarget);
        const confirmation = await programEditor.publish();
        test.info().annotations.push({ type: 'revision publish confirmation', description: confirmation || '(none)' });
        expect.soft(confirmation, 'confirmation before publishing the revision').not.toBe('');
      }
      await expect.poll(async () => {
        await programLibrary.typeSearch(input.title);
        const row = await programLibrary.readRow(input.title);
        return `${row.status} ${row.title}`;
      }, { timeout: 60_000 }).toMatch(/^(active|published)(?![\s\S]*draft pending)/i);
    });

    await test.step('A client preview of the program shows the updated version', async () => {
      const offered = await flows.addProgramCatalogOffers(client, input.title);
      expect(offered.length, 'published program offered to clients').toBeGreaterThan(0);
      await page.goto(`/clients/${client}`);
      await plan.openAddProgram();
      await addProgram.expectLoaded();
      await addProgram.chooseSource(offered[0] as 'System Programs' | 'My Programs').catch(() => undefined);
      await addProgram.searchFor(input.title);
      const preview = await addProgram.preview(input.title);
      await expect(preview).toContainText(addedTarget);
      await flows.evidence('revision-preview');
      await addProgram.closePreview(preview);
      await addProgram.close();
    });

    await test.step('Clean-up', async () => {
      await programLibrary.open();
      test.info().annotations.push({ type: 'cleanup', description: await programLibrary.retire(input.title) });
    });
  });
});
