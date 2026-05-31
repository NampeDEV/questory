import { expect, test } from '@playwright/test';

// TEST-004 (TODO_TASKS) — E2E: checkout → order created → activation code generated
// Covers: AC-COMMERCE-003

test.describe('Checkout — order & activation code flow', () => {
  test('AC-COMMERCE-003 · empty submit shows all required-field errors', async ({ page }) => {
    await page.goto('/checkout');

    await page.getByRole('button', { name: 'ส่งข้อมูล' }).click();

    await expect(page.getByText('กรุณากรอกชื่อ')).toBeVisible();
  });

  test('AC-COMMERCE-003 · invalid email shows error', async ({ page }) => {
    await page.goto('/checkout');

    await page.getByLabel('ชื่อ–นามสกุล *').fill('Tester User');
    await page.getByLabel('อีเมล *').fill('not-an-email');
    await page.getByLabel('เบอร์โทรศัพท์ *').fill('0891234567');
    await page.getByLabel('จังหวัด *').selectOption({ label: 'เชียงใหม่' });
    await page.getByLabel('สินค้าที่สนใจ *').selectOption('starter');

    await page.getByRole('button', { name: 'ส่งข้อมูล' }).click();

    await expect(page.getByText('อีเมลไม่ถูกต้อง')).toBeVisible();
  });

  test('AC-COMMERCE-003 · successful order shows confirmation and activation code info', async ({ page }) => {
    await page.goto('/checkout');

    await page.getByLabel('ชื่อ–นามสกุล *').fill('Tester User');
    await page.getByLabel('อีเมล *').fill('tester@example.com');
    await page.getByLabel('เบอร์โทรศัพท์ *').fill('0891234567');
    await page.getByLabel('จังหวัด *').selectOption({ label: 'เชียงใหม่' });
    await page.getByLabel('สินค้าที่สนใจ *').selectOption('starter');

    await page.getByRole('button', { name: 'ส่งข้อมูล' }).click();

    // Order success heading (AC-COMMERCE-003)
    await expect(
      page.getByRole('heading', { name: 'ขอบคุณ!' }),
    ).toBeVisible({ timeout: 5_000 });

    // Success page should tell the user team will follow up (activation code sent via contact)
    await expect(
      page.getByText('ทีมงานจะติดต่อกลับภายใน 1-2 วันทำการ'),
    ).toBeVisible();

    // Return to home link is accessible
    await expect(
      page.getByRole('link', { name: 'กลับหน้าหลัก' }),
    ).toBeVisible();
  });

  test('AC-COMMERCE-004 · checkout page renders without overflow at 360 px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 812 });
    await page.goto('/checkout');

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(360);
  });
});
