import { test, expect } from '../../../src/fixtures/test';

test.describe('US-23 Close a session and review summary, audit & note', { tag: '@US-23' }, () => {
  test('TC-US23-01 Conclude a scheduled session: summary, audit list, account note template, finalize, appointment completed @rbt', async ({ page, flows, rbtHome, rbtSessions, sessionOpen, dataSheet, abc, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    const program = testData.seeded.obProgram;
    const target = testData.seeded.obTarget;
    const behavior = testData.seeded.behavior;
    await flows.signInAs('rbt');
    await rbtHome.expectLoaded();
    await expect(rbtHome.scheduledRows.first().or(page.getByTestId('scheduled-sessions-empty'))).toBeVisible();
    const clientRow = rbtHome.scheduledRows.and(page.locator(`[data-testid$="-${client}"]`)).first();
    const listed = await clientRow.waitFor({ timeout: 15_000 }).then(() => true, () => false);
    const scheduledRow = clientRow.filter({ hasNotText: /completed|finali[sz]ed/i });
    let scheduled = listed && (await scheduledRow.count()) > 0;
    test.info().annotations.push({ type: 'appointment', description: listed ? (await clientRow.innerText()).replace(/\s+/g, ' ') : 'none today' });
    let chosenTemplate = '';
    let behaviorOnSheet = true;

    await test.step('Open today\'s scheduled session for the seeded client and start it', async () => {
      if (!scheduled) {
        test.info().annotations.push({ type: 'test-data gap', description: 'no open scheduled session today for the seeded client; ran an ad-hoc session and skipped the appointment check' });
        await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] }, behaviors: { [client]: [behavior] } });
        return;
      }
      await scheduledRow.locator('[data-testid^="scheduled-sessions-open-button-"]').click();
      await expect(sessionOpen.root.or(dataSheet.root)).toBeVisible({ timeout: 30_000 });
      if (await dataSheet.root.isVisible()) {
        test.info().annotations.push({ type: 'resumed', description: 'the appointment was already in progress from an earlier run; finalized it and ran an ad-hoc session instead' });
        await flows.concludeAndFinalize();
        scheduled = false;
        await page.goto('/rbt');
        await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] }, behaviors: { [client]: [behavior] } });
        return;
      }
      const startable = await expect(sessionOpen.startButton).toBeEnabled({ timeout: 15_000 }).then(() => true, () => false);
      if (!startable) {
        const why = (await page.locator('#session-open-start-note').innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
        test.info().annotations.push({ type: 'test-data gap', description: `today's appointment cannot be started yet (${why || 'Start Session disabled'}); ran an ad-hoc session and skipped the appointment check` });
        scheduled = false;
        await page.goto('/rbt');
        await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] }, behaviors: { [client]: [behavior] } });
        return;
      }
      await sessionOpen.expectLoaded();
      const templates = (await sessionOpen.noteTemplate.locator('option').allInnerTexts()).map((t) => t.trim()).filter((t) => t && t !== 'None');
      expect(templates.length, 'account-level note templates are offered').toBeGreaterThan(0);
      chosenTemplate = templates.find((t) => !/test/i.test(t)) ?? templates[0];
      const preselected = (await sessionOpen.noteTemplate.locator('option:checked').innerText()).trim();
      test.info().annotations.push({ type: 'note templates', description: `offered ${JSON.stringify(templates)}; pre-selected "${preselected}"; chose "${chosenTemplate}"` });
      await sessionOpen.chooseNoteTemplate(chosenTemplate);
      await sessionOpen.start();
      await dataSheet.expectLoaded();
    });

    await test.step('Record two trials, a behavior count and an ABC entry', async () => {
      await dataSheet.recordOutcome(program, target, 'Correct');
      await dataSheet.recordOutcome(program, target, 'Incorrect');
      await expect.poll(() => dataSheet.targetScore(program, undefined, target)).toBe('50%');
      behaviorOnSheet = await dataSheet.behaviorRow(client, behavior).waitFor({ timeout: 10_000 }).then(() => true, () => false);
      expect.soft(behaviorOnSheet, `plan behavior ${behavior} is on the session's behavior support card (loaded on Oct 19; missing on Oct 20, "0 behavior plans")`).toBe(true);
      if (behaviorOnSheet) await dataSheet.addBehaviorCount(client, behavior);
      await dataSheet.openAbcEntry();
      await abc.record({ behavior, context: 'Academics', antecedents: ['Task/command given'], consequences: ['Ignored'], note: 'E2E closeout ABC entry' });
    });

    await test.step('Conclude: the summary shows collected data by name', async () => {
      await flows.concludeToSummary();
      await expect(sessionClose.overallPercent).toHaveText('50%');
      await expect.poll(() => sessionClose.scored()).toBe(2);
      await expect.soft(page.getByTestId('target-summary-name').filter({ hasText: target }), 'summary names the target, not its id').toBeVisible({ timeout: 15_000 });
      if (behaviorOnSheet) await expect.soft(page.getByTestId('session-data-summary-behaviors')).toContainText(new RegExp(`${behavior}\\s*1 time`));
      await expect(page.locator('[data-testid^="session-data-summary-abc-"]').filter({ hasText: behavior }).first()).toContainText('Academics');
    });

    await test.step('Audit list: each trial, the behavior, the ABC entry (context by name) and the session times', async () => {
      const trials = await sessionClose.auditTrialEntries(program);
      await expect(trials).toHaveCount(2);
      await expect(trials.filter({ hasText: /Outcome: correct/ })).toHaveCount(1);
      await expect(trials.filter({ hasText: /Outcome: incorrect/ })).toHaveCount(1);
      await expect(sessionClose.auditBehaviorEntries).toHaveCount(behaviorOnSheet ? 1 : 0);
      const abcEntry = sessionClose.auditAbcEntries.filter({ hasText: behavior }).first();
      await expect(abcEntry).toContainText('Context: Academics');
      expect.soft(await abcEntry.innerText(), 'ABC context shown by name, not id').not.toMatch(/Context:\s*\d+\b/);
      await expect(sessionClose.auditTimesEntry).toContainText(/Started at: .* Ended at: /);
      expect(await sessionClose.corrections()).toBe(0);
    });

    await test.step('Session note is drafted from the account template', async () => {
      let template = await sessionClose.waitForNoteTemplate();
      if (chosenTemplate) expect.soft(template, 'the template picked on the pre-session page is applied to the note').toBe(chosenTemplate);
      if (/no template selected/i.test(template)) {
        const fallback = chosenTemplate || 'Parent Training Session Note';
        template = await sessionClose.startNoteWith(fallback, { orAnyReal: true });
        test.info().annotations.push({ type: 'workaround', description: `note was not started; picked "${template}" in the note` });
      }
      expect(template, 'a note template is applied').not.toMatch(/no template selected/i);
      expect.soft(template, 'a real account template, not a test template').not.toMatch(/\btest\b/i);
      await expect(sessionClose.noteDataRows.filter({ hasText: target }).first()).toContainText('50%');
      if ((await sessionClose.requiredNoteFieldLabels()).length) {
        await expect(sessionClose.noteSubmitButton).toBeDisabled();
        await expect(sessionClose.noteSubmitBlocked).toContainText(/required field/i);
      } else {
        test.info().annotations.push({ type: 'note template', description: `"${template}" has no required fields` });
        // Save draft stays disabled until the note is edited.
        await page.getByTestId('session-note-element').locator('textarea, input[type=text]').first().fill('E2E: client engaged and followed the routine.');
      }
      await sessionClose.completeRequiredNoteFields('E2E: client engaged and followed the routine.');
      if (!(await sessionClose.noteSubmitBlocked.isHidden())) {
        test.info().annotations.push({ type: 'note still blocked', description: `${await sessionClose.noteSubmitBlocked.innerText()} required: ${JSON.stringify(await sessionClose.requiredNoteFieldLabels())}` });
      }
      await expect.soft(sessionClose.noteSubmitBlocked, 'every required note field can be completed').toBeHidden();
      await sessionClose.saveNoteDraft();
      await expect(sessionClose.noteDraftStamp).toContainText(/Draft saved: .* by /);
      await flows.evidence('summary-audit-note');
    });

    await test.step('Finalize: wording and landing page (NGC-86)', async () => {
      await expect(sessionClose.finalizeButton).toBeDisabled();
      await expect(page.getByTestId('session-summary-finalize-hint')).toContainText(/confirm the session times/i);
      const prompt = await sessionClose.openFinalizePrompt();
      test.info().annotations.push({ type: 'finalize prompt', description: prompt });
      expect.soft(prompt, 'finalize wording should not say "removed from this device" (NGC-86)').not.toMatch(/removed from this device/i);
      await sessionClose.finalizeConfirmButton.click();
      await expect(page).not.toHaveURL(/\/summary/, { timeout: 60_000 });
    });

    await test.step('The appointment shows completed', async () => {
      test.skip(!scheduled, 'ad-hoc session - no appointment to check');
      if (!/\/rbt\/sessions/.test(page.url())) await page.goto('/rbt/sessions');
      await rbtSessions.expectLoaded();
      const row = page.locator(`[data-testid^="scheduled-sessions-row-"][data-testid$="-${client}"]`).first();
      await expect(row).toBeVisible();
      await expect.soft(row, 'finalized appointment is marked completed').toContainText(/finali[sz]ed|completed/i, { timeout: 15_000 });
      await expect.soft(row, 'finalized appointment is no longer "Missed"').not.toContainText(/missed/i);
      await page.goto('/rbt');
      await rbtHome.expectLoaded();
      const homeRow = rbtHome.scheduledRows.and(page.locator(`[data-testid$="-${client}"]`)).first();
      await expect.soft(homeRow, 'RBT Home also shows the appointment as finalized').toContainText(/finali[sz]ed|completed/i, { timeout: 15_000 });
    });
  });

  test('TC-US23-02 Finalize stays locked until the session times are confirmed @rbt', async ({ page, flows, dataSheet, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    const program = testData.seeded.obProgram;
    const target = testData.seeded.obTarget;
    await flows.signInAs('rbt');
    await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] } });
    await dataSheet.recordOutcome(program, target, 'Correct');
    await flows.concludeToSummary();
    const hint = page.getByTestId('session-summary-finalize-hint');

    await test.step('Finalize is disabled with a hint until times are confirmed', async () => {
      await expect(sessionClose.finalizeButton).toBeDisabled();
      await expect(hint).toContainText(/confirm the session times/i);
      await expect(sessionClose.netDuration).toHaveText(/\d+\s*[sm]/);
      await expect(sessionClose.pausedDuration).toHaveText(/^0\s*m$/);
    });

    await test.step('Session-times correction needs a reason before it can be saved', async () => {
      await sessionClose.openCorrection(sessionClose.auditTimesEntry);
      await expect(page.getByTestId('correction-started-at-input')).toBeVisible();
      await expect(page.getByTestId('correction-ended-at-input')).toBeVisible();
      await expect(page.getByTestId('correction-form-save-button')).toBeDisabled();
      await sessionClose.cancelCorrection();
      expect(await sessionClose.corrections()).toBe(0);
    });

    await test.step('Confirming enables Finalize; un-confirming locks it again', async () => {
      await sessionClose.timesConfirm.click();
      await expect(sessionClose.finalizeButton).toBeEnabled();
      await sessionClose.timesConfirm.click();
      await expect(sessionClose.finalizeButton).toBeDisabled();
    });

    await test.step('Confirm and finalize', async () => {
      await sessionClose.finalize();
    });
  });
});
