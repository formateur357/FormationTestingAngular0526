import { expect, test } from '@playwright/test';

test.describe('Debug Playwright', () => {
    test('echoue volontairement pour analyser le debug', async  ( {page} )  => {
        await page.goto('/');

        await expect(page.getByText("Ce texte n'existe pas")).toBeVisible({
            timeout: 3000,
        });
    });
});