const { test, expect } = require('@playwright/test');

test('Handle New Tab / Window Popup on real site', async ({ page }) => {
  // 1. Navigate to the main page
  await page.goto('https://the-internet.herokuapp.com/windows');

  // Verify title/heading on the main parent page
  await expect(page.locator('h3')).toHaveText('Opening a new window');

  // 2. Set up event listener for the popup AND click the button simultaneously
  // Using Promise.all prevents race conditions if the popup loads very fast
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),                     // Listener for new window
    page.getByRole('link', { name: 'Click Here' }).click()
  ]);

 

  // 3. Wait for the new popup tab/window to load completely
  await expect(popup).toHaveURL(/\/windows\/new$/);
  await popup.waitForLoadState('domcontentloaded');

  // 4. Inspect details of the NEW popup page
  console.log('Popup Page Title:', await popup.title()); // Output: "New Window"
  console.log('Popup Page URL:  ', popup.url());         // Output: "https://the-internet.herokuapp.com/windows/new"

  // 5. Assert elements INSIDE the new popup window
  await expect(popup.locator('h3')).toHaveText('New Window');

  // 6. Verify the ORIGINAL parent page is still accessible
  await expect(page.locator('h3')).toHaveText('Opening a new window');
  await popup.close();
});