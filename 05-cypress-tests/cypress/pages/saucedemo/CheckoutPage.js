// ============================================================
// SauceDemo — Checkout Page Object
//
// Spans the two checkout steps and the completion page:
//   /checkout-step-one.html  → buyer info form
//   /checkout-step-two.html  → order overview + totals
//   /checkout-complete.html  → "Thank you for your order!"
//
// This is the page object that lets the portfolio finally cover a
// COMPLETE purchase flow end-to-end in CI — the gap the RTM flagged.
// ============================================================

class CheckoutPage {
  // ---- Selectors ----------------------------------------------
  elements = {
    // Step one — buyer info
    firstName:   () => cy.get('[data-test="firstName"]'),
    lastName:    () => cy.get('[data-test="lastName"]'),
    postalCode:  () => cy.get('[data-test="postalCode"]'),
    continueBtn: () => cy.get('[data-test="continue"]'),
    errorMessage:() => cy.get('[data-test="error"]'),

    // Step two — overview
    finishButton:   () => cy.get('[data-test="finish"]'),
    summaryItemTotal: () => cy.get('[data-test="subtotal-label"]'),
    summaryTotal:     () => cy.get('[data-test="total-label"]'),
    overviewItems:    () => cy.get('.cart_item'),

    // Complete
    completeHeader: () => cy.get('[data-test="complete-header"]'),
  }

  // ---- Actions ------------------------------------------------

  fillBuyerInfo(firstName, lastName, postalCode) {
    if (firstName) this.elements.firstName().type(firstName)
    if (lastName) this.elements.lastName().type(lastName)
    if (postalCode) this.elements.postalCode().type(postalCode)
    this.elements.continueBtn().click()
    return this
  }

  finish() {
    this.elements.finishButton().click()
    return this
  }

  // ---- Assertions ---------------------------------------------

  assertOnOverview() {
    cy.url().should('include', '/checkout-step-two.html')
    return this
  }

  assertOverviewItemCount(expected) {
    this.elements.overviewItems().should('have.length', expected)
    return this
  }

  assertErrorContains(text) {
    this.elements.errorMessage().should('be.visible').and('contain', text)
    return this
  }

  assertOrderComplete() {
    cy.url().should('include', '/checkout-complete.html')
    this.elements.completeHeader()
      .should('be.visible')
      .and('contain', 'Thank you for your order!')
    return this
  }
}

export default new CheckoutPage()
