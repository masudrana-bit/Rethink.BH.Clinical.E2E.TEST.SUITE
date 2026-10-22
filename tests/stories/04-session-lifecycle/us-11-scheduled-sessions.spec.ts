import { test, expect } from '../../../src/fixtures/test';

test.describe('US-11 View and open scheduled sessions', { tag: '@US-11' }, () => {
  test('TC-US11-01 Sessions list is limited to own clients and shows correct counts', async ({ page, flows, shell, clientsList, rbtHome, rbtSessions, newSession, testData }) => {
    await flows.signInAs('rbt');
    let caseload: string[] = [];
    let seededName = '';

    await test.step('Read the caseload from Clients', async () => {
      await shell.goToNav('Clients');
      await clientsList.expectLoaded();
      caseload = await clientsList.clientNames();
      expect(caseload.length).toBeGreaterThan(0);
      seededName = (await clientsList.root.getByTestId(`clients-list-link-${testData.clients.seeded}`).innerText()).replace(/\s+/g, ' ').trim();
    });

    await test.step('This Week lists only caseload clients (NGC-49)', async () => {
      await shell.goToNav('Sessions');
      await rbtSessions.expectLoaded();
      await rbtSessions.chooseRange('this-week');
      await expect(rbtSessions.rangeLabel).toBeVisible();
      const rows = await rbtSessions.scheduledRows.allInnerTexts();
      const outside = rows.filter((row) => !caseload.some((name) => row.includes(name)));
      expect.soft(outside, 'every scheduled row belongs to a caseload client (NGC-49)').toEqual([]);
    });

    await test.step('Client filter offers only caseload clients (NGC-49)', async () => {
      const options = await rbtSessions.clientFilterOptions();
      expect(options.length).toBeGreaterThan(0);
      expect.soft(options.filter((o) => !caseload.includes(o)), 'client filter is limited to the caseload (NGC-49)').toEqual([]);
    });

    let programCount = NaN;
    await test.step('Home row shows counts and a status for the seeded client', async () => {
      await shell.goToNav('Home');
      await rbtHome.expectLoaded();
      const row = rbtHome.scheduledFor(seededName);
      if (!(await row.waitFor({ timeout: 10_000 }).then(() => true, () => false))) {
        test.info().annotations.push({ type: 'test-data gap', description: `no session scheduled today for ${seededName}; count checks skipped` });
        return;
      }
      const counts = await rbtHome.scheduledCounts(seededName);
      expect(counts.programs).toBeGreaterThanOrEqual(0);
      expect(counts.targets).toBeGreaterThanOrEqual(0);
      programCount = counts.programs;
      await expect(row.locator('[data-testid^="scheduled-sessions-duration-"]')).toBeVisible();
    });

    await test.step('Program count matches the client\'s active skill programs', async () => {
      if (Number.isNaN(programCount)) return;
      await rbtHome.startNewSession();
      await newSession.selectClients([testData.clients.seeded]);
      await newSession.next();
      await newSession.addAllFor(testData.clients.seeded);
      const sessionOrderSkills = async () =>
        Number((await page.getByTestId('new-session-step-programs').innerText()).match(/SESSION ORDER \((\d+) SKILLS?\)/i)?.[1] ?? NaN);
      await expect.poll(sessionOrderSkills, { timeout: 15_000 }).toBeGreaterThan(0);
      const skills = await sessionOrderSkills();
      expect.soft(programCount, 'schedule row program count equals the active skill programs').toBe(skills);
      await newSession.exitLink.click();
    });
  });

  test('TC-US11-02 Open a scheduled session: pre-session page, then data sheet', async ({ page, flows, rbtHome, sessionOpen, dataSheet }) => {
    await flows.signInAs('rbt');
    await rbtHome.expectLoaded();
    await expect(rbtHome.scheduledRows.first().or(page.getByTestId('scheduled-sessions-empty'))).toBeVisible();
    const openable = rbtHome.scheduledRows.filter({ hasNotText: /completed/i }).filter({ has: page.locator('[data-testid^="scheduled-sessions-open-button-"]') });
    test.skip((await openable.count()) === 0, 'no open scheduled session today');
    const seededRow = openable.filter({ hasText: /Benson Moon/ });
    const row = (await seededRow.count()) ? seededRow.first() : openable.first();
    const clientName = await rbtHome.rowClientName(row);

    await test.step('Open shows the pre-session page', async () => {
      await row.locator('[data-testid^="scheduled-sessions-open-button-"]').click();
      await sessionOpen.expectLoaded();
      await expect(sessionOpen.clientDetails).toContainText(clientName);
      await expect(sessionOpen.clientDetails).toContainText('DOB');
      await expect(sessionOpen.service).toBeVisible();
      await expect(sessionOpen.prepCard).toBeVisible();
      const templates = (await sessionOpen.noteTemplate.locator('option').allInnerTexts()).map((t) => t.trim()).filter((t) => t && t !== 'None');
      expect(templates.length, 'account-level note templates are offered').toBeGreaterThan(0);
      await sessionOpen.chooseNoteTemplate(templates[0]);
    });

    await test.step('Start Session opens the data sheet within 2 s', async () => {
      const elapsed = await sessionOpen.start();
      expect.soft(elapsed, 'session start within 2 s (cross-cutting performance)').toBeLessThan(2_000);
      await dataSheet.expectLoaded();
      await expect(dataSheet.header).toContainText(clientName);
      await expect.poll(() => dataSheet.clockSeconds(), { timeout: 10_000 }).toBeGreaterThan(0);
    });

    await test.step('Conclude and finalize', async () => {
      await flows.concludeAndFinalize();
    });
  });

  test('TC-US11-03 Concluded session appears in "Incomplete session notes" for its client only', async ({ page, flows, rbtHome, dataSheet, sessionClose, testData }) => {
    const program = testData.seeded.obProgram;
    const target = testData.seeded.obTarget;
    await flows.signInAs('rbt');
    await flows.startLiveSessionAsRbt({ clientIds: [testData.clients.seeded], programs: { [testData.clients.seeded]: [program] } });
    const clientName = await dataSheet.title();

    await test.step('Record a trial and conclude', async () => {
      await dataSheet.recordOutcome(program, target, 'Correct');
      await flows.concludeToSummary();
    });

    const before = await test.step('Leave the summary and go Home', async () => {
      await page.getByTestId('session-focus-header-back-button').click();
      await page.goto('/rbt');
      await rbtHome.expectLoaded();
      const listed = await rbtHome.concludedFor(clientName).first().waitFor({ timeout: 15_000 }).then(() => true, () => false);
      expect.soft(listed, 'a concluded, unfinalized session is listed under Incomplete session notes').toBe(true);
      return listed;
    });

    await test.step('Incomplete session notes count matches its rows', async () => {
      test.skip(!before, 'concluded session not listed - see soft failure');
      const rows = await rbtHome.concludedRows.count();
      expect(Number((await rbtHome.incompleteCount.innerText()).trim())).toBe(rows);
      await expect(rbtHome.concludedFor(clientName).first()).toContainText(/not (finali[sz]ed|finished)/i);
    });

    await test.step('Open the row and finalize', async () => {
      if (before) await rbtHome.reviewConcluded(clientName);
      else await page.goBack();
      await sessionClose.expectLoaded();
      await sessionClose.finalize();
      await page.goto('/rbt');
      await rbtHome.expectLoaded();
      await expect(rbtHome.concludedFor(clientName)).toHaveCount(0);
    });
  });
});
