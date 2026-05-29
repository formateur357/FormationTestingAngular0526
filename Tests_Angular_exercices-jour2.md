# 📝 Exercices Jour 2 — Playwright E2E

> **Prérequis** : Projet Angular du Jour 1 opérationnel sur `http://localhost:4200`
> **Référencés dans** : `jour2.md` slides 35, 52, 68, 84

---

## 🔧 Exercice 1 — Installation et Premiers Tests

### Contexte
Installer Playwright dans le projet Angular existant et écrire vos premiers tests e2e.

### 1.1 Installation

```bash
# Dans le dossier formation-tests du Jour 1
cd formation-tests

# Installer Playwright
npm init playwright@latest -- --quiet \
  --lang=TypeScript \
  --test-dir=e2e \
  --gha \
  --browser=chromium \
  --browser=firefox

# Installer les navigateurs
npx playwright install chromium firefox
npx playwright install-deps
```

### 1.2 Vérifier l'installation

```bash
# Voir les tests d'exemple générés
ls e2e/

# Lancer les tests d'exemple
npx playwright test

# Ouvrir le rapport
npx playwright show-report
```

### 1.3 Configurer pour Angular

Mettez à jour `playwright.config.ts` :

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],

  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  // Démarrer Angular automatiquement
  webServer: {
    command: 'ng serve',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### 1.4 Premier test : navigation

Créez `e2e/navigation.spec.ts` :

```typescript
import { test, expect } from '@playwright/test';

test.describe('Navigation de base', () => {

  test('should display the app title', async ({ page }) => {
    await page.goto('/');

    // TODO : vérifier le titre de la page
    await expect(page).toHaveTitle(/* votre titre */);
  });

  test('should display welcome heading', async ({ page }) => {
    await page.goto('/');

    // TODO : vérifier le h1 ou le message de bienvenue
    // Utiliser getByRole('heading') ou getByText()
  });

  test('should navigate to users page', async ({ page }) => {
    await page.goto('/');

    // TODO :
    // 1. Cliquer sur le lien "Utilisateurs" dans la nav
    // 2. Vérifier l'URL avec toHaveURL('/users')
    // 3. Vérifier qu'un titre "Utilisateurs" est visible
  });

});
```

### 1.5 Utiliser le Codegen pour générer des tests

```bash
# Ouvrir le navigateur de codegen
npx playwright codegen http://localhost:4200

# Effectuez vos actions dans le navigateur
# Copiez le code généré dans un nouveau fichier spec
```

### 1.6 Lancer en UI Mode

```bash
npx playwright test --ui
# Explorez l'interface, essayez le Locator Picker
```

### Critères de validation
- [ ] `npx playwright test` passe sans erreur
- [ ] Les tests tournent sur Chromium ET Firefox
- [ ] La navigation entre pages fonctionne
- [ ] Le rapport HTML s'ouvre correctement

---

## 🔧 Exercice 2 — Interactions & Interception Réseau

### Contexte
Tester les interactions utilisateur avec les formulaires et intercepter les appels API.

### 2.1 Test du formulaire de connexion

Créez `e2e/auth.spec.ts` :

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentification', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should show login form', async ({ page }) => {
    // TODO : vérifier la présence des éléments
    // - Input email (getByLabel)
    // - Input password (getByLabel)
    // - Bouton de connexion (getByRole 'button')
  });

  test('should show validation errors on empty submit', async ({ page }) => {
    // TODO :
    // 1. Cliquer sur le bouton sans remplir
    // 2. Vérifier les messages d'erreur Angular
    // Conseil : les erreurs Angular apparaissent dans des <mat-error> ou <span class="error">
  });

  test('should login with valid credentials', async ({ page }) => {
    // TODO :
    // 1. Intercepter l'appel POST /api/auth/login
    // 2. Simuler une réponse de succès avec un token JWT
    // 3. Remplir le formulaire
    // 4. Cliquer sur connexion
    // 5. Vérifier la redirection vers /dashboard

    await page.route('/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'eyJhbGciOiJIUzI1NiJ9.test.token',
          user: { id: 1, name: 'Alice', role: 'admin' }
        })
      });
    });

    await page.getByLabel('Email').fill('alice@example.com');
    await page.getByLabel('Mot de passe').fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // TODO : vérifier la navigation
  });

  test('should show error on invalid credentials', async ({ page }) => {
    // TODO :
    // 1. Intercepter et retourner une erreur 401
    // 2. Vérifier le message d'erreur affiché
    await page.route('/api/auth/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Identifiants incorrects' })
      });
    });

    // TODO : remplir et soumettre, vérifier l'erreur
  });

  test('should show error on server failure', async ({ page }) => {
    // TODO : simuler une erreur 500 et vérifier le message générique
  });

});
```

### 2.2 Test de la liste des utilisateurs

Créez `e2e/users.spec.ts` :

```typescript
import { test, expect } from '@playwright/test';

