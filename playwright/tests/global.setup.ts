import { test as setup } from '@playwright/test';
import * as path from 'path';

setup('Add Test Objects', async ({ browser }) => {
    //const { baseURL, storageState } = config.projects[0].use;
    //const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    //await page.goto(baseURL!);

    await page.goto('user');
    //await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('islandora');
    //await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('islandora');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.goto('node/add/islandora_object');
    await page.getByRole('textbox', { name: 'Title *' }).click();
    await page.getByRole('textbox', { name: 'Title *' }).fill('Test Display');
    // Triggering will make an XHR request, wait for it complete.
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('node/add/islandora_object?ajax_form=1&_wrapper_format=drupal_ajax') && response.status() === 200
        ),
     page.selectOption('#edit-field-model', { label: 'Image' })
    ]);
    //await page.getByLabel('Add media').uncheck();
    await page.locator('#edit-gin-sticky-actions').getByRole('button', { name: 'Save' }).click();

    //await page.waitForURL('**/test-display*');
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('media/add/image?element_parents=field_media_image') && response.status() === 200),
        await page.getByLabel('Add a new file').setInputFiles(path.join(__dirname, 'brandonface.jpg'))
    ]);
    await page.locator('#edit-gin-sticky-actions').getByRole('button', { name: 'Save' }).click();
    //await page.waitForURL('**/test-display*');
});
