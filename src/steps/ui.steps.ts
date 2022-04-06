import { ICustomWorld } from '../support/custom-world';
import { config } from '../support/config';
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

const eventItemCount: number[] = [];

Given('Navigate to the betson website', async function (this: ICustomWorld) {
  const page = this.page!;
  await page.goto(config.BASE_URL);
});

Given('I click to the login button', async function (this: ICustomWorld) {
  const page = this.page!;
  await page.locator('a[test-id*="login-button"]').click();
});

When(
  'I enter email {string} and password {string}',
  async function (this: ICustomWorld, username: string, password: string) {
    const page = this.page!;
    await page.locator('input[test-id="login-username"]').type(username);
    await page.locator('input[test-id="login-password"]').type(password);
  },
);

When('I click to the login submit button', async function (this: ICustomWorld) {
  const page = this.page!;
  await page.locator('button[test-id*="login-submit"]').click();
});
Then('I should see my balance', async function (this: ICustomWorld) {
  const page = this.page!;
  const depositView = await page.locator('span[class*="summary-balance"]').innerText();
  expect(depositView).toContain('0.00');
});

When('I click to the sportsbook link', async function (this: ICustomWorld) {
  const page = this.page!;
  await page.locator('a[test-id="menu.product.sportsbook"]').click();
});

Then('I should see sportsbook quicklink menu', async function (this: ICustomWorld) {
  const page = this.page!;
  const quicklinkMenuLocator = page.locator(
    'obg-quick-links-scroller[class*="sportsbook-quicklink-menu"]',
  );
  await expect(quicklinkMenuLocator).toBeVisible();
});

When(
  'I should navigate to {string} in {string} in {string}',
  async function (this: ICustomWorld, gameType: string, gameGroup: string, gameDivision: string) {
    const page = this.page!;
    const sideNavigationButton = page.locator(
      'div[class="sidenav-toggle-button"] >> text="A-Z Sports"',
    );

    const gameTypeLabel = page.locator(
      `span[class*="sport-catalog-component-header-label"] >> text="${gameType}" >> nth=0`,
    );

    const gameGroupLabel = page.locator(
      `span[class*="sport-catalog-component-header-label"] >> text="${gameGroup}" >> nth=0`,
    );

    const gameDivisionLabel = page.locator(
      `a[class*="sport-catalog-component-competition-content"] >> text="${gameDivision}"`,
    );

    await sideNavigationButton.click();
    await gameTypeLabel.click();
    await gameGroupLabel.click();
    await gameDivisionLabel.click();
  },
);

Then('I should see content table', async function (this: ICustomWorld) {
  const page = this.page!;
  await page.waitForSelector('div[test-id="event.row"]');
  const events = await page.$$('div[test-id="event.row"]');
  await page.waitForLoadState('load');
  await page.waitForLoadState('domcontentloaded');
  for await (const event of events) {
    await event.scrollIntoViewIfNeeded();
  }

  eventItemCount.push(events.length);
});

When('I scroll down to the bottom', async function (this: ICustomWorld) {
  const page = this.page!;
  const eventGroups = await page.$$(
    'div[class="obg-m-events-master-detail-header no-animation ng-star-inserted"]',
  );

  for await (const eventGroup of eventGroups) {
    await eventGroup.scrollIntoViewIfNeeded();
  }
});

Then('I should see new content is loaded', async function (this: ICustomWorld) {
  expect(eventItemCount[0] < eventItemCount[1]).toBeTruthy();
});

When('I extend all event tables', async function (this: ICustomWorld) {
  const page = this.page!;
  const eventGroups = await page.$$(
    'div[class="obg-m-events-master-detail-header no-animation ng-star-inserted"]',
  );

  for await (const eventGroup of eventGroups) {
    await eventGroup.click();
  }
});

When('I make {int} bet selections', async function (this: ICustomWorld, betCount: number) {
  const page = this.page!;
  const selections = await page.$$('div[test-id="selection"] >> text="Draw"');
  let iteration = 0;
  for await (const selection of selections) {
    await selection.click();
    iteration++;
    if (iteration == betCount) {
      break;
    }
  }
});
Then('I should see maximum bet warning message on betslip', async function (this: ICustomWorld) {
  const page = this.page!;
  const warningMessage = page.locator('obg-message[class*="warning"]');
  expect(warningMessage).toBeVisible();
});
Then(
  'There should be {int} items in betslip',
  async function (this: ICustomWorld, betSlipItemCount: number) {
    const page = this.page!;

    const sideNavigationButton = page.locator(
      'div[class="sidenav-toggle-button"] >> text="Betslip"',
    );
    await sideNavigationButton.click();
    const betSlipSelections = await page.$$(
      'obg-m-betslip-selection-container[test-id="betslip.selection"]',
    );
    expect(betSlipSelections.length == betSlipItemCount).toBeTruthy();
  },
);

When('I click Remove All Selections in betslip', async function (this: ICustomWorld) {
  const page = this.page!;
  await page.locator('button[class*="betslip-selection-remove-all"]').click();
});

Then('I should see all selections are removed', async function (this: ICustomWorld) {
  const page = this.page!;
  const betslipContentText = await page.locator('section[class*="betslip-content"]').innerText();
  expect(betslipContentText).toContain('You need at least 2 selections');
});
