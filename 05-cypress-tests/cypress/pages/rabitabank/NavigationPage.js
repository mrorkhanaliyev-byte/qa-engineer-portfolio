// ============================================================
// Rabitabank — Site Navigation Page Object
//
// Second production Azerbaijani bank in the portfolio (alongside
// ABB Bank). https://www.rabitabank.com
//
// Why this POM upgrades the assertions:
//   A naive navigation test does `cy.visit(path)` then asserts the
//   URL still contains the domain. That's a WEAK check — it passes
//   even on a 404 page, because a 404 still lives on the domain.
//
//   This page object asserts THREE things per page:
//     1. HTTP status is 200 (via cy.request — catches 404 / 5xx)
//     2. The page body actually rendered (catches blank-page errors)
//     3. The URL resolved on the bank domain (catches off-site redirects)
//
//   That turns a shallow smoke test into a meaningful one: it would
//   FAIL on a broken link, which is exactly what a navigation test
//   should catch.
// ============================================================

class NavigationPage {
  baseUrl = 'https://www.rabitabank.com'

  // Path map — keeping the route slugs here means a site
  // restructure is a one-place fix.
  //
  // IMPORTANT — this map was CORRECTED during migration. An earlier
  // version of this navigation test (written against an older site
  // structure) included these paths that now return HTTP 404:
  //     /corporate-customer, /about, /individual-customer/loans,
  //     /individual-customer/deposits, /branches
  // That old test still "passed" on them, because its only assertion
  // was `url contains rabitabank.com` — and a 404 page keeps the
  // domain in the URL. The stronger assertions in this POM (HTTP 200
  // + rendered body) surfaced the broken links. The map below holds
  // only paths verified to return 200, using the slugs the site
  // actually serves today (e.g. /about-bank, /filiallar).
  paths = {
    home:          '/',
    individual:    '/individual-customer',
    contact:       '/contact',
    onlineServices:'/individual-customer/online-services',
    cards:         '/individual-customer/cards',
    aboutBank:     '/about-bank',   // was /about (now 404)
    branches:      '/filiallar',    // was /branches (now 404)
    english:       '/en',
  }

  // ---- Actions ------------------------------------------------

  /**
   * Navigate to a path on the bank site. Returns `this` so the
   * caller can chain assertions.
   */
  visitPath(path) {
    cy.useDesktopViewport()
    cy.visit(`${this.baseUrl}${path}`, { failOnStatusCode: false })
    return this
  }

  // ---- Assertions ---------------------------------------------

  /**
   * Strong assertion: the path returns HTTP 200 at the network level.
   * Run as a direct request so a broken link fails loudly instead of
   * silently rendering a 404 page that still "contains the domain".
   */
  assertPathReturns200(path) {
    cy.request({
      url: `${this.baseUrl}${path}`,
      failOnStatusCode: false,
    })
      .its('status')
      .should('eq', 200)
    return this
  }

  /**
   * Verify the page actually rendered content (not a blank error
   * page) and resolved on the bank domain.
   */
  assertPageRendered() {
    cy.get('body').should('be.visible').and('not.be.empty')
    cy.url().should('include', 'rabitabank.com')
    return this
  }

  /**
   * Convenience: full check for a path — HTTP 200 + rendered body.
   * This is the meaningful "did this navigation actually work" gate.
   */
  assertNavigationWorks(path) {
    this.assertPathReturns200(path)
    this.visitPath(path)
    this.assertPageRendered()
    return this
  }
}

export default new NavigationPage()
