import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('user');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('islandora');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('islandora');
    await page.getByRole('button', { name: 'Log in' }).click();
});

test('Test Islandora Login', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'islandora' })).toBeDefined();

    await page.goto('?check_logged_in=1');
    await expect(page.getByText('To log in to this site, your browser must accept cookies from the domain')).toHaveCount(0);
});

test('Test Islandora Logout', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'islandora' })).toBeDefined();

    await page.goto('user/logout');

    await page.goto('?check_logged_in=1');
    await expect(page.getByText('To log in to this site, your browser must accept cookies from the domain')).toBeVisible();
});

test('Create and Delete testuser', async ({ page }) => {
    // Create User
    await page.goto('admin/people/create');
    await page.getByLabel('Email address').click();
    await page.getByLabel('Email address').fill('testuser@discoverygarden.ca');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Password', { exact: true }).click();
    await page.getByLabel('Password', { exact: true }).fill('islandora');
    await page.getByLabel('Confirm password').click();
    await page.getByLabel('Confirm password').fill('islandora');
    await page.getByLabel('Editor').check();
    await page.getByLabel('Ingester').check();
    await page.getByLabel('Repository Administrator').check();
    await page.getByLabel('Site Administrator').check();
    await page.getByLabel('Administrator', { exact: true }).check();
    await page.getByLabel('Repository Administrator').uncheck();
    await page.getByLabel('Site Administrator').uncheck();
    await page.getByLabel('Administrator', { exact: true }).uncheck();
    await page.getByLabel('Time zone').selectOption('America/Halifax');
    await page.getByLabel('URL alias').click();
    await page.getByLabel('URL alias').fill('/user/testuser');

    await page.getByRole('button', { name: 'Create new account' }).click();

    await expect(page.getByLabel('Status message')).toContainText('Created a new user account for testuser. No email has been sent.');

    // Delete created User
    await page.goto('admin/people');
    await page.getByRole('row', { name: 'Update the user testuser' }).getByRole('link', { name: 'Edit' }).click();
    await page.getByRole('link', { name: 'Cancel account' }).click();
    await page.getByLabel('Delete the account and its').check();
    await page.getByRole('button', { name: 'Confirm' }).click();

    await expect(page.getByLabel('Status message')).toContainText('Account testuser has been deleted.');
});
