import { defineConfig, devices } from '@playwright/test';
const databaseUrl = process.env['TEST_DATABASE_URL'];
if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith('_test')) {
  throw new Error('TEST_DATABASE_URL must point to a dedicated database ending in _test.');
}
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  workers: process.env['CI'] ? 2 : 4,
  reporter: [['list'], ['html', { open: 'never' }]],
  globalSetup: './e2e/global-setup.ts',
  use: { baseURL: 'http://127.0.0.1:4300', trace: 'retain-on-failure' },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: process.env['PLAYWRIGHT_CHROME_CHANNEL'] },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 7'],
        defaultBrowserType: 'chromium',
        channel: process.env['PLAYWRIGHT_CHROME_CHANNEL'],
      },
    },
  ],
  webServer: [
    {
      command: 'node apps/api/dist/main.js',
      url: 'http://127.0.0.1:3100/api/health/ready',
      env: { DATABASE_URL: databaseUrl, PORT: '3100' },
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command:
        'npm exec --workspace @foodsale/web -- ng serve --port 4300 --host 127.0.0.1 --proxy-config proxy.e2e.conf.json',
      url: 'http://127.0.0.1:4300',
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
