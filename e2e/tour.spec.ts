import { expect, test, type Page } from '@playwright/test'

const SCREENSHOT_DIR = 'e2e/screenshots'
/** Lets camera transitions and the cutaway animation settle before a screenshot. */
const SETTLE_MS = 2500

const trackConsoleErrors = (page: Page): string[] => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  return errors
}

const waitForScene = async (page: Page) => {
  await expect(page.locator('.tour-canvas canvas')).toBeVisible()
  await expect(page.locator('.loader')).toHaveClass(/is-done/)
}

/** Phones start with the plan collapsed; open it when the toggle is showing. */
const openFloorPlan = async (page: Page) => {
  const toggle = page.getByRole('button', { name: 'Floor plan', exact: true })
  if (await toggle.isVisible()) await toggle.click()
}

const shoot = async (page: Page, name: string) => {
  await page.waitForTimeout(SETTLE_MS)
  await page.screenshot({ path: `${SCREENSHOT_DIR}/${test.info().project.name}-${name}.png` })
}

test('overview shows the property, its rooms and the floor plan', async ({ page }) => {
  const errors = trackConsoleErrors(page)

  await page.goto('/')
  await waitForScene(page)

  await expect(page.getByRole('heading', { name: 'Villa Serena' })).toBeVisible()
  await expect(page.getByText('$1,850,000')).toBeVisible()
  await openFloorPlan(page)
  await expect(page.getByRole('button', { name: /Living Room, 70 square metres/ })).toBeVisible()
  await shoot(page, 'villa-overview')
  expect(errors).toEqual([])
})

test('guided tour walks room to room and ends at the inquiry form', async ({ page }) => {
  const errors = trackConsoleErrors(page)
  await page.goto('/')
  await waitForScene(page)

  await page.getByRole('button', { name: /start guided tour/i }).click()
  await expect(page.getByRole('heading', { name: 'Gallery Hall' })).toBeVisible()
  await expect(page).toHaveURL(/room=hall/)

  await page.getByRole('button', { name: /^next/i }).click()
  await expect(page.getByRole('heading', { name: 'Living Room' })).toBeVisible()
  await shoot(page, 'villa-living')

  await openFloorPlan(page)
  await page.getByRole('button', { name: /Kitchen & Dining, 70 square metres/ }).click()
  await expect(page.getByRole('heading', { name: 'Kitchen & Dining' })).toBeVisible()
  await shoot(page, 'villa-kitchen')

  await page.goto('/?property=villa-serena&room=bathroom')
  await waitForScene(page)
  await page.getByRole('button', { name: /request details/i }).click()

  const dialog = page.getByRole('dialog', { name: 'Villa Serena' })
  await expect(dialog).toBeVisible()
  await dialog.getByLabel('Full name').fill('Amira Haddad')
  await dialog.getByLabel('Email').fill('amira@example.com')
  await dialog.getByLabel('Budget').selectOption('1m-2m')
  await dialog.getByText('An investment').click()
  await dialog.getByText(/I agree/).click()
  await shoot(page, 'inquiry-form')
  await dialog.getByRole('button', { name: /send inquiry/i }).click()

  await expect(dialog.getByRole('heading', { name: /thank you, amira/i })).toBeVisible()
  await expect(dialog.getByText(/demo mode/i)).toBeVisible()
  expect(errors).toEqual([])
})

test('switching to the apartment resets the tour and updates the link', async ({ page }) => {
  await page.goto('/?property=villa-serena&room=living')
  await waitForScene(page)

  await page.getByRole('button', { name: /Skyline 12B/ }).click()

  await expect(page.getByRole('heading', { name: 'Skyline Residence 12B' })).toBeVisible()
  await expect(page).toHaveURL(/property=skyline-12b$/)
  await shoot(page, 'apartment-overview')
})

test('deep links open straight into a room', async ({ page }) => {
  const errors = trackConsoleErrors(page)

  await page.goto('/?property=skyline-12b&room=lounge')
  await waitForScene(page)

  await expect(page.getByRole('heading', { name: 'Living & Dining' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Go to Kitchen' })).toBeVisible()
  await shoot(page, 'apartment-lounge')

  await page.goto('/?property=villa-serena&room=terrace')
  await waitForScene(page)
  await shoot(page, 'villa-terrace')
  expect(errors).toEqual([])
})

test('layout never scrolls sideways', async ({ page }) => {
  await page.goto('/')
  await waitForScene(page)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)

  expect(overflow).toBeLessThanOrEqual(0)
})
