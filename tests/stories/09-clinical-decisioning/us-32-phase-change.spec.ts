import { test, expect } from '../../../src/fixtures/test';

test.describe("US-32 Change a target's phase and see its history", { tag: '@US-32' }, () => {
  test("TC-US32-01 Move a target from Baseline to Intervention and then Maintenance with reasons; history and the program-level phase follow", async ({ page, flows, programDetails, targets, phaseDialog, testData }) => {
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    let targetId = '';

    await test.step('BCBA: new program; its targets start in Baseline', async () => {
      await flows.createCollectionProgram('opportunity-based');
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      expect(await targets.phaseOf('Touch nose')).toBe('Baseline');
      targetId = ((await (await targets.row('Touch nose')).getAttribute('data-testid')) ?? '').replace('target-manager-row-', '');
    });

    let initialHistory = 0;
    await test.step('Change phase dialog requires a phase and shows the history so far', async () => {
      await targets.openPhaseChange('Touch nose');
      await expect(phaseDialog.target).toHaveText('Touch nose');
      await expect(phaseDialog.blockedReason).toContainText('Choose the phase');
      await expect(phaseDialog.saveButton).toBeDisabled();
      await expect(phaseDialog.history).toBeVisible();
      initialHistory = await phaseDialog.historyItems.count();
      test.info().annotations.push({ type: 'initial history', description: (await phaseDialog.history.innerText()).replace(/\s+/g, ' ') });
    });

    await test.step('Record Intervention with a reason', async () => {
      await phaseDialog.changePhase('Intervention', 'E2E: baseline stable over 3 sessions');
      await expect.poll(() => targets.phaseOf('Touch nose')).toBe('Intervention');
    });

    await test.step('Move beyond Intervention to Maintenance; history lists both changes with reasons', async () => {
      await targets.openPhaseChange('Touch nose');
      await expect(phaseDialog.historyItems).toHaveCount(initialHistory + 1);
      await expect(phaseDialog.history).toContainText('Intervention');
      await phaseDialog.changePhase('Maintenance', 'E2E: criteria met, move to maintenance');
      await expect.poll(() => targets.phaseOf('Touch nose')).toBe('Maintenance');
      await targets.openPhaseChange('Touch nose');
      const history = (await phaseDialog.historyItems.allInnerTexts()).map((t) => t.replace(/\s+/g, ' '));
      test.info().annotations.push({ type: 'phase history', description: JSON.stringify(history) });
      expect(history).toHaveLength(initialHistory + 2);
      expect(history.join(' ')).toContain('baseline stable over 3 sessions');
      expect(history.join(' ')).toContain('move to maintenance');
      expect.soft(history.join(' '), 'history names the user who made each change').not.toMatch(/\bUnknown\b/);
      await flows.evidence('phase-history');
      await phaseDialog.cancelButton.click();
      await expect(phaseDialog.phaseSelect).toBeHidden();
    });

    await test.step('Program-level phase column shows the new phase after reload (NGC-60)', async () => {
      await targets.close();
      await page.reload();
      await programDetails.expectLoaded();
      const phaseCell = page.getByTestId(`program-details-target-phase-${targetId}`);
      await expect(phaseCell).toHaveText(/Maintenance/);
      await programDetails.manageTargetsButton.click();
      await targets.expectLoaded();
      expect(await targets.phaseOf('Touch nose'), 'phase persisted').toBe('Maintenance');
      await targets.cancel();
    });
  });

  test('TC-US32-02 Close baseline moves a target out of Baseline', async ({ page, flows, programDetails, targets, phaseDialog, testData }) => {
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
    await flows.createCollectionProgram('opportunity-based');
    await programDetails.manageTargetsButton.click();
    await targets.expectLoaded();

    await test.step('Close baseline on Clap hands', async () => {
      const row = await targets.row('Clap hands');
      await row.getByTestId('phase-control-close-baseline').click();
      if (await phaseDialog.phaseSelect.isVisible({ timeout: 3_000 }).catch(() => false)) {
        test.info().annotations.push({ type: 'close baseline', description: 'opens the phase dialog' });
        await phaseDialog.changePhase('Intervention', 'E2E: close baseline');
      } else {
        const confirm = page.locator('.p-dialog:visible, .p-confirmdialog:visible').last();
        if (await confirm.isVisible({ timeout: 2_000 }).catch(() => false)) {
          test.info().annotations.push({ type: 'close baseline confirm', description: (await confirm.innerText()).replace(/\s+/g, ' ') });
          const reason = confirm.locator('textarea');
          if (await reason.isVisible().catch(() => false)) await reason.fill('E2E: close baseline');
          await confirm.getByRole('button', { name: /close baseline|confirm|record|save/i }).last().click();
        }
      }
      await expect.poll(() => targets.phaseOf('Clap hands')).not.toBe('Baseline');
      test.info().annotations.push({ type: 'phase after close baseline', description: await targets.phaseOf('Clap hands') });
    });

    await test.step('Other targets stay in Baseline', async () => {
      expect(await targets.phaseOf('Touch nose')).toBe('Baseline');
      await targets.close();
    });
  });
});
