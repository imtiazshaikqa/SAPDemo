import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';

const tabRoutes = {
  Dashboard: /dashboard(?:\/index)?/,
  Admin: /admin\/viewSystemUsers/,
  PIM: /pim\/viewEmployeeList/,
  Leave: /leave\/viewLeaveList/,
  Time: /time\/viewEmployeeTimesheet/,
  Recruitment: /recruitment\/viewCandidates/,
  'My Info': /pim\/viewPersonalDetails/,
  Performance: /performance/,
  Directory: /directory/,
  Maintenance: /maintenance/
};

test.describe('Orange HRML Tab Validation', () => {
  let sharedPage;

  test.beforeAll(async ({ browser }) => {
    sharedPage = await browser.newPage();
    const loginPage = new LoginPage(sharedPage);

    await loginPage.openBrowser();
    await loginPage.login('Admin', 'admin123');
    await expect(sharedPage).toHaveURL(/dashboard/);
  });

  test.afterAll(async () => {
    if (sharedPage) {
      await sharedPage.close();
    }
  });

  test('logs in with valid credentials', async () => {
    await expect(sharedPage.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  for (const tab of Object.keys(tabRoutes)) {
    test(`validates ${tab} tab`, async () => {
      const tabLink = sharedPage.getByRole('link', { name: tab, exact: true });
      console.log(`Validating ${tab} tab with route: ${tabRoutes[tab]}`);
      console.log(' Validate tab   ', tab);
      await expect(tabLink).toBeVisible();
      await tabLink.click();
      await expect(sharedPage).toHaveURL(tabRoutes[tab]);
    });
  }
});
