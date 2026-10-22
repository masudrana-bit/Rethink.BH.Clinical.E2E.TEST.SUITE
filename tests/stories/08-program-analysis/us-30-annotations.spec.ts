import { test, expect } from '../../../src/fixtures/test';
import { uniqueName } from '../../../src/helpers/data-factory';

test.describe("US-30 Annotate a program's chart with clinical events", { tag: '@US-30' }, () => {
  test('TC-US30-01 Add a dated Medication Change annotation; it is listed on the rail and on the chart, then removed', async ({ page, flows, programDetails, programData, testData }) => {
    const client = testData.clients.seeded;
    const title = uniqueName('Medication change');
    await flows.signInAs('bcba');
    await flows.openClient(client);
    await flows.openProgram(testData.seeded.obProgram);
    await programData.open(client, await programDetails.programId());
    const before = await programData.annotationTotal();

    await test.step('Add the annotation with today as the start date (NGC-43)', async () => {
      const typedDateKept = await programData.addAnnotation({ title, detail: 'Started new medication', type: 'Medication Change' });
      expect.soft(typedDateKept, 'typed start date is kept (NGC-43: date entry cleared)').toBe(true);
    });

    await test.step('Rail count goes up and the annotation is listed; the chart mentions it', async () => {
      await expect.poll(() => programData.annotationTotal()).toBe(before + 1);
      await programData.expandAnnotationRail();
      await expect(programData.annotationItem(title)).toBeVisible();
      const description = await programData.chartDescription(programData.combinedChart.getByTestId('clinical-chart-canvas'));
      const lines = await programData.combinedChart.locator('.highcharts-plot-line').count();
      test.info().annotations.push({ type: 'chart after annotation', description: `plot lines ${lines}; ${description.slice(0, 300)}` });
      expect.soft(lines > 0 || description.includes(title), 'annotation drawn on the chart').toBe(true);
      await flows.evidence('annotation-added');
    });

    await test.step('Annotation survives a reload', async () => {
      await page.reload();
      await programData.expectLoaded();
      await programData.expandAnnotationRail();
      await expect(programData.annotationItem(title)).toBeVisible();
    });

    await test.step('Open the annotation from the rail and delete it', async () => {
      await programData.deleteAnnotation(title);
      await expect.poll(() => programData.annotationTotal()).toBe(before);
    });
  });

  test('TC-US30-02 Annotation dialog: types offered, start date required, Cancel adds nothing', async ({ flows, programDetails, programData, testData }) => {
    const client = testData.clients.seeded;
    await flows.signInAs('bcba');
    await flows.openClient(client);
    await flows.openProgram(testData.seeded.obProgram);
    await programData.open(client, await programDetails.programId());
    const before = await programData.annotationTotal();

    await test.step('Types include the clinical event types', async () => {
      await programData.openAnnotationDialog();
      const types = await programData.annotationTypes();
      test.info().annotations.push({ type: 'annotation types', description: JSON.stringify(types) });
      expect(types).toEqual(expect.arrayContaining(['Medication Change', 'Prompt Fade', 'Staff Change', 'Criteria Change', 'Note']));
    });

    await test.step('Save without a start date keeps the dialog open', async () => {
      await programData.annotationTitle.fill('E2E no date');
      await expect(programData.annotationStartDate).toHaveValue('');
      await programData.annotationSave.click();
      await expect(programData.annotationTitle).toBeVisible();
    });

    await test.step('Cancel closes without adding', async () => {
      await programData.cancelAnnotation();
      expect(await programData.annotationTotal()).toBe(before);
    });
  });
});
