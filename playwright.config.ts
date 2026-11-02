import { defineConfig, devices } from '@playwright/test'

const PORT = 5175
/** Locally, use the installed Google Chrome (no download). CI runners use Playwright's own Chromium. */
const CHANNEL = process.env.CI ? undefined : 'chrome'
/** E2E_SOFTWARE_GL=1 turns the GPU off locally, reproducing CI's CPU-only WebGL. */
const SOFTWARE_GL_ARGS = process.env.E2E_SOFTWARE_GL ? ['--disable-gpu', '--use-angle=swiftshader'] : []

export default defineConfig({
  testDir: './e2e',
  // Software-rendered WebGL on CI runners is slow to compile shaders and light the scene.
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  // WebGL with ambient occlusion is heavy on a CPU-rendered headless GPU; one browser at a time keeps timings stable.
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: CHANNEL,
    launchOptions: { args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', ...SOFTWARE_GL_ARGS] },
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: CHANNEL } },
  ],
  webServer: {
    // Test the production build, as deployed. The dev server re-bundles the 3D libraries the first
    // time the tour loads and reloads the page mid-test, which breaks the lazily loaded scene.
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    port: PORT,
    timeout: 180_000,
    reuseExistingServer: false,
  },
})
