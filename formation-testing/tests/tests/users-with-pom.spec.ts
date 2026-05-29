import { test, expect } from '../fixtures/app.fixture';

test.describe('Liste des utilisateurs avec POM', () => {
  test('should display users when authenticated', async ({ loggedInPage }) => {
    await loggedInPage.expectUserVisible('Alice');
    await loggedInPage.expectUserCount(1);
  });

  test('should search for a user', async ({ loggedInPage }) => {
    await loggedInPage.searchFor('Alice');

    await loggedInPage.expectUserVisible('Alice');
    await loggedInPage.expectUserCount(1);
  });

  test('should delete a user', async ({ page, loggedInPage }) => {
    await page.route('**/api/users/1', async route => {
      await route.fulfill({
        status: 204,
        body: '',
      });
    });

    await loggedInPage.clickDeleteForUser('Alice');

    await loggedInPage.expectUserNotVisible('Alice');
  });
});

test.describe('Authentification avec POM', () => {
  test('should login and access dashboard', async ({ page, loginPage }) => {
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'valid-token',
          user: {
            id: 1,
            name: 'Admin Test',
            role: 'admin',
          },
        }),
      });
    });

    await loginPage.goto();

    await loginPage.loginAs('admin');

    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
