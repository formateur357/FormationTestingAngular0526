# Exercice 3 — Page Object Model avec un catalogue de formations

## Contexte

Dans cet exercice, vous allez tester une page Angular avec Playwright en utilisant le **Page Object Model**.

L'application contient une page : /formations

Cette page affiche un catalogue de formations récupéré depuis une API : GET /api/formations

Chaque formation possède la structure suivante :

```ts
{
  id: number;
  title: string;
  category: 'frontend' | 'backend' | 'testing';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
}
```

La page permet de :

- afficher toutes les formations ;
- rechercher une formation par titre ;
- filtrer les formations par catégorie ;
- filtrer les formations par niveau ;
- afficher un état vide si aucune formation ne correspond ;
- afficher un message d'erreur si l'API échoue ;
- cliquer sur une formation pour accéder à sa page détail.

---

## Objectifs pédagogiques

À la fin de l'exercice, vous devez être capables de :

- créer un **Page Object** Playwright ;
- centraliser les locators dans une classe ;
- écrire des méthodes métier lisibles ;
- utiliser une fixture Playwright personnalisée ;
- mocker une API avec `page.route()` ;
- écrire des tests E2E maintenables ;
- éviter les sélecteurs CSS fragiles.

---

## Rappel — Qu'est-ce que le Page Object Model ?

Le **Page Object Model**, souvent abrégé **POM**, consiste à créer une classe qui représente une page ou une zone importante de l'application.

Au lieu d'écrire directement dans les tests :

```ts
await page.getByPlaceholder(/rechercher une formation/i).fill('Angular');
await expect(page.getByText('Angular avancé')).toBeVisible();
```

On écrit plutôt :

```ts
await formationCatalogPage.searchFor('Angular');
await formationCatalogPage.expectFormationVisible('Angular avancé');
```

Le test devient plus lisible, plus proche d'un scénario métier, et moins couplé au HTML interne.

---

## Arborescence attendue

Vous devez créer ou compléter les fichiers suivants :

```txt
e2e/
├── fixtures/
│   ├── formation-data.ts
│   └── formation.fixture.ts
├── pages/
│   └── formation-catalog.page.ts
└── tests/
    └── formations-with-pom.spec.ts
```

---

# Partie 1 — Données de test

## Fichier à créer

```txt
e2e/fixtures/formation-data.ts
```

Copiez le contenu suivant :

```ts
export const mockFormations = [
  {
    id: 1,
    title: 'Angular avancé',
    category: 'frontend',
    level: 'advanced',
    duration: 21,
  },
  {
    id: 2,
    title: 'Spring Boot API REST',
    category: 'backend',
    level: 'intermediate',
    duration: 14,
  },
  {
    id: 3,
    title: 'Tests E2E avec Playwright',
    category: 'testing',
    level: 'intermediate',
    duration: 7,
  },
  {
    id: 4,
    title: 'HTML CSS débutant',
    category: 'frontend',
    level: 'beginner',
    duration: 14,
  },
] as const;
```

---

# Partie 2 — Créer le Page Object

## Fichier à créer

```txt
e2e/pages/formation-catalog.page.ts
```

## Consigne

Créez une classe `FormationCatalogPage` qui représente la page `/formations`.

Cette classe doit contenir :

- les locators principaux de la page ;
- les actions utilisateur ;
- les assertions utiles aux tests.

## Squelette à compléter

```ts
import { expect, type Locator, type Page } from '@playwright/test';

export class FormationCatalogPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly categorySelect: Locator;
  readonly levelSelect: Locator;
  readonly formationList: Locator;
  readonly formationItems: Locator;
  readonly emptyState: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', {
      name: /catalogue des formations/i,
    });

    this.searchInput = page.getByPlaceholder(/rechercher une formation/i);

    this.categorySelect = page.getByLabel(/catégorie/i);

    this.levelSelect = page.getByLabel(/niveau/i);

    this.formationList = page.getByRole('list', {
      name: /formations/i,
    });

    this.formationItems = page.getByTestId('formation-item');

    this.emptyState = page.getByText(/aucune formation trouvée/i);

    this.errorAlert = page.getByRole('alert');
  }

  async goto(): Promise<void> {
    // TODO : naviguer vers /formations
  }

  async searchFor(query: string): Promise<void> {
    // TODO : remplir le champ de recherche
  }

  async filterByCategory(
    category: 'frontend' | 'backend' | 'testing',
  ): Promise<void> {
    // TODO : sélectionner une catégorie
  }

  async filterByLevel(
    level: 'beginner' | 'intermediate' | 'advanced',
  ): Promise<void> {
    // TODO : sélectionner un niveau
  }

  async clickFormation(title: string): Promise<void> {
    // TODO : cliquer sur une formation par son titre
  }

  async expectLoaded(): Promise<void> {
    // TODO : vérifier que le titre principal est visible
  }

  async expectFormationVisible(title: string): Promise<void> {
    // TODO : vérifier qu'une formation est visible
  }

  async expectFormationNotVisible(title: string): Promise<void> {
    // TODO : vérifier qu'une formation n'est pas visible
  }

  async expectFormationCount(count: number): Promise<void> {
    // TODO : vérifier le nombre de formations visibles
  }

  async expectEmptyStateVisible(): Promise<void> {
    // TODO : vérifier que l'état vide est visible
  }

  async expectErrorVisible(): Promise<void> {
    // TODO : vérifier que l'alerte d'erreur est visible
  }
}
```

---

## Contraintes pour le Page Object

Votre Page Object doit respecter les règles suivantes :

- ne pas utiliser de sélecteurs CSS de type `.classe` si un locator accessible est possible ;
- utiliser prioritairement `getByRole()` ;
- utiliser ensuite `getByLabel()` ;
- utiliser ensuite `getByPlaceholder()` ;
- utiliser ensuite `getByText()` ;
- utiliser `getByTestId()` seulement quand c'est utile ;
- ne pas utiliser `waitForTimeout()`.

---

# Partie 3 — Créer la fixture Playwright

## Fichier à créer

```txt
e2e/fixtures/formation.fixture.ts
```

## Consigne

Créez une fixture personnalisée qui prépare automatiquement la page catalogue.

Cette fixture doit :

1. intercepter l'appel `GET /api/formations` ;
2. retourner `mockFormations` ;
3. créer une instance de `FormationCatalogPage` ;
4. naviguer vers `/formations` ;
5. fournir cette page aux tests.

## Squelette à compléter

```ts
import { test as base, expect } from '@playwright/test';
import { FormationCatalogPage } from '../pages/formation-catalog.page';
import { mockFormations } from './formation-data';

type FormationFixtures = {
  formationCatalogPage: FormationCatalogPage;
};

export const test = base.extend<FormationFixtures>({
  formationCatalogPage: async ({ page }, use) => {
    // TODO : intercepter GET /api/formations

    // TODO : créer une instance de FormationCatalogPage

    // TODO : naviguer vers /formations

    // TODO : fournir la page au test avec use()
  },
});

export { expect };
```

---

# Partie 4 — Écrire les tests avec le Page Object

## Fichier à créer

```txt
e2e/tests/formations-with-pom.spec.ts
```

## Consigne

Écrivez les tests de la page catalogue en utilisant le Page Object et la fixture.

Les tests doivent être lisibles et ne doivent pas manipuler directement les locators internes de la page.

## Squelette à compléter

```ts
import { test, expect } from '../fixtures/formation.fixture';

test.describe('Catalogue des formations avec POM', () => {
  test('should display all formations', async ({ formationCatalogPage }) => {
    // TODO : vérifier que la page est chargée
    // TODO : vérifier qu'il y a 4 formations
    // TODO : vérifier que "Angular avancé" est visible
    // TODO : vérifier que "Tests E2E avec Playwright" est visible
  });

  test('should search formation by title', async ({ formationCatalogPage }) => {
    // TODO : rechercher "Angular"
    // TODO : vérifier que "Angular avancé" est visible
    // TODO : vérifier que les autres formations ne sont pas visibles
    // TODO : vérifier qu'il reste une seule formation
  });

  test('should filter formations by category', async ({
    formationCatalogPage,
  }) => {
    // TODO : filtrer par catégorie "frontend"
    // TODO : vérifier que "Angular avancé" est visible
    // TODO : vérifier que "HTML CSS débutant" est visible
    // TODO : vérifier que "Spring Boot API REST" n'est pas visible
    // TODO : vérifier qu'il y a 2 formations visibles
  });

  test('should filter formations by level', async ({
    formationCatalogPage,
  }) => {
    // TODO : filtrer par niveau "intermediate"
    // TODO : vérifier que "Spring Boot API REST" est visible
    // TODO : vérifier que "Tests E2E avec Playwright" est visible
    // TODO : vérifier que "Angular avancé" n'est pas visible
    // TODO : vérifier qu'il y a 2 formations visibles
  });

  test('should show empty state when no formations match', async ({
    formationCatalogPage,
  }) => {
    // TODO : rechercher une formation inexistante
    // TODO : vérifier que l'état vide est visible
    // TODO : vérifier qu'il y a 0 formation visible
  });

  test('should navigate to formation detail', async ({
    page,
    formationCatalogPage,
  }) => {
    // TODO : cliquer sur "Angular avancé"
    // TODO : vérifier que l'URL finit par /formations/1
  });
});
```

---

# Partie 5 — Tester le cas d'erreur API

Dans le même fichier :

```txt
e2e/tests/formations-with-pom.spec.ts
```

Ajoutez un deuxième bloc de tests.

## Squelette à compléter

