import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { UserListPage } from '../pages/user-list.page';

test.describe('Flux complet utilisateur', () => {

  test('admin can create and delete a user', async ({ page }) => {
    // SETUP : intercepter toutes les API nécessaires
    const createdUser = {
      id: 99, name: 'Nouveau Test', email: 'nouveau@test.com', role: 'user'
    };

    // 1. Mocker login
    await page.route('/api/auth/login', route => route.fulfill({
      status: 200,
      body: JSON.stringify({ token: 'valid-token', user: { id: 1, role: 'admin' } })
    }));

    // 2. Mocker la liste des utilisateurs
    const users = [createdUser];
    await page.route('/api/users', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify(users) });
      } else if (route.request().method() === 'POST') {
        await route.fulfill({ status: 201, body: JSON.stringify(createdUser) });
      }
    });

    // 3. Mocker la suppression
    await page.route('/api/users/99', route =>
      route.fulfill({ status: 204, body: '' })
    );

    // ÉTAPE 1 : Se connecter
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin@example.com', 'admin123');
    await expect(page).toHaveURL('/dashboard');

    // ÉTAPE 2 : Aller sur la liste des utilisateurs
    const userListPage = new UserListPage(page);
    await userListPage.goto();
    await userListPage.expectUserVisible('Nouveau Test');

    // ÉTAPE 3 : TODO - Supprimer l'utilisateur et vérifier
  });

  test('should maintain state during navigation', async ({ page }) => {
    // TODO : tester que les données persistent lors des allers-retours
    // entre la liste et le détail
  });

});