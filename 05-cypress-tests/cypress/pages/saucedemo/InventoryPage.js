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
  }

  // ---- Actions ------------------------------------------------

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
