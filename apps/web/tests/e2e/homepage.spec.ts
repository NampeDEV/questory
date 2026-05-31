import { expect, test } from '@playwright/test';

test('homepage renders hero and CTA links', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Turn Every Journey into an Achievement' })).toBeVisible();

  const startQuest = page.getByRole('link', { name: 'Start Your Quest' });
  await expect(startQuest).toHaveAttribute('href', '/activate');

  const memoryHeading = page.getByRole('heading', { name: 'Memory Wall' });
  await expect(memoryHeading).toBeVisible();
});
