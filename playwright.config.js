// This is a sample config for what users might be running locally
import {devices} from '@playwright/test'
const config = {
  testDir: './tests',
  testMatch: ['**/tests/scif_certificate_stability.js'],

  /* Maximum time one test can run for. */
  timeout: 300 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* tests in parallel */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'line',
  /* Configure projects for major browsers */
  projects: [
    {
      name: "safari@iPhone 15:17@browserstack-mobile",
      use: {
        baseURL: "https://the-internet.herokuapp.com/",        
        browserName: "webkit",
        channel: "chrome",
        timeout: 120000,
      },
      
    },
    {
      name: 'Chrome',
      use: { ...devices['Desktop Chrome'], 
        channel: 'chrome' ,
        viewport: null,
        deviceScaleFactor: undefined,
        launchOptions: {
          args: [
            '--start-maximized',           // Starts Chrome maximized            
          ],          
        },
      }, // or 'chrome-beta'
    }
  ],
};

module.exports = config;