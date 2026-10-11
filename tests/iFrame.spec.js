const { test, expect } = require('@playwright/test');
test('Interact with Rich Text Editor iFrame', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/iframe');
  // 1. Locate the iframe element using CSS selector/id
  const editorFrame = page.frameLocator('#mce_0_ifr');
  // 2. Locate the text area INSIDE the iframe
  const editorBody = editorFrame.locator('#tinymce');
  // 3. Clear existing content and type new text inside the iframe
  await editorBody.fill('');
  await editorBody.fill('Hello World from Playwright!');
  // 4. Assert text inside the iframe
  await expect(editorBody).toHaveText('Hello World from Playwright!');
});