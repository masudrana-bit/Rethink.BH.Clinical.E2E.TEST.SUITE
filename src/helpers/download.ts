import { Download, expect, Locator, Page } from '@playwright/test';

/**
 * Clicks an export button and returns the download. Exports first ask for consent
 * ("Export leaves this application"), which has to be accepted before the file is produced.
 */
export async function exportWithConsent(page: Page, button: Locator): Promise<Download> {
  const download = page.waitForEvent('download', { timeout: 60_000 });
  await button.click();
  const consent = page.getByRole('dialog', { name: 'Export leaves this application' });
  await consent.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined);
  if (await consent.isVisible()) {
    await consent.getByRole('button', { name: 'Export', exact: true }).click();
    await expect(consent).toBeHidden();
  }
  return download;
}
