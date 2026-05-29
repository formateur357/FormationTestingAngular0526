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

    test('should display all users', async ({ page, userListPage }) => {
    // TODO : vérifier que 3 éléments de liste sont présents
    await userListPage.expectUserCount(3);
  });

  test('should display user names', async ({ page, userListPage }) => {
    // TODO : vérifier la présence des noms dans la liste
    await userListPage.expectUserVisible('Alice Martin');
    await userListPage.expectUserVisible('Bob Dupont');
    await userListPage.expectUserVisible('Carol Simon');
  });

  test('should filter users by name', async ({ page, userListPage }) => {
    // TODO :
    // 1. Trouver le champ de recherche
    // 2. Taper 'Alice'
    // 3. Vérifier qu'uniquement Alice est visible
    await userListPage.searchFor('Alice');
    await userListPage.expectUserVisible('Alice Martin');
    await userListPage.expectUserNotVisible('Bob Dupont');
    await userListPage.expectUserNotVisible('Carol Simon');
    await userListPage.expectUserCount(1);
  });

  test('should show empty state when no users', async ({ page, userListPage }) => {
    // Override l'interception pour retourner []
    await page.route('/api/users', route =>
      route.fulfill({ status: 200, body: '[]', contentType: 'application/json' })
    );
    await page.reload();
    // TODO : vérifier le message "Aucun utilisateur"
    await userListPage.expectEmptyStateVisible();
    await userListPage.expectUserCount(0);
  });

  test('should show error when API fails', async ({ page, userListPage }) => {
    await page.route('/api/users', route =>
      route.fulfill({ status: 500, body: 'Server Error' })
    );
    await page.reload();
    // TODO : vérifier le message d'erreur
    await userListPage.expectErrorVisible();
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

test.describe('Création d\'utilisateur', () => {

  test('should create a new user', async ({ page, userFormPage }) => {
    let receivedBody: unknown;

    // Intercepter POST /api/users
    await page.route('/api/users', async route => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON();
        receivedBody = body;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 42, ...body })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    await page.goto('/users/new');

    // TODO :
    // 1. Remplir le formulaire (nom, email, rôle)
    // 2. Soumettre
    // 3. Vérifier la redirection vers /users
    // 4. Vérifier que la requête POST a été envoyée avec les bonnes données
    await userFormPage.fillForm({ name: "David", email: "david@test.com", role: "guest"  });
    await userFormPage.submit();
    await expect(page).toHaveURL(/\/users$/);
    expect(receivedBody).toEqual({
      name: "David",
      email: "david@test.com",
      role: "guest"
    });
  });

  // test('should validate required fields', async ({ page, userFormPage }) => {
  //   await page.goto('/users/new');
  //   await page.getByRole('button', { name: 'Créer' }).click();
  //   // TODO : vérifier les messages de validation
  //   userFormPage.
  // });

});

  
});
