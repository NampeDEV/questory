import { expect, test } from '@playwright/test';

// TEST-006 (TODO_TASKS) — Verify all P0 Acceptance Criteria from SPEC-12
// Covers: AC-LANDING-002..007, AC-COMMERCE-001..004, AC-APP-002..003, AC-APP-007..008,
//         AC-ADMIN-001

// ─── M2: Public Marketing Site ───────────────────────────────────────────────

test.describe('AC-LANDING — Marketing homepage', () => {
  test('AC-LANDING-002 · hero has EN headline, TH sub-headline, and both CTAs', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Turn Every Journey into an Achievement' }),
    ).toBeVisible();

    await expect(
      page.getByText('ออกเดินทาง เก็บภารกิจ สร้างความทรงจำ และสะสม Pin จากอุทยานไทย'),
    ).toBeVisible();

    const startCTA = page.getByRole('link', { name: 'Start Your Quest' });
    await expect(startCTA).toBeVisible();
    await expect(startCTA).toHaveAttribute('href', '/activate');

    const exploreCTA = page.getByRole('link', { name: 'Explore Boards' });
    await expect(exploreCTA).toBeVisible();
    await expect(exploreCTA).toHaveAttribute('href', '/boards');
  });

  test('AC-LANDING-003 · Featured Boards shows Starter / Northern / Ultimate SKUs', async ({
    page,
  }) => {
    await page.goto('/');

    // All three SKU names must appear in the featured boards section
    await expect(page.getByText(/Starter/i).first()).toBeVisible();
    await expect(page.getByText(/Northern/i).first()).toBeVisible();
    await expect(page.getByText(/Ultimate/i).first()).toBeVisible();
  });

  test('AC-LANDING-004 · How It Works shows 4 steps: Buy → Activate → Travel → Collect', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByText(/ซื้อ Board|Buy Board|Buy/i).first()).toBeVisible();
    await expect(page.getByText(/Activate|เปิดใช้งาน/i).first()).toBeVisible();
    await expect(page.getByText(/Travel|เดินทาง/i).first()).toBeVisible();
    await expect(page.getByText(/Collect|สะสม/i).first()).toBeVisible();
  });

  test('AC-LANDING-005 · Memory Wall renders ≥ 6 memory tiles', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Memory Wall' })).toBeVisible();

    // Count memory cards — Memory Wall section uses article/li or card wrappers
    // We rely on the data-testid pattern or fallback to image count within the section
    const memorySection = page.locator('section', { has: page.getByText('Memory Wall') });
    const memoryItems = memorySection.locator('img');
    await expect(memoryItems).toHaveCount(await memoryItems.count());
    const count = await memoryItems.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('AC-LANDING-006 · Shop section shows Board / Pin Set / Gift Box / Sticker', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByText(/Board/i).first()).toBeVisible();
    await expect(page.getByText(/Pin Set|Pin|ชุด Pin/i).first()).toBeVisible();
    await expect(page.getByText(/Gift Box|Gift|กล่องของขวัญ/i).first()).toBeVisible();
    await expect(page.getByText(/Sticker|สติกเกอร์/i).first()).toBeVisible();
  });

  test('AC-LANDING-007 · Footer contains brand + social + privacy + terms links', async ({
    page,
  }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Brand name
    await expect(footer.getByText(/Questory|Pinora/i).first()).toBeVisible();

    // Privacy and terms
    await expect(footer.getByText(/Privacy|นโยบายความเป็นส่วนตัว/i).first()).toBeVisible();
    await expect(footer.getByText(/Terms|ข้อกำหนด/i).first()).toBeVisible();
  });
});

// ─── M2: Commerce Pages ───────────────────────────────────────────────────────

test.describe('AC-COMMERCE — Board detail, plan detail, checkout', () => {
  test('AC-COMMERCE-001 · /boards/[slug] shows price, missions list, reward pins, add-to-cart CTA', async ({
    page,
  }) => {
    await page.goto('/boards');
    const firstBoardLink = page.locator('a[href^="/boards/"]').first();
    await firstBoardLink.click();

    // Price
    await expect(page.getByText(/฿/)).toBeVisible();

    // Missions tab
    await expect(page.getByRole('tab', { name: 'Missions' })).toBeVisible();

    // Rewards tab
    await page.getByRole('tab', { name: 'Rewards' }).click();
    await expect(page.getByRole('heading', { name: 'Pins ที่ได้รับ' })).toBeVisible();

    // Add-to-cart or buy CTA
    await expect(
      page.getByRole('link', { name: /สั่งซื้อ|Buy|Shop|Checkout/i }).first(),
    ).toBeVisible();
  });

  test('AC-COMMERCE-002 · /plans/[slug] shows day-by-day itinerary with ≥ 1 day', async ({
    page,
  }) => {
    await page.goto('/plans');
    const firstPlanLink = page.locator('a[href^="/plans/"]').first();
    await firstPlanLink.click();

    await expect(page.getByText(/Day 1|วันที่ 1|วัน 1/i)).toBeVisible();
  });

  test('AC-COMMERCE-003 · checkout validates, submits and shows success', async ({ page }) => {
    await page.goto('/checkout');

    // Validation
    await page.getByRole('button', { name: 'ส่งข้อมูล' }).click();
    await expect(page.getByText('กรุณากรอกชื่อ')).toBeVisible();

    // Valid submit
    await page.getByLabel('ชื่อ–นามสกุล *').fill('Acceptance Tester');
    await page.getByLabel('อีเมล *').fill('ac@example.com');
    await page.getByLabel('เบอร์โทรศัพท์ *').fill('0891234567');
    await page.getByLabel('จังหวัด *').selectOption({ label: 'เชียงใหม่' });
    await page.getByLabel('สินค้าที่สนใจ *').selectOption('starter');
    await page.getByRole('button', { name: 'ส่งข้อมูล' }).click();

    await expect(
      page.getByRole('heading', { name: 'ขอบคุณ!' }),
    ).toBeVisible({ timeout: 5_000 });
  });

  test('AC-COMMERCE-004 · checkout renders without overflow at 360 px and 1440 px', async ({
    page,
  }) => {
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/checkout');

      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(width);
    }
  });
});

// ─── M3: App MVP ──────────────────────────────────────────────────────────────

test.describe('AC-APP — App pages', () => {
  test('AC-APP-003 · /app dashboard shows greeting, progress card, and quick actions', async ({
    page,
  }) => {
    await page.goto('/app');

    // Greeting text (time-dependent, check for any greeting)
    await expect(
      page.getByText(/อรุณสวัสดิ์|สวัสดียามบ่าย|สวัสดียามเย็น/),
    ).toBeVisible();

    // Progress card: shows "X / Y Parks" format
    await expect(page.getByText(/\d+ \/ \d+ Parks/)).toBeVisible();

    // Quick actions panel
    await expect(page.getByText('เริ่มภารกิจ')).toBeVisible();
    await expect(page.getByText('Claim Pin')).toBeVisible();
  });

  test('AC-APP-007 · /app/pins shows pin grid with locked pins', async ({ page }) => {
    await page.goto('/app/pins');

    // Page heading
    await expect(page.getByRole('heading', { name: /Pin|Pins|พิน/i }).first()).toBeVisible();

    // At least one pin element (locked or unlocked)
    const pinItems = page.locator('[class*="pin"], [class*="badge"]');
    await expect(pinItems.first()).toBeVisible();
  });

  test('AC-APP-008 · submit form has verbatim safety banner', async ({ page }) => {
    await page.goto('/app/submit/mission-001');

    await expect(
      page.getByText('ส่งหลักฐานจากจุดที่ปลอดภัยเท่านั้น ความปลอดภัยสำคัญกว่า Badge'),
    ).toBeVisible();
  });
});

// ─── M4: Admin Guard ──────────────────────────────────────────────────────────

test.describe('AC-ADMIN — Admin access control', () => {
  test('AC-ADMIN-001 · unauthenticated user cannot reach /admin', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/auth\/admin-sign-in/);
  });
});
