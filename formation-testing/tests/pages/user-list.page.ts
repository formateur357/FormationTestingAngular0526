import { expect, type Locator, type Page } from '@playwright/test';

export class UserListPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly createButton: Locator;
  readonly searchInput: Locator;
  readonly userList: Locator;
  readonly userItems: Locator;
  readonly emptyState: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', {
      name: /utilisateurs/i,
    });

    this.createButton = page.getByRole('button', {
      name: /créer|nouvel utilisateur/i,
    });

    this.searchInput = page.getByPlaceholder(/rechercher/i);

    this.userList = page.getByRole('list', {
      name: /utilisateurs/i,
    });

    this.userItems = page.getByTestId('user-item');

    this.emptyState = page.getByText(/aucun utilisateur/i);

    this.errorMessage = page.getByRole('alert');
  }

  async goto(): Promise<void> {
    await this.page.goto('/users');
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async getUserCount(): Promise<number> {
    return await this.userItems.count();
  }

  async getUserNames(): Promise<string[]> {
    return await this.page.getByTestId('user-name').allTextContents();
  }

  async clickDeleteForUser(userName: string): Promise<void> {
    await this.userItems
      .filter({ hasText: userName })
      .getByRole('button', { name: /supprimer/i })
      .click();
  }

  async expectUserVisible(name: string): Promise<void> {
    await expect(this.page.getByText(name)).toBeVisible();
  }

  async expectUserNotVisible(name: string): Promise<void> {
    await expect(this.page.getByText(name)).not.toBeVisible();
  }

  async expectUserCount(count: number): Promise<void> {
    await expect(this.userItems).toHaveCount(count);
  }

  async expectEmptyStateVisible(): Promise<void> {
    await expect(this.emptyState).toBeVisible();
  }

  async expectErrorVisible(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }
}
