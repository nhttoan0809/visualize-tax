import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  timeout: 60000,
  expect: { timeout: 10000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3002",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    reducedMotion: "reduce",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
        defaultBrowserType: "chromium",
        viewport: { width: 375, height: 812 },
      },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "pnpm dev --hostname 127.0.0.1 --port 3002",
        url: "http://127.0.0.1:3002",
        reuseExistingServer: !process.env.CI,
        timeout: 60000,
      },
});
