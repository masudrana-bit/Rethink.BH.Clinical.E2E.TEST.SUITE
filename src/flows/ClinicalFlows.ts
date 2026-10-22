import { expect, Page, TestInfo } from '@playwright/test';
import { env, Role } from '../config/env';
import { Pages } from '../fixtures/pages';
import { CustomProgramInput } from '../pages/plan/CustomProgramForm';
import { COLLECTION_TYPE_LABELS, CollectionType } from '../pages/program/DataCollectionWizard';
import { customProgramInput } from '../data/programs';
import { SessionSetup } from '../pages/sessions/NewSessionWizard';

/** Business-level user journeys composed from page objects, shared by story and core specs. */
export class ClinicalFlows {
  private readonly createdPrograms: { clientId: string; programId: string }[] = [];

  constructor(private readonly page: Page, private readonly pages: Pages, private readonly testInfo: TestInfo) {}

  /** Deletes programs this test created that are still on a plan (used after a failed test). Never touches non-E2E programs. */
  async deleteLeftoverPrograms(): Promise<void> {
    const { programDetails } = this.pages;
    for (const { clientId, programId } of this.createdPrograms) {
      try {
        await this.page.goto(`/clients/${clientId}/programs/${programId}`);
        await expect(programDetails.actionsMenu).toBeVisible({ timeout: 30_000 });
        await expect(this.page).toHaveURL(new RegExp(`/programs/${programId}(\\?|$)`));
        const title = (await programDetails.title.innerText()).trim();
        if (!/^E2E-\d{10}-/.test(title)) continue;
        await programDetails.deleteProgram(title);
        this.testInfo.annotations.push({ type: 'cleanup', description: `deleted leftover program "${title}"` });
      } catch {
        // Already deleted or not reachable - nothing to clean.
      }
    }
  }

  /** Sign in through the real sign-in screen and land in the right shell for the role. */
  async signInAs(role: Role, { reloadAfterToggle = true } = {}): Promise<void> {
    const credentials = env.accounts[role];
    await this.pages.signIn.open();
    await this.pages.signIn.signIn(credentials);
    await this.pages.shell.expectSignedIn();
    if (credentials.usesRoleToggle) {
      this.testInfo.annotations.push({ type: 'role', description: `${role} simulated with the view toggle on the shared login` });
      await this.pages.shell.switchView(role === 'rbt' ? 'rbt' : 'bcba');
      // The RBT view only loads the caseload and schedule on a full page load (see US-10).
      if (role === 'rbt' && reloadAfterToggle) {
        await this.page.reload();
        await this.pages.shell.expectSignedIn();
      }
    }
    if (role === 'rbt') await expect(this.page).toHaveURL(/\/rbt/);
  }

  /** Clients page -> pick client -> Skills Programs loaded. Returns the client's display name. */
  async openClient(clientId: string): Promise<string> {
    const { shell, clientsList, plan } = this.pages;
    if (!/\/clients(\?|$)/.test(this.page.url())) await shell.goToNav('Clients');
    await clientsList.expectLoaded();
    const name = await clientsList.openClient(clientId);
    await plan.expectLoaded();
    await expect(shell.clientSwitcher).toContainText(name.split(' ')[0]);
    return name;
  }

  /** Opens a client's plan by URL (used after a role switch, when the clients list may not reload). */
  async openClientByUrl(clientId: string): Promise<void> {
    await this.page.goto(`/clients/${clientId}`);
    await this.pages.plan.expectLoaded();
  }

  async addLibraryProgram(programName: string, status: 'current' | 'future'): Promise<boolean> {
    const { plan, addProgram } = this.pages;
    await plan.openAddProgram();
    await addProgram.expectLoaded();
    await addProgram.searchFor(programName);
    const duplicate = await addProgram.addProgram(programName, status);
    if (await addProgram.search.isVisible()) await addProgram.close();
    return duplicate;
  }

