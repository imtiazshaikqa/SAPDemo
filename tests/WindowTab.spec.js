const { test, expect } = require('@playwright/test');

test('Handle New Tab / Window Popup on real site', async ({ page }) => {
  // 1. Navigate to the main page
  await page.goto('https://the-internet.herokuapp.com/windows');
  console.log('Main Window Title:', await page.title());
  console.log('Main Window Page URL:', page.url());

  // Verify title/heading on the main parent page
  await expect(page.locator('h3')).toHaveText('Opening a new window');

  // 2. Wait for the new tab while clicking its link simultaneously
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'Click Here' }).click()
  ]);

  // ⭐ FIX 1: Wait for the popup page to load completely before interacting/asserting
  await popup.waitForLoadState('domcontentloaded');

  // ⭐ FIX 2: Use regex for URL check to avoid strict matching issues (e.g. trailing slashes)
  await expect(popup).toHaveURL(/.*\/windows\/new/);

  // 3. Inspect details of the NEW popup page
  console.log('Popup Page Title:', await popup.title());
  console.log('Popup Page URL:  ', popup.url());

  // 4. Assert elements INSIDE the new popup window
  await expect(popup.locator('h3')).toHaveText('New Window');
  console.log('Popup heading verified');

  // 5. Switch focus back to the ORIGINAL parent page and verify accessibility
  await page.bringToFront();
  console.log('Returned focus to main page');
  await expect(page.locator('h3')).toHaveText('Opening a new window');
  console.log('Main heading verified');

  // 6. Close the popup window when finished
  await popup.close();
  console.log('Popup closed');

  // 7. Confirm popup is closed
  expect(popup.isClosed()).toBe(true);
});