import { test, expect } from '../../../src/fixtures/test';
import { uniqueName } from '../../../src/helpers/data-factory';
import { setPrimeCheckbox } from '../../../src/helpers/primeng';
import type { ProgramLibraryAdminPage } from '../../../src/pages/settings/ProgramLibraryAdminPage';
import type { ProgramEditorDialog } from '../../../src/pages/settings/ProgramEditorDialog';

/**
 * Opens an editable copy of a standard program. Without the adapt prompt (known defect) Edit opens the original
 * itself, which must never be saved, so it is cancelled and the copy is made with Duplicate.
 */
async function openAdaptedCopy(programLibrary: ProgramLibraryAdminPage, programEditor: ProgramEditorDialog, original: string): Promise<void> {
  const originalRow = await programLibrary.readRow(original);
  const message = await programLibrary.editOrAdapt(original);
  test.info().annotations.push({ type: 'adapt prompt', description: message || '(editor opened directly)' });
  expect.soft(message, 'standard programs are adapted, not edited in place').not.toBe('');
  if (message) return;
  await programEditor.cancel();
  const { confirmation, editor } = await programLibrary.duplicate(original);
  test.info().annotations.push({ type: 'copied with Duplicate', description: `${confirmation || '(no confirmation)'}; editor opened: ${editor}` });
  if (editor) {
    const filled = await programEditor.fillMissingClassification();
    test.info().annotations.push({ type: 'copy classification', description: `original category "${originalRow.category}", domain "${originalRow.domain}"; copy had none: ${filled}` });
    if (/\w/.test(originalRow.category)) expect.soft(filled, 'Duplicate keeps the category and domain of the original').toBe(false);
    return;
  }
  await programLibrary.typeSearch(original);
  const copies = (await programLibrary.allTitles()).filter((t) => t.split('\n')[0].trim() !== original);
  test.info().annotations.push({ type: 'rows after Duplicate', description: JSON.stringify(copies) });
  const copy = copies.find((t) => /copy|duplicate/i.test(t)) ?? copies[0];
  expect(copy, 'Duplicate created a copy row').toBeTruthy();
  await programLibrary.edit(copy.split('\n')[0].trim());
}

