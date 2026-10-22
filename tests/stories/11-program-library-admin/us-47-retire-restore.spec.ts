import { test, expect } from '../../../src/fixtures/test';
import { libraryProgramInput } from '../../../src/data/programs';

test.describe('US-47 Retire and restore a program', { tag: '@US-47' }, () => {
  test('TC-US47-01 Deactivate with confirmation hides the program from clients; Reactivate brings it back', async ({ flows, programLibrary, programEditor, testData }) => {
    test.setTimeout(10 * 60_000);
    const input = libraryProgramInput('Library Retire');
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
      }, { timeout: 60_000, message: 'published program shows as Active in the library' }).toMatch(/active|published/i);
      expect((await flows.addProgramCatalogOffers(client, input.title)).length).toBeGreaterThan(0);
    });

    await test.step('Deactivate: confirmation, then status Inactive', async () => {
      await programLibrary.open();
      await programLibrary.typeSearch(input.title);
      const message = await programLibrary.toggleActive(input.title, 'Deactivate');
      test.info().annotations.push({ type: 'deactivate confirmation', description: message || '(none)' });
      expect.soft(message, 'confirmation before deactivating').not.toBe('');
      await expect.poll(() => programLibrary.statusOf(input.title)).toMatch(/inactive|deactivated|retired/i);
    });

    await test.step('Deactivated program disappears from the client Add Program catalog', async () => {
      expect(await flows.addProgramCatalogOffers(client, input.title)).toEqual([]);
    });

    await test.step('Reactivate: status Active and offered to clients again', async () => {
      await programLibrary.open();
      await programLibrary.typeSearch(input.title);
      const labels = await programLibrary.rowActionLabels(input.title);
      const action = labels.includes('Reactivate') ? 'Reactivate' : 'Activate';
      await programLibrary.toggleActive(input.title, action);
      await expect.poll(() => programLibrary.statusOf(input.title)).toMatch(/^active|published/i);
      expect((await flows.addProgramCatalogOffers(client, input.title)).length).toBeGreaterThan(0);
      await flows.evidence('reactivated');
    });

    await test.step('Clean-up', async () => {
      await programLibrary.open();
      test.info().annotations.push({ type: 'cleanup', description: await programLibrary.retire(input.title) });
    });
  });

  test('TC-US47-02 Deactivating a standard program is either confirmed for this organization only or offers "Adapt a copy" (NGC-30)', async ({ page, flows, programLibrary }) => {
    await flows.signInAs('admin');
    await programLibrary.open();
    const sources = (await programLibrary.columnValues('source')).filter((s) => s !== 'Source');
    const titles = await programLibrary.titles();
    let standard = '';
    for (const title of titles.filter((_, i) => sources[i] === 'Standard').slice(0, 10)) {
      if (/^active/i.test(await programLibrary.statusOf(title))) {
        standard = title;
        break;
      }
    }
    test.skip(!standard, 'no active standard program in the catalog');

    await test.step(`Deactivate on "${standard}" asks first and explains the scope`, async () => {
      const actions = await programLibrary.actions(standard);
      await actions.getByRole('button', { name: 'Deactivate', exact: true }).click();
      const confirm = page.locator('.p-confirmdialog:visible, .p-dialog:visible').last();
      const asked = await confirm.isVisible({ timeout: 3_000 }).catch(() => false);
      const message = asked ? (await confirm.innerText()).replace(/\s+/g, ' ') : '';
      test.info().annotations.push({ type: 'standard deactivate', description: message || '(no confirmation)' });
      if (asked) {
        expect.soft(message, 'explains it is hidden for this organization only, or offers Adapt a copy (NGC-30)').toMatch(/organization|adapt/i);
        await confirm.getByRole('button', { name: /cancel|no|close/i }).first().click();
        await expect(confirm).toBeHidden();
      } else {
        test.info().annotations.push({ type: 'defect', description: 'Standard program deactivated without confirmation; reactivating it' });
        if (/inactive/i.test(await programLibrary.statusOf(standard))) await programLibrary.toggleActive(standard, 'Reactivate').catch(() => programLibrary.toggleActive(standard, 'Activate'));
      }
      expect(await programLibrary.statusOf(standard), 'standard program still active').toMatch(/^active/i);
      expect.soft(asked, 'confirmation before deactivating').toBe(true);
    });
  });
});