  /** Precondition helper: deletes `programName` from the open client's plan (Current and Inactive lists) if present. */
  async removeProgramIfPresent(programName: string): Promise<void> {
    const { plan, programDetails } = this.pages;
    for (const timeline of ['current', 'inactive'] as const) {
      await plan.showTimeline(timeline);
      const matches = plan.railMatches(programName);
      let remaining = await matches.count();
      while (remaining > 0) {
        await plan.openProgram(programName);
        await programDetails.deleteProgram(programName);
        await plan.showTimeline(timeline);
        await expect(matches).toHaveCount(remaining - 1);
        remaining -= 1;
      }
    }
    await plan.showTimeline('current');
  }

  async createCustomProgram(input: CustomProgramInput): Promise<string> {
    const { plan, addProgram, customProgram, programDetails } = this.pages;
    await plan.openAddProgram();
    await addProgram.openCreateCustom();
    await customProgram.fill(input);
    await customProgram.save();
    await plan.expectProgramListed(input.title, input.status === 'future' ? 'inactive' : 'current').catch(async () => {
      await plan.expectProgramListed(input.title, 'current');
    });
    await plan.openProgram(input.title);
    await programDetails.expectLoaded();
    const programId = await programDetails.programId();
    const clientId = this.page.url().match(/clients\/(\d+)/)?.[1];
    if (clientId && programId) this.createdPrograms.push({ clientId, programId });
    return programId;
  }

  /**
   * BCBA: creates an E2E custom program on the open client and saves its collection type.
   * Types whose mastery step blocks Save until maintenance has its own threshold get one (see US-9), noted as a workaround.
   */
  async createCollectionProgram(type: CollectionType, { label, targets, prompts }: { label?: string; targets?: string[]; prompts?: boolean } = {}): Promise<string> {
    const { programDetails, dataCollection } = this.pages;
    const input = customProgramInput(label ?? `${COLLECTION_TYPE_LABELS[type]} Program`, targets ? { targets } : {});
    await this.createCustomProgram(input);
    await programDetails.manageDataCollectionButton.click();
    await dataCollection.expectOpen();
    await dataCollection.chooseType(type);
    if (prompts !== undefined) await dataCollection.setDimension('prompts', prompts);
    await dataCollection.goToMastery();
    if (await dataCollection.saveButton.isDisabled()) {
      this.testInfo.annotations.push({ type: 'workaround', description: `${COLLECTION_TYPE_LABELS[type]}: Save blocked by ${JSON.stringify(await dataCollection.blockingMessages())}; filled intervention and custom maintenance thresholds` });
      await dataCollection.setMastery({ interventionThreshold: 5, maintenanceCustomThreshold: 5 });
      if (type === 'frequency-duration') {
        await dataCollection.field(dataCollection.interventionSection, 'secondary-threshold').fill('1');
        const maintenanceSecondary = dataCollection.field(dataCollection.maintenanceSection, 'secondary-threshold');
        if (await maintenanceSecondary.isVisible()) await maintenanceSecondary.fill('1');
      }
    }
    await dataCollection.save();
    await expect(programDetails.dataSettings).toContainText(COLLECTION_TYPE_LABELS[type]);
    return input.title;
  }

  /** Moves the signed-in user to another role: the view toggle on a shared login, otherwise sign out and in again. */
  async switchRole(role: 'bcba' | 'rbt'): Promise<void> {
    const target = env.accounts[role];
    const current = env.accounts[role === 'rbt' ? 'bcba' : 'rbt'];
    if (target.usesRoleToggle || target.username === current.username) {
      await this.pages.shell.switchView(role);
      if (role === 'rbt') {
        await this.page.reload();
        await this.pages.shell.expectSignedIn();
      }
    } else {
      await this.pages.shell.logOut();
      await this.signInAs(role);
    }
  }

  /** Chained core scenarios keep their programs for the next scenario. */
  keepCreatedPrograms(): void {
    this.createdPrograms.length = 0;
  }

  /** Deletes every program this test created (switching back to the BCBA view first). */
  async deleteCreatedPrograms(): Promise<void> {
    if (!this.createdPrograms.length) return;
    if (/\/(rbt|sessions)(\/|\?|$)/.test(this.page.url())) await this.switchRole('bcba').catch(() => undefined);
    await this.deleteLeftoverPrograms();
    this.createdPrograms.length = 0;
  }

