import {
  defineConfig,
  devices,
} from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",

  fullyParallel: false,

  forbidOnly: Boolean(
    process.env.CI,
  ),

  retries: process.env.CI
    ? 2
    : 0,

  workers: 1,

  reporter: [
    [
      "list",
    ],
    [
      "html",
      {
        open: "never",
      },
    ],
  ],

  use: {
    baseURL:
      "http://localhost:3000",

    trace: "on-first-retry",

    screenshot:
      "only-on-failure",

    video:
      "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",

      use: {
        ...devices[
          "Desktop Chrome"
        ],
      },
    },
  ],

  webServer: {
    command: process.env.CI
      ? "pnpm start"
      : "pnpm build && pnpm start",

    url:
      "http://localhost:3000/tr",

    reuseExistingServer: false,

    timeout: 180_000,
  },
});