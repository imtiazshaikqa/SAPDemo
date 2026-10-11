const { test, expect } = require('@playwright/test');
// -------------------------------------------------------------
// Test 1: JS Alert (alert())
// -------------------------------------------------------------
test('Handle JS Confirm dialog - Accept (Click OK) nre', async ({ page }) => {

    test.setTimeout(60000);

    await page.goto('https://the-internet.herokuapp.com/javascript_alerts', {
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });

    page.once('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        await dialog.accept();
    });

    await page.getByRole('button', {
        name: 'Click for JS Confirm'
    }).click();

    await expect(page.locator('#result'))
        .toHaveText('You clicked: Ok');

        await page.pause();
});


 test('Handle JS Confirm dialog - Accept (Click OK)3', async ({ page }) => {

    test.setTimeout(60000);

    await page.goto('https://the-internet.herokuapp.com/javascript_alerts', {
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });

    page.once('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        await dialog.accept();
    });

    await page.getByRole('button', {
        name: 'Click for JS Confirm'
    }).click();

    await expect(page.locator('#result'))
        .toHaveText('You clicked: Ok');
});

  test('Handle JS Confirm dialog - Dismiss (Click Cancel)', async ({ page }) => {
     test.setTimeout(60000);

       await page.goto('https://the-internet.herokuapp.com/javascript_alerts', {
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });
    page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
    await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
     await page.pause();
  });