// ============================================================
// ABB Bank — Site Search Flow
// 6 test cases on a real production banking site
//
// Site under test: https://abb-bank.az/
// Page Object: pages/abbbank/SearchPage.js
//
// Like the other ABB specs, this does NOT map to the manual CSV
// (which covers Automation Exercise). The ABB suite stands alone
// to demonstrate testing production-grade Azerbaijani banking.
//
// Read SearchPage.js for the rationale behind force-typing, the
// header-button toggle, and the waits.
// ============================================================

import searchPage from '../../pages/abbbank/SearchPage'

describe('ABB Bank — Site Search', () => {
  beforeEach(() => {
    searchPage.visit().openSearchPanel()
  })

  // ----------------------------------------------------------
  // POSITIVE TEST CASES
  // ----------------------------------------------------------

  it('TC-SEARCH-001 | Positive | Searching "kredit" surfaces a matching result', () => {
    searchPage
      .type('kredit')
      .assertResultVisibleFor('kredit')
  })

  it('TC-SEARCH-002 | Positive | Searching "kart" surfaces a matching result', () => {
    searchPage
      .type('kart')
      .assertResultVisibleFor('kart')
  })

  it('TC-SEARCH-003 | Positive | Search input is visible, enabled, and accepts a value', () => {
    searchPage.assertInputIsInteractive()
    searchPage
      .type('depozit')
      .assertInputHasValue('depozit')
  })

  // ----------------------------------------------------------
  // NEGATIVE / RESILIENCE TEST CASES
  // ----------------------------------------------------------

  it('TC-SEARCH-004 | Negative | Submitting an empty search does not crash the page', () => {
    searchPage
      .submitEmpty()
      .assertPageDidNotCrash()
  })

  it('TC-SEARCH-005 | Negative | A no-match keyword does not crash the page', () => {
    searchPage
      .type('xyzxyzxyzabc123')
      .assertPageDidNotCrash()
  })

  it('TC-SEARCH-006 | Negative | Special characters do not crash the page', () => {
    searchPage
      .type('!@#$%')
      .assertPageDidNotCrash()
  })
})
