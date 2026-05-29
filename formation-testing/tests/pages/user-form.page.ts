import { type Locator, type Page } from '@playwright/test';

export class UserFormPage {
  readonly page: Page;

  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly roleSelect: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameInput = page.getByLabel(/nom/i);
    this.emailInput = page.getByLabel(/email/i);
    this.roleSelect = page.getByLabel(/rôle|role/i);
    this.submitButton = page.getByRole('button', { name: /créer/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/users/new');
  }

  async fillForm(user: {
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
  }): Promise<void> {
    await this.nameInput.fill(user.name);
    await this.emailInput.fill(user.email);
    await this.roleSelect.selectOption(user.role);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
