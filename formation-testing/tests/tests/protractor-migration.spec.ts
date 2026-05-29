import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Migration Protractor vers Playwright', () => {
  test('should login and redirect', async ({ page }) => {
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'valid-token',
          user: {
            id: 1,
            email: 'user@test.com',
            role: 'user',
          },
        }),
      });
    });

    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login('user@test.com', 'password');

    await expect(page).toHaveURL(/\/dashboard$/);

    await expect(
      page.getByRole('heading', { name: /tableau de bord|dashboard/i }),
    ).toBeVisible();
  });
});
