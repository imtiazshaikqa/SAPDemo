const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const csvPath = path.resolve(__dirname, '..', 'Data', 'KUNDAN.CSV');
const ownerEmail = process.env.INDIANPGS_OWNER_EMAIL;
const ownerPassword = process.env.INDIANPGS_OWNER_PASSWORD;
const ownerContact = process.env.INDIANPGS_OWNER_CONTACT;
const expectedHeaders = [
  'Property / PG Name',
  'City',
  'Locality / Area',
  'Tenant Type',
  'Starting Rent (₹/mo)',
];

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;

  for (let i = 0; i < csv.length; i += 1) {
    const character = csv[i];

    if (quoted) {
      if (character === '"' && csv[i + 1] === '"') {
        value += '"';
        i += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        value += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ',') {
      row.push(value);
      value = '';
    } else if (character === '\n') {
      row.push(value.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      value = '';
    } else {
      value += character;
    }
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value.replace(/\r$/, ''));
    rows.push(row);
  }

  return rows;
}

function getCompleteListings() {
  const [headers, ...records] = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const column = Object.fromEntries(headers.map((header, index) => [header, index]));
  const tenantTypes = {
    Men: 'Boys',
    Women: 'Girls',
    'Men & Women': 'Coliving',
    Anyone: 'Coliving',
  };

  return records
    .map((record) => ({
      name: record[column['Property / PG Name']],
      city: record[column.City],
      locality: record[column['Locality / Area']],
      tenantType: tenantTypes[record[column['Tenant Type']]],
      rent: record[column['Starting Rent (₹/mo)']],
    }))
    .filter((listing) =>
      listing.name &&
      listing.city &&
      listing.locality &&
      listing.tenantType &&
      /^\d+$/.test(listing.rent) &&
      Number(listing.rent) > 0,
    );
}

test('KUNDAN.CSV has the listing fields and can be parsed safely', () => {
  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const [headers, ...records] = rows;

  expect(headers).toEqual(expectedHeaders);
  expect(records.length).toBeGreaterThan(0);

  for (const record of records) {
    expect(record).toHaveLength(expectedHeaders.length);
    expect(record[0]).not.toBe('');
    expect(record[1]).not.toBe('');
    expect(record[2]).not.toBe('');
    expect(record[3]).not.toBe('');
  }
});

test('List Your Property opens the Owner Login popup', async ({ page }) => {
  await page.goto('https://indianpgs.com/');
  await page.getByRole('button', { name: /List Your Property/i }).click();

  const loginPopup = page.locator('#ownerLoginModalBackdrop');
  const emailInput = loginPopup.locator('#ownerEmail');
  const passwordInput = loginPopup.locator('#ownerPassword');

  await expect(loginPopup).toBeVisible();
  await expect(loginPopup.getByRole('heading', { name: 'Owner Login' })).toBeVisible();
  await expect(loginPopup.getByText('Sign in to list and manage your PG property.')).toBeVisible();
  await expect(emailInput).toHaveAttribute('type', 'email');
  await expect(emailInput).toHaveAttribute('required', '');
  await expect(passwordInput).toHaveAttribute('type', 'password');
  await expect(passwordInput).toHaveAttribute('required', '');
  await expect(
    loginPopup.getByRole('button', { name: 'Sign In to List Property' }),
  ).toBeVisible();
});

test('Owner can sign in through the Owner Login popup', async ({ page }) => {
  test.skip(
    !ownerEmail || !ownerPassword,
    'Set INDIANPGS_OWNER_EMAIL and INDIANPGS_OWNER_PASSWORD to enable the sign-in test.',
  );

  await page.goto('https://indianpgs.com/');
  await page.getByRole('button', { name: /List Your Property/i }).click();

  const loginPopup = page.locator('#ownerLoginModalBackdrop');
  await expect(loginPopup).toBeVisible();
  await loginPopup.locator('#ownerEmail').fill(ownerEmail);
  await loginPopup.locator('#ownerPassword').fill(ownerPassword);
  await loginPopup.getByRole('button', { name: 'Sign In to List Property' }).click();

  await expect(loginPopup).toBeHidden();
  await expect(page.getByRole('button', { name: '+ Add Property' })).toBeVisible();
});

test('Owner can enter complete KUNDAN.CSV listings for review', async ({ page }) => {
  test.skip(
    !ownerEmail || !ownerPassword || !ownerContact,
    'Set INDIANPGS_OWNER_EMAIL, INDIANPGS_OWNER_PASSWORD, and INDIANPGS_OWNER_CONTACT to enable listing prefill.',
  );

  const listings = getCompleteListings();
  test.skip(!listings.length, 'No CSV rows have all required listing details and a supported tenant type.');

  await page.goto('https://indianpgs.com/');
  await page.getByRole('button', { name: /List Your Property/i }).click();

  const loginPopup = page.locator('#ownerLoginModalBackdrop');
  await expect(loginPopup).toBeVisible();
  await loginPopup.locator('#ownerEmail').fill(ownerEmail);
  await loginPopup.locator('#ownerPassword').fill(ownerPassword);
  await loginPopup.getByRole('button', { name: 'Sign In to List Property' }).click();
  await expect(loginPopup).toBeHidden();

  const listingForm = page.locator('#addPgModalBackdrop');
  for (let index = 0; index < listings.length; index += 1) {
    const listing = listings[index];

    await page.getByRole('button', { name: '+ Add Property' }).click();
    await expect(listingForm).toBeVisible();
    await listingForm.locator('#addPgName').fill(listing.name);
    await listingForm.locator('#addPgCity').selectOption(listing.city);
    await listingForm.locator('#addPgLocality').fill(listing.locality);
    await listingForm.locator('#addPgType').selectOption(listing.tenantType);
    await listingForm.locator('#addPgPrice').fill(listing.rent);
    await listingForm.locator('#addPgContact').fill(ownerContact);

    await expect(listingForm.locator('#addPgName')).toHaveValue(listing.name);
    await expect(listingForm.locator('#addPgCity')).toHaveValue(listing.city);
    await expect(listingForm.locator('#addPgLocality')).toHaveValue(listing.locality);
    await expect(listingForm.locator('#addPgType')).toHaveValue(listing.tenantType);
    await expect(listingForm.locator('#addPgPrice')).toHaveValue(listing.rent);
    await expect(listingForm.locator('#addPgContact')).toHaveValue(ownerContact);
    await expect(listingForm.locator('#propertyFormSubmit')).toBeVisible();

    console.log(`Review listing ${index + 1}/${listings.length}: ${listing.name}`);
    await page.pause();
    await expect(listingForm).toBeHidden();
  }
});
