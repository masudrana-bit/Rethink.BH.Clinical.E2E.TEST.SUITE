import { test, expect } from '../../../src/fixtures/test';
import { LIBRARY_PROGRAMS } from '../../../src/data/programs';
import { createPages } from '../../../src/fixtures/pages';

test.describe('US-4 Add a library program to a plan (Current / Future)', { tag: '@US-4' }, () => {
  test('TC-US04-01 Add a system program as Current and confirm goal, targets and lesson plan were copied', async ({ page, flows, plan, addProgram, programDetails, targets, testData }) => {
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.clean);
    let catalogGoal = '';
    let catalogHasDetails = true;

    await test.step('Precondition: library programs are not on the plan yet', async () => {
      await flows.removeProgramIfPresent(LIBRARY_PROGRAMS.current);
      await flows.removeProgramIfPresent(LIBRARY_PROGRAMS.future);
    });

    await test.step('Add the library program as Current', async () => {
      await plan.openAddProgram();
      await addProgram.expectLoaded();
      await addProgram.searchFor(LIBRARY_PROGRAMS.current);
      const preview = await addProgram.preview(LIBRARY_PROGRAMS.current);
      const previewText = await preview.innerText();
      catalogHasDetails = /\b(targets?|lesson)\b/i.test(previewText) && !/No catalog details recorded/i.test(previewText);
      catalogGoal = previewText.match(/Teach[^\n]*/)?.[0].trim() ?? '';
      await addProgram.closePreview(preview);
      if (!catalogHasDetails) {
        test.info().annotations.push({ type: 'test-data gap', description: `"${LIBRARY_PROGRAMS.current}" has no catalog targets or lesson plan on this environment` });
      }
      const duplicate = await addProgram.addProgram(LIBRARY_PROGRAMS.current, 'current');
      if (duplicate) await addProgram.duplicateWarning.getByRole('button', { name: /cancel|close|no/i }).click();
      if (await addProgram.search.isVisible()) await addProgram.close();
    });

    await test.step('Program is listed under Current and opens', async () => {
      await plan.expectProgramListed(LIBRARY_PROGRAMS.current, 'current');
      await plan.openProgram(LIBRARY_PROGRAMS.current);
    });

    await test.step('Goal, lesson information and targets were copied (NGC-72)', async () => {
      if (catalogGoal) await expect.soft(programDetails.goal, 'goal copied from library (NGC-72)').toContainText(catalogGoal);
      else await expect.soft(programDetails.goal, 'goal copied from library (NGC-72)').not.toHaveText(/^\s*(Not written yet\.?)?\s*$/);
      if (catalogHasDetails) {
        await programDetails.openTab('lesson-information');
        await expect.soft(page.getByTestId('lesson-plan-empty'), 'lesson plan copied (NGC-72)').toHaveCount(0);
        await programDetails.openTab('program-details');
        await programDetails.manageTargetsButton.click();
        await targets.expectLoaded();
        expect((await targets.targetNames()).length, 'targets copied (NGC-72)').toBeGreaterThan(0);
        await targets.cancel();
      }
    });
    await flows.evidence('library program added');
  });

  test('TC-US04-02 Duplicate protection: "Already added" in the catalog and a warning from a stale second tab', async ({ page, flows, plan, addProgram, testData }) => {
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.clean);

    await test.step('A program already on the plan cannot be added again', async () => {
      await plan.showTimeline('current');
      if ((await plan.railMatches(LIBRARY_PROGRAMS.current).count()) === 0) {
        await flows.addLibraryProgram(LIBRARY_PROGRAMS.current, 'current');
      }
      await plan.openAddProgram();
      await addProgram.expectLoaded();
      await addProgram.searchFor(LIBRARY_PROGRAMS.current);
      await expect(addProgram.alreadyAddedChip(LIBRARY_PROGRAMS.current)).toHaveText(/Already added/i);
      await expect(addProgram.addButton(LIBRARY_PROGRAMS.current)).toHaveCount(0);
      await addProgram.close();
    });

    await test.step('Precondition: the cross-tab program is not on the plan', async () => {
      await flows.removeProgramIfPresent(LIBRARY_PROGRAMS.crossTab);
    });

    const secondTab = await page.context().newPage();
    const tab2 = createPages(secondTab);

    await test.step('Both tabs open Add Program on the same client', async () => {
      await plan.openAddProgram();
      await addProgram.expectLoaded();
      await addProgram.searchFor(LIBRARY_PROGRAMS.crossTab);
      await secondTab.goto(`/clients/${testData.clients.clean}`);
      await tab2.plan.openAddProgram();
      await tab2.addProgram.expectLoaded();
      await tab2.addProgram.searchFor(LIBRARY_PROGRAMS.crossTab);
    });

    await test.step('Tab 2 adds the program first', async () => {
      expect(await tab2.addProgram.addProgram(LIBRARY_PROGRAMS.crossTab, 'current')).toBe(false);
      await secondTab.close();
    });

    await test.step('Tab 1 (stale list) is warned instead of adding a second copy (NGC-21)', async () => {
      await page.bringToFront();
      const warned = await addProgram.addProgram(LIBRARY_PROGRAMS.crossTab, 'current');
      expect.soft(warned, 'duplicate warning should appear when the list is stale (NGC-21)').toBe(true);
      if (warned) await addProgram.duplicateWarning.getByRole('button', { name: /cancel|close|no/i }).click();
      if (await addProgram.search.isVisible()) await addProgram.close();
      await page.reload();
      await plan.showTimeline('current');
      await expect.soft(plan.railMatches(LIBRARY_PROGRAMS.crossTab), 'plan keeps a single copy (NGC-21)').toHaveCount(1);
    });

    await test.step('Clean-up', async () => {
      await flows.removeProgramIfPresent(LIBRARY_PROGRAMS.crossTab);
    });
  });

  test('TC-US04-03 Add a program as Future and move it to Current', async ({ flows, plan, programDetails, testData }) => {
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.clean);

    await test.step('Add as Future', async () => {
      await flows.addLibraryProgram(LIBRARY_PROGRAMS.future, 'future');
      await plan.expectProgramNotListed(LIBRARY_PROGRAMS.future, 'current');
      await plan.expectProgramListed(LIBRARY_PROGRAMS.future, 'inactive');
    });

    await test.step('Move it to Current', async () => {
      await plan.openProgram(LIBRARY_PROGRAMS.future);
      await programDetails.updateStatus('Current');
      await plan.expectProgramListed(LIBRARY_PROGRAMS.future, 'current');
    });
  });
});
