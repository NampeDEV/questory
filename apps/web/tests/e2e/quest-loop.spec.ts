import path from 'path';
import { expect, test } from '@playwright/test';

// TEST-003 (TODO_TASKS) — E2E: core quest loop
// Covers: safety banner (AC-APP-008), submit proof form (AC-APP-005),
//         success state (AC-APP-006)

test.describe('Core quest loop — submit proof', () => {
  const SUBMIT_URL = '/app/submit/mission-001';

  test('AC-APP-008 · safety banner text is verbatim', async ({ page }) => {
    await page.goto(SUBMIT_URL);

    await expect(
      page.getByText('ส่งหลักฐานจากจุดที่ปลอดภัยเท่านั้น ความปลอดภัยสำคัญกว่า Badge'),
    ).toBeVisible();
  });

  test('AC-APP-005 · form validates required fields before submit', async ({ page }) => {
    await page.goto(SUBMIT_URL);

    // Submit with no inputs — should surface validation errors
    await page.getByRole('button', { name: 'ส่งหลักฐาน' }).click();

    await expect(page.getByText('กรุณาแนบรูปหลักฐาน')).toBeVisible();
    await expect(page.getByText('กรุณาระบุวันที่เดินทาง')).toBeVisible();
    await expect(page.getByText('กรุณายืนยันความปลอดภัย')).toBeVisible();
  });

  test('AC-APP-005 · safety checkbox required — shows error when unchecked', async ({ page }) => {
    await page.goto(SUBMIT_URL);

    // Attach a mock photo
    const mockJpeg = Buffer.alloc(100, 0xff);
    await page.locator('#photo-upload').setInputFiles({
      name: 'proof.jpg',
      mimeType: 'image/jpeg',
      buffer: mockJpeg,
    });

    // Fill travel date
    const today = new Date().toISOString().slice(0, 10);
    await page.locator('#travel-date').fill(today);

    // Submit without safety checkbox
    await page.getByRole('button', { name: 'ส่งหลักฐาน' }).click();

    await expect(page.getByText('กรุณายืนยันความปลอดภัย')).toBeVisible();
  });

  test('AC-APP-005 & AC-APP-006 · complete submission shows success state', async ({ page }) => {
    await page.goto(SUBMIT_URL);

    // Attach a mock photo
    const mockJpeg = Buffer.alloc(100, 0xff);
    await page.locator('#photo-upload').setInputFiles({
      name: 'proof.jpg',
      mimeType: 'image/jpeg',
      buffer: mockJpeg,
    });

    // Fill travel date
    const today = new Date().toISOString().slice(0, 10);
    await page.locator('#travel-date').fill(today);

    // Check safety acknowledgement
    await page.getByRole('checkbox', { name: 'ฉันรับทราบและปฏิบัติตามกฎอุทยานแล้ว' }).check();

    await page.getByRole('button', { name: 'ส่งหลักฐาน' }).click();

    // AC-APP-006: success heading must appear
    await expect(
      page.getByRole('heading', { name: 'ส่งหลักฐานสำเร็จ!' }),
    ).toBeVisible({ timeout: 5_000 });

    // After success the page redirects to mission detail
    await expect(page).toHaveURL(/\/app\/missions\/mission-001/, { timeout: 5_000 });
  });
});
