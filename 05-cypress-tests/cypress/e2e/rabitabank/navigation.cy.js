// ============================================================
// Rabitabank — Site Navigation Flow
// 8 navigation tests on a second production Azerbaijani bank
//
// Site under test: https://www.rabitabank.com
// Page Object: pages/rabitabank/NavigationPage.js
//
// Each test asserts a key customer-facing page is reachable AND
// actually renders — HTTP 200 + a non-empty body — not just that
// the URL stayed on the domain.
//
// MIGRATION NOTE: the original version of this test (against an
// older site structure) checked 5 paths that now return 404, yet
// "passed" because its only assertion was `url contains domain`.
// The stronger assertions here surfaced those broken links; the
// path map was corrected to verified-reachable pages. See
// NavigationPage.js for the full detail. This is the value of a
// real assertion over a cosmetic one.
//
// Complements the ABB Bank specs: two production banking sites
// demonstrate handling real infrastructure across more than one
// codebase.
// ============================================================

import nav from '../../pages/rabitabank/NavigationPage'

describe('Rabitabank — Site Navigation', () => {
  beforeEach(() => {
    cy.useDesktopViewport()
  })

  it('TC-RBANK-NAV-001 | Home page returns 200 and renders', () => {
    nav.assertNavigationWorks(nav.paths.home)
  })

  it('TC-RBANK-NAV-002 | Individual customer page returns 200 and renders', () => {
    nav.assertNavigationWorks(nav.paths.individual)
  })

  it('TC-RBANK-NAV-003 | Contact page returns 200 and renders', () => {
    nav.assertNavigationWorks(nav.paths.contact)
  })

  it('TC-RBANK-NAV-004 | Online services page returns 200 and renders', () => {
    nav.assertNavigationWorks(nav.paths.onlineServices)
  })

  it('TC-RBANK-NAV-005 | Cards page returns 200 and renders', () => {
    nav.assertNavigationWorks(nav.paths.cards)
  })

  it('TC-RBANK-NAV-006 | About-bank page returns 200 and renders', () => {
    nav.assertNavigationWorks(nav.paths.aboutBank)
  })

  it('TC-RBANK-NAV-007 | Branches (filiallar) page returns 200 and renders', () => {
    nav.assertNavigationWorks(nav.paths.branches)
  })

  it('TC-RBANK-NAV-008 | English homepage returns 200 and renders', () => {
    nav.assertNavigationWorks(nav.paths.english)
  })
})