  async openProgram(programName: string): Promise<void> {
    const { workspace, plan, programDetails } = this.pages;
    if (!/\/clients\/\d+(\/programs\/\d+)?(\?.*)?$/.test(this.page.url())) await workspace.openTab('skills-programs');
    await plan.expectLoaded();
    await plan.openProgram(programName);
    await programDetails.expectLoaded();
  }

  /** Client Sessions tab -> Start Live Session -> wizard -> data sheet. */
  async startLiveSessionFromClient(setup: SessionSetup): Promise<string> {
    const { workspace, clientSessions, newSession, dataSheet } = this.pages;
    await workspace.openTab('sessions');
    await clientSessions.expectLoaded();
    await clientSessions.startLive();
    await newSession.expectOpen('LIVE');
    const id = await newSession.startSession(setup);
    await dataSheet.expectLoaded();
    return id;
  }

  /** RBT home -> New Session -> wizard -> data sheet. */
  async startLiveSessionAsRbt(setup: SessionSetup): Promise<string> {
    const { rbtHome, newSession, dataSheet } = this.pages;
    await rbtHome.expectLoaded();
    await rbtHome.startNewSession();
    await newSession.expectOpen('LIVE');
    const id = await newSession.startSession(setup);
    await dataSheet.expectLoaded();
    return id;
  }

  /** Data sheet -> Close Session -> Conclude -> summary. */
  async concludeToSummary(): Promise<void> {
    const { dataSheet, closeSession, sessionClose } = this.pages;
    await dataSheet.openCloseSession();
    const runningTimers = await closeSession.concludeToNote();
    if (runningTimers) this.testInfo.annotations.push({ type: 'timers', description: runningTimers });
    await sessionClose.expectLoaded();
  }

  /**
   * Data sheet -> Close Session -> Conclude -> (optional note) -> Finalize. Returns the finalize prompt wording.
   * Concluded sessions are only kept on this device until finalized, so tests finalize in the same browser.
   */
  async concludeAndFinalize(note?: string): Promise<string> {
    const { sessionClose } = this.pages;
    await this.concludeToSummary();
    if (note) await sessionClose.writeNote(note);
    return sessionClose.finalize();
  }

  /**
   * From the BCBA view: RBT ad-hoc session on one program, records the outcomes on one target, finalizes,
   * then returns to the BCBA view. Finalized sessions also feed this device's Observations grid.
   */
  async runFinalizedSession(clientId: string, program: string, target: string, outcomes: ('Correct' | 'Incorrect')[]): Promise<void> {
    const { dataSheet } = this.pages;
    await this.switchRole('rbt');
    await this.startLiveSessionAsRbt({ clientIds: [clientId], programs: { [clientId]: [program] } });
    await dataSheet.showProgram(program);
    for (const outcome of outcomes) await dataSheet.recordOutcome(program, target, outcome);
    await this.concludeAndFinalize();
    await this.switchRole('bcba');
  }

  /** Opens the client's Add Program dialog and reports which sources offer `programName`. */
  async addProgramCatalogOffers(clientId: string, programName: string): Promise<string[]> {
    const { plan, addProgram } = this.pages;
    await this.page.goto(`/clients/${clientId}`);
    await plan.expectLoaded();
    await plan.openAddProgram();
    await addProgram.expectLoaded();
    const found: string[] = [];
    for (const source of ['System Programs', 'My Programs'] as const) {
      await addProgram.chooseSource(source).catch(() => undefined);
      if (await addProgram.offers(programName)) found.push(source);
    }
    await addProgram.close();
    return found;
  }

  /** Finalizes the open summary; group sessions may ask once per client. */
  async finalizeAll(maxClients = 8): Promise<string> {
    const { sessionClose } = this.pages;
    const prompts: string[] = [];
    for (let i = 0; i < maxClients && /\/summary/.test(this.page.url()); i++) {
      await sessionClose.expectLoaded();
      prompts.push(await sessionClose.finalize());
    }
    return prompts[0] ?? '';
  }

  async evidence(name: string): Promise<void> {
    await this.testInfo.attach(name, { body: await this.page.screenshot({ fullPage: true }), contentType: 'image/png' });
  }
}
