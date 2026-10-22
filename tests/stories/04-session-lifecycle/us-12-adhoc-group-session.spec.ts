import { test, expect } from '../../../src/fixtures/test';

test.describe('US-12 Create an ad-hoc session, incl. multi-client group', { tag: '@US-12' }, () => {
  test('TC-US12-01 Ad-hoc single-client session from RBT home', async ({ flows, rbtHome, newSession, sessionOpen, dataSheet, sessionClose, testData }) => {
    const client = testData.clients.seeded;
    const program = testData.seeded.obProgram;
    const target = testData.seeded.obTarget;
    await flows.signInAs('rbt');

    await test.step('New Session opens the LIVE wizard', async () => {
      await rbtHome.expectLoaded();
      await rbtHome.startNewSession();
      await newSession.expectOpen('LIVE');
      await expect(newSession.steps).toContainText('1. Clients');
    });

    await test.step('Pick the client and one program', async () => {
      await newSession.selectClients([client]);
      await newSession.next();
      await expect(newSession.pick(program)).toBeVisible();
      await newSession.configureClient(client, [program]);
      await newSession.next();
      await expect(newSession.confirmParticipants).toContainText('1 skills & behaviors selected');
    });

    await test.step('Start the session', async () => {
      expect(await newSession.submit()).toBe('open');
      await sessionOpen.expectLoaded();
      await sessionOpen.start();
      await dataSheet.expectLoaded();
      await expect(dataSheet.card(program)).toBeVisible();
    });

    await test.step('Record a trial', async () => {
      await dataSheet.recordOutcome(program, target, 'Correct');
      await expect.poll(() => dataSheet.targetScore(program)).toBe('100%');
    });

    await test.step('Conclude: summary shows the trial, then finalize', async () => {
      await flows.concludeToSummary();
      await expect(sessionClose.scoredTotal).toHaveText(/\b1\b/);
      await expect(sessionClose.programsTotal).toHaveText(/\b1\b/);
      await sessionClose.finalize();
    });
  });

  test('TC-US12-02 Start Live Session from the client page pre-selects the client', async ({ flows, workspace, clientSessions, newSession, sessionOpen, dataSheet, testData }) => {
    const client = testData.clients.seeded;
    await flows.signInAs('bcba');
    const clientName = await flows.openClient(client);

    await test.step('Start Live Session from the client\'s Sessions tab', async () => {
      await workspace.openTab('sessions');
      await clientSessions.expectLoaded();
      await clientSessions.startLive();
      await newSession.expectOpen('LIVE');
    });

    await test.step('The client is pre-selected', async () => {
      const box = newSession.clientCheckbox(client);
      await expect(box).toBeAttached();
      const preselected = await box.isChecked();
      expect.soft(preselected, 'client should be pre-selected when starting from the client page').toBe(true);
      if (!preselected) test.info().annotations.push({ type: 'workaround', description: 'client ticked manually in the wizard' });
      await newSession.selectClients([client]);
    });

    await test.step('Start and land on the data sheet for that client', async () => {
      await newSession.next();
      await newSession.next();
      expect(await newSession.submit()).toBe('open');
      await sessionOpen.start();
      await dataSheet.expectLoaded();
      expect(await dataSheet.title()).toBe(clientName);
    });

    await test.step('Conclude and finalize', async () => {
      await flows.concludeAndFinalize();
    });
  });

  test('TC-US12-03 Group session with two clients records data per client', async ({ flows, rbtHome, newSession, sessionOpen, dataSheet, sessionClose, testData }) => {
    const seeded = testData.clients.seeded;
    const group = testData.clients.group;
    const program = testData.seeded.obProgram;
    await flows.signInAs('rbt');

    await test.step('Pick both clients and a program for each', async () => {
      await rbtHome.expectLoaded();
      await rbtHome.startNewSession();
      await newSession.selectClients([seeded, group]);
      await newSession.next();
      for (const id of [seeded, group]) {
        await newSession.configureClient(id, [program]);
        await expect(newSession.configureButton(id)).toContainText('1 selected');
      }
      await newSession.next();
      await expect(newSession.confirmParticipants).toContainText('1 skills & behaviors selected');
    });

    await test.step('Pre-session page has a tab per client', async () => {
      expect(await newSession.submit()).toBe('open');
      await expect(sessionOpen.clientTabs).toHaveCount(2);
      await sessionOpen.start();
      await dataSheet.expectLoaded();
      expect((await dataSheet.title()).split(',').length).toBe(2);
    });

    const targets: Record<string, string> = {};
    await test.step('Record a trial for each client in its own section', async () => {
      for (const id of [seeded, group]) {
        const card = await dataSheet.showProgram(program, id);
        targets[id] = (await dataSheet.targetNames(card))[0];
        expect(targets[id], `client ${id} has a target on "${program}"`).toBeTruthy();
      }
      await dataSheet.recordOutcome(program, targets[seeded], 'Correct', seeded);
      await dataSheet.recordOutcome(program, targets[group], 'Incorrect', group);
      await expect.poll(() => dataSheet.targetScore(program, seeded)).toBe('100%');
      await expect.poll(() => dataSheet.targetScore(program, group)).toBe('0%');
    });

    await test.step('Summary keeps each client\'s data separate', async () => {
      await flows.concludeToSummary();
      await expect(sessionClose.clientTabs).toHaveCount(2);
      await sessionClose.showClient(seeded);
      await expect(sessionClose.scoredTotal).toHaveText(/\b1\b/);
      await expect(sessionClose.overallPercent).toHaveText('100%');
      await sessionClose.showClient(group);
      await expect(sessionClose.scoredTotal).toHaveText(/\b1\b/);
      await expect(sessionClose.overallPercent).toHaveText('0%');
    });

    await test.step('Finalize', async () => {
      await flows.finalizeAll();
    });
  });
});
