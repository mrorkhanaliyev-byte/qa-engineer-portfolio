// ============================================================
// Automation Exercise — Products Listing Page Object
//
// Used by the cart spec as the *source* of products to add.
// Cart-specific operations live in CartPage. Splitting the two
// keeps each page object focused on a single concern (and the
// specs read cleanly).
// ============================================================

class ProductsPage {
  // ---- Selectors ----------------------------------------------

  elements = {
    productsHeading: () => cy.contains('h2', 'All Products'),

    // Every product card on the listing has class `.product-image-wrapper`.
    // For "add to cart" we use the overlay link inside it.
    productCard: (productName) =>
      cy.contains('.productinfo p', productName).parents('.product-image-wrapper'),

    addToCartOverlay: (productName) =>
      cy
        .contains('.productinfo p', productName)
        .parents('.productinfo')
        .find('a.add-to-cart'),

    // The post-add modal AE shows ("Added!").
    addedModal:           () => cy.get('#cartModal'),
    addedModalContinue:   () => cy.contains('#cartModal button.close-modal', 'Continue Shopping'),
    addedModalViewCart:   () => cy.contains('#cartModal a', 'View Cart'),
  }

  // ---- Actions ------------------------------------------------

  visit() {
    cy.useDesktopViewport()
    cy.visit('https://automationexercise.com/products')
    this.elements.productsHeading().should('be.visible')
    return this
  }

  /**
   * Hover a product card so the overlay is interactable, then click
   * its "Add to cart" link. AE binds the overlay to `:hover`, so a
   * `.trigger('mouseover')` before click is the stable pattern.
   */
  addToCart(productName) {
    this.elements.productCard(productName).trigger('mouseover')
    // The hover-revealed overlay has class .add-to-cart. AE has TWO
    // overlay containers per product (single-card view + features-items
    // view) — `.first()` keeps the click deterministic.
    this.elements.addToCartOverlay(productName).first().click({ force: true })
    this.elements.addedModal().should('be.visible')
    return this
  }

  /**
   * Dismiss the post-add modal and stay on /products to add more.
   */
  dismissAddedModal() {
    this.elements.addedModalContinue().click()
    this.elements.addedModal().should('not.be.visible')
    return this
  }

  /**
   * Follow the "View Cart" link in the post-add modal.
   * Returns nothing — the caller should then use the CartPage POM.
   */
  goToCartFromModal() {
    this.elements.addedModalViewCart().click()
  }
}

export default new ProductsPage()
