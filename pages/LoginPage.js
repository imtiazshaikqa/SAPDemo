// @ts-check

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page   LoginPage() {} username =123
   * ()
   */
  constructor(page) {
    this.page = page;

    // Define Locators
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
  }

  // Action: Navigate to the page
  async openBrowser() {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  }



  /** @param {string} username @param {string} password */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyLabels(){

    return this.page.title();
  }
  
}