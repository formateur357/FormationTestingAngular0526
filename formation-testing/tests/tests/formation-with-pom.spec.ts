import { test, expect } from '../fixtures/formation.fixture';

test.describe('Catalogue des formations avec POM', () => {
  test('should display all formations', async ({ formationCatalogPage }) => {
    // TODO
  });

  test('should search formation by title', async ({ formationCatalogPage }) => {
    // TODO
  });

  test('should filter formations by category', async ({
    formationCatalogPage,
  }) => {
    // TODO
  });

  test('should filter formations by level', async ({
    formationCatalogPage,
  }) => {
    // TODO
  });

  test('should show empty state when no formations match', async ({
    formationCatalogPage,
  }) => {
    // TODO
  });

  test('should navigate to formation detail', async ({
    page,
    formationCatalogPage,
  }) => {
    // TODO
  });
});

test.describe('Catalogue des formations — erreurs API', () => {
  test('should show error when API fails', async ({ page }) => {
    // TODO
  });
});