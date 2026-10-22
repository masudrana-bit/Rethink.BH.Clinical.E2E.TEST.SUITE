import { test, expect } from '../../../src/fixtures/test';

test.describe('US-24 Correct a previously recorded attempt or fact', { tag: '@US-24' }, () => {
  test('TC-US24-01 Correct a trial outcome from the audit list; the summary and audit trail update @rbt', async ({ page, flows, dataSheet, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    const program = testData.seeded.obProgram;
    const target = testData.seeded.obTarget;
    await flows.signInAs('rbt');
    await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] } });

    await test.step('Record Correct and Incorrect, then conclude', async () => {
      await dataSheet.recordOutcome(program, target, 'Correct');
      await dataSheet.recordOutcome(program, target, 'Incorrect');
      await flows.concludeToSummary();
      await expect(sessionClose.overallPercent).toHaveText('50%');
    });

    await test.step('Correct the Incorrect trial to Correct with a reason', async () => {
      const trials = await sessionClose.auditTrialEntries(program);
      const incorrect = trials.filter({ hasText: /Outcome: incorrect/ }).first();
      const dialog = await sessionClose.openCorrection(incorrect);
      await expect(dialog.getByTestId('correction-original-values')).toContainText('Outcome: incorrect');
      await expect(page.getByTestId('outcome-editor')).toContainText(/Correct\s*Incorrect\s*N\/A/);
      await sessionClose.cancelCorrection();
      await sessionClose.correctTrialOutcome(incorrect, 'correct', 'E2E: pressed the wrong button');
    });

    await test.step('Correction count, audit trail and summary reflect the change', async () => {
      await expect.poll(() => sessionClose.corrections()).toBe(1);
      const group = await sessionClose.auditProgramGroup(program);
      const text = (await group.innerText()).replace(/\s+/g, ' ');
      test.info().annotations.push({ type: 'audit after correction', description: text });
      expect(text, 'corrected value is shown').toMatch(/Outcome: correct.*Outcome: correct|Correct(ed)?.*Outcome: correct/i);
      expect.soft(text, 'audit keeps the original value').toMatch(/incorrect/i);
      expect.soft(text, 'audit shows the correction reason').toContain('pressed the wrong button');
      await expect(sessionClose.overallPercent).toHaveText('100%');
      await flows.evidence('trial-corrected');
    });

    await test.step('Finalize', async () => {
      await sessionClose.finalize();
    });
  });

  test('TC-US24-02 Undo in session and delete from the audit list leave an audit trail @rbt', async ({ flows, dataSheet, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    const program = testData.seeded.obProgram;
    const target = testData.seeded.obTarget;
    await flows.signInAs('rbt');
    await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] } });
    const card = dataSheet.card(program);

    await test.step('Record three trials and undo the last one on the data sheet', async () => {
      await dataSheet.recordOutcome(program, target, 'Correct');
      await dataSheet.recordOutcome(program, target, 'Incorrect');
      await dataSheet.recordOutcome(program, target, 'Correct');
      await expect(dataSheet.trialChips(card, target)).toHaveCount(3);
      await card.getByRole('button', { name: `Undo last trial for ${target}` }).click();
      await expect(dataSheet.trialChips(card, target)).toHaveCount(2);
      await expect.poll(() => dataSheet.targetScore(program, undefined, target)).toBe('50%');
    });

    await test.step('Summary counts only the remaining trials; the undo is traceable', async () => {
      await flows.concludeToSummary();
      await expect.poll(() => sessionClose.scored()).toBe(2);
      const trials = await sessionClose.auditTrialEntries(program);
      const texts = (await trials.allInnerTexts()).map((t) => t.replace(/\s+/g, ' '));
      test.info().annotations.push({ type: 'audit entries', description: JSON.stringify(texts) });
      expect.soft(texts.some((t) => /undo|undone|removed|deleted/i.test(t)), 'undone trial appears in the audit trail').toBe(true);
    });

    await test.step('Delete the Incorrect trial from the audit list', async () => {
      const trials = await sessionClose.auditTrialEntries(program);
      const message = await sessionClose.deleteAuditRecord(trials.filter({ hasText: /Outcome: incorrect/ }).first());
      test.info().annotations.push({ type: 'delete confirmation', description: message });
      await expect.poll(() => sessionClose.scored()).toBe(1);
      await expect(sessionClose.overallPercent).toHaveText('100%');
      const group = await sessionClose.auditProgramGroup(program);
      expect.soft((await group.innerText()).replace(/\s+/g, ' '), 'deleted trial stays visible as removed in the audit trail').toMatch(/removed|deleted/i);
    });

    await test.step('Finalize', async () => {
      await sessionClose.finalize();
    });
  });

  test('TC-US24-03 Correct or remove an ABC entry from the audit list (NGC-65) @rbt', async ({ page, flows, dataSheet, abc, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    const program = testData.seeded.obProgram;
    const behavior = testData.seeded.behavior;
    await flows.signInAs('rbt');
    await flows.startLiveSessionAsRbt({ clientIds: [client], programs: { [client]: [program] }, behaviors: { [client]: [behavior] } });

    await test.step('Record an ABC entry and conclude', async () => {
      await dataSheet.openAbcEntry();
      await abc.record({ behavior, context: 'Academics', antecedents: ['Task/command given'], consequences: ['Ignored'], note: 'E2E ABC to correct' });
      await flows.concludeToSummary();
      await expect(sessionClose.auditAbcEntries.filter({ hasText: behavior })).toHaveCount(1);
    });

    await test.step('Correct the ABC entry', async () => {
      const entry = sessionClose.auditAbcEntries.filter({ hasText: behavior }).first();
      await sessionClose.openCorrection(entry);
      await expect(page.getByTestId('correction-original-values')).toContainText('Context: Academics');
      await expect.soft(sessionClose.correctionUnavailable, 'ABC entries can be corrected (NGC-65)').toBeHidden();
      if (await sessionClose.correctionUnavailable.isVisible()) {
        test.info().annotations.push({ type: 'defect', description: `NGC-65: ${(await sessionClose.correctionUnavailable.innerText()).replace(/\s+/g, ' ')}` });
      }
      await sessionClose.cancelCorrection();
    });

    await test.step('Remove the ABC entry instead; it leaves the summary', async () => {
      const entry = sessionClose.auditAbcEntries.filter({ hasText: behavior }).first();
      const message = await sessionClose.deleteAuditRecord(entry);
      test.info().annotations.push({ type: 'delete confirmation', description: message });
      await expect(page.locator('[data-testid^="session-data-summary-abc-"]')).toHaveCount(0);
      await expect(page.getByText('No ABC entries were recorded during the run.')).toBeVisible();
    });

    await test.step('Finalize', async () => {
      await sessionClose.finalize();
    });
  });
});
