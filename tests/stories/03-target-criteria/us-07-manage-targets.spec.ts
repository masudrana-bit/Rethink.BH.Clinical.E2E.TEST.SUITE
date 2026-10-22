import { test, expect } from '../../../src/fixtures/test';
import { customProgramInput } from '../../../src/data/programs';

const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

test.describe('US-7 Manage targets / steps within a program', { tag: '@US-7' }, () => {
  test('TC-US07-01 Add, bulk add, rename, reorder and assign objective and group', async ({ flows, programDetails, targets, testData }) => {
    const program = customProgramInput('Targets Program');
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await flows.createCustomProgram(program);

    await test.step('Add a single target and bulk add two more', async () => {
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      await targets.addTarget('Point to dog');
      await targets.bulkAdd(['Wave', 'Jump']);
      await targets.save();
      for (const name of [...program.targets!, 'Point to dog', 'Wave', 'Jump']) {
        await expect(programDetails.targetsSection).toContainText(name);
      }
      await expect.soft(programDetails.targetsSection.getByRole('columnheader', { name: /phase/i }), 'phase column (NGC-60)').toBeVisible();
    });

    await test.step('Rename, reorder, and assign group and objective to one target', async () => {
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      await targets.renameTarget('Stand up', 'Stand up tall');
      await targets.move('Jump', 'up');
      const names = await targets.targetNames();
      expect(names.indexOf('Jump')).toBeLessThan(names.indexOf('Wave'));
      await targets.addGroup('Body parts');
      await targets.setField('Touch nose', 'group', 'Body parts');
      await targets.setField('Touch nose', 'objective', /Objective 2/);
      await flows.evidence('targets edited');
      const saved = await targets.trySave();
      expect.soft(saved, 'rename + group/objective changes in one save (412 Conflict/StaleVersion on PATCH target)').toBe(true);
      if (!saved) {
        await flows.evidence('save error');
        await targets.cancel();
        test.info().annotations.push({ type: 'workaround', description: 'Rename/reorder and group/objective saved separately' });
        await programDetails.manageTargetsButton.click();
        await targets.expectLoaded();
        await targets.renameTarget('Stand up', 'Stand up tall');
        await targets.move('Jump', 'up');
        await targets.save();
        await programDetails.manageTargetsButton.click();
        await targets.expectLoaded();
        await targets.setField('Touch nose', 'group', 'Body parts');
        await targets.setField('Touch nose', 'objective', /Objective 2/);
        await targets.save();
      }
    });

    await test.step('Changes persisted and only the chosen target is linked (NGC-05)', async () => {
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      const names = await targets.targetNames();
      expect(names).toContain('Stand up tall');
      expect(names).not.toContain('Stand up');
      expect(names.indexOf('Jump')).toBeLessThan(names.indexOf('Wave'));
      const touchNose = await targets.row('Touch nose');
      await expect(touchNose.locator('[data-testid$="-group"]')).toContainText('Body parts');
      await expect(touchNose.locator('[data-testid$="-objective"]')).toContainText('Objective 2');
      for (const other of names.filter((n) => n !== 'Touch nose')) {
        const row = await targets.row(other);
        await expect.soft(row.locator('[data-testid$="-group"]'), `${other} must not inherit the group`).not.toContainText('Body parts');
        await expect.soft(row.locator('[data-testid$="-objective"]'), `${other} must not inherit the objective`).not.toContainText('Objective 2');
      }
      await targets.cancel();
    });

    await test.step('Clean-up', async () => {
      await programDetails.deleteProgram(program.title);
    });
  });

  test('TC-US07-02 Status lifecycle: In Progress, On hold, Mastered and un-master, with dated history', async ({ page, flows, programDetails, targets, testData }) => {
    const program = customProgramInput('Status Program');
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await flows.createCustomProgram(program);

    const openHistory = async (target: string) => {
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      return targets.openStatusHistory(target);
    };
    const closeHistory = async () => {
      await page.keyboard.press('Escape');
      await targets.cancel();
    };

    await test.step('Set In Progress and On hold', async () => {
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      await targets.setField('Clap hands', 'status', 'In Progress');
      await targets.setOnHold('Stand up', true);
      await targets.save();
      await expect(programDetails.targetsSection.getByRole('row').filter({ hasText: 'Clap hands' })).toContainText('In Progress');
    });

    await test.step('History is date-stamped', async () => {
      const history = await openHistory('Clap hands');
      await expect(history).toContainText('In Progress');
      await expect(history).toContainText(today());
      await closeHistory();
    });

    await test.step('Master the target', async () => {
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      await targets.setField('Clap hands', 'status', 'Mastered');
      await targets.save();
      const row = programDetails.targetsSection.getByRole('row').filter({ hasText: 'Clap hands' });
      await expect(row).toContainText('Mastered');
      await expect(row).toContainText(today());
    });

    await test.step('Un-master the target', async () => {
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      const row = await targets.row('Clap hands');
      await expect(row, 'mastered target moves to the Maintenance phase').toContainText('Maintenance');
      await targets.unmaster('Clap hands');
      await targets.save();
      await expect(programDetails.targetsSection.getByRole('row').filter({ hasText: 'Clap hands' })).not.toContainText('Mastered');
    });

    await test.step('History lists both changes and On hold persisted', async () => {
      const history = await openHistory('Clap hands');
      await expect(history).toContainText('Mastered');
      await expect(history).toContainText('In Progress');
      await page.keyboard.press('Escape');
      const standUp = await targets.row('Stand up');
      await expect(standUp.locator('input[data-testid$="-on-hold"]')).toBeChecked();
      await targets.cancel();
    });

    await test.step('Clean-up', async () => {
      await programDetails.deleteProgram(program.title);
    });
  });

  test('TC-US07-03 Remove a target (cancel and save) and delete a group', async ({ flows, programDetails, targets, testData }) => {
    const program = customProgramInput('Remove Target Program');
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await flows.createCustomProgram(program);

    await test.step('Remove then Cancel keeps the target', async () => {
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      await targets.remove('Stand up');
      expect(await targets.targetNames()).not.toContain('Stand up');
      await targets.cancel();
      await expect(programDetails.targetsSection).toContainText('Stand up');
    });

    await test.step('Remove then Save deletes the target', async () => {
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      await targets.remove('Stand up');
      await targets.save();
      await expect(programDetails.targetsSection).not.toContainText('Stand up');
      await expect(programDetails.targetsSection).toContainText('Touch nose');
    });

    await test.step('Add and delete a target group', async () => {
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      await targets.addGroup('Temp group');
      await targets.deleteGroup('Temp group');
      await targets.cancel();
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      expect(await targets.groupNames()).not.toContain('Temp group');
      await targets.cancel();
    });

    await test.step('Clean-up', async () => {
      await programDetails.deleteProgram(program.title);
    });
  });
});