const mockUsers = [
  { id: 1, name: 'Alice Martin', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob Dupont', email: 'bob@example.com', role: 'user' },
  { id: 3, name: 'Carol Simon', email: 'carol@example.com', role: 'user' },
];

test.describe('Liste des utilisateurs', () => {

  test.beforeEach(async ({ page }) => {
    // Intercepter l'API avant de naviguer
    await page.route('/api/users', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUsers)
      });
    });

    await page.goto('/users');
  });

  test('should display all users', async ({ page }) => {
    // TODO : vérifier que 3 éléments de liste sont présents
    const userItems = page.getByRole('listitem');
    await expect(userItems).toHaveCount(3);
  });

  test('should display user names', async ({ page }) => {
    // TODO : vérifier la présence des noms dans la liste
    await expect(page.getByText('Alice Martin')).toBeVisible();
    await expect(page.getByText('Bob Dupont')).toBeVisible();
  });

  test('should filter users by name', async ({ page }) => {
    // TODO :
    // 1. Trouver le champ de recherche
    // 2. Taper 'Alice'
    // 3. Vérifier qu'uniquement Alice est visible
  });

  test('should show empty state when no users', async ({ page }) => {
    // Override l'interception pour retourner []
    await page.route('/api/users', route =>
      route.fulfill({ status: 200, body: '[]', contentType: 'application/json' })
    );
    await page.reload();
    // TODO : vérifier le message "Aucun utilisateur"
  });

  test('should show error when API fails', async ({ page }) => {
    await page.route('/api/users', route =>
      route.fulfill({ status: 500, body: 'Server Error' })
    );
    await page.reload();
    // TODO : vérifier le message d'erreur
  });

});
```

### 2.3 Test du formulaire de création

```typescript
test.describe('Création d\'utilisateur', () => {

  test('should create a new user', async ({ page }) => {
    // Intercepter POST /api/users
    await page.route('/api/users', async route => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON();
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
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/users/new');
    await page.getByRole('button', { name: 'Créer' }).click();
    // TODO : vérifier les messages de validation
  });

});
```

### Critères de validation
- [ ] `page.route()` utilisé pour mocker l'API
- [ ] Les cas d'erreur (401, 500) sont testés
- [ ] Les assertions utilisent `getByRole`, `getByLabel`
- [ ] Les formulaires sont testés avec validation

---

## 🔧 Exercice 3 — Page Object Model

### Contexte
Restructurer les tests en Page Objects pour améliorer la maintenabilité.

### 3.1 Créer la structure de dossiers

```bash
mkdir -p e2e/pages
mkdir -p e2e/fixtures
mkdir -p e2e/helpers
```

### 3.2 LoginPage

Créez `e2e/pages/login.page.ts` :

```typescript
import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // Locators — définir tous les sélecteurs ici
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // TODO : initialiser tous les locators
    this.emailInput = page.getByLabel(/* ? */);
    this.passwordInput = page.getByLabel(/* ? */);
    this.submitButton = page.getByRole('button', { name: /* ? */ });
    this.errorAlert = page.getByRole('alert');
    this.forgotPasswordLink = page.getByRole('link', { name: /* ? */ });
  }

  // Actions
  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginAs(role: 'admin' | 'user') {
    const credentials = {
      admin: { email: 'admin@example.com', password: 'admin123' },
      user: { email: 'user@example.com', password: 'user123' },
    };
    await this.login(credentials[role].email, credentials[role].password);
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorAlert.textContent() ?? '';
  }

  // Assertions
  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL('/login');
    await expect(this.submitButton).toBeVisible();
  }
}
```

### 3.3 UserListPage

Créez `e2e/pages/user-list.page.ts` :

```typescript
import { type Locator, type Page, expect } from '@playwright/test';

