import { test, expect } from '../../../src/fixtures/test';
import { customProgramInput } from '../../../src/data/programs';
import { readPrimeOptions } from '../../../src/helpers/primeng';

test.describe('US-3 View client treatment plan', { tag: '@US-3' }, () => {
  test('TC-US03-01 Review the Current and Inactive plan lists with domain and last-recorded info', async ({ page, flows, plan, testData }) => {
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);

    await test.step('Current list shows seeded programs with domain and last recorded date', async () => {
      await plan.showTimeline('current');
      await expect(plan.railItem(testData.seeded.obProgram)).toBeVisible();
      await expect(plan.railItem(testData.seeded.obProgram)).toContainText(/School Readiness|[A-Z][a-z]+/);
      await expect(plan.railItem(testData.seeded.obProgram)).toContainText(/Date Last Recorded: [A-Z][a-z]{2} \d{1,2}, \d{4}/);
    });

    await test.step('Domain filter narrows the list', async () => {
      const domains = (await readPrimeOptions(page, plan.railDomainFilter)).filter((d) => !/^all domains$/i.test(d));
      expect(domains.length).toBeGreaterThan(0);
      await plan.filterDomain(domains[0]);
      for (const text of await plan.programNames()) expect(text).toContain(domains[0]);
      await plan.filterDomain(/all domains/i);
    });

    await test.step('Inactive list then back to Current (NGC-20)', async () => {
      await plan.showTimeline('inactive');
      await expect(plan.railItems.first().or(plan.railEmpty)).toBeVisible();
      await plan.showTimeline('current');
      await expect(plan.railItem(testData.seeded.obProgram)).toBeVisible();
    });

    await test.step('US spelling "Uncategorized" (NGC-16)', async () => {
      await expect.soft(page.getByText(/Uncategorised/)).toHaveCount(0);
    });
  });

  test('TC-US03-02 Add a Future program and find it under the right list, then reorder', async ({ page, flows, plan, addProgram, customProgram, programDetails, testData }) => {
    const program = customProgramInput('Future Program', { status: 'future' });
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);

    await test.step('Create a Future program', async () => {
      await plan.openAddProgram();
      await addProgram.openCreateCustom();
      await customProgram.fill(program);
      await customProgram.save();
    });

    await test.step('Future program is not in Current but is in Inactive/Future', async () => {
      await plan.expectProgramNotListed(program.title, 'current');
      await plan.expectProgramListed(program.title, 'inactive');
      await expect.soft(plan.railItem(program.title), 'status badge (NGC-18)').toContainText(/Future/i);
    });

    await test.step('Program list options offer reorder', async () => {
      await plan.railMenuToggle.click();
      await expect(page.locator('[role=menu]:visible, .p-menu:visible').getByText(/edit order|reorder/i).first()).toBeVisible();
      await page.keyboard.press('Escape');
    });

    await test.step('Clean-up', async () => {
      await plan.openProgram(program.title);
      await programDetails.deleteProgram(program.title);
    });
  });
});
