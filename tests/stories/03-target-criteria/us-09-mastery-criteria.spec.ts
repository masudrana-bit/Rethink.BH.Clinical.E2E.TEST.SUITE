import { test, expect } from '../../../src/fixtures/test';
import { customProgramInput } from '../../../src/data/programs';

test.describe('US-9 Configure mastery, maintenance & generalization criteria', { tag: '@US-9' }, () => {
  test('TC-US09-01 Mastery, baseline, generalization and maintenance save and display @smoke', async ({ flows, programDetails, dataCollection, testData }) => {
    const program = customProgramInput('Mastery Program');
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await flows.createCustomProgram(program);

    await test.step('Open the mastery step for Opportunity Based', async () => {
      await programDetails.manageDataCollectionButton.click();
      await dataCollection.chooseType('opportunity-based');
      await dataCollection.goToMastery();
      await expect(dataCollection.masteryHeading).toContainText('Opportunity Based');
      await expect(dataCollection.interventionThreshold).toHaveValue('80');
    });

    await test.step('Criteria dropdowns offer the expected options', async () => {
      const section = dataCollection.interventionSection;
      expect(await dataCollection.optionsOf(section, 'mode')).toEqual(['Clinician Attestation', 'Automatic', 'Automatic with Confirmation']);
      expect(await dataCollection.optionsOf(section, 'direction')).toEqual(['At Least', 'At Most']);
      expect(await dataCollection.optionsOf(section, 'window')).toEqual(['consecutive', 'total', 'of the last']);
      expect(await dataCollection.optionsOf(section, 'count-unit')).toEqual(['Sessions', 'Day', 'Week', 'Month']);
    });

    await test.step('Set baseline maximum, mastery, generalization and maintenance', async () => {
      await dataCollection.setMastery({
        baselineDirection: 'At Most',
        baselineThreshold: 30,
        interventionMode: 'Automatic with Confirmation',
        interventionThreshold: 90,
        sessionCount: 3,
        generalization: true,
        maintenance: true,
      });
      await flows.evidence('mastery criteria');
      await dataCollection.save();
    });

    await test.step('Program Details shows every criterion', async () => {
      const settings = programDetails.dataSettings;
      await expect(settings).toContainText(/Baseline at most 30%/i);
      await expect(settings).toContainText(/Mastery criteria at least 90%.*3 consecutive sessions/i);
      await expect(settings).toContainText(/require BCBA confirmation/i);
      await expect(settings).toContainText(/Generalization On/i);
      await expect(settings).toContainText(/Maintenance On/i);
    });

    await test.step('Reopening shows the saved values', async () => {
      await programDetails.manageDataCollectionButton.click();
      await dataCollection.goToMastery();
      await expect(dataCollection.interventionThreshold).toHaveValue('90');
      await dataCollection.expandSection(dataCollection.baselineSection);
      await expect(dataCollection.field(dataCollection.baselineSection, 'direction')).toContainText('At Most');
      await expect(dataCollection.field(dataCollection.baselineSection, 'threshold')).toHaveValue('30');
      await dataCollection.cancel();
    });

    await test.step('Clean-up', async () => {
      await programDetails.deleteProgram(program.title);
    });
  });

  test('TC-US09-02 Validation: percentage above 100 and empty required values', async ({ flows, programDetails, dataCollection, testData }) => {
    const program = customProgramInput('Mastery Validation Program');
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await flows.createCustomProgram(program);
    await programDetails.manageDataCollectionButton.click();
    await dataCollection.chooseType('opportunity-based');
    await dataCollection.goToMastery();

    await test.step('150% is rejected', async () => {
      await dataCollection.interventionThreshold.fill('150');
      await dataCollection.interventionThreshold.blur();
      await expect(dataCollection.interventionThresholdError).toHaveText('Percentage must be between 0 and 100.');
      await expect(dataCollection.interventionThreshold).toHaveAttribute('aria-invalid', 'true');
      await expect(dataCollection.saveButton).toBeDisabled();
    });

    await test.step('An empty threshold blocks Save', async () => {
      await dataCollection.interventionThreshold.fill('');
      await dataCollection.interventionThreshold.blur();
      await expect(dataCollection.saveButton).toBeDisabled();
    });

    await test.step('A valid threshold clears the error', async () => {
      await dataCollection.interventionThreshold.fill('90');
      await dataCollection.interventionThreshold.blur();
      await expect(dataCollection.interventionThresholdError).toHaveCount(0);
      await expect(dataCollection.saveButton).toBeEnabled();
    });

    await test.step('Cancel without saving', async () => {
      await dataCollection.cancel();
      await expect(programDetails.dataSettings).toContainText(/No data collection configured/i);
    });

    await test.step('Clean-up', async () => {
      await programDetails.deleteProgram(program.title);
    });
  });

  test('TC-US09-03 Frequency/Rate programs use frequency-based criteria', async ({ flows, programDetails, dataCollection, testData }) => {
    const program = customProgramInput('Frequency Mastery Program');
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await flows.createCustomProgram(program);

    await test.step('Frequency/Rate criteria are counted per session', async () => {
      await programDetails.manageDataCollectionButton.click();
      await dataCollection.chooseType('frequency-rate');
      await dataCollection.goToMastery();
      await expect(dataCollection.masteryHeading).toContainText('Frequency/Rate');
      await expect(dataCollection.field(dataCollection.interventionSection, 'threshold-noun')).toHaveText(/occurrences per session/i);
      await expect(dataCollection.saveButton).toBeDisabled();
    });

    await test.step('Thresholds above 100 are allowed', async () => {
      await dataCollection.interventionThreshold.fill('150');
      await dataCollection.interventionThreshold.blur();
      await expect(dataCollection.interventionThresholdError).toHaveCount(0);
    });

    await test.step('Maintenance mirroring Intervention should not block Save', async () => {
      const blocked = await dataCollection.saveButton.isDisabled();
      expect.soft(blocked, `Save should be enabled; blocking messages: ${(await dataCollection.blockingMessages()).join(' ')}`).toBe(false);
      if (blocked) {
        test.info().annotations.push({ type: 'workaround', description: 'Maintenance custom criteria filled to enable Save for Frequency/Rate' });
        await dataCollection.setMastery({ maintenanceCustomThreshold: 150 });
      }
      await expect(dataCollection.saveButton).toBeEnabled();
      await dataCollection.save();
    });

    await test.step('Program Details shows the frequency criteria', async () => {
      await expect(programDetails.dataSettings).toContainText('Frequency/Rate');
      await expect(programDetails.dataSettings).toContainText('150');
    });

    await test.step('Clean-up', async () => {
      await programDetails.deleteProgram(program.title);
    });
  });
});
