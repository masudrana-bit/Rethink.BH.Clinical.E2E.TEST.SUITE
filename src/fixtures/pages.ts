import { Page } from '@playwright/test';
import { SignInPage } from '../pages/auth/SignInPage';
import { AppShell } from '../pages/shell/AppShell';
import { ClientsListPage } from '../pages/clients/ClientsListPage';
import { ClientWorkspace } from '../pages/clients/ClientWorkspace';
import { TreatmentPlanPage } from '../pages/plan/TreatmentPlanPage';
import { AddProgramDialog } from '../pages/plan/AddProgramDialog';
import { CustomProgramForm } from '../pages/plan/CustomProgramForm';
import { ProgramDetailsPage } from '../pages/program/ProgramDetailsPage';
import { TargetManagerDrawer } from '../pages/program/TargetManagerDrawer';
import { PhaseChangeDialog } from '../pages/program/PhaseChangeDialog';
import { DataCollectionWizard } from '../pages/program/DataCollectionWizard';
import { ProgramDataTab } from '../pages/program/ProgramDataTab';
import { ClientSessionsPage } from '../pages/sessions/ClientSessionsPage';
import { NewSessionWizard } from '../pages/sessions/NewSessionWizard';
import { DataSheetPage } from '../pages/sessions/DataSheetPage';
import { AbcEntryDialog } from '../pages/sessions/AbcEntryDialog';
import { CloseSessionDialog } from '../pages/sessions/CloseSessionDialog';
import { SessionClosePage } from '../pages/sessions/SessionClosePage';
import { SessionOpenPage } from '../pages/sessions/SessionOpenPage';
import { BulkEntryPage } from '../pages/sessions/BulkEntryPage';
import { RbtHomePage } from '../pages/rbt/RbtHomePage';
import { RbtSessionsPage } from '../pages/rbt/RbtSessionsPage';
import { BehaviorSupportPage } from '../pages/behavior/BehaviorSupportPage';
import { AnalyzeDataPage } from '../pages/analysis/AnalyzeDataPage';
import { FunderReportsPage } from '../pages/reports/FunderReportsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { ProgramLibraryAdminPage } from '../pages/settings/ProgramLibraryAdminPage';
import { ProgramEditorDialog } from '../pages/settings/ProgramEditorDialog';

export function createPages(page: Page) {
  return {
    signIn: new SignInPage(page),
    shell: new AppShell(page),
    clientsList: new ClientsListPage(page),
    workspace: new ClientWorkspace(page),
    plan: new TreatmentPlanPage(page),
    addProgram: new AddProgramDialog(page),
    customProgram: new CustomProgramForm(page),
    programDetails: new ProgramDetailsPage(page),
    targets: new TargetManagerDrawer(page),
    phaseDialog: new PhaseChangeDialog(page),
    dataCollection: new DataCollectionWizard(page),
    programData: new ProgramDataTab(page),
    clientSessions: new ClientSessionsPage(page),
    newSession: new NewSessionWizard(page),
    dataSheet: new DataSheetPage(page),
    abc: new AbcEntryDialog(page),
    closeSession: new CloseSessionDialog(page),
    sessionClose: new SessionClosePage(page),
    sessionOpen: new SessionOpenPage(page),
    bulkEntry: new BulkEntryPage(page),
    rbtHome: new RbtHomePage(page),
    rbtSessions: new RbtSessionsPage(page),
    behavior: new BehaviorSupportPage(page),
    analyze: new AnalyzeDataPage(page),
    funderReports: new FunderReportsPage(page),
    settings: new SettingsPage(page),
    programLibrary: new ProgramLibraryAdminPage(page),
    programEditor: new ProgramEditorDialog(page),
  };
}

export type Pages = ReturnType<typeof createPages>;