export class UserListPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly createButton: Locator;
  readonly searchInput: Locator;
  readonly userList: Locator;
  readonly emptyState: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // TODO : initialiser les locators
    this.heading = page.getByRole('heading', { name: 'Utilisateurs' });
    this.createButton = page.getByRole('button', { name: 'Créer' });
    this.searchInput = page.getByPlaceholder('Rechercher...');
    this.userList = page.getByRole('list', { name: 'utilisateurs' });
    this.emptyState = page.getByText('Aucun utilisateur');
    this.errorMessage = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/users');
  }

  async searchFor(query: string) {
    await this.searchInput.fill(query);
    // Attendre que les résultats se mettent à jour
    await this.page.waitForTimeout(300); // debounce
  }

  async getUserCount(): Promise<number> {
    return await this.userList.locator('[data-testid="user-item"]').count();
  }

  async getUserNames(): Promise<string[]> {
    const items = this.userList.locator('[data-testid="user-name"]');
    return await items.allTextContents();
  }

  async clickDeleteForUser(userName: string) {
    await this.userList
      .locator('[data-testid="user-item"]')
      .filter({ hasText: userName })
      .getByRole('button', { name: 'Supprimer' })
      .click();
  }

  async expectUserVisible(name: string) {
    await expect(this.page.getByText(name)).toBeVisible();
  }
}
```

### 3.4 Fixtures partagées

Créez `e2e/fixtures/app.fixture.ts` :

```typescript
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { UserListPage } from '../pages/user-list.page';

// Types des fixtures
type Fixtures = {
  loginPage: LoginPage;
  userListPage: UserListPage;
  loggedInPage: UserListPage; // déjà authentifié
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  userListPage: async ({ page }, use) => {
    const userListPage = new UserListPage(page);
    await use(userListPage);
  },

  loggedInPage: async ({ page }, use) => {
    // Injecter le token d'auth avant le chargement de la page
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'valid-test-token');
      localStorage.setItem('user', JSON.stringify({
        id: 1, name: 'Admin Test', role: 'admin'
      }));
    });

    // Intercepter l'API pour que l'auth soit valide
    await page.route('/api/users', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' }
        ])
      })
    );

    const userListPage = new UserListPage(page);
    await userListPage.goto();
    await use(userListPage);
  },
});

export { expect };
```

### 3.5 Réécrire les tests avec les fixtures

Créez `e2e/tests/users-with-pom.spec.ts` :

```typescript
import { test, expect } from '../fixtures/app.fixture';

test.describe('Liste des utilisateurs (POM)', () => {

  test('should display users when authenticated', async ({ loggedInPage }) => {
    // TODO : utiliser loggedInPage directement
    await loggedInPage.expectUserVisible('Alice');
  });

  test('should search for a user', async ({ loggedInPage }) => {
    // TODO : utiliser loggedInPage.searchFor('Alice')
    // et vérifier le résultat
  });

  test('should delete a user', async ({ loggedInPage }) => {
    // TODO : cliquer sur supprimer et vérifier
  });

});

