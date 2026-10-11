import { test, expect } from '@playwright/test';

test('Handle dynamic dropdown', async ({ page }) => {

  await page.goto('https://www.playwrightautomation.com/practice.html');

  // Locate the search box
  const searchBox = page.getByPlaceholder('Search for Products');

  // Type into the dynamic dropdown
  await searchBox.fill('lap');

  // Select the exact matching suggestion
  await page.getByRole('option', { name: 'Laptop', exact: true }).click();

  await page.pause();
});

