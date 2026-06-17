import { defineConfig, devices } from "@playwright/test";

process.env.ACCESS_TOKEN_PEPPER ??= "development-only-pepper";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/zadachnik?schema=public";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  webServer: {
    command: "npm run dev",
    env: {
      DATABASE_URL: databaseUrl,
      ACCESS_TOKEN_PEPPER: process.env.ACCESS_TOKEN_PEPPER
    },
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 120_000
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"] }
    }
  ]
});
