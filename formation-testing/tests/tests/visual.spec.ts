import { test, expect } from '@playwright/test';

test.describe('Régression visuelle', () => {
  test.skip(
    'home page visual regression',
    async ({ page }) => {
      await page.goto('/');

      await expect(page).toHaveScreenshot('home-page.png', {
        fullPage: true,
        threshold: 0.1,
      });
    },
  );
});
