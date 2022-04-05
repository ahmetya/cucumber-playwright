import { LaunchOptions } from 'playwright';
const browserOptions: LaunchOptions = {
  slowMo: 0,
  headless: true,
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true,
  },
};

export const config = {
  browser: process.env.BROWSER || 'chromium',
  browserOptions,
  BASE_URL: 'https://www.bets10.com/en',
  IMG_THRESHOLD: { threshold: 0.4 },
  BASE_API_URL: 'https://www.706bets10.com/api/',
};
