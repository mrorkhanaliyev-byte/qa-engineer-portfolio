// ============================================================
// Automation Exercise — Cart Page Object
//
// Covers /view_cart — table of cart rows, remove buttons, the
// "Proceed To Checkout" CTA, and the guest-blocker modal that
// pops up if a logged-out user tries to check out.
// ============================================================

class CartPage {
  // ---- Selectors ----------------------------------------------

  elements = {
    // The "Cart is empty!" panel that appears when no items.
    emptyState: () => cy.get('#empty_cart'),

    // The populated cart table (only present when items exist).
    cartTable:  () => cy.get('#cart_info_table'),

    // One row per product. AE puts the product id in the row id:
    // <tr id="product-1"> etc. We match by product name in the
    // .cart_description cell so tests don't depend on AE's numeric IDs.
    rowByName: (productName) =>
      cy.contains('#cart_info_table .cart_description a', productName).parents('tr'),

    quantityCell: (productName) =>
      this.elements.rowByName(productName).find('.cart_quantity button'),

    removeButton: (productName) =>
      this.elements.rowByName(productName).find('a.cart_quantity_delete'),

    // CTA at the bottom of the cart table.
    proceedToCheckout: () => cy.contains('a.check_out', 'Proceed To Checkout'),

    // Modal AE shows to logged-out users who try to check out.
    guestCheckoutModal:
      () => cy.contains('.modal-content', 'Register / Login account'),
    guestCheckoutModalLink:
      () => cy.contains('.modal-body a', 'Register / Login'),
  }

  // ---- Actions ------------------------------------------------

  visit() {
    cy.useDesktopViewport()
    cy.visit('https://automationexercise.com/view_cart')
    return this
  }

  removeItem(productName) {
    this.elements.removeButton(productName).click()
    // After removal the row should disappear.
    cy.contains('#cart_info_table .cart_description a', productName)
      .should('not.exist')
    return this
  }

  clickProceedToCheckout() {
    this.elements.proceedToCheckout().click()
    return this
  }

  // ---- Assertions ---------------------------------------------

  assertEmpty() {
    this.elements.emptyState().should('be.visible')
    this.elements.cartTable().should('not.exist')
    return this
  }

  assertItemInCart(productName, expectedQuantity) {
    const row = this.elements.rowByName(productName)
    row.should('be.visible')
    if (expectedQuantity !== undefined) {
      row.find('.cart_quantity button').should('contain', String(expectedQuantity))
    }
    return this
  }

  assertRowCount(expectedCount) {
    cy.get('#cart_info_table tbody tr').should('have.length', expectedCount)
    return this
  }

  /**
   * After clicking Proceed To Checkout while logged out, AE shows
   * a modal asking the user to register / log in.
   */
  assertGuestCheckoutBlocker() {
    this.elements.guestCheckoutModal().should('be.visible')
    this.elements.guestCheckoutModalLink().should('be.visible')
    return this
  }
}

export default new CartPage()