test.describe('Authentification (POM)', () => {

  test('should redirect to login when not authenticated', async ({ loginPage }) => {
    // TODO : naviguer vers /users sans auth
    // vérifier la redirection vers /login
  });

  test('should login and access dashboard', async ({ loginPage }) => {
    await loginPage.goto();
    // TODO : intercepter l'API, se connecter, vérifier
  });

});
```

### Critères de validation
- [ ] Tous les sélecteurs sont dans les Page Objects
- [ ] Les fixtures sont utilisées dans les tests
- [ ] Aucun `page.locator('.css-class')` dans les fichiers spec
- [ ] Les tests lisent comme des scénarios utilisateur

---

## 🔧 Exercice 4 — Tests Angular Complets & Debug

### Contexte
Tester un flux complet de l'application et utiliser les outils de debug Playwright.

### 4.1 Test du flux complet : Login → Création utilisateur

Créez `e2e/tests/user-flow.spec.ts` :

```typescript
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
```

### 4.2 Exercice de debug : analyser un test qui échoue

Modifiez temporairement un test pour le faire échouer :

```typescript
test('intentionally failing test for debug', async ({ page }) => {
  await page.goto('/');
  // Chercher un élément qui n'existe pas
  await expect(page.getByText('Ce texte n\'existe pas')).toBeVisible({
    timeout: 3000
  });
});
```

**Étapes de debug :**

1. Lancer `npx playwright test --ui` et analyser l'échec
2. Activer la trace : `trace: 'on'` dans `playwright.config.ts`
3. Relancer et ouvrir la trace avec `npx playwright show-report`
4. Observer la timeline, les screenshots, les requêtes réseau

### 4.3 Tests visuels (régression)

```typescript
test('home page visual regression', async ({ page }) => {
  await page.goto('/');
  // Créer un screenshot de référence
  await expect(page).toHaveScreenshot('home-page.png', {
    threshold: 0.1,
    fullPage: true,
  });
});

// Premier lancement : crée le screenshot de référence
// npx playwright test --update-snapshots

// Lancements suivants : compare avec la référence
// npx playwright test
```

### 4.4 Tests d'accessibilité

```typescript
test('home page should be accessible', async ({ page }) => {
  await page.goto('/');

  // Vérifier les rôles ARIA
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();

  // Vérifier la navigation au clavier
  await page.keyboard.press('Tab');
  const focusedElement = await page.evaluate(
    () => document.activeElement?.tagName
  );
  expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);

  // Vérifier les images ont un alt text
  const images = page.locator('img');
  const count = await images.count();
  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute('alt');
    expect(alt).not.toBeNull();
  }
});
```

### 4.5 Configuration CI/CD finale

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Build Angular app
        run: npm run build

      - name: Run E2E tests
        run: npx playwright test --reporter=html

      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-${{ github.run_id }}
          path: playwright-report/
          retention-days: 30
```

### Critères de validation
- [ ] Flux complet login → action → vérification fonctionne
- [ ] La trace est analysée avec le Trace Viewer
- [ ] Au moins 1 test de régression visuelle
- [ ] Au moins 1 vérification d'accessibilité
- [ ] La config CI/CD est en place

---

## 🔧 Exercice Bonus — Migration depuis Protractor

### Contexte
Migrer un test Protractor existant vers Playwright.

### Code Protractor original

```javascript
// login.e2e-spec.ts (Protractor)
describe('Login page', () => {
  it('should login and redirect', () => {
    browser.get('/login');

    element(by.css('[formcontrolname="email"]')).sendKeys('user@test.com');
    element(by.css('[formcontrolname="password"]')).sendKeys('password');
    element(by.css('button[type="submit"]')).click();

    browser.wait(EC.urlContains('/dashboard'), 5000);
    expect(browser.getCurrentUrl()).toContain('/dashboard');
    expect(element(by.css('h1')).getText()).toBe('Tableau de bord');
  });
});
```

### Votre mission
Réécrire ce test en Playwright :
1. Utiliser les locators modernes (`getByLabel`, `getByRole`)
2. Supprimer les `browser.wait()` → utiliser l'auto-waiting
3. Utiliser `await expect(page).toHaveURL()`
4. Organiser dans un Page Object

---

## 📋 Récapitulatif des commandes Playwright

```bash
# Lancer tous les tests
npx playwright test

# UI Mode (recommandé en dev)
npx playwright test --ui

# Mode headed (voir le navigateur)
npx playwright test --headed

# Débuggeur interactif
npx playwright test --debug

# Générer des tests automatiquement
npx playwright codegen http://localhost:4200

# Rapport HTML
npx playwright show-report

# Un seul fichier
npx playwright test e2e/users.spec.ts

# Filtrer par tag
npx playwright test --grep @smoke

# Mettre à jour les screenshots
npx playwright test --update-snapshots

# Mode watch (relancer sur changement)
npx playwright test --watch
```

## 📖 Ressources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright pour Angular](https://www.browserstack.com/guide/playwright-angular)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Locators Guide](https://playwright.dev/docs/locators)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)
