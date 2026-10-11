const { test, expect } = require('@playwright/test');

// 1. Run tests serially to prevent overloading the public demo server with parallel requests
test.describe.configure({ mode: 'serial' });

test.describe('Real-Time Native Dialog Handling Examples', () => {

  // 2. Set timeout for tests in this block to 60 seconds
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    // 3. Use 'domcontentloaded' so page navigation doesn't hang waiting for external assets
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
  });

  // -------------------------------------------------------------
  // Test 1: JS Alert (alert())
  // -------------------------------------------------------------
  test('Handle JS Alert dialog', async ({ page }) => {

    await page.pause();
    page.once('dialog', async (dialog) => {
      console.log('Dialog Type:', dialog.type());
      console.log('Dialog Message:', dialog.message());
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Click for JS Alert' }).click();
    await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
  });

  // -------------------------------------------------------------
  // Test 2: JS Confirm - Accept (OK)
  // -------------------------------------------------------------
  test('Handle JS Confirm dialog - Accept (Click OK)', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      console.log('Dialog Type:', dialog.type());
      console.log('Dialog Message:', dialog.message());
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
    await expect(page.locator('#result')).toHaveText('You clicked: Ok');
  });

  // -------------------------------------------------------------
  // Test 3: JS Confirm - Dismiss (Cancel)
  // -------------------------------------------------------------
  test('Handle JS Confirm dialog - Dismiss (Click Cancel)', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
    await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
  });

  // -------------------------------------------------------------
  // Test 4: JS Prompt - Enter Text & Accept
  // -------------------------------------------------------------
  test('Handle JS Prompt dialog - Enter Text & Accept', async ({ page }) => {
    const inputText = 'Playwright Automation';

    page.once('dialog', async (dialog) => {
      console.log('Dialog Type:', dialog.type());
      console.log('Dialog Message:', dialog.message());
      await dialog.accept(inputText);
    });

    await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
    await expect(page.locator('#result')).toHaveText(`You entered: ${inputText}`);
  });

});