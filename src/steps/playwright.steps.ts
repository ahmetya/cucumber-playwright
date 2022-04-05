import { ICustomWorld } from '../support/custom-world';
import { config } from '../support/config';
import { Given, When, Then } from '@cucumber/cucumber';
import expect from 'expect';

Given('Go to the playwright website', async function (this: ICustomWorld) {
  const page = this.page!;
  await page.goto(config.BASE_URL);
  await page.locator('nav >> a >> text="Playwright"').waitFor();
});

When('Change theme to {string} mode', async function (this: ICustomWorld, mode: string) {
  const page = this.page!;
  const current = await page.getAttribute('html', 'data-theme');
  if (current !== mode) {
    await page.locator('nav >> div:has(input[type="checkbox"]) >> div[role="button"]').click();
  }
  await page.waitForSelector(`html[data-theme=${mode}]`);
});

Then('We see {string} mode', async function (this: ICustomWorld, mode: string) {
  const page = this.page!;
  const theme = await page.locator('html').getAttribute('data-theme');
  expect(theme).toEqual(mode);
});

Given('Go to the betson website', async function (this: ICustomWorld) {
  const page = this.page!;
  await page.goto(config.BASE_URL);
  await page.locator('img[obgimagecontent="general.brand-logo"]').waitFor();
});

Given('I click to the login button', async function (this: ICustomWorld) {
  const page = this.page!;
  await page.locator('a[test-id*="login-button"]').click();
});

When('I enter username and password', async function (this: ICustomWorld) {
  const page = this.page!;
  await page.locator('input[test-id="login-username"]').type('dailytester@protonmail.com');
  await page.locator('input[test-id="login-password"]').type('Kartal1903@bjk');
});

When('I click to the login submit button', async function (this: ICustomWorld) {
  const page = this.page!;
  await page.locator('button[test-id*="login-submit"]').click();
});
Then('I should see my balance', async function (this: ICustomWorld) {
  const page = this.page!;
  const depositView = await page
    .locator(
      'button[test-id="user-summary-toggle-button"] span[class*="obg-m-user-summary-balance ng-star-inserted"]',
    )
    .innerText();
  expect(depositView).toBe('€0.00');
});
