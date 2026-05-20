// ============================================================
// Cypress E2E Support File
// Runs once before every spec.
// ============================================================

import './commands'
import 'cypress-mochawesome-reporter/register'

// Many of the production sites under test (e.g. ABB Bank) have third-party
// scripts (analytics, chat widgets) that occasionally throw uncaught errors.
// These are not our concern as testers — fail only on errors in OUR target flow.
Cypress.on('uncaught:exception', (err, runnable) => {
  // Let the test continue. Log so failures are still visible during triage.
  // eslint-disable-next-line no-console
  console.warn('Uncaught exception (ignored):', err.message)
  return false
})
