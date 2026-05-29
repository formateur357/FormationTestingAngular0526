import { test as base, expect } from '@playwright/test';
import { FormationCatalogPage } from '../pages/formation-catalog.page';
import { mockFormations } from './formation-data';

type FormationFixtures = {
  formationCatalogPage: FormationCatalogPage;
};

export const test = base.extend<FormationFixtures>({
  formationCatalogPage: async ({ page }, use) => {
    // TODO :
    // 1. Intercepter GET /api/formations
    // 2. Retourner mockFormations
    // 3. Créer FormationCatalogPage
    // 4. Aller sur /formations
    // 5. Fournir la page au test avec use()
  },
});

export { expect };