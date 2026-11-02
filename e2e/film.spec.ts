import { expect, test, type Page } from '@playwright/test'

const SCREENSHOT_DIR = 'e2e/screenshots'
/** Lets the eased scroll catch up and the clip seek before a screenshot. */
const SETTLE_MS = 1800

const scrollFilmTo = async (page: Page, fraction: number) => {
  await page.locator('.film').evaluate((el, f) => {
    el.scrollTop = f * (el.scrollHeight - el.clientHeight)
  }, fraction)
  await page.waitForTimeout(SETTLE_MS)
}

const shoot = (page: Page, name: string) => page.screenshot({ path: `${SCREENSHOT_DIR}/${test.info().project.name}-film-${name}.png` })

const visibleChapter = (page: Page) =>
  page.locator('.film__chapter').evaluateAll((els) => els.findIndex((el) => Number((el as HTMLElement).style.opacity) > 0.5))

test('the film scrubs through every chapter and hands off to the 3D tour', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()))

  await page.goto('/')
  await expect(page.getByRole('heading', { name: /exceptional homes/i })).toBeVisible()
  await expect(page.locator('.film__counter')).toContainText('01')
  await page.waitForTimeout(SETTLE_MS)
  await shoot(page, '1')

  const stops = [0.3, 0.5, 0.7, 1]
  for (const [i, stop] of stops.entries()) {
    await scrollFilmTo(page, stop)
    await expect(page.locator('.film__counter')).toContainText(String(i + 2).padStart(2, '0'))
    expect(await visibleChapter(page)).toBe(i + 1)
    await shoot(page, String(i + 2))
  }

  await page.getByRole('button', { name: /explore villa serena in 3d/i }).click()
  await expect(page).toHaveURL(/view=tour/)
  await expect(page.locator('#property-name')).toHaveText('Villa Serena')
  await expect(page.locator('.tour-canvas canvas')).toBeVisible()
  expect(errors).toEqual([])
})

test('skip goes straight to the tour and the Film button comes back', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /skip to 3d tour/i }).click()
  await expect(page.getByRole('button', { name: /start guided tour/i })).toBeVisible()

  await page.getByRole('button', { name: /watch the film/i }).click()
  await expect(page.getByRole('heading', { name: /exceptional homes/i })).toBeVisible()
})

test('the inquiry form opens from the film', async ({ page }) => {
  await page.goto('/')

  await page.locator('.film__header').getByRole('button', { name: /enquire/i }).click()

  await expect(page.getByRole('dialog', { name: 'Villa Serena' })).toBeVisible()
})
