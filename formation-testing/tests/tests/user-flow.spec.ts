import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { UserListPage } from '../pages/user-list.page';

test.describe('Flux complet utilisateur', () => {
  test('admin can create and delete a user', async ({ page }) => {
    const createdUser = {
      id: 99,
      name: 'Nouveau Test',
      email: 'nouveau@test.com',
      role: 'user',
    };

    const users = [createdUser];

    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'valid-token',
          user: {
            id: 1,
            role: 'admin',
          },
        }),
      });
    });

    await page.route('**/api/users', async route => {
      const request = route.request();

      if (request.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(users),
        });

        return;
      }

      if (request.method() === 'POST') {
        const body = request.postDataJSON();

        users.push({
          id: 100,
          ...(body as Omit<typeof createdUser, 'id'>),
        });

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 100,
            ...(body as object),
          }),
        });

        return;
      }

      await route.fallback();
    });

    await page.route('**/api/users/99', async route => {
      if (route.request().method() === 'DELETE') {
        const index = users.findIndex(user => user.id === 99);

        if (index !== -1) {
          users.splice(index, 1);
        }

        await route.fulfill({
          status: 204,
          body: '',
        });

        return;
      }

      await route.fallback();
    });

    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('admin@example.com', 'admin123');

    await expect(page).toHaveURL(/\/dashboard$/);

    const userListPage = new UserListPage(page);

    await userListPage.goto();
    await userListPage.expectUserVisible('Nouveau Test');

    await userListPage.clickDeleteForUser('Nouveau Test');

    await userListPage.expectUserNotVisible('Nouveau Test');
  });

  test('should maintain state during navigation', async ({ page }) => {
    const users = [
      {
        id: 1,
        name: 'Alice Martin',
        email: 'alice@example.com',
        role: 'admin',
      },
    ];

    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'valid-token');
    });

    await page.route('**/api/users', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(users),
      });
    });

    await page.route('**/api/users/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(users[0]),
      });
    });

    await page.goto('/users');

    await expect(page.getByText('Alice Martin')).toBeVisible();

    await page.getByRole('link', { name: 'Alice Martin' }).click();

    await expect(page).toHaveURL(/\/users\/1$/);
    await expect(page.getByText('alice@example.com')).toBeVisible();

    await page.getByRole('link', { name: /retour aux utilisateurs/i }).click();

    await expect(page).toHaveURL(/\/users$/);
    await expect(page.getByText('Alice Martin')).toBeVisible();
  });
});
