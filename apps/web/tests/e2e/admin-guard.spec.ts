import { expect, test } from '@playwright/test';

test('admin route redirects when not authenticated as admin', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/auth\/admin-sign-in\?redirect=%2Fadmin/);
});
