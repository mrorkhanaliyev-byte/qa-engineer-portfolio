// ============================================================
// ABB Bank — Cash Loan Credit Calculator Flow
// 6 test cases on a real production banking site
//
// Note: ABB tests do NOT map to the manual login/cart/checkout
// test cases in /01-manual-testing — those describe Automation
// Exercise. The ABB suite stands alone to demonstrate testing
// real production-grade Azerbaijani banking infrastructure.
//
// Site under test: https://kredit.abb-bank.az/cash-loan
// Read CreditCalculatorPage.js for the rationale behind
// force:true, the cy.wait()s, and the role="slider" selectors.
// ============================================================

import calculator from '../../pages/abbbank/CreditCalculatorPage'

describe('ABB Bank — Cash Loan Credit Calculator', () => {
  beforeEach(() => {
    calculator.visit().openCalculatorTab()
  })

  // ----------------------------------------------------------
  // POSITIVE TEST CASES
  // ----------------------------------------------------------

  it('TC-CALC-001 | Positive | Calculator tab opens successfully', () => {
    calculator
      .assertOnCashLoanPage()
      .assertCalculatorTabExists()
  })

  it('TC-CALC-002 | Positive | Slider elements render on the calculator', () => {
    calculator.assertAtLeastOneSliderRendered()
    calculator.elements.amountSlider().should('exist')
  })

  it('TC-CALC-003 | Positive | Adjusting loan amount updates the monthly payment', () => {
    calculator
      .adjustAmountSlider(5, 'right')
      .assertMonthlyPaymentVisible()
  })

  it('TC-CALC-004 | Positive | Adjusting loan duration updates the monthly payment', () => {
    calculator
      .adjustDurationSlider(3, 'right')
      .assertMonthlyPaymentVisible()
  })

  // ----------------------------------------------------------
  // NEGATIVE / BOUNDARY TEST CASES
  // ----------------------------------------------------------

  it('TC-CALC-005 | Boundary | Loan amount at minimum does not crash the page', () => {
    calculator
      .setAmountSliderBoundary('min')
      .assertPageDidNotCrash()
  })

  it('TC-CALC-006 | Boundary | Loan amount at maximum does not crash the page', () => {
    calculator
      .setAmountSliderBoundary('max')
      .assertPageDidNotCrash()
  })
})
