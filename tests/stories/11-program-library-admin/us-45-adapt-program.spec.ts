import { test, expect } from '../../../src/fixtures/test';
import { uniqueName } from '../../../src/helpers/data-factory';

test.describe('US-45 Edit a program without changing it for everyone else', { tag: '@US-45' }, () => {
  test('TC-US45-01 Editing a standard program adapts a copy; the original stays Standard and unchanged', async ({ flows, programLibrary, programEditor }) => {
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
});
