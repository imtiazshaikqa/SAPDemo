const { After, AfterAll, Before, BeforeAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

setDefaultTimeout(360_000);

let browser;

BeforeAll(async () => {
  browser = await chromium.launch({
    channel: process.env.BROWSER_CHANNEL || 'chrome',
    headless: process.env.HEADLESS === 'true'
  });
});

Before(async function () {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function () {
  if (this.context) {
    await this.context.close();
  }
});

AfterAll(async () => {
  if (browser) {
    await browser.close();
  }
});