```ts
test.describe('Catalogue des formations — erreurs API', () => {
  test('should show error when API fails', async ({ page }) => {
    // TODO : intercepter GET /api/formations
    // TODO : retourner une erreur 500
    // TODO : créer une instance de FormationCatalogPage
    // TODO : naviguer vers /formations
    // TODO : vérifier que l'erreur est visible
  });
});
```

## Indice

Pour simuler une erreur serveur :

```ts
await page.route('**/api/formations', async route => {
  await route.fulfill({
    status: 500,
    contentType: 'application/json',
    body: JSON.stringify({
      message: 'Server Error',
    }),
  });
});
```

---

# Comportements attendus

## Test 1 — Affichage initial

Quand la page `/formations` charge correctement, elle doit afficher 4 formations :

```txt
Angular avancé
Spring Boot API REST
Tests E2E avec Playwright
HTML CSS débutant
```

---

## Test 2 — Recherche par titre

Quand l'utilisateur recherche :

```txt
Angular
```

Alors seule la formation suivante doit rester visible :

```txt
Angular avancé
```

---

## Test 3 — Filtre par catégorie

Quand l'utilisateur filtre par catégorie :

```txt
frontend
```

Alors les formations visibles doivent être :

```txt
Angular avancé
HTML CSS débutant
```

---

## Test 4 — Filtre par niveau

Quand l'utilisateur filtre par niveau :

```txt
intermediate
```

Alors les formations visibles doivent être :

```txt
Spring Boot API REST
Tests E2E avec Playwright
```

---

## Test 5 — État vide

Quand l'utilisateur recherche une formation inexistante, par exemple :

```txt
Cobol avancé
```

Alors la page doit afficher :

```txt
Aucune formation trouvée
```

Et aucune formation ne doit être visible.

---

## Test 6 — Navigation vers le détail

Quand l'utilisateur clique sur :

```txt
Angular avancé
```

Alors l'URL doit finir par :

```txt
/formations/1
```

---

## Test 7 — Erreur API

Quand l'API `/api/formations` retourne une erreur `500`, alors la page doit afficher un message d'erreur accessible via `role="alert"`.

---

# Commandes utiles

Lancer tous les tests :

```bash
npx playwright test
```

Lancer uniquement cet exercice :

```bash
npx playwright test e2e/tests/formations-with-pom.spec.ts
```

Lancer en mode UI :

```bash
npx playwright test e2e/tests/formations-with-pom.spec.ts --ui
```

Lancer en debug :

```bash
npx playwright test e2e/tests/formations-with-pom.spec.ts --debug
```

Afficher le rapport :

```bash
npx playwright show-report
```

---

# Critères de validation

Votre exercice est réussi si :

- [ ] le fichier `formation-data.ts` existe ;
- [ ] le fichier `formation-catalog.page.ts` existe ;
- [ ] le fichier `formation.fixture.ts` existe ;
- [ ] le fichier `formations-with-pom.spec.ts` existe ;
- [ ] les locators sont centralisés dans le Page Object ;
- [ ] les tests utilisent majoritairement `formationCatalogPage` ;
- [ ] l'API `/api/formations` est mockée avec `page.route()` ;
- [ ] le test d'affichage vérifie 4 formations ;
- [ ] le test de recherche fonctionne ;
- [ ] le test de filtre par catégorie fonctionne ;
- [ ] le test de filtre par niveau fonctionne ;
- [ ] le test d'état vide fonctionne ;
- [ ] le test d'erreur API fonctionne ;
- [ ] le test de navigation vers le détail fonctionne ;
- [ ] les tests ne dépendent pas d'une vraie API ;
- [ ] les tests n'utilisent pas de sélecteurs CSS fragiles.

---

# Bonus

Ajoutez une méthode dans le Page Object :

```ts
async expectOnlyFormationsVisible(titles: string[]): Promise<void> {
  // TODO : récupérer tous les titres visibles
  // TODO : comparer avec la liste attendue
}
```

Puis utilisez-la dans les tests de recherche et de filtre.

Exemple attendu :

```ts
await formationCatalogPage.expectOnlyFormationsVisible([
  'Angular avancé',
  'HTML CSS débutant',
]);
```

---

# Règles importantes

Vous ne devez pas écrire des tests comme ceci :

```ts
await page.locator('.formation-card').first().click();
```

Ce type de test est fragile, car il dépend de classes CSS internes.

Préférez :

```ts
await page.getByRole('link', { name: 'Angular avancé' }).click();
```

Ou mieux, dans le Page Object :

```ts
await formationCatalogPage.clickFormation('Angular avancé');
```

---

# À retenir

Un bon test avec Page Object Model doit ressembler à un scénario lisible :

```ts
await formationCatalogPage.searchFor('Angular');
await formationCatalogPage.expectFormationVisible('Angular avancé');
await formationCatalogPage.expectFormationCount(1);
```

Il ne doit pas ressembler à une exploration technique du HTML interne.
