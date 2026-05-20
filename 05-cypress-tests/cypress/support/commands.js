// ============================================================
// Custom Cypress Commands
// Reusable building blocks for specs across the portfolio.
// ============================================================

/**
 * Catch a browser-level alert() and assert its message contains `expectedText`.
 * Must be set up BEFORE the action that triggers the alert.
 *
 * @example
 *   cy.expectAlert('Wrong password')
 *   loginPage.submit()
 */
Cypress.Commands.add('expectAlert', (expectedText) => {
  cy.on('window:alert', (alertMessage) => {
    expect(alertMessage).to.include(expectedText)
  })
})

/**
 * Set a stable viewport before each test.
 * Defaults match the cypress.config.js viewport — explicit for spec-local overrides.
 */
Cypress.Commands.add('useDesktopViewport', () => {
  cy.viewport(1440, 900)
})
