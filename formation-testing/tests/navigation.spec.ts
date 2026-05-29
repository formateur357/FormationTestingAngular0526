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