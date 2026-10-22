import { test as base, expect, Page } from '@playwright/test';
import { createPages, Pages } from './pages';
import { ClinicalFlows } from '../flows/ClinicalFlows';
import { env } from '../config/env';
import { KNOWN_DEFECTS } from '../data/known-defects';

type Fixtures = {
  pages: Pages;
  flows: ClinicalFlows;
  testData: typeof env;
  knownDefect: void;
} & Pages;

const stripAnsi = (s: string): string => s.replace(/\u001b\[[0-9;]*m/g, '');

const pageCache = new WeakMap<Page, Pages>();
const pagesFor = (page: Page): Pages => {
  if (!pageCache.has(page)) pageCache.set(page, createPages(page));
  return pageCache.get(page)!;
};

export const test = base.extend<Fixtures>({
  knownDefect: [async ({}, use, testInfo) => {
    const id = testInfo.title.match(/TC-US\d+-\d+/)?.[0];
    const entries = id && process.env.IGNORE_KNOWN_DEFECTS !== '1' ? [KNOWN_DEFECTS[id] ?? []].flat() : [];
    const defect = entries.find((e) => !e.envs || e.envs.includes(env.name));
    if (defect) testInfo.fail(true, `${id}: ${defect.summary}`);
    await use();
    if (!defect || testInfo.status !== 'failed') return;
    const other = testInfo.errors.map((e) => stripAnsi(e.message ?? '')).filter((m) => !defect.match.test(m));
    if (other.length) {
      testInfo.annotations.push({ type: 'not the known defect', description: other[0].split('\n')[0].slice(0, 250) });
      testInfo.expectedStatus = 'passed';
    }
  }, { auto: true }],
  pages: async ({ page }, use) => use(pagesFor(page)),
  flows: async ({ page }, use, testInfo) => {
    const flows = new ClinicalFlows(page, pagesFor(page), testInfo);
    await use(flows);
    await flows.deleteCreatedPrograms();
  },
  testData: async ({}, use) => use(env),
  signIn: async ({ pages }, use) => use(pages.signIn),
  shell: async ({ pages }, use) => use(pages.shell),
  clientsList: async ({ pages }, use) => use(pages.clientsList),
  workspace: async ({ pages }, use) => use(pages.workspace),
  plan: async ({ pages }, use) => use(pages.plan),
  addProgram: async ({ pages }, use) => use(pages.addProgram),
  customProgram: async ({ pages }, use) => use(pages.customProgram),
  programDetails: async ({ pages }, use) => use(pages.programDetails),
  targets: async ({ pages }, use) => use(pages.targets),
  phaseDialog: async ({ pages }, use) => use(pages.phaseDialog),
  dataCollection: async ({ pages }, use) => use(pages.dataCollection),
  programData: async ({ pages }, use) => use(pages.programData),
  clientSessions: async ({ pages }, use) => use(pages.clientSessions),
  newSession: async ({ pages }, use) => use(pages.newSession),
  dataSheet: async ({ pages }, use) => use(pages.dataSheet),
  abc: async ({ pages }, use) => use(pages.abc),
  closeSession: async ({ pages }, use) => use(pages.closeSession),
  sessionClose: async ({ pages }, use) => use(pages.sessionClose),
  sessionOpen: async ({ pages }, use) => use(pages.sessionOpen),
  bulkEntry: async ({ pages }, use) => use(pages.bulkEntry),
  rbtHome: async ({ pages }, use) => use(pages.rbtHome),
  rbtSessions: async ({ pages }, use) => use(pages.rbtSessions),
  behavior: async ({ pages }, use) => use(pages.behavior),
  analyze: async ({ pages }, use) => use(pages.analyze),
  funderReports: async ({ pages }, use) => use(pages.funderReports),
  settings: async ({ pages }, use) => use(pages.settings),
  programLibrary: async ({ pages }, use) => use(pages.programLibrary),
  programEditor: async ({ pages }, use) => use(pages.programEditor),
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await testInfo.attach('failure-url', { body: page.url(), contentType: 'text/plain' });
  }
});

export { expect };
