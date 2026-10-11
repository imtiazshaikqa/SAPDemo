// @ts-check

export class SystemUsersPage {
  /** @param {import('@playwright/test').Page} page */

  constructor(page) {
    this.page = page;
    this.adminLink = page.getByRole('link', { name: 'Admin', exact: true });
    this.filterToggle = page.locator('.oxd-table-filter-header-options button');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.usersTable = page.locator('.oxd-table');
  }

  async clickOnAdminTab() {
    await this.adminLink.click();
  }

  /** @param {string} role */
  async selectUserRole(role) {
    await this.filterToggle.click();
    await this.page.locator('.oxd-select-text').first().click();
    await this.page.locator('.oxd-select-option').getByText(role, { exact: true }).click();
  }

  async searchUsers() {
    await this.searchButton.click();
  }
}