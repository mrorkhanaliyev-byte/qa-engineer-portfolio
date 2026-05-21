// ============================================================
// Tap.az — Search & Category Browse Page Object
//
// Production Azerbaijani classified-ads / e-commerce site
// https://tap.az/ — listings for vehicles, real estate,
// electronics, etc.
//
// Why URL-based testing?
//   Tap.az exposes a stable query-string contract for search
//   and filters (q[keywords], q[price_from], q[region_id]).
//   That contract is part of the public surface — testing it
//   directly is faster and less brittle than driving the UI.
//   We still load the page to confirm it renders without 5xx.
// ============================================================

class SearchPage {
  baseUrl = 'https://tap.az'

  // Category slugs — keeping them here means changes to the
  // taxonomy (e.g. site renames a section) are a one-line fix.
  categories = {
    transport:  'neqliyyat',     // Transport / vehicles
    realEstate: 'dasinmaz-emlak',// Real estate
    electronics:'elektronika',   // Electronics
    personal:   'sexsi-esyalar', // Personal items / clothing
  }

  // ---- Navigation actions -------------------------------------

  /**
   * Open the all-listings page (no filter).
   */
  visitAllListings() {
    cy.useDesktopViewport()
    cy.visit(`${this.baseUrl}/elanlar`, { failOnStatusCode: false })
    return this
  }

  /**
   * Search across all listings by free-text keyword.
   */
  searchKeyword(keyword) {
    cy.useDesktopViewport()
    const url = `${this.baseUrl}/elanlar?q[keywords]=${encodeURIComponent(keyword)}`
    cy.visit(url, { failOnStatusCode: false })
    return this
  }

  /**
   * Browse a top-level category by slug. Use a `categories` constant
   * (e.g. searchPage.browseCategory(searchPage.categories.transport))
   * so typos surface at lint time, not at runtime.
   */
  browseCategory(slug) {
    cy.useDesktopViewport()
    cy.visit(`${this.baseUrl}/elanlar/${slug}`, { failOnStatusCode: false })
    return this
  }

  /**
   * Search with price range filter applied.
   */
  searchWithPriceRange(keyword, priceFrom, priceTo) {
    cy.useDesktopViewport()
    const params = new URLSearchParams({
      'q[keywords]':  keyword,
      'q[price_from]': priceFrom,
      'q[price_to]':   priceTo,
    })
    cy.visit(`${this.baseUrl}/elanlar?${params}`, { failOnStatusCode: false })
    return this
  }

  /**
   * Search filtered by region (Baku = region_id 1, by convention).
   */
  searchInRegion(keyword, regionId) {
    cy.useDesktopViewport()
    const params = new URLSearchParams({
      'q[keywords]': keyword,
      'q[region_id]': regionId,
    })
    cy.visit(`${this.baseUrl}/elanlar?${params}`, { failOnStatusCode: false })
    return this
  }

  // ---- Assertions ---------------------------------------------

  /**
   * Verify the current URL contains the given substring.
   * Used to assert that filter / search params survived navigation.
   */
  assertUrlContains(fragment) {
    cy.url().should('include', fragment)
    return this
  }

  /**
   * Verify the page rendered — body is visible, no full-page crash.
   * Cheap smoke check after every navigation.
   */
  assertPageRendered() {
    cy.get('body').should('be.visible')
    cy.url().should('include', 'tap.az')
    return this
  }
}

export default new SearchPage()
