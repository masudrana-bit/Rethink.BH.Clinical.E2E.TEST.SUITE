import { test, expect } from '../../../src/fixtures/test';

test.describe('US-40 Reach client-level and program-level analysis', { tag: '@US-40' }, () => {
  test('TC-US40-01 Move between Analyze Data and a program chart without losing the client; legacy tabs open the same client', async ({ page, flows, shell, workspace, analyze, programDetails, programData, testData }) => {
    const client = testData.clients.seeded;
    let clientName = '';

    await test.step('Client-level: Analyze Data', async () => {
      await flows.signInAs('bcba');
      clientName = await flows.openClient(client);
      await workspace.openTab('analyze-data');
      await analyze.expectLoaded();
      await expect(page).toHaveURL(new RegExp(`/clients/${client}/analyze-data`));
    });

    await test.step('Program-level: Skills Programs → program → Data tab', async () => {
      await flows.openProgram(testData.seeded.obProgram);
      await programDetails.openTab('data');
      await programData.expectLoaded();
      await expect(page).toHaveURL(new RegExp(`/clients/${client}/programs/\\d+.*tab=data`));
      await expect(shell.clientSwitcher).toContainText(clientName.split(' ')[0]);
    });

    await test.step('Back to Analyze Data from the tab bar', async () => {
      await workspace.openTab('analyze-data');
      await analyze.expectLoaded();
      await expect(shell.clientSwitcher).toContainText(clientName.split(' ')[0]);
    });

    await test.step('Client Info and File Cabinet open legacy BH for the same client', async () => {
      const info = await workspace.openLegacyTab('client-info');
      const files = await workspace.openLegacyTab('file-cabinet');
      test.info().annotations.push({ type: 'legacy tabs', description: `${info} | ${files}` });
      expect(info).toContain(`/clients/${client}`);
      expect(files).toContain(`/clients/${client}/files`);
    });
  });
});
