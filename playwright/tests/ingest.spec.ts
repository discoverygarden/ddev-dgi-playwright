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
});

test('Ingest Test with Media and Solr Search Results', async ({ page }) => {
    await page.goto('node/add/islandora_object');
    await page.getByRole('textbox', { name: 'Title *' }).click();
    await page.getByRole('textbox', { name: 'Title *' }).fill('Test Object with Media');

    // Triggering will make an XHR request, wait for it complete.
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('node/add/islandora_object?ajax_form=1&_wrapper_format=drupal_ajax') && response.status() === 200
        ),
        page.selectOption('#edit-field-model', { label: 'Image' })
    ]);

    await page.getByRole('button', { name: 'Save' }).click()

    await page.waitForURL('**/media/add/image*');

    await expect(page.getByLabel('Status message')).toBeVisible();
    await expect(page.getByLabel('Status message')).toContainText('Repository Item Test Object with Media has been created.');

    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('media/add/image?element_parents=field_media_image') && response.status() === 200
        ),
        await page.getByLabel('Add a new file').setInputFiles(path.join(__dirname, 'brandonface.jpg'))
    ]);
    await page.getByRole('button', { name: 'Save' }).click();

    await page.waitForURL('**/test-object*');
    await expect(page.getByText('Image Test Object With Media has been created')).toBeVisible();
    await page.getByRole('link', { name: 'Media', exact: true}).click();
    await expect(page.getByRole('cell', { name: '-Thumbnail Image.jpg' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '-Service File.jp2' })).toBeVisible();
    await page.getByRole('link', { name: 'Home' }).click();
    await page.getByLabel('Search all collections and').click();
    await page.getByLabel('Search all collections and').fill('Test Object');
    await page.getByRole('button', { name: 'Search' }).click();
    await page.waitForURL('**/solr-search/content/grid*');

    // Ensure that "Test Object" appears on the page.
    const elements = page.locator("span[class='page-title']").filter({ hasText: /^Test Object$/ });
    const count = await elements.count();
    expect(count).toBeGreaterThan(0);

    const error = page.locator("div.alert.alert-danger.alert-dismissible");
    const errorCount = await error.count();
    expect(errorCount).toBe(0);
});

test('Ingest Test Image without Media', async ({ page }) => {
    await page.goto('node/add/islandora_object');
    await page.getByRole('textbox', { name: 'Title *' }).click();
    await page.getByRole('textbox', { name: 'Title *' }).fill('Test Object - Without Media');

    // Triggering will make an XHR request, wait for it complete.
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('node/add/islandora_object?ajax_form=1&_wrapper_format=drupal_ajax') && response.status() === 200
        ),
        page.selectOption('#edit-field-model', { label: 'Image' })
    ]);

    await page.getByLabel('Add media').uncheck();
    await page.getByRole('button', { name: 'Save' }).click()


    await expect(page.getByText('Test Object - Without Media has been created.')).toBeVisible();

    const error = page.locator("div.alert.alert-danger.alert-dismissible");
    const errorCount = await error.count();
    expect(errorCount).toBe(0);
});

test('Ingest and Delete Node', async ({ page }) => {
    await page.goto('node/add/islandora_object');
    await page.getByRole('textbox', { name: 'Title *' }).click();
    await page.getByRole('textbox', { name: 'Title *' }).fill('Test Object - To Delete');

    // Triggering will make an XHR request, wait for it complete.
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('node/add/islandora_object?ajax_form=1&_wrapper_format=drupal_ajax') && response.status() === 200
        ),
        page.selectOption('#edit-field-model', { label: 'Image' })
    ]);

    await page.getByLabel('Add media').uncheck();
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText('Test Object - To Delete has been created.')).toBeVisible();

    const error = page.locator("div.alert.alert-danger.alert-dismissible");
    const errorCount = await error.count();
    expect(errorCount).toBe(0);

    await page.getByRole('link', { name: 'Delete', exact: true }).click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('paragraph')).toContainText('The Repository Item Test Object - To Delete has been deleted.');
});
