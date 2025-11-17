import { test, expect } from '@playwright/test';

test('create 100 contacts', async ({ page }) => {

  await page.goto('http://localhost/');
  await page.getByRole('textbox', { name: 'Username' }).fill('yash2');
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();

  for (let i = 1; i <= 100; i++) {

    await page.getByRole('button', { name: ' Add Contact' }).click();

    await page.getByRole('textbox', { name: 'Full Name *' })
      .fill(`User ${i}`);

    await page.getByRole('textbox', { name: 'Phone Number *' })
      .fill(`90000${i.toString().padStart(5, '0')}`);

    await page.getByRole('textbox', { name: 'Email Address' })
      .fill(`user${i}@example.com`);

    await page.getByRole('textbox', { name: 'Address', exact: true })
      .fill(`Address ${i}`);

    await page.getByRole('button', { name: ' Add Contact' }).click();

    console.log(`Created contact ${i}`);
  }
});
