import { test, expect } from '@playwright/test';
import * as path from 'path';

test.beforeEach(async ({ page }) => {
    await page.goto('user');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('islandora');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('islandora');
    await page.getByRole('button', { name: 'Log in' }).click();
});

test('OAI-PMH Records and Endpoint', async ({ page }) => {
    await page.goto('admin/config/services/rest/oai-pmh/queue');
    await page.getByRole('button', { name: 'Rebuild OAI-PMH' }).click();
    await page.waitForURL('**/admin/config/services/rest/oai-pmh/queue');

    // Check to see if OAI-PMH Record can be succesfully rebuilt.
    await expect(page.getByLabel('Status message').getByText('Successfully rebuilt your OAI')).toBeVisible();

    // Ensure page can be loaded before navigating.
    const response = await page.request.get('oai/request?verb=ListRecords&metadataPrefix=oai_dc');
    await expect(response).toBeOK();
    await page.goto('oai/request?verb=ListRecords&metadataPrefix=oai_dc');

    // Validate the response contains expected OAI-PMH elements
    const responseBody = await response.text();
    await expect(responseBody).toContain('<OAI-PMH');
    await expect(responseBody).toContain('<ListRecords>');
});
