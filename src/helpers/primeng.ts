import { expect, Locator, Page } from '@playwright/test';

export const FIRST_OPTION = '__first__';

const visibleOptions = (page: Page) => page.locator('[role=option]:visible');

/** Opens a PrimeNG <p-select>/<p-multiselect> unless it is already open (autofocused selects open themselves). */
async function openSelect(page: Page, select: Locator): Promise<boolean> {
  const target = select.locator('[role=combobox]').first();
  // While options load the app renders a plain input with the same test id; wait for the real combobox.
  await expect(target).toBeVisible({ timeout: 30_000 });
  if ((await target.getAttribute('aria-disabled')) === 'true') return false;
  const optionsShown = (timeout: number) =>
    visibleOptions(page).first().waitFor({ state: 'visible', timeout }).then(() => true, () => false);
  if ((await target.getAttribute('aria-expanded')) !== 'true') await target.click();
  if (await optionsShown(5_000)) return true;
  if ((await target.getAttribute('aria-expanded')) !== 'true') await target.click();
  return optionsShown(10_000);
}

/** Opens a PrimeNG <p-select> (identified by its host locator) and picks the option with the given label. */
export async function selectPrimeOption(page: Page, select: Locator, option: string | RegExp): Promise<void> {
  const name = typeof option === 'string' ? new RegExp(`^\\s*${option.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`) : option;
  // Focus-opened selects can toggle shut while the overlay animates, so retry open + pick as one unit.
  await expect(async () => {
    expect(await openSelect(page, select), `options of ${select} should open`).toBe(true);
    await visibleOptions(page).filter({ hasText: name }).first().click({ timeout: 3_000 });
    await expect(visibleOptions(page)).toHaveCount(0, { timeout: 3_000 });
  }).toPass({ timeout: 45_000 });
}

/** Picks the first option of a PrimeNG <p-select>; returns its label, or '' when the list is empty or disabled. */
export async function selectFirstPrimeOption(page: Page, select: Locator): Promise<string> {
  if (!(await openSelect(page, select))) {
    await page.keyboard.press('Escape');
    return '';
  }
  const label = (await visibleOptions(page).first().innerText()).trim();
  await selectPrimeOption(page, select, label);
  return label;
}

/** Selects `option`, or the first available option when `option` is FIRST_OPTION. */
export async function selectPrimeOptionOrFirst(page: Page, select: Locator, option: string | RegExp): Promise<string> {
  if (option === FIRST_OPTION) return selectFirstPrimeOption(page, select);
  await selectPrimeOption(page, select, option);
  return String(option);
}

/**
 * Returns all option labels of a PrimeNG <p-select> and closes it again.
 * Pass `closeByClick` inside dialogs, where Escape would close the dialog too.
 */
export async function readPrimeOptions(page: Page, select: Locator, { closeByClick = false } = {}): Promise<string[]> {
  if (!(await openSelect(page, select))) return [];
  // Options can arrive after the overlay opens (placeholder "All ..." first), so let the list settle.
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await expect.poll(async () => visibleOptions(page).count(), { timeout: 5_000 }).toBeGreaterThan(1).catch(() => undefined);
  const labels = (await visibleOptions(page).allInnerTexts()).map((t) => t.trim());
  if (closeByClick) await select.locator('[role=combobox]').first().click();
  else await page.keyboard.press('Escape');
  await expect(visibleOptions(page)).toHaveCount(0);
  return labels;
}

/** Picks one or more options in a PrimeNG <p-multiselect>. */
export async function selectPrimeMultiOptions(page: Page, multiselect: Locator, options: (string | RegExp)[]): Promise<void> {
  expect(await openSelect(page, multiselect)).toBe(true);
  for (const option of options) {
    await visibleOptions(page).filter({ hasText: option }).first().click();
  }
  await page.keyboard.press('Escape');
}

/** Sets a PrimeNG <p-checkbox> or native checkbox to the wanted state. */
export async function setPrimeCheckbox(checkbox: Locator, checked: boolean): Promise<void> {
  const input = (await checkbox.evaluate((el) => el.tagName === 'INPUT')) ? checkbox : checkbox.locator('input[type=checkbox]').first();
  if ((await input.isChecked()) !== checked) {
    await input.setChecked(checked, { force: true }).catch(() => checkbox.click());
  }
  await expect(input).toBeChecked({ checked });
}

/** Clicks a PrimeNG radio button host (<p-radiobutton>) and asserts it is selected. */
export async function choosePrimeRadio(radio: Locator): Promise<void> {
  const input = radio.locator('input[type=radio]').first();
  await input.check({ force: true });
  await expect(input).toBeChecked();
}
