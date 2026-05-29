import { test, expect } from '@playwright/test';

test.describe('Accessibilité de base', () => {
  test('home page should expose basic accessible structure', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('main')).toBeVisible();

    await expect(page.getByRole('navigation')).toBeVisible();

    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(
      focusedElement,
    );

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let index = 0; index < imageCount; index++) {
      const alt = await images.nth(index).getAttribute('alt');

      expect(alt).not.toBeNull();
    }
  });
});
