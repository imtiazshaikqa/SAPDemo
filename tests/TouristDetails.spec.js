import { test, expect } from '@playwright/test';

const selectFields = new Set(['application_type', 'gender', 'has_valid_passport', 'passport_gender']);

test('submits 10 complete Tourist Details applications with distinct partner companies', async ({ page }) => {
  test.setTimeout(360_000);

  const submittedApplications = [];

  await page.route('**/api/partners/directory', (route) => route.fulfill({
    json: Array.from({ length: 10 }, (_, index) => ({
      company_name: `ABC${index + 1}`,
      city: 'Mumbai',
      state: 'Maharashtra'
    }))
  }));
  await page.route('**/api/tourist-applications', async (route) => {
    const application = route.request().postDataJSON();
    submittedApplications.push(application);
    await route.fulfill({
      status: 201,
      json: { public_id: `TEST${String(submittedApplications.length).padStart(3, '0')}` }
    });
  });

  await page.goto('http://localhost:3000/');

  const openTouristDetails = page.getByRole('navigation')
    .getByRole('button', { name: 'Tourist Details', exact: true });

  for (let index = 1; index <= 10; index += 1) {
    await openTouristDetails.click();
    await expect(page.getByRole('heading', { name: 'Tourist Details', exact: true })).toBeVisible();

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
      const field = page.locator(`[name="${fieldName}"]`);
      if (selectFields.has(fieldName)) {
        await field.selectOption(value);
      } else {
        await field.fill(value);
      }
    }

    await page.getByRole('button', { name: 'Submit Tourist Details', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Application received', exact: true })).toBeVisible();
    await expect(page.getByText(/Your unique application ID is HS-/)).toBeVisible();

    if (index < 10) {
      await page.getByRole('button', { name: 'Close', exact: true }).click();
    }
  }

  expect(submittedApplications).toHaveLength(10);
  expect(submittedApplications.map((application) => application.partner_name)).toEqual(
    Array.from({ length: 10 }, (_, index) => `ABC${index + 1}`)
  );
  expect(submittedApplications.every((application) => (
    application.name && application.email && application.nominee_name && application.nominee_email
  ))).toBe(true);
});
