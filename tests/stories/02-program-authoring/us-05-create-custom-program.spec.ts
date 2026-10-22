import { test, expect } from '../../../src/fixtures/test';
import { customProgramInput } from '../../../src/data/programs';

test.describe('US-5 Create a custom program', { tag: '@US-5' }, () => {
  test('TC-US05-01 Build a full custom program with objectives, bulk targets, lesson plan and a material link @smoke', async ({ flows, plan, addProgram, customProgram, programDetails, targets, testData }) => {
    const program = customProgramInput('Custom Program', {
      materialUrl: { title: 'E2E visual schedule', url: 'https://example.com/visual-schedule.pdf' },
    });
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);

    await test.step('Open Create Custom Program', async () => {
      await plan.openAddProgram();
      await addProgram.openCreateCustom();
    });

    await test.step('Category Skills offers domains (NGC-24)', async () => {
      const domains = await customProgram.domainOptions(program.category);
      expect(domains.length, 'domain list should not be empty').toBeGreaterThan(0);
    });

    await test.step('Fill and save the program', async () => {
      await customProgram.fill(program);
      await flows.evidence('custom program form');
      await customProgram.save();
    });

    await test.step('Program is on the Current plan with goal and targets', async () => {
      await plan.expectProgramListed(program.title, 'current');
      await plan.openProgram(program.title);
      await expect(programDetails.goal).toContainText(program.goal.slice(0, 30));
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      expect(await targets.targetNames()).toEqual(expect.arrayContaining(program.targets!));
      await targets.cancel();
    });

    await test.step('Clean-up', async () => {
      await programDetails.deleteProgram(program.title);
    });
  });

  test('TC-US05-02 New custom program saved to My Programs is searchable in the library', async ({ flows, plan, addProgram, programDetails, testData }) => {
    const program = customProgramInput('My Library Program', { saveToMyPrograms: true });
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await flows.createCustomProgram(program);

    await test.step('Search for it under My Programs (NGC-25 / NGC-52)', async () => {
      await plan.openAddProgram();
      await addProgram.chooseSource('My Programs');
      await addProgram.searchFor(program.title);
      await expect(addProgram.row(program.title)).toBeVisible();
      await addProgram.close();
    });

    await test.step('Clean-up', async () => {
      await plan.openProgram(program.title);
      await programDetails.deleteProgram(program.title);
    });
  });

  test('TC-US05-03 Required-field validation', async ({ flows, plan, addProgram, customProgram, testData }) => {
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await plan.openAddProgram();
    await addProgram.openCreateCustom();

    const disabled = await customProgram.saveButton.isDisabled();
    if (!disabled) await customProgram.saveButton.click();
    await expect(customProgram.root, 'form must stay open when required fields are empty').toBeVisible();
    await expect(customProgram.category.locator('[role=combobox]')).toHaveAttribute('aria-required', 'true');
    await flows.evidence('custom program validation');
  });
});
