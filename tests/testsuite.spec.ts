import { test, expect } from '@playwright/test';

test.describe('Frontend tests', () => {
  test('Test01 - Logga in', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.locator('input[type="text"]').fill(`${process.env.TEST_USERNAME}`);
    await page.locator('input[type="password"]').fill(`${process.env.TEST_PASSWORD}`);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading', { name: 'Tester Hotel Overview' })).toBeVisible();
  });
})

test('Test02 - Skapa faktura', async ({ page }) => {

  await page.goto('http://localhost:3000');
  await page.locator('input[type="text"]').fill(`${process.env.TEST_USERNAME}`);
  await page.locator('input[type="password"]').fill(`${process.env.TEST_PASSWORD}`);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Tester Hotel Overview' })).toBeVisible();

  await page.locator('#app > div > div > div:nth-child(3) > a').click();
  await page.locator('#app > div > h2 > a').click();

  await page.fill('input[type="number"]', '3500');

  await page.locator('a.btn.blue').click();

  await expect(page.locator('text=Bills')).toBeVisible();
});

test.describe('Backend tests', () => {
  test('Test01 - Logga in', async ({ request }) => {
    const loginResponse = await request.post('http://localhost:3000/api/login', {
      data: {
        "username": process.env.TEST_USERNAME,
        "password": process.env.TEST_PASSWORD
      }
    });

    console.log('Login status code:', loginResponse.status());
    console.log('Login response body:', await loginResponse.text());

    expect(loginResponse.ok()).toBeTruthy();  // Kontrollera om inloggningen lyckades
  });
});