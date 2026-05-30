// ============================================================
// ABB Bank — Site Search Page Object
//
// Production banking site — abb-bank.az
//
// The search is a React-driven overlay panel toggled by a button
// in the header. Notable production-site quirks handled here:
//   - The search trigger is the LAST button in <header> (no id /
//     data-test attribute on it)
//   - The search input (input[name="query"]) is visually covered by
//     a floating label, so Cypress considers it "covered" — we use
//     { force: true } to type into it
//   - Results render asynchronously after a debounce, so a short
//     wait after typing is pragmatic (the site exposes no reliable
//     "results loaded" signal to wait on)
//
// These are the kinds of decisions you only learn from testing a
// real production app — documented inline so the rationale survives.
// ============================================================

class SearchPage {
  // ---- Selectors ----------------------------------------------

  elements = {
    // The last header button toggles the search overlay.
    searchToggleButton: () => cy.get('header button').last(),

    // The search text field inside the overlay.
    searchInput: () => cy.get('input[name="query"]'),

    // Any element containing the given text (used to assert a result
    // for a keyword surfaced in the results panel).
    resultContaining: (text) => cy.contains(new RegExp(text, 'i')),
  }

  // ---- Actions ------------------------------------------------

  /**
   * Open the bank homepage and let third-party widgets settle, then
   * open the search overlay.
   */
  visit() {
    cy.useDesktopViewport()
    cy.visit('https://abb-bank.az/')
    cy.wait(2000)
    return this
  }

  openSearchPanel() {
    this.elements.searchToggleButton().click({ force: true })
    cy.wait(1000)
    return this
  }

  /**
   * Type a keyword into the search field. force:true because a
   * floating label overlaps the input. Does NOT submit — results
   * render live as you type.
   */
  type(keyword) {
    this.elements.searchInput().type(keyword, { force: true })
    cy.wait(800)
    return this
  }

  /**
   * Submit the search by pressing Enter (used by the empty-search
   * negative test to confirm the page survives a bare submit).
   */
  submitEmpty() {
    this.elements.searchInput().type('{enter}', { force: true })
    cy.wait(1500)
    return this
  }

  // ---- Assertions ---------------------------------------------

  assertInputIsInteractive() {
    this.elements.searchInput()
      .should('be.visible')
      .and('not.be.disabled')
    return this
  }

  /**
   * Verify the typed value actually landed in the input. Chained
   * immediately after type() to check before React re-renders.
   */
  assertInputHasValue(value) {
    this.elements.searchInput().should('have.value', value)
    return this
  }

  assertResultVisibleFor(keyword) {
    this.elements.resultContaining(keyword).should('exist')
    return this
  }

  /**
   * Verify the site didn't crash — still on the bank domain and the
   * body is rendered. Used by every negative test.
   */
  assertPageDidNotCrash() {
    cy.url().should('include', 'abb-bank.az')
    cy.get('body').should('be.visible')
    return this
  }
}

export default new SearchPage()
