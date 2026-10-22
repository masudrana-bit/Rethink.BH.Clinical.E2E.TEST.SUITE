import { test, expect } from '../../../src/fixtures/test';
import { customProgramInput } from '../../../src/data/programs';

test.describe('US-6 Edit, archive, or delete a program', { tag: '@US-6' }, () => {
  test('TC-US06-01 Edit the goal and rename a program from the header', async ({ page, flows, plan, programDetails, testData }) => {
    const program = customProgramInput('Editable Program');
    const renamed = `${program.title} (renamed)`;
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await flows.createCustomProgram(program);

    await test.step('Edit goal', async () => {
      await programDetails.editGoal('Updated goal: responds independently in 90% of opportunities.');
    });

    await test.step('Rename from the header', async () => {
      await programDetails.renameProgram(renamed);
      await expect(plan.railItem(renamed)).toBeVisible();
    });

    await test.step('Program actions menu lists each action once (RHD-58952)', async () => {
      await programDetails.actionsMenu.click();
      for (const action of ['Edit', 'Duplicate', 'Update Status', 'Delete']) {
        await expect(page.getByRole('menuitem', { name: action, exact: true })).toHaveCount(1);
      }
      await page.keyboard.press('Escape');
    });

    await test.step('Clean-up', async () => {
      await programDetails.deleteProgram(renamed);
    });
  });

  test('TC-US06-02 Discontinue (archive) a program, then delete it with confirmation', async ({ flows, plan, programDetails, testData }) => {
    const program = customProgramInput('Archive Program');
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await flows.createCustomProgram(program);

    await test.step('Discontinue moves the program to Inactive', async () => {
      await programDetails.updateStatus(/Discontinu|Inactive/);
      await plan.expectProgramNotListed(program.title, 'current');
      await plan.expectProgramListed(program.title, 'inactive');
    });

    await test.step('Delete asks for confirmation', async () => {
      await plan.openProgram(program.title);
      const message = await programDetails.deleteProgram(program.title);
      expect(message, 'delete confirmation names the program').toMatch(/delete/i);
    });

    await test.step('Program is gone from every list', async () => {
      await plan.expectProgramNotListed(program.title, 'inactive');
      await plan.expectProgramNotListed(program.title, 'current');
    });
  });
});
