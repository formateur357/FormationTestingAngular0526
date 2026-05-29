import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { UserListPage } from '../pages/user-list.page';
import { UserFormPage } from '../pages/user-form.page';

type AppFixtures = {
  loginPage: LoginPage;
  userListPage: UserListPage;
  loggedInPage: UserListPage;
  userFormPage: UserFormPage;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await use(loginPage);
  },

  userListPage: async ({ page }, use) => {
    const userListPage = new UserListPage(page);

    await use(userListPage);
  },

  userFormPage: async ({ page }, use) => {
    const userFormPage = new UserFormPage(page);

    await use(userFormPage);
  },

  loggedInPage: async ({ page }, use) => {
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'valid-test-token');

      localStorage.setItem(
        'user',
        JSON.stringify({
          id: 1,
          name: 'Admin Test',
          role: 'admin',
        }),
      );
    });

    await page.route('**/api/users', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            name: 'Alice',
            email: 'alice@example.com',
            role: 'admin',
          },
        ]),
      });
    });

    const userListPage = new UserListPage(page);

    await userListPage.goto();

    await use(userListPage);
  },
});

export { expect };
