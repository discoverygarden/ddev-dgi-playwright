import { test, expect } from '@playwright/test';
import * as path from 'path';

test.use({
    ignoreHTTPSErrors: true
});

test.beforeEach(async ({ page }) => {
    await page.goto('user');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('islandora');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('islandora');
    await page.getByRole('button', { name: 'Log in' }).click();

    // Skip tests if fixity is not enabled
    const response = await page.request.get('admin/config/fixity');
    test.skip(response.status() !== 200, 'Fixity is not enabled');
});

test('Dgi Fixity', async ({ page }) => {
    // WORK IN PROGRESS
    const response = await page.request.get('admin/config/fixity');
    await expect(response).toBeOK();
});
