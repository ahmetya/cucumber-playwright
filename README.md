# cucumber-playwright

![Test](https://github.com/Tallyb/cucumber-playwright/workflows/Test/badge.svg)

A starter repo for writing E2E tests based on Cucumber(7) with Playwright using Typescript.

## Kudos

This repository is based on the [Cucumber-typescript-starter](https://github.com/hdorgeval/cucumber7-ts-starter/) repo.

## What's inside

- Typescript setup for writing steps with eslint/typescript and prettier
- Launching of Playwright browser before running all tests
- Launching new context and page for each scenario
- Running feature with video recording option
- Report generated with last good image attached
- Utilies function to help you with writing steps
- VScode configuration to debug a single feature or an only scenario (run when located on the feature file)

## Usage

Create a repo based on this template and start writing your tests.

## To run your tests

`npm run test` or `npx cucumber-js` runs all tests
`npm run test <feature name>` or `npx cucumber-js <feature name>` run the single feature

## Browser selection

By default we will use chromium. You can define an envrionment variable called BROWSER and
set the name of the browser. Available options: chromium, firefox, webkit

On Linux and Mac you can write:

`BROWSER=firefox npm run test` or `BROWSER=firefox npx cucumber-js` runs all tests using Firefox

One Windows you need to write

```
set BROWSER=firefox
npm run test
```

## Working with Page Objects

I am not fond of the Page Object Model (POM) for testing. It feels like a leftover from Java world, and I do not think it fits the Javascript world. However, you can check [this PR](https://github.com/Tallyb/cucumber-playwright/pull/95/files) to see POM implementation.

## Debugging Features

### From CLI

- `npm run debug` - headful mode with APIs enables both APIs and debug options
- `npm run api` - headless mode with debug apis
- `npm run video` - headless mode vith video

## In Visual Studio Code

- Open the feature
- Select the debug options in the VSCode debugger
- Set breakpoints in the code

To stop the feature, you can add the `Then debug` step inside your feature. It will stop your debugger.

## To choose a reporter

The last reporter/formatter found on the cucumber-js command-line wins:

```text
--format summary --format @cucumber/pretty-formatter --format cucumber-console-formatter
```

In [cucumber.js](cucumber.js) file, modify the options.

## To ignore a scenario

- tag the scenario with `@ignore`

## To check for typescript, linting and gherkin errors

- run the command `npm run build`.

## To view the steps usage

- run the command `npm run steps-usage`.

## To view the html report of the last run

- run the command `npm run report`.

## QA Automation Assignment Notes

- Depending to the regulations in my country [bets10.com](https:/www.bets10.com) url changes in daily basis. Currently it is https://www.708bets10.com/ (number at the beginning increments daily) this does not effect UI cases but it causes API tests to fail. Please validate it before executing tests. You can change it under [config.js](./src/support/config.ts)  > BASE_API_URL
- UI automation cases added to validate functionality of sportsbook tables and betslip assertions
- API automation cases includes user authentication to receive user related data
- Integration with GitHub Actions added to project workflow that triggers on every push or it can be executed manually when required.
- A new reporting tool added run the command `npm run report:alt` to generate alternative reports.
- Scenarios are self explaning by feautre files
