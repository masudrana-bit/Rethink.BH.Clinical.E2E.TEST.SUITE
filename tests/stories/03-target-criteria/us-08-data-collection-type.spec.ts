import { test, expect } from '../../../src/fixtures/test';
import { customProgramInput } from '../../../src/data/programs';
import { COLLECTION_TYPE_LABELS, CollectionType } from '../../../src/pages/program/DataCollectionWizard';

test.describe('US-8 Configure data-collection type & dimensions', { tag: '@US-8' }, () => {
  test('TC-US08-01 Opportunity Based with prompts and location; settings persist and show in Program Details @smoke', async ({ flows, programDetails, dataCollection, targets, testData }) => {
    const program = customProgramInput('Collection Program');
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await flows.createCustomProgram(program);
    await expect(programDetails.dataSettings).toContainText(/No data collection configured/i);

    await test.step('Open the wizard on step 1', async () => {
      await programDetails.manageDataCollectionButton.click();
      await dataCollection.expectOpen();
      for (const group of ['Structured Collection', 'Quick Entry', 'Specialized Collection']) {
        await expect(dataCollection.root).toContainText(group);
      }
    });

    await test.step('Opportunity Based with Prompts: Model offered and N/A last (NGC-54 / NGC-90)', async () => {
      await dataCollection.chooseType('opportunity-based');
      await dataCollection.setDimension('prompts', true);
      const prompts = await dataCollection.promptHierarchy();
      expect.soft(prompts, 'Model prompt level (NGC-90)').toContain('Model');
      expect(prompts.at(-1)).toBe('N/A');
    });

    await test.step('Location dimension survives Next and Back', async () => {
      await dataCollection.setDimension('location', true);
      await dataCollection.goToMastery();
      await dataCollection.backButton.click();
      await expect(dataCollection.typeRadio('opportunity-based')).toBeChecked();
      await expect(dataCollection.dimensionToggle('location')).toBeChecked();
    });

    await test.step('Save closes the wizard and Program Details shows the settings', async () => {
      await dataCollection.goToMastery();
      await dataCollection.save();
      await expect(programDetails.dataSettings).toContainText('Opportunity Based');
      await expect(programDetails.dataSettings).toContainText('2 optional dimensions');
    });

    await test.step('Targets now offer a Prompt per row', async () => {
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      await expect(targets.rows.first().locator('[data-testid$="-prompt"]')).toBeVisible();
      await expect(targets.setAllPrompts).toBeVisible();
      await targets.cancel();
    });

    await test.step('Reopening the wizard shows the saved choices', async () => {
      await programDetails.manageDataCollectionButton.click();
      await dataCollection.expectOpen();
      await expect(dataCollection.typeRadio('opportunity-based')).toBeChecked();
      await expect(dataCollection.dimensionToggle('prompts')).toBeChecked();
      await expect(dataCollection.dimensionToggle('location')).toBeChecked();
      await dataCollection.cancel();
    });

    await test.step('Clean-up', async () => {
      await programDetails.deleteProgram(program.title);
    });
  });

  test('TC-US08-02 Every collection type can be selected and shows its mastery wording', async ({ flows, programDetails, dataCollection, testData }) => {
    const program = customProgramInput('All Types Program');
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await flows.createCustomProgram(program);
    await programDetails.manageDataCollectionButton.click();
    await dataCollection.expectOpen();

    for (const [type, label] of Object.entries(COLLECTION_TYPE_LABELS) as [CollectionType, string][]) {
      await test.step(`${label}`, async () => {
        await dataCollection.chooseType(type);
        await dataCollection.goToMastery();
        await expect.soft(dataCollection.masteryHeading, `mastery step for ${label}`).toContainText(label);
        await dataCollection.backButton.click();
        await expect(dataCollection.typeRadio(type)).toBeChecked();
      });
    }

    await test.step('Cancel saves nothing', async () => {
      await dataCollection.cancel();
      await expect(programDetails.dataSettings).toContainText(/No data collection configured/i);
    });

    await test.step('Clean-up', async () => {
      await programDetails.deleteProgram(program.title);
    });
  });

  test('TC-US08-03 Change the collection type of a configured program', async ({ flows, programDetails, dataCollection, testData }) => {
    const program = customProgramInput('Change Type Program');
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await flows.createCustomProgram(program);

    await test.step('Configure Opportunity Based', async () => {
      await programDetails.manageDataCollectionButton.click();
      await dataCollection.chooseType('opportunity-based');
      await dataCollection.goToMastery();
      await dataCollection.save();
      await expect(programDetails.dataSettings).toContainText('Opportunity Based');
    });

    await test.step('Switch to Task Analysis', async () => {
      await programDetails.manageDataCollectionButton.click();
      await dataCollection.chooseType('task-analysis');
      await dataCollection.goToMastery();
      await dataCollection.save();
      await expect(programDetails.dataSettings).toContainText('Task Analysis');
      await expect(programDetails.dataSettings).not.toContainText('Opportunity Based');
    });

    await test.step('Clean-up', async () => {
      await programDetails.deleteProgram(program.title);
    });
  });
});
