import { defineConfig, devices } from '@playwright/test'

const PORT = 5175
/** Locally, use the installed Google Chrome (no download). CI runners use Playwright's own Chromium. */
const CHANNEL = process.env.CI ? undefined : 'chrome'

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  // WebGL with ambient occlusion is heavy on a CPU-rendered headless GPU; one browser at a time keeps timings stable.
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: CHANNEL,
    launchOptions: { args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] },
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: CHANNEL } },
  ],
  webServer: {
    command: `npx vite --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: false,
  },
})
