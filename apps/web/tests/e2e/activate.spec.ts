import { expect, test } from '@playwright/test';

test('activate board accepts valid code and rejects invalid code', async ({ page }) => {
  await page.goto('/activate');

  await page.getByLabel('Activation Code').fill('INVALID-0000');
  await page.getByRole('button', { name: 'เปิดใช้งาน Quest' }).click();
  await expect(page.getByText('Code ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง')).toBeVisible();

  await page.getByLabel('Activation Code').fill('BEGINNER10-DEMO');
  await page.getByRole('button', { name: 'เปิดใช้งาน Quest' }).click();

  await expect(page).toHaveURL(/\/app\/boards/);
});
