// ============================================================
// ABB Bank — Currency Converter / Rates Flow
// 8 test cases on the bank's main homepage widget
//
// Site under test: https://abb-bank.az/
// Page Object: pages/abbbank/CurrencyConverterPage.js
//
// What this exercises:
//   - Currency rates widget rendering (heading, columns, rows)
//   - "Bütün valyuta məzənnələri" link navigation
//   - HTTP-level checks for the homepage and a non-existent path
// ============================================================

import currencyPage from '../../pages/abbbank/CurrencyConverterPage'

describe('ABB Bank — Currency Converter / Rates', () => {
  // ----------------------------------------------------------
  // UI TESTS (need the page open in the browser)
  // ----------------------------------------------------------

  describe('Currency widget on the homepage', () => {
    beforeEach(() => {
      currencyPage.visit()
    })

    it('TC-CONV-001 | Positive | Currency rates section renders with USD and EUR', () => {
      currencyPage
        .assertCurrencyRatesSectionVisible()
        .assertCurrencyRowExists('USD')
        .assertCurrencyRowExists('EUR')
    })

    it('TC-CONV-002 | Positive | Currency converter section is present', () => {
      currencyPage.assertConverterSectionVisible()
    })

    it('TC-CONV-003 | Positive | Rates table shows Buy and Sell columns', () => {
      currencyPage.assertBuyAndSellColumnsVisible()
    })

    it('TC-CONV-004 | Positive | "All currency rates" link is available', () => {
      currencyPage.assertAllRatesLinkVisible()
    })

    it('TC-CONV-005 | Positive | Clicking "All currency rates" navigates within the bank domain', () => {
      currencyPage
        .openAllRatesPage()
        .assertStillOnBankDomain()
    })

    it('TC-CONV-006 | Negative | Made-up currency code is not rendered', () => {
      // ZZZ is not a real ISO 4217 code — the table should not
      // accidentally contain it from a typo or stale data.
      currencyPage.assertCurrencyRowNotExists('ZZZ')
    })
  })

  // ----------------------------------------------------------
  // HTTP-LEVEL TESTS (faster, no browser nav)
  // ----------------------------------------------------------

  describe('HTTP-level checks', () => {
    it('TC-CONV-007 | Positive | Bank homepage returns HTTP 200', () => {
      currencyPage.requestStatus('/').should('eq', 200)
    })

    it('TC-CONV-008 | Negative | Non-existent currency page returns HTTP 404', () => {
      currencyPage.requestStatus('/valyuta/bilinmeyen').should('eq', 404)
    })
  })
})
