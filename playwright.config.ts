import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

export default defineConfig({
  testDir: './tests',
  timeout: 6 * 60_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // dev2 allows one session per user, and every role shares the BCBA login, so tests cannot run in parallel.
  workers: 1,
  outputDir: 'reports/artifacts',
  // The release dashboard (scripts/build-run-summary.mjs) reads test-results/results.json and links into playwright-report.
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ...(process.env.CI ? [['github'] as ['github']] : []),
  ],
  metadata: { environment: env.baseUrl, environmentName: env.name, build: env.buildId || 'not recorded', ticket: 'RHD-57736' },
  use: {
    baseURL: env.baseUrl,
    testIdAttribute: 'data-testid',
    actionTimeout: 20_000,
    navigationTimeout: 45_000,
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: 'core-e2e',
      testDir: './tests/core',
      fullyParallel: false,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'stories',
      testDir: './tests/stories',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'maintenance',
      testDir: './tests/maintenance',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'edge-smoke',
      testDir: './tests',
      grep: /@smoke/,
      use: { ...devices['Desktop Edge'], channel: 'msedge', viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'safari-smoke',
      testDir: './tests',
      grep: /@smoke/,
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'tablet-rbt',
      testDir: './tests/stories',
      grep: /@rbt/,
      use: { ...devices['iPad Pro 11 landscape'] },
    },
  ],
});
