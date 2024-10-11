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

  await page.waitForLoadState('networkidle');

  const content = await page.content();
  console.log(content);

  await expect(page.locator('text=Tester Hotel Overview')).toBeVisible({ timeout: 15000 });
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


test('Test02 - Skapa faktura API', async ({ request }) => {
  const loginResponse = await request.post('http://localhost:3000/api/login', {
    data: {
      "username": process.env.TEST_USERNAME,
      "password": process.env.TEST_PASSWORD
    }
  });

  const { token } = await loginResponse.json();
  console.log('Received token:', token);

  const response = await request.post('http://localhost:3000/api/bill/new', {
    headers: {
      'Content-Type': 'application/json',
      'X-user-auth': JSON.stringify({ username: 'tester01', token }),
    },
    data: {
      value: '3500',
    }
  });

  console.log('Create bill status code:', response.status());
  console.log('Create bill response body:', await response.text());

  expect(response.ok()).toBeTruthy();
});