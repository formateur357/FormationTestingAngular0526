import { test, expect } from '@playwright/test';

test.describe('Debug Playwright', () => {
  test('intentionally failing test for debug', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText("Ce texte n'existe pas")).toBeVisible({
      timeout: 3000,
    });
  });
});
