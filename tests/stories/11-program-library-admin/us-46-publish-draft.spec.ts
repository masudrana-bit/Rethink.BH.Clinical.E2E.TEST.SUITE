import { test, expect } from '../../../src/fixtures/test';
import { libraryProgramInput } from '../../../src/data/programs';

test.describe('US-46 Publish a draft', { tag: '@US-46' }, () => {
  test('TC-US46-01 A draft is not offered to clients; publishing asks for confirmation and makes it available in Add Program', async ({ flows, programLibrary, programEditor, testData }) => {
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
});
