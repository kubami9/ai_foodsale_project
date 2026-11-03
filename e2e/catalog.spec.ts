import { test, expect } from '@playwright/test';

test('browse, search, open product details and return with filters preserved', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Dobre jedzenie. Blisko Ciebie.' })).toBeVisible();
  await expect(
    page.getByRole('status').filter({ hasText: 'Znalezione produkty: 6' }),
  ).toBeVisible();
  await expect(page.getByRole('searchbox')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('catalog.png'), fullPage: true });
  await page.getByRole('searchbox').fill('Ser kozi');
  await page.getByRole('button', { name: 'Szukaj', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Znalezione produkty: 1');
  await page.getByRole('heading', { name: 'Ser kozi z ziołami' }).getByRole('link').click();
  await expect(page.getByRole('heading', { name: 'Ser kozi z ziołami', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Zagroda pod Lipami' })).toBeVisible();
  await expect(page.getByText('24,00', { exact: false }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Ser kozi z ziołami', level: 1 })).toBeVisible();
  await page.getByRole('link', { name: 'Wróć do produktów' }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('Ser kozi');
  await expect(page.getByRole('status')).toHaveText('Znalezione produkty: 1');
});

test('filter by category and availability', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Gotowe dania' }).click();
  await expect(page.getByRole('heading', { name: 'Pierogi z pieczonymi warzywami' })).toBeVisible();
  await page.getByRole('checkbox', { name: 'Tylko dostępne' }).check();
  await expect(page.getByRole('heading', { name: 'Tym razem koszyk jest pusty' })).toBeVisible();
  await page.getByRole('link', { name: 'Wyczyść filtry' }).click();
  await expect(page.getByRole('status')).toHaveText('Znalezione produkty: 6');
});

test('show an empty search result', async ({ page }) => {
  await page.goto('/?query=nieistniejacy-produkt');
  await expect(page.getByRole('heading', { name: 'Tym razem koszyk jest pusty' })).toBeVisible();
});

test('show API failure and allow retry', async ({ page }) => {
  await page.route('**/api/products?*', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: false,
        error: { code: 'DATABASE_UNAVAILABLE', message: 'Katalog jest chwilowo niedostępny.' },
      }),
    }),
  );
  await page.goto('/?query=ser');
  await expect(page.getByRole('alert')).toContainText('Katalog jest chwilowo niedostępny.');
  await page.unroute('**/api/products?*');
  await page.getByRole('button', { name: 'Spróbuj ponownie' }).click();
  await expect(page.getByRole('heading', { name: 'Ser kozi z ziołami' })).toBeVisible();
});

test('show missing products without breaking navigation', async ({ page }) => {
  await page.goto('/produkty/20000000-0000-4000-8000-999999999999');
  await expect(page.getByRole('alert')).toContainText('Nie znaleziono produktu.');
  await page.getByRole('link', { name: 'Wróć do produktów' }).click();
  await expect(page.getByRole('status')).toHaveText('Znalezione produkty: 6');
});
