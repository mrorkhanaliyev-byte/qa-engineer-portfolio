// ============================================================
// ABB Bank — Currency Converter Page Object
//
// Production banking site — abb-bank.az
//
// Unlike the credit calculator (kredit subdomain), the currency
// rates widget lives on the main bank homepage. The widget shows:
//   - "Valyuta məzənnələri" (Currency rates) heading
//   - Buy / Sell columns ("Alış" / "Satış")
//   - Major currency rows (USD, EUR, etc.)
//   - "Bütün valyuta məzənnələri" link to the full rates page
//
// Selectors use cy.contains() against Azerbaijani UI text — the
// site does not expose data-test or stable IDs on this section.
// If the bank ever ships an English version, these strings are
// the single fix point.
// ============================================================

class CurrencyConverterPage {
  // ---- AZ text constants (single source of truth) -------------
  // Keeping these as class properties means a future
  // localization or label change is one diff, not many.
  text = {
    sectionHeading:    'Valyuta məzənnələri',   // "Currency rates"
    converterHeading:  'Valyuta konvertoru',    // "Currency converter"
    buyColumn:         'Alış',                  // "Buy"
    sellColumn:        'Satış',                 // "Sell"
    allRatesLink:      'Bütün valyuta məzənnələri', // "All currency rates"
  }

  // ---- Selectors ----------------------------------------------

  elements = {
    sectionHeading:    () => cy.contains(this.text.sectionHeading),
    converterHeading:  () => cy.contains(this.text.converterHeading),
    buyColumn:         () => cy.contains(this.text.buyColumn),
    sellColumn:        () => cy.contains(this.text.sellColumn),
    allRatesLink:      () => cy.contains(this.text.allRatesLink),
    currencyRow: (code) => cy.contains(code),
  }

  // ---- Actions ------------------------------------------------

  /**
   * Open the bank homepage. The site loads many third-party
   * widgets; a fixed wait is pragmatic here (see ABB credit
   * calculator POM for the full rationale).
   */
  visit() {
    cy.useDesktopViewport()
    cy.visit('https://abb-bank.az/')
    cy.wait(3000)
    return this
  }

  /**
   * Click "All currency rates" link. force:true because the link
   * sometimes overlaps with sticky header on mid viewports.
   */
  openAllRatesPage() {
    this.elements.allRatesLink().click({ force: true })
    cy.wait(2000)
    return this
  }

  // ---- Assertions ---------------------------------------------

  assertCurrencyRatesSectionVisible() {
    this.elements.sectionHeading().should('exist')
    return this
  }

  assertConverterSectionVisible() {
    this.elements.converterHeading().should('exist')
    return this
  }

  assertBuyAndSellColumnsVisible() {
    this.elements.buyColumn().should('exist')
    this.elements.sellColumn().should('exist')
    return this
  }

  assertCurrencyRowExists(code) {
    this.elements.currencyRow(code).should('exist')
    return this
  }

  assertCurrencyRowNotExists(code) {
    this.elements.currencyRow(code).should('not.exist')
    return this
  }

  assertAllRatesLinkVisible() {
    this.elements.allRatesLink().should('exist')
    return this
  }

  assertStillOnBankDomain() {
    cy.url().should('include', 'abb-bank.az')
    cy.get('body').should('be.visible')
    return this
  }

  // ---- Direct request helpers (no UI) -------------------------
  // Used for HTTP-level assertions (status codes, redirects).
  // Keeping them inside the page object means specs don't have
  // to know the bank's URL structure.

  /**
   * Fetch a URL and resolve with the HTTP status. Caller asserts.
   */
  static requestStatus(path = '/') {
    return cy
      .request({
        url: `https://abb-bank.az${path}`,
        failOnStatusCode: false,
      })
      .its('status')
  }
}

export default new CurrencyConverterPage()
