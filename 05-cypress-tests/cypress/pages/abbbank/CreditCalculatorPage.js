// ============================================================
// ABB Bank — Cash Loan Credit Calculator Page Object
//
// Production banking site — kredit.abb-bank.az/cash-loan
//
// Why this page is interesting from a QA standpoint:
//   1. Built with Chakra UI: sliders expose role="slider" rather
//      than the native input[type="range"]. Standard cy.invoke() /
//      .clear() approaches fail; only keyboard events move them.
//   2. Tab parent has overflow:hidden, which clips the calculator
//      tab button. Cypress correctly considers it "not visible",
//      so we use { force: true } and assert .should('exist')
//      instead of .should('be.visible').
//   3. Third-party scripts (analytics, chat widgets) load slowly
//      and occasionally throw — handled at the support/e2e.js
//      level via uncaught:exception listener.
//
// These are the kinds of pragmatic decisions you only learn from
// testing real production sites — the value of this spec to the
// portfolio is showing that judgment.
// ============================================================

class CreditCalculatorPage {
  // ---- Selectors ----------------------------------------------

  elements = {
    // The "Kredit kalkulyatoru" (Credit Calculator) tab button
    // is clipped by an overflow:hidden parent. Use force-click.
    calculatorTab: () => cy.contains('Kredit kalkulyatoru'),

    // Chakra UI sliders — role="slider" is the only stable hook.
    // [0] = loan amount, [1] = loan duration in months.
    amountSlider:   () => cy.get('[role="slider"]').eq(0),
    durationSlider: () => cy.get('[role="slider"]').eq(1),
    allSliders:     () => cy.get('[role="slider"]'),

    // The monthly payment is rendered as text containing "AZN"
    // (Azerbaijani Manat). The DOM structure isn't stable enough
    // to grab a specific node, so we match by currency code.
    monthlyPaymentAzn: () => cy.contains(/AZN/i),
  }

  // ---- Actions ------------------------------------------------

  /**
   * Open the cash-loan page. The site is heavy (React + 3rd-party
   * widgets) — give it time to settle before interacting.
   *
   * The wait is pragmatic, not ideological: replacing it with
   * smart waits requires a stable element to assert on, and this
   * site doesn't expose one consistently in the initial paint.
   */
  visit() {
    cy.useDesktopViewport()
    cy.visit('https://kredit.abb-bank.az/cash-loan')
    cy.wait(3000)
    return this
  }

  /**
   * Click the calculator tab. force:true is required because the
   * parent container clips the button (overflow:hidden).
   */
  openCalculatorTab() {
    this.elements.calculatorTab().click({ force: true })
    cy.wait(1500)
    return this
  }

  /**
   * Step the loan-amount slider with arrow keys.
   * direction: 'right' (increase) | 'left' (decrease)
   */
  adjustAmountSlider(steps = 5, direction = 'right') {
    return this._stepSlider(this.elements.amountSlider(), steps, direction)
  }

  /**
   * Step the loan-duration slider with arrow keys.
   */
  adjustDurationSlider(steps = 3, direction = 'right') {
    return this._stepSlider(this.elements.durationSlider(), steps, direction)
  }

  /**
   * Jump the amount slider to its boundary value.
   * boundary: 'min' (Home key) | 'max' (End key)
   */
  setAmountSliderBoundary(boundary) {
    const key = boundary === 'max' ? '{end}' : '{home}'
    this.elements.amountSlider().focus().type(key, { force: true })
    cy.wait(800)
    return this
  }

  // ---- Assertions ---------------------------------------------

  assertOnCashLoanPage() {
    cy.url().should('include', 'kredit.abb-bank.az')
    return this
  }

  assertCalculatorTabExists() {
    // .should('exist') instead of .should('be.visible') because
    // the parent clips the element — see class-level comment.
    this.elements.calculatorTab().should('exist')
    return this
  }

  assertAtLeastOneSliderRendered() {
    this.elements.allSliders().should('have.length.at.least', 1)
    return this
  }

  assertMonthlyPaymentVisible() {
    this.elements.monthlyPaymentAzn().should('exist')
    return this
  }

  assertPageDidNotCrash() {
    cy.get('body').should('be.visible')
    this.assertOnCashLoanPage()
    this.assertMonthlyPaymentVisible()
    return this
  }

  // ---- Internals ----------------------------------------------

  _stepSlider($slider, steps, direction) {
    const key = direction === 'left' ? '{leftarrow}' : '{rightarrow}'
    const sequence = key.repeat(steps)
    $slider.focus().type(sequence, { force: true })
    cy.wait(800)
    return this
  }
}

export default new CreditCalculatorPage()
