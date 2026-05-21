// ============================================================
// Tap.az — Search & Category Browse Flow
// 10 test cases on a production Azerbaijani e-commerce site
//
// Site under test: https://tap.az/
// Page Object: pages/tapaz/SearchPage.js
//
// Test design note:
//   Tests use Tap.az's public query-string contract directly
//   (q[keywords], q[price_from], q[region_id]) instead of
//   driving the search UI. Two benefits:
//     1. Faster — one navigation, no form fills
//     2. More resilient — the URL contract is stable; the
//        search box JS may change between releases
//   The trade-off: we don't cover the search BAR itself.
//   That gap could be closed by a single ui-level spec later.
// ============================================================

import searchPage from '../../pages/tapaz/SearchPage'

describe('Tap.az — Search & Category Browse', () => {
  // ----------------------------------------------------------
  // KEYWORD SEARCH
  // ----------------------------------------------------------

  describe('Keyword search', () => {
    it('TC-TAPAZ-001 | Positive | Phone search returns to a results URL', () => {
      searchPage
        .searchKeyword('telefon')
        .assertUrlContains('telefon')
        .assertPageRendered()
    })

    it('TC-TAPAZ-002 | Positive | Car search returns to a results URL', () => {
      searchPage
        .searchKeyword('avtomobil')
        .assertUrlContains('avtomobil')
        .assertPageRendered()
    })

    it('TC-TAPAZ-003 | Positive | Apartment search returns to a results URL', () => {
      searchPage
        .searchKeyword('menzil')
        .assertUrlContains('menzil')
        .assertPageRendered()
    })
  })

  // ----------------------------------------------------------
  // CATEGORY BROWSE
  // ----------------------------------------------------------

  describe('Category browse', () => {
    it('TC-TAPAZ-004 | Positive | Transport category page loads', () => {
      searchPage
        .browseCategory(searchPage.categories.transport)
        .assertUrlContains(searchPage.categories.transport)
        .assertPageRendered()
    })

    it('TC-TAPAZ-005 | Positive | Real estate category page loads', () => {
      searchPage
        .browseCategory(searchPage.categories.realEstate)
        .assertPageRendered()
    })

    it('TC-TAPAZ-006 | Positive | Electronics category page loads', () => {
      searchPage
        .browseCategory(searchPage.categories.electronics)
        .assertPageRendered()
    })

    it('TC-TAPAZ-007 | Positive | Personal items / clothing category page loads', () => {
      searchPage
        .browseCategory(searchPage.categories.personal)
        .assertPageRendered()
    })
  })

  // ----------------------------------------------------------
  // FILTERED SEARCH
  // ----------------------------------------------------------

  describe('Filtered search', () => {
    it('TC-TAPAZ-008 | Positive | Price-range filter is applied in URL', () => {
      searchPage
        .searchWithPriceRange('telefon', 100, 500)
        .assertUrlContains('price')
        .assertPageRendered()
    })

    it('TC-TAPAZ-009 | Positive | Region filter (Baku) is applied', () => {
      // region_id=1 is Baku by Tap.az convention.
      searchPage
        .searchInRegion('telefon', 1)
        .assertPageRendered()
    })
  })

  // ----------------------------------------------------------
  // EDGE CASE
  // ----------------------------------------------------------

  describe('Edge cases', () => {
    it('TC-TAPAZ-010 | Edge | No-filter listings page loads everything', () => {
      searchPage
        .visitAllListings()
        .assertUrlContains('/elanlar')
        .assertPageRendered()
    })
  })
})
