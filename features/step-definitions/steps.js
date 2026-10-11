const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I open {string}', async function (url) {
  await this.page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000
  });
});

Given('I log in to Orange HRM as {string} with password {string}', async function (username, password) {
  const { LoginPage } = await import('../../pages/LoginPage.js');
  const loginPage = new LoginPage(this.page);
  await loginPage.openBrowser();
  await loginPage.login(username, password);
  await expect(this.page).toHaveURL(/dashboard/);
});

When('I click the {string} navigation tab', async function (tabName) {
  await this.page.getByRole('link', { name: tabName, exact: true }).click();
});

When('I select {string} from the country dropdown', async function (country) {
  await this.page.locator('select[name="country"]').selectOption({ label: country });
});

When('I search for {string} and choose the {string} suggestion', async function (query, suggestion) {
  await this.page.getByPlaceholder('Search for Products').fill(query);
  await this.page.getByRole('option', { name: suggestion, exact: true }).click();
});

When('I accept the next JavaScript dialog', function () {
  this.page.once('dialog', async (dialog) => {
    await dialog.accept();
  });
});

When('I dismiss the next JavaScript dialog', function () {
  this.page.once('dialog', async (dialog) => {
    await dialog.dismiss();
  });
});

When('I accept the next JavaScript dialog with text {string}', function (text) {
  this.page.once('dialog', async (dialog) => {
    await dialog.accept(text);
  });
});

When('I click the {string} button', async function (buttonName) {
  await this.page.getByRole('button', { name: buttonName, exact: true }).click();
});

When('I open the {string} link in a new window', async function (linkName) {
  [this.popup] = await Promise.all([
    this.page.waitForEvent('popup'),
    this.page.getByRole('link', { name: linkName, exact: true }).click()
  ]);
  await this.popup.waitForLoadState('domcontentloaded');
});

When('I close the new window', async function () {
  await this.popup.close();
});

Then('I should see the heading {string}', async function (heading) {
  await expect(this.page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
});

Then('the page heading should be {string}', async function (heading) {
  await expect(this.page.locator('h3')).toHaveText(heading);
});

Then('the new window heading should be {string}', async function (heading) {
  await expect(this.popup.locator('h3')).toHaveText(heading);
});

Then('the page URL should match {string}', async function (pattern) {
  await expect(this.page).toHaveURL(new RegExp(pattern));
});

Then('the new window URL should match {string}', async function (pattern) {
  await expect(this.popup).toHaveURL(new RegExp(pattern));
});

Then('the new window should be closed', async function () {
  expect(this.popup.isClosed()).toBe(true);
});

Then('the result should be {string}', async function (result) {
  await expect(this.page.locator('#result')).toHaveText(result);
});

Then('the editor should contain {string}', async function (text) {
  await expect(this.page.frameLocator('#mce_0_ifr').locator('#tinymce')).toHaveText(text);
});

When('I enter {string} into the rich text editor', async function (text) {
  const editorBody = this.page.frameLocator('#mce_0_ifr').locator('#tinymce');
  await editorBody.fill('');
  await editorBody.fill(text);
});

When('I submit ten complete Tourist Details applications with distinct partner companies', async function () {
  const selectFields = new Set(['application_type', 'gender', 'has_valid_passport', 'passport_gender']);
  this.submittedApplications = [];

  await this.page.route('**/api/partners/directory', (route) => route.fulfill({
    json: Array.from({ length: 10 }, (_, index) => ({
      company_name: `ABC${index + 1}`,
      city: 'Mumbai',
      state: 'Maharashtra'
    }))
  }));
  await this.page.route('**/api/tourist-applications', async (route) => {
    this.submittedApplications.push(route.request().postDataJSON());
    await route.fulfill({
      status: 201,
      json: { public_id: `TEST${String(this.submittedApplications.length).padStart(3, '0')}` }
    });
  });

  await this.page.goto('http://localhost:3000/');
  const openTouristDetails = this.page.getByRole('navigation')
    .getByRole('button', { name: 'Tourist Details', exact: true });

  for (let index = 1; index <= 10; index += 1) {
    await openTouristDetails.click();
    await expect(this.page.getByRole('heading', { name: 'Tourist Details', exact: true })).toBeVisible();

    const values = {
      partner_name: `ABC${index}`,
      application_type: 'Umrah',
      application_date: new Date().toISOString().slice(0, 10),
      name: `Test Tourist ${index}`,
      gender: 'Male',
      age: '36',
      date_of_birth: '1990-01-01',
      address: '123 Test Street',
      city: 'Mumbai',
      pincode: '400001',
      pan_number: `ABCDE${String(1000 + index).slice(-4)}F`,
      whatsapp: `98765000${String(index).padStart(2, '0')}`,
      mobile: `98765000${String(index).padStart(2, '0')}`,
      email: `tourist${index}@example.com`,
      mahram_name: `Test Mahram ${index}`,
      mahram_relationship: 'Brother',
      has_valid_passport: 'true',
      passport_number: `N${String(1000000 + index).slice(-7)}`,
      passport_given_name: `Test Tourist ${index}`,
      passport_gender: 'Male',
      passport_place_of_birth: 'Mumbai',
      passport_date_of_issue: '2020-01-01',
      father_or_guardian_name: `Test Guardian ${index}`,
      surname: `Tourist${index}`,
      nationality: 'Indian',
      passport_date_of_birth: '1990-01-01',
      passport_place_of_issue: 'Mumbai',
      passport_date_of_expiry: '2030-01-01',
      mother_name: `Test Mother ${index}`,
      spouse_name: `Test Spouse ${index}`,
      nominee_name: `Test Nominee ${index}`,
      nominee_city: 'Mumbai',
      nominee_whatsapp: `98765001${String(index).padStart(2, '0')}`,
      nominee_email: `nominee${index}@example.com`,
      nominee_address: '456 Nominee Test Street',
      nominee_pincode: '400002',
      nominee_mobile: `98765001${String(index).padStart(2, '0')}`,
      nominee_relationship: 'Spouse'
    };

    for (const [fieldName, value] of Object.entries(values)) {
      const field = this.page.locator(`[name="${fieldName}"]`);
      if (selectFields.has(fieldName)) {
        await field.selectOption(value);
      } else {
        await field.fill(value);
      }
    }

    await this.page.getByRole('button', { name: 'Submit Tourist Details', exact: true }).click();
    await expect(this.page.getByRole('heading', { name: 'Application received', exact: true })).toBeVisible();
    await expect(this.page.getByText(/Your unique application ID is HS-/)).toBeVisible();

    if (index < 10) {
      await this.page.getByRole('button', { name: 'Close', exact: true }).click();
    }
  }
});

Then('all ten applications should have distinct partners and contact details', function () {
  expect(this.submittedApplications).toHaveLength(10);
  expect(this.submittedApplications.map((application) => application.partner_name)).toEqual(
    Array.from({ length: 10 }, (_, index) => `ABC${index + 1}`)
  );
  expect(this.submittedApplications.every((application) => (
    application.name && application.email && application.nominee_name && application.nominee_email
  ))).toBe(true);
});
