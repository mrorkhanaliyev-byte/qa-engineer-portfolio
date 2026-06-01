// ============================================================
// SauceDemo (Swag Labs) — Full Purchase Flow
// inventory → sort → add to cart → cart → checkout → confirmation
//
// This is the spec that CLOSES the checkout-coverage gap flagged
// in the Requirements Traceability Matrix. Automation Exercise and
// Demoblaze can't complete a real purchase in CI (payment / account
// provisioning), but SauceDemo's public credentials let the entire
// flow — through "Thank you for your order!" — run on every push.
//
// Site under test: https://www.saucedemo.com/
// Page Objects: pages/saucedemo/{Login,Inventory,Cart,Checkout}Page.js
// ============================================================

import inventoryPage from '../../pages/saucedemo/InventoryPage'
import cartPage      from '../../pages/saucedemo/CartPage'
import checkoutPage  from '../../pages/saucedemo/CheckoutPage'

const BACKPACK = 'sauce-labs-backpack'
const BIKE_LIGHT = 'sauce-labs-bike-light'

// testIsolation:false → the whole purchase flow shares ONE logged-in
// session and ONE page load. This is the right model for a sequential
// e-commerce journey AND it removes a class of flake: public demo
// CDNs (SauceDemo) throttle an IP that logs in 8× in a minute, which
// would otherwise produce "page failed to load" timeouts unrelated to
// the code. We log in once, then reset app state between tests in-app.
describe('SauceDemo — Full Purchase Flow', { testIsolation: false }, () => {
  let users

  before(() => {
    cy.fixture('users').then((data) => {
      users = data.saucedemo

      // One UI login for the entire spec, then land on inventory.
      cy.useDesktopViewport()
      cy.visit('https://www.saucedemo.com/')
      cy.get('[data-test="username"]').type(users.standard)
      cy.get('[data-test="password"]').type(users.password)
      cy.get('[data-test="login-button"]').click()
      cy.url().should('include', '/inventory.html')
    })
  })

  beforeEach(() => {
    // Reset to a clean, empty-cart inventory between tests — in-app
    // via the burger menu, no page reload (so no repeated CDN hits).
    inventoryPage.resetToCleanInventory()
  })

  // ----------------------------------------------------------
  // INVENTORY
  // ----------------------------------------------------------

  it('TC-SAUCE-INV-001 | Positive | Inventory lists all 6 products', () => {
    inventoryPage.assertItemCount(6)
  })

  it('TC-SAUCE-INV-002 | Positive | Sort by price low-to-high orders prices ascending', () => {
    inventoryPage.sortBy('lohi').assertPricesAscending()
  })

  it('TC-SAUCE-INV-003 | Positive | Sort by name Z-to-A orders names descending', () => {
    inventoryPage.sortBy('za').assertNamesDescending()
  })

  it('TC-SAUCE-INV-004 | Positive | Adding a product increments the cart badge', () => {
    inventoryPage.addToCart(BACKPACK).assertCartBadgeCount(1)
  })

  // ----------------------------------------------------------
  // CART
  // ----------------------------------------------------------

  it('TC-SAUCE-CART-001 | Positive | Cart lists the products that were added', () => {
    inventoryPage.addToCart(BACKPACK)
    inventoryPage.addToCart(BIKE_LIGHT)
    inventoryPage.assertCartBadgeCount(2).openCart()

    cartPage.assertItemCount(2)
    cartPage.assertContainsItem('Sauce Labs Backpack')
    cartPage.assertContainsItem('Sauce Labs Bike Light')
  })

  it('TC-SAUCE-CART-002 | Positive | Removing an item from the cart updates it', () => {
    inventoryPage.addToCart(BACKPACK)
    inventoryPage.addToCart(BIKE_LIGHT)
    inventoryPage.openCart()

    cartPage.removeItem(BACKPACK).assertItemCount(1)
    cartPage.assertContainsItem('Sauce Labs Bike Light')
  })

  // ----------------------------------------------------------
  // CHECKOUT (full, through confirmation)
  // ----------------------------------------------------------

  it('TC-SAUCE-CHK-001 | Positive | Complete purchase reaches the confirmation page', () => {
    inventoryPage.addToCart(BACKPACK).openCart()
    cartPage.checkout()

    checkoutPage
      .fillBuyerInfo(users.buyer.firstName, users.buyer.lastName, users.buyer.postalCode)
      .assertOnOverview()
      .assertOverviewItemCount(1)

    checkoutPage.finish().assertOrderComplete()
  })

  it('TC-SAUCE-CHK-002 | Negative | Checkout info form requires the postal code', () => {
    inventoryPage.addToCart(BACKPACK).openCart()
    cartPage.checkout()

    // First + last name but NO postal code.
    checkoutPage
      .fillBuyerInfo(users.buyer.firstName, users.buyer.lastName, null)
      .assertErrorContains('Postal Code is required')
  })
})
