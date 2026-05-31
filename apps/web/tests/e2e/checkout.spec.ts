import { expect, test } from '@playwright/test';

test('checkout validates and submits', async ({ page }) => {
  await page.goto('/checkout');

  await page.getByRole('button', { name: 'ส่งข้อมูล' }).click();
  await expect(page.getByText('กรุณากรอกชื่อ')).toBeVisible();

  await page.getByLabel('ชื่อ–นามสกุล *').fill('Tester User');
  await page.getByLabel('อีเมล *').fill('tester@example.com');
  await page.getByLabel('เบอร์โทรศัพท์ *').fill('0891234567');
  await page.getByLabel('จังหวัด *').selectOption({ label: 'เชียงใหม่' });
  await page.getByLabel('สินค้าที่สนใจ *').selectOption('starter');

  await page.getByRole('button', { name: 'ส่งข้อมูล' }).click();

  await expect(page.getByRole('heading', { name: 'ขอบคุณ!' })).toBeVisible();
});
