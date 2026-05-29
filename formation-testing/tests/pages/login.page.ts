import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByLabel(/email/i);

    this.passwordInput = page.getByLabel(/mot de passe|password/i);

    this.submitButton = page.getByRole('button', {
      name: /se connecter|connexion|login/i,
    });

    this.errorAlert = page.getByRole('alert');

    this.forgotPasswordLink = page.getByRole('link', {
      name: /mot de passe oublié|forgot password/i,
    });
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginAs(role: 'admin' | 'user'): Promise<void> {
    const credentials = {
      admin: {
        email: 'admin@example.com',
        password: 'admin123',
      },
      user: {
        email: 'user@example.com',
        password: 'user123',
      },
    };

    await this.login(credentials[role].email, credentials[role].password);
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorAlert.textContent()) ?? '';
  }

  async expectToBeOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login$/);
    await expect(this.submitButton).toBeVisible();
  }
}
