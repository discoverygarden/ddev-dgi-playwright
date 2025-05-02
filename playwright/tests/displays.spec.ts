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

test('Content View Display', async ({ page }) => {
    await page.goto('test-display');

    await page.waitForURL('**/test-display');
    // Looking for Object Title display
    await expect(page.getByRole('heading', { name: /^Test Display$/ })).toBeVisible();

    // Looking for object display (Image in this case).
    await expect(page.locator('canvas')).toBeVisible();

    // Checking for metadata display.
    await expect(page.locator("section[id='block-views-block-repository-item-metadata-block-1']")).toBeVisible();
});

test('Solr Search Display - Grid', async ({ page }) => {
    await page.goto('');

    //await page.locator('#block-dgiheaderblock').getByRole('link', { name: 'Home' }).click();
    await page.getByLabel('Search all collections and').click();
    await page.getByLabel('Search all collections and').fill('Test Display');
    await page.getByRole('button', { name: 'Search' }).click();
    await page.waitForURL('**/solr-search/content/grid*');

    // Ensure that "Test Display" appears on the page.
    const elements = page.locator("span[class='page-title']").filter({ hasText: /^Test Display$/ });
    const count = await elements.count();
    expect(count).toBeGreaterThan(0);

    const error = page.locator("div.alert.alert-danger.alert-dismissible");
    const errorCount = await error.count();
    expect(errorCount).toBe(0);
});

test('Solr Search Display - List', async ({ page }) => {
    // Go directly to the List search for the applicable node.
    await page.goto('solr-search/content/list?search_api_fulltext=Test%20Display&field_ancestors=&display=list');

    // Ensure that "Test Display" appears on the page.
    const elements = page.locator("td > a").filter({ hasText: /^Test Display$/});
    const count = await elements.count();
    expect(count).toBeGreaterThan(0);

    const error = page.locator("div.alert.alert-danger.alert-dismissible");
    const errorCount = await error.count();
    expect(errorCount).toBe(0);
});

test('Solr Search Display - Card', async ({ page }) => {
    // Go directly to the Card search for the applicable node.
    await page.goto('solr-search/content/card?search_api_fulltext=Test%20Display&field_ancestors=&display=card');

    // Ensure that "Test Display" appears on the page.
    const elements = page.locator("div > a[class='page-title']").filter({ hasText: /^Test Display$/ });
    const count = await elements.count();
    expect(count).toBeGreaterThan(0);

    const error = page.locator("div.alert.alert-danger.alert-dismissible");
    const errorCount = await error.count();
    expect(errorCount).toBe(0);
});