test.describe('US-45 Edit a program without changing it for everyone else', { tag: '@US-45' }, () => {
  test('TC-US45-01 [RHD-60125] Editing a standard program adapts a copy; the original stays Standard and unchanged', { tag: ['@xray', '@RHD-60125'] }, async ({ flows, programLibrary, programEditor }) => {
    await flows.signInAs('admin');
    await programLibrary.open();
    const sources = await programLibrary.columnValues('source');
    const titles = await programLibrary.titles();
    const original = titles[sources.filter((s) => s !== 'Source').findIndex((s) => s === 'Standard')] ?? titles[0];
    const before = await programLibrary.readRow(original);
    const adaptedTitle = uniqueName('Adapted');

    let message = '';
    await test.step(`Edit standard program "${original}": asked to adapt a copy`, async () => {
      expect(before.source).toBe('Standard');
      message = await programLibrary.editOrAdapt(original);
      test.info().annotations.push({ type: 'adapt prompt', description: message || '(editor opened directly)' });
      expect(message, 'standard programs are adapted, not edited in place').not.toBe('');
      expect.soft(message, 'prompt explains others are not affected (NGC-75)').toMatch(/copy|your organization|others|original/i);
    });

    await test.step('Rename the copy and save it as a draft', async () => {
      await programEditor.title.fill(adaptedTitle);
      if (!(await programEditor.legal.locator('input').isChecked().catch(() => true))) await programEditor.legal.locator('input').check({ force: true });
      await programEditor.saveDraft();
    });

    await test.step('Copy is listed as Custom / Adapted (NGC-70)', async () => {
      await programLibrary.typeSearch(adaptedTitle);
      const copy = await programLibrary.readRow(adaptedTitle);
      test.info().annotations.push({ type: 'adapted row', description: JSON.stringify(copy) });
      expect.soft(copy.source, 'adapted copy is marked Custom/Adapted, not Standard (NGC-70)').toMatch(/custom|adapt/i);
      expect(copy.status).toMatch(/draft/i);
    });

    await test.step('Original is unchanged', async () => {
      await programLibrary.typeSearch(original);
      const after = await programLibrary.readRow(original);
      expect(after.title).toBe(before.title);
      expect(after.source).toBe('Standard');
      expect(after.status).toBe(before.status);
      await flows.evidence('adapted-copy');
    });

    await test.step('Clean-up', async () => {
      await programLibrary.typeSearch('');
      test.info().annotations.push({ type: 'cleanup', description: await programLibrary.retire(adaptedTitle) });
    });
  });

  test('TC-US45-02 [RHD-60390] An adapted copy can be added to a client plan with its added target', { tag: ['@xray', '@RHD-60390'] }, async ({ page, flows, programLibrary, programEditor, plan, addProgram, programDetails, targets, testData }) => {
    test.setTimeout(10 * 60_000);
    const client = testData.clients.clean;
    const copyTitle = uniqueName('Adapted Copy');
    const addedTarget = 'Adapted target';
    await flows.signInAs('admin');
    await programLibrary.open();
    const { label: original, name: originalName } = await programLibrary.firstStandardProgram();
    let goal = '';

    await test.step(`Adapt standard program "${originalName}" and add a target to the copy`, async () => {
      await openAdaptedCopy(programLibrary, programEditor, original);
      goal = (await programEditor.goal.inputValue()).trim();
      await programEditor.title.fill(copyTitle);
      await programEditor.bulkTargets.addTargets([addedTarget]);
      await expect(programEditor.targetCatalog).toContainText(addedTarget);
      await setPrimeCheckbox(programEditor.legal, true);
    });

    let offered: string[] = [];
    await test.step('Publish the copy: it is offered in the client Add Program', async () => {
      await programEditor.publish();
      await expect.poll(async () => {
        await programLibrary.typeSearch(copyTitle);
        return programLibrary.statusOf(copyTitle);
      }, { timeout: 60_000 }).toMatch(/active|published/i);
      offered = await flows.addProgramCatalogOffers(client, copyTitle);
      test.info().annotations.push({ type: 'offered in', description: JSON.stringify(offered) });
      expect(offered.length, 'adapted copy offered to clients').toBeGreaterThan(0);
    });

    await test.step('Add the copy to the plan: it has the added target and the copied content', async () => {
      await page.goto(`/clients/${client}`);
      await plan.expectLoaded();
      await plan.openAddProgram();
      await addProgram.expectLoaded();
      await addProgram.chooseSource(offered[0] as 'System Programs' | 'My Programs').catch(() => undefined);
      await addProgram.searchFor(copyTitle);
      await addProgram.addProgram(copyTitle, 'current');
      if (await addProgram.search.isVisible()) await addProgram.close();
      await flows.openProgram(copyTitle);
      if (goal) await expect(programDetails.goal).toContainText(goal.slice(0, 40));
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      const names = [...(await targets.templateTargets()), ...(await targets.targetNames())];
      test.info().annotations.push({ type: 'targets on the plan', description: JSON.stringify(names) });
      expect(names).toContain(addedTarget);
      await flows.evidence('adapted-copy-on-plan');
      await targets.cancel();
    });

    await test.step('Clean-up', async () => {
      test.info().annotations.push({ type: 'cleanup plan', description: await programDetails.deleteProgram(copyTitle).catch(() => 'not deleted') });
      await programLibrary.open();
      test.info().annotations.push({ type: 'cleanup library', description: await programLibrary.retire(copyTitle) });
    });
  });

  test('TC-US45-03 [RHD-60391] Adapting a program does not change plans or previews of the original', { tag: ['@xray', '@RHD-60391'] }, async ({ page, flows, programLibrary, programEditor, plan, addProgram, programDetails, targets, testData }) => {
    test.setTimeout(10 * 60_000);
    const clientA = testData.clients.clean;
    const clientB = testData.clients.seeded;
    const copyTitle = uniqueName('Adapted Change');
    const copyOnlyTarget = 'Adapted only target';
    await flows.signInAs('admin');
    await programLibrary.open();
    const { label: original, name: originalName } = await programLibrary.firstStandardProgram();
    let addedByTest = false;
    let targetsBefore: string[] = [];
    const planTargets = async () => {
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      const names = [...(await targets.templateTargets()), ...(await targets.targetNames())];
      await targets.cancel();
      return names;
    };

    await test.step(`Client A has standard program "${originalName}" on the plan`, async () => {
      await page.goto(`/clients/${clientA}`);
      await plan.expectLoaded();
      if (!(await plan.railMatches(originalName).count())) {
        await plan.openAddProgram();
        await addProgram.expectLoaded();
        await addProgram.chooseSource('System Programs').catch(() => undefined);
        await addProgram.searchFor(originalName);
        await addProgram.addProgram(originalName, 'current');
        if (await addProgram.search.isVisible()) await addProgram.close();
        addedByTest = true;
      }
      await flows.openProgram(originalName);
      targetsBefore = await planTargets();
      test.info().annotations.push({ type: 'targets before', description: JSON.stringify(targetsBefore) });
    });

    await test.step('Adapt the program, change the copy and save it', async () => {
      await programLibrary.open();
      await programLibrary.typeSearch(originalName);
      await openAdaptedCopy(programLibrary, programEditor, original);
      await programEditor.title.fill(copyTitle);
      await programEditor.bulkTargets.addTargets([copyOnlyTarget]);
      await expect(programEditor.targetCatalog).toContainText(copyOnlyTarget);
      await setPrimeCheckbox(programEditor.legal, true);
      // Published rather than kept as a draft: draft duplicates can be neither deleted nor deactivated.
      await programEditor.publishOrSaveChanges();
      await expect.poll(async () => {
        await programLibrary.typeSearch(copyTitle);
        return (await programLibrary.readRow(copyTitle)).title;
      }, { timeout: 60_000 }).toContain(copyTitle);
    });

    await test.step("Client A's plan still has the original with unchanged targets", async () => {
      await page.goto(`/clients/${clientA}`);
      await plan.expectLoaded();
      await flows.openProgram(originalName);
      expect(await planTargets()).toEqual(targetsBefore);
    });

    await test.step('Client B Add Program preview of the standard program shows the original content', async () => {
      await page.goto(`/clients/${clientB}`);
      await plan.expectLoaded();
      await plan.openAddProgram();
      await addProgram.expectLoaded();
      await addProgram.chooseSource('System Programs').catch(() => undefined);
      await addProgram.searchFor(originalName);
      const preview = await addProgram.preview(originalName);
      await expect(preview).not.toContainText(copyOnlyTarget);
      await flows.evidence('original-preview-unchanged');
      await addProgram.closePreview(preview);
      await addProgram.close();
    });

    await test.step('Clean-up', async () => {
      if (addedByTest) {
        await page.goto(`/clients/${clientA}`);
        await plan.expectLoaded();
        await flows.openProgram(originalName);
        test.info().annotations.push({ type: 'cleanup plan', description: await programDetails.deleteProgram(originalName).catch(() => 'not deleted') });
      }
      await programLibrary.open();
      test.info().annotations.push({ type: 'cleanup library', description: await programLibrary.retire(copyTitle) });
    });
  });
});
