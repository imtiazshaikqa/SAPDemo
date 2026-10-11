import { test, expect } from '@playwright/test';

test.describe('Dropdown suite', () => {
  test('Select country from dropdown', async ({ page }) => {
    await page.goto('https://demo.guru99.com/test/newtours/register.php');

    await page.locator('select[name="country"]').selectOption({
      label: 'INDIA'
    });
     await page.pause();
  });
});