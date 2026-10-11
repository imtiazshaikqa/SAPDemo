const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const csvPath = path.resolve(__dirname, '..', 'Data', 'KUNDAN.CSV');
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



test('List Your Property requires owner sign-in', async ({ page }) => {
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
  await page.goto('https://indianpgs.com/');
  await page.getByRole('button', { name: /List Your Property/i }).click();

  //Sign In to List Property

 // await expect(page.getByRole('heading', { name: 'Owner Login' })).fill("owner@example.com")
  //await expect(page.getByRole('textbox', { name: 'Email Address' })).fill("owner@example.com");
  await expect(page.getByRole('textbox', { id: 'ownerEmail' })).fill("owner@example.com");
  await expect(page.getByRole('textbox', { id: 'ownerPassword' })).fill("pAssword@1QAZ");
   await page.getByRole('button', { name: /Sign In to List Property/i }).click();
  
  await page.pause();
});
