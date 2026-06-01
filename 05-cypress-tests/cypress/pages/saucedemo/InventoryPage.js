// ============================================================
// SauceDemo — Inventory (Products) Page Object
//
// The product grid shown after login. Covers item listing, the
// sort dropdown, add-to-cart, and the cart badge / link.
// ============================================================

class InventoryPage {
  // ---- Selectors ----------------------------------------------
  elements = {
    inventoryItems:  () => cy.get('.inventory_item'),
    itemNames:       () => cy.get('.inventory_item_name'),
    itemPrices:      () => cy.get('.inventory_item_price'),
    sortDropdown:    () => cy.get('[data-test="product-sort-container"]'),
    cartBadge:       () => cy.get('.shopping_cart_badge'),
    cartLink:        () => cy.get('.shopping_cart_link'),

    // Add/remove buttons are keyed by a slugified product name, e.g.
    // [data-test="add-to-cart-sauce-labs-backpack"].
    addToCartButton: (slug) => cy.get(`[data-test="add-to-cart-${slug}"]`),
    removeButton:    (slug) => cy.get(`[data-test="remove-${slug}"]`),

    // Continue-shopping button on the cart page — used to navigate back
    // to the inventory IN-APP (no server request).
    continueShopping: () => cy.get('[data-test="continue-shopping"]'),
  }

  // ---- Actions ------------------------------------------------

  /**
   * Reset to a clean, empty-cart inventory between tests that share one
   * logged-in session (the testIsolation:false checkout spec).
   *
   * Why this shape (clear localStorage + cart-link → continue-shopping):
   *   - SauceDemo serves /inventory.html with an HTTP 404 status (it's a
   *     History-API SPA). cy.visit / cy.reload on that path makes Cypress
   *     choke on the resulting DOMException intermittently — so we never
   *     re-navigate by URL.
   *   - A fresh UI login per test (8×) trips SauceDemo's CDN rate-limit
   *     even from CI — so we log in once and reset in-app.
   *   - The burger menu works too, but its slide-out animation makes the
   *     reset/all-items clicks flaky.
   * Clearing the `cart-contents` localStorage key empties the cart; the
   * two in-app navigations (cart link, then "Continue Shopping") force a
   * pushState re-render of the inventory from the clean state, with no
   * network round-trip and no animation timing to fight.
   */
  resetToCleanInventory() {
    cy.window().then((w) => w.localStorage.removeItem('cart-contents'))
    this.elements.cartLink().click()
    this.elements.continueShopping().click()
    this.elements.inventoryItems().should('have.length', 6)
    this.elements.cartBadge().should('not.exist')
    return this
  }

  /**
   * Select a sort option by its <option> value:
   *   az  = Name A→Z   |  za = Name Z→A
   *   lohi = Price low→high  |  hilo = Price high→low
   */
  sortBy(value) {
    this.elements.sortDropdown().select(value)
    return this
  }

  addToCart(slug) {
    this.elements.addToCartButton(slug).click()
    return this
  }

  openCart() {
    this.elements.cartLink().click()
    return this
  }

  // ---- Assertions / Queries -----------------------------------

  assertItemCount(expected) {
    this.elements.inventoryItems().should('have.length', expected)
    return this
  }

  assertCartBadgeCount(expected) {
    this.elements.cartBadge().should('contain', String(expected))
    return this
  }

  /**
   * Assert prices are sorted ascending. Reads the rendered price
   * text, strips the $, and verifies the array is non-decreasing.
   */
  assertPricesAscending() {
    this.elements.itemPrices().then(($els) => {
      const prices = [...$els].map((el) => parseFloat(el.innerText.replace('$', '')))
      const sorted = [...prices].sort((a, b) => a - b)
      expect(prices, 'prices should be ascending').to.deep.equal(sorted)
    })
    return this
  }

  /**
   * Assert product names are in reverse-alphabetical (Z→A) order.
   */
  assertNamesDescending() {
    this.elements.itemNames().then(($els) => {
      const names = [...$els].map((el) => el.innerText)
      const sorted = [...names].sort().reverse()
      expect(names, 'names should be Z→A').to.deep.equal(sorted)
    })
    return this
  }
}

export default new InventoryPage()
