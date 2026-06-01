const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // Each spec sets its own baseUrl via cy.visit('https://...')
    // because this portfolio tests multiple production sites.
    baseUrl: null,
    viewportWidth: 1440,
    viewportHeight: 900,

    // Timeouts tuned for real-world production and demo sites that
    // occasionally lag. pageLoadTimeout is generous (60s) because some
    // public demo CDNs (e.g. SauceDemo under repeated logins) have slow
    // windows; a tight timeout there produces false "page failed to
    // load" failures unrelated to the code under test.
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    requestTimeout: 15000,

    // Retries keep flaky third-party sites from breaking CI on transient issues
    retries: {
      runMode: 3,
      openMode: 0,
    },

    // Capture artifacts only on failure to keep CI runs lean
    video: false,
    screenshotOnRunFailure: true,

    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports',
      charts: true,
      reportPageTitle: 'QA Engineer Portfolio — Cypress Report',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
    },

    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)
      return config
    },

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
  },
})
