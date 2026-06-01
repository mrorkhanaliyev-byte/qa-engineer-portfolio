import { test, expect, Page } from '@playwright/test'
import { LoginPage } from '../../pages/saucedemo/LoginPage'
import { InventoryPage } from '../../pages/saucedemo/InventoryPage'
import { CartPage } from '../../pages/saucedemo/CartPage'
import { CheckoutPage } from '../../pages/saucedemo/CheckoutPage'
import { saucedemo as sd } from '../../fixtures/test-data'

/**
 * SauceDemo (Swag Labs) — Full Purchase Flow (Playwright / TypeScript).
 *
 * inventory → sort → add to cart → cart → checkout → confirmation.
 *
 * This is the spec that CLOSES the checkout-coverage gap in the RTM:
 * Automation Exercise and Demoblaze can't complete a real purchase in
 * CI, but SauceDemo's public credentials let the whole flow — through
 * "Thank you for your order!" — run on every push across all browsers.
 *
 * Pattern: serial mode with ONE shared page and ONE login (beforeAll),
 * resetting app state in-app between tests. Mirrors the Cypress spec's
 * testIsolation:false approach and avoids hammering the demo CDN with
 * a fresh login per test.
 *
 * Mirrors 05-cypress-tests/cypress/e2e/saucedemo/checkout.cy.js — same TC IDs.
 */

const BACKPACK = 'sauce-labs-backpack'
const BIKE_LIGHT = 'sauce-labs-bike-light'

test.describe.serial('SauceDemo — Full Purchase Flow', () => {
  let page: Page
  let inventory: InventoryPage
  let cart: CartPage
  let checkout: CheckoutPage

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await page.setViewportSize({ width: 1440, height: 900 })

    const login = new LoginPage(page)
    await login.visit()
    await login.loginAs(sd.standard, sd.password)
    await login.assertOnInventory()

    inventory = new InventoryPage(page)
    cart = new CartPage(page)
    checkout = new CheckoutPage(page)
  })

  test.beforeEach(async () => {
    // Reset to a clean, empty-cart inventory between tests — in-app,
    // no page reload.
    await inventory.resetToCleanInventory()
  })

  test.afterAll(async () => {
    await page.close()
  })

  // ---- INVENTORY ----------------------------------------------

  test('TC-SAUCE-INV-001 | Positive | Inventory lists all 6 products', async () => {
    await inventory.assertItemCount(6)
  })

  test('TC-SAUCE-INV-002 | Positive | Sort by price low-to-high orders prices ascending', async () => {
    await inventory.sortBy('lohi')
    await inventory.assertPricesAscending()
  })

  test('TC-SAUCE-INV-003 | Positive | Sort by name Z-to-A orders names descending', async () => {
    await inventory.sortBy('za')
    await inventory.assertNamesDescending()
  })

  test('TC-SAUCE-INV-004 | Positive | Adding a product increments the cart badge', async () => {
    await inventory.addToCart(BACKPACK)
    await inventory.assertCartBadgeCount(1)
  })

  // ---- CART ---------------------------------------------------

  test('TC-SAUCE-CART-001 | Positive | Cart lists the products that were added', async () => {
    await inventory.addToCart(BACKPACK)
    await inventory.addToCart(BIKE_LIGHT)
    await inventory.assertCartBadgeCount(2)
    await inventory.openCart()

    await cart.assertItemCount(2)
    await cart.assertContainsItem('Sauce Labs Backpack')
    await cart.assertContainsItem('Sauce Labs Bike Light')
  })

  test('TC-SAUCE-CART-002 | Positive | Removing an item from the cart updates it', async () => {
    await inventory.addToCart(BACKPACK)
    await inventory.addToCart(BIKE_LIGHT)
    await inventory.openCart()

    await cart.removeItem(BACKPACK)
    await cart.assertItemCount(1)
    await cart.assertContainsItem('Sauce Labs Bike Light')
  })

  // ---- CHECKOUT (full, through confirmation) ------------------

  test('TC-SAUCE-CHK-001 | Positive | Complete purchase reaches the confirmation page', async () => {
    await inventory.addToCart(BACKPACK)
    await inventory.openCart()
    await cart.checkout()

    await checkout.fillBuyerInfo(sd.buyer.firstName, sd.buyer.lastName, sd.buyer.postalCode)
    await checkout.assertOnOverview()
    await checkout.assertOverviewItemCount(1)

    await checkout.finish()
    await checkout.assertOrderComplete()
  })

  test('TC-SAUCE-CHK-002 | Negative | Checkout info form requires the postal code', async () => {
    await inventory.addToCart(BACKPACK)
    await inventory.openCart()
    await cart.checkout()

    // First + last name but NO postal code.
    await checkout.fillBuyerInfo(sd.buyer.firstName, sd.buyer.lastName, undefined)
    await checkout.assertErrorContains('Postal Code is required')
  })
})
