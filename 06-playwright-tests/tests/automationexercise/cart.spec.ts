import { test, expect } from '@playwright/test'
import { ProductsPage } from '../../pages/automationexercise/ProductsPage'
import { CartPage } from '../../pages/automationexercise/CartPage'
import { automationexercise as ae, SKIP_AUTH } from '../../fixtures/test-data'

/**
 * Automation Exercise — Cart Flow (Playwright / TypeScript).
 *
 * Direct counterpart to the Cypress spec at:
 *   05-cypress-tests/cypress/e2e/automationexercise/cart.cy.js
 *
 * Same TC IDs, mapping to /01-manual-testing/test-cases/cart-test-cases.csv.
 *
 * Coverage strategy:
 *   - Stable guest-cart tests run on every CI build
 *   - Auth-required tests use test.skip(SKIP_AUTH, ...)
 *   - TC-CART-009 (cart persistence across logout) is intentionally
 *     NOT automated as a passing test — it documents BUG-002.
 *     Automating it as passing would mask the bug.
 */

const PRODUCT_A = 'Blue Top'
const PRODUCT_B = 'Men Tshirt'

test.describe('Automation Exercise — Cart Flow', () => {
  let products: ProductsPage
  let cart: CartPage

  test.beforeEach(async ({ page }) => {
    products = new ProductsPage(page)
    cart = new CartPage(page)
  })

  // ----------------------------------------------------------
  // EMPTY STATE
  // ----------------------------------------------------------

  test('TC-CART-001 | Positive | Empty cart shows the "Cart is empty" message', async () => {
    await cart.visit()
    await cart.assertEmpty()
  })

  // ----------------------------------------------------------
  // ADD / REMOVE
  // ----------------------------------------------------------

  test('TC-CART-002 | Positive | Adding a single product lands it in the cart', async () => {
    await products.visit()
    await products.addToCart(PRODUCT_A)
    await products.goToCartFromModal()

    await cart.assertItemInCart(PRODUCT_A, 1)
    await cart.assertRowCount(1)
  })

  test('TC-CART-003 | Positive | Adding the same product twice increments the quantity', async () => {
    await products.visit()
    await products.addToCart(PRODUCT_A)
    await products.dismissAddedModal()
    await products.addToCart(PRODUCT_A)
    await products.goToCartFromModal()

    await cart.assertItemInCart(PRODUCT_A, 2)
    await cart.assertRowCount(1)
  })

  test('TC-CART-004 | Positive | Adding different products produces separate rows', async () => {
    await products.visit()
    await products.addToCart(PRODUCT_A)
    await products.dismissAddedModal()
    await products.addToCart(PRODUCT_B)
    await products.goToCartFromModal()

    await cart.assertItemInCart(PRODUCT_A, 1)
    await cart.assertItemInCart(PRODUCT_B, 1)
    await cart.assertRowCount(2)
  })

  test('TC-CART-005 | Positive | Remove button deletes the row', async () => {
    await products.visit()
    await products.addToCart(PRODUCT_A)
    await products.dismissAddedModal()
    await products.addToCart(PRODUCT_B)
    await products.goToCartFromModal()

    await cart.removeItem(PRODUCT_A)
    await cart.assertRowCount(1)
    await cart.assertItemInCart(PRODUCT_B, 1)
  })

  // ----------------------------------------------------------
  // PERSISTENCE
  // ----------------------------------------------------------

  test('TC-CART-008 | Positive | Cart survives navigating away and back', async ({ page }) => {
    await products.visit()
    await products.addToCart(PRODUCT_A)
    await products.dismissAddedModal()

    await page.goto('https://automationexercise.com/contact_us')
    await expect(page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible()

    await cart.visit()
    await cart.assertItemInCart(PRODUCT_A, 1)
  })

  // ----------------------------------------------------------
  // CHECKOUT ENTRY
  // ----------------------------------------------------------

  test('TC-CART-012 | Negative | Guest user is shown the register/login modal', async () => {
    await products.visit()
    await products.addToCart(PRODUCT_A)
    await products.goToCartFromModal()

    await cart.clickProceedToCheckout()
    await cart.assertGuestCheckoutBlocker()
  })

  test('TC-CART-011 | Positive | Logged-in user goes straight to /checkout', async ({ page }) => {
    test.skip(SKIP_AUTH, 'Requires pre-registered user — skipped in CI')

    // Quick inline login — full login flow is covered in login.spec.ts.
    await page.goto('https://automationexercise.com/login')
    await page.locator('input[data-qa="login-email"]').fill(ae.valid.email)
    await page.locator('input[data-qa="login-password"]').fill(ae.valid.password)
    await page.locator('button[data-qa="login-button"]').click()

    await products.visit()
    await products.addToCart(PRODUCT_A)
    await products.goToCartFromModal()

    await cart.clickProceedToCheckout()
    await expect(page).toHaveURL(/\/checkout/)
    await expect(page.getByText('Address Details')).toBeVisible()
  })

  // ----------------------------------------------------------
  // KNOWN BUG (intentionally NOT automated as passing)
  // ----------------------------------------------------------
  // TC-CART-009 — cart should survive logout/login. Currently broken
  // on AE (BUG-002 in /01-manual-testing/bug-reports/). Re-introducing
  // it as a passing test would mask the bug. Reference preserved
  // here so the gap is intentional, not accidental.
})
