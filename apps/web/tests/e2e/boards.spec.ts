import { expect, test } from '@playwright/test';

test('boards page filter and board detail tabs', async ({ page }) => {
  await page.goto('/boards');

  await page.getByRole('button', { name: 'Starter' }).click();

  const boardLinks = page.locator('a[href^="/boards/"]');
  await expect(boardLinks.first()).toBeVisible();

  await boardLinks.first().click();

  await expect(page.getByRole('tab', { name: 'Missions' })).toBeVisible();
  await page.getByRole('tab', { name: 'Rewards' }).click();
  await expect(page.getByRole('heading', { name: 'Pins ที่ได้รับ' })).toBeVisible();
});
