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
    // TODO
  }

  async searchFor(query: string): Promise<void> {
    // TODO
  }

  async filterByCategory(
    category: 'frontend' | 'backend' | 'testing',
  ): Promise<void> {
    // TODO
  }

  async filterByLevel(
    level: 'beginner' | 'intermediate' | 'advanced',
  ): Promise<void> {
    // TODO
  }

  async clickFormation(title: string): Promise<void> {
    // TODO
  }

  async expectLoaded(): Promise<void> {
    // TODO
  }

  async expectFormationVisible(title: string): Promise<void> {
    // TODO
  }

  async expectFormationNotVisible(title: string): Promise<void> {
    // TODO
  }

  async expectFormationCount(count: number): Promise<void> {
    // TODO
  }

  async expectEmptyStateVisible(): Promise<void> {
    // TODO
  }

  async expectErrorVisible(): Promise<void> {
    // TODO
  }
}