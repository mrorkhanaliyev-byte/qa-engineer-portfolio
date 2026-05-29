// ============================================================
// Automation Exercise — Cart Flow
// Maps to manual test cases TC-CART-001..012 in
// /01-manual-testing/test-cases/cart-test-cases.csv
//
// Coverage strategy:
//   * Stable guest-cart tests run every CI build
//   * Auth-required tests use itIfAuth (skipped in CI)
//   * TC-CART-009 (cart persistence across logout) is INTENTIONALLY
//     NOT automated here — it documents BUG-002 from manual testing.
//     Re-introducing it as a passing test would mask the bug.
// ============================================================

import productsPage from '../../pages/automationexercise/ProductsPage'
import cartPage     from '../../pages/automationexercise/CartPage'

// Same auth-skip pattern as the login spec.
const itIfAuth = Cypress.env('CI_SKIP_AUTH_TESTS') ? it.skip : it

const PRODUCT_A = 'Blue Top'
const PRODUCT_B = 'Men Tshirt'

describe('Automation Exercise — Cart Flow', () => {
  // ----------------------------------------------------------
  // EMPTY STATE
  // ----------------------------------------------------------

  describe('Empty cart', () => {
    it('TC-CART-001 | Positive | Empty cart shows the "Cart is empty" message', () => {
      cartPage.visit().assertEmpty()
    })
  })

  // ----------------------------------------------------------
  // ADD / REMOVE
  // Each test starts on /products so the cart state from a
  // previous test never leaks (the AE demo doesn't persist
  // cart for anonymous users — clean slate per spec session).
  // ----------------------------------------------------------

  describe('Add and remove products', () => {
    beforeEach(() => {
      productsPage.visit()
    })

    it('TC-CART-002 | Positive | Adding a single product lands it in the cart', () => {
      productsPage.addToCart(PRODUCT_A)
      productsPage.goToCartFromModal()

      cartPage.assertItemInCart(PRODUCT_A, 1)
      cartPage.assertRowCount(1)
    })

    it('TC-CART-003 | Positive | Adding the same product twice increments the quantity', () => {
      productsPage.addToCart(PRODUCT_A)
      productsPage.dismissAddedModal()
      productsPage.addToCart(PRODUCT_A)
      productsPage.goToCartFromModal()

      cartPage.assertItemInCart(PRODUCT_A, 2)
      cartPage.assertRowCount(1)  // still ONE row, quantity 2
    })

    it('TC-CART-004 | Positive | Adding different products produces separate rows', () => {
      productsPage.addToCart(PRODUCT_A)
      productsPage.dismissAddedModal()
      productsPage.addToCart(PRODUCT_B)
      productsPage.goToCartFromModal()

      cartPage.assertItemInCart(PRODUCT_A, 1)
      cartPage.assertItemInCart(PRODUCT_B, 1)
      cartPage.assertRowCount(2)
    })

    it('TC-CART-005 | Positive | Remove button deletes the row', () => {
      productsPage.addToCart(PRODUCT_A)
      productsPage.dismissAddedModal()
      productsPage.addToCart(PRODUCT_B)
      productsPage.goToCartFromModal()

      cartPage.removeItem(PRODUCT_A)
      cartPage.assertRowCount(1)
      cartPage.assertItemInCart(PRODUCT_B, 1)
    })
  })

  // ----------------------------------------------------------
  // PERSISTENCE
  // ----------------------------------------------------------

  describe('Persistence across navigation', () => {
    beforeEach(() => {
      productsPage.visit()
      productsPage.addToCart(PRODUCT_A)
      productsPage.dismissAddedModal()
    })

    it('TC-CART-008 | Positive | Cart survives navigating away and back', () => {
      cy.visit('https://automationexercise.com/contact_us')
      cy.contains('h2', 'Get In Touch').should('be.visible')

      cartPage.visit()
      cartPage.assertItemInCart(PRODUCT_A, 1)
    })
  })

  // ----------------------------------------------------------
  // CHECKOUT ENTRY
  // ----------------------------------------------------------

  describe('Proceed to checkout', () => {
    it('TC-CART-012 | Negative | Guest user is shown the register/login modal', () => {
      productsPage.visit()
      productsPage.addToCart(PRODUCT_A)
      productsPage.goToCartFromModal()

      cartPage.clickProceedToCheckout()
      cartPage.assertGuestCheckoutBlocker()
    })

    itIfAuth('TC-CART-011 | Positive | Logged-in user goes straight to /checkout', () => {
      // Login is out of scope here — this assumes the existing user
      // is reachable. Skipped in CI without provisioning.
      cy.visit('https://automationexercise.com/login')
      cy.get('input[data-qa="login-email"]').type('qa_orkhan@test.com')
      cy.get('input[data-qa="login-password"]').type('Test@1234')
      cy.get('button[data-qa="login-button"]').click()

      productsPage.visit()
      productsPage.addToCart(PRODUCT_A)
      productsPage.goToCartFromModal()

      cartPage.clickProceedToCheckout()
      cy.url().should('include', '/checkout')
      cy.contains('Address Details').should('be.visible')
    })
  })

  // ----------------------------------------------------------
  // KNOWN BUG (intentionally NOT automated as a passing test)
  // ----------------------------------------------------------
  //
  // TC-CART-009 — Cart contents should survive logout + re-login.
  // This is currently broken on AE (BUG-002 in 01-manual-testing).
  // Adding a passing automated test here would mask the bug.
  // Reference is kept in this comment so the gap is intentional
  // and discoverable, not accidental.
})
