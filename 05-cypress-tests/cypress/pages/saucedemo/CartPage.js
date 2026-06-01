// ============================================================
// SauceDemo — Cart Page Object
//
// /cart.html — lists selected items, allows removal, and is the
// jumping-off point to checkout.
// ============================================================

class CartPage {
  // ---- Selectors ----------------------------------------------
  elements = {
    cartItems:        () => cy.get('.cart_item'),
    itemNames:        () => cy.get('.inventory_item_name'),
    checkoutButton:   () => cy.get('[data-test="checkout"]'),
    continueShopping: () => cy.get('[data-test="continue-shopping"]'),
    removeButton:     (slug) => cy.get(`[data-test="remove-${slug}"]`),
  }

  // ---- Actions ------------------------------------------------

  removeItem(slug) {
    this.elements.removeButton(slug).click()
    return this
  }

  checkout() {
    this.elements.checkoutButton().click()
    return this
  }

  continueShopping() {
    this.elements.continueShopping().click()
    return this
  }

  // ---- Assertions ---------------------------------------------

  assertItemCount(expected) {
    this.elements.cartItems().should('have.length', expected)
    return this
  }

  assertContainsItem(name) {
    this.elements.itemNames().should('contain', name)
    return this
  }
}

export default new CartPage()
