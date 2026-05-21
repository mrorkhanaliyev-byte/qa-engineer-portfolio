// ============================================================
// Automation Exercise — Login Flow
// 12 test cases, mapped 1:1 to the manual test cases in
// /01-manual-testing/test-cases/login-test-cases.csv
//
// PRECONDITION (for valid-credential tests):
//   TC-AE-LOGIN-002, 003, 009, and 010 require a registered user.
//   If they fail with "Your email or password is incorrect!":
//     1. Open https://automationexercise.com/login
//     2. On the "New User Signup!" form, register:
//        Name: "Orkhan QA" | Email: "qa_orkhan@test.com"
//     3. On the account info page, set Password: "Test@1234"
//        + fill the rest with any valid data
//     4. Re-run the spec
//
// Notes vs. Demoblaze:
//   - AE shows INLINE error messages, not browser alert() pop-ups
//   - AE uses data-qa attributes (cleaner selectors)
//   - AE login is a full page (not a modal)
// ============================================================

import loginPage from '../../pages/automationexercise/LoginPage'

// Auth-dependent tests require a pre-registered user on automationexercise.com.
// In CI we can't create that user, so we skip them via Cypress env var.
// Locally, leave CI_SKIP_AUTH_TESTS unset to run the full suite.
const itIfAuth = Cypress.env('CI_SKIP_AUTH_TESTS') ? it.skip : it

describe('Automation Exercise — Login Flow', () => {
  let users

  before(() => {
    cy.fixture('users').then((data) => {
      users = data.automationexercise
    })
  })

  beforeEach(() => {
    loginPage.visit()
  })

  // ----------------------------------------------------------
  // POSITIVE TEST CASES
  // ----------------------------------------------------------

  it('TC-AE-LOGIN-001 | Positive | Login page renders all required fields', () => {
    loginPage.elements.loginHeading().should('be.visible')
    loginPage.elements.emailInput().should('be.visible').and('be.enabled')
    loginPage.elements.passwordInput().should('be.visible').and('be.enabled')
    loginPage.elements.submitButton()
      .should('be.visible')
      .and('contain', 'Login')
  })

  itIfAuth('TC-AE-LOGIN-002 | Positive | Valid credentials log the user in', () => {
    loginPage
      .loginAs(users.valid.email, users.valid.password)
      .assertLoggedInAs()
  })

  itIfAuth('TC-AE-LOGIN-003 | Positive | Header shows "Logged in as <name>" after login', () => {
    loginPage
      .loginAs(users.valid.email, users.valid.password)
      .assertLoggedInAs(users.valid.name)
  })

  itIfAuth('TC-AE-LOGIN-009 | Positive | Email field is case-insensitive', () => {
    loginPage
      .loginAs(users.valid.email.toUpperCase(), users.valid.password)
      .assertLoggedInAs()
  })

  itIfAuth('TC-AE-LOGIN-010 | Positive | Logout returns the user to a guest state', () => {
    loginPage
      .loginAs(users.valid.email, users.valid.password)
      .assertLoggedInAs()
      .logout()
      .assertNotLoggedIn()

    // After logout AE redirects back to the login page.
    loginPage.elements.loginHeading().should('be.visible')
  })

  // ----------------------------------------------------------
  // NEGATIVE TEST CASES
  // ----------------------------------------------------------

  it('TC-AE-LOGIN-004 | Negative | Wrong password shows generic inline error', () => {
    loginPage
      .loginAs(users.invalidPassword.email, users.invalidPassword.password)
      .assertLoginErrorVisible()
      .assertNotLoggedIn()
  })

  it('TC-AE-LOGIN-005 | Negative | Non-existent email shows the SAME generic error', () => {
    // Security check: AE must NOT reveal whether the email exists.
    // Both wrong-password and non-existent-email return the same message.
    // (This is the basis of manual BUG-001 — keep both branches identical.)
    loginPage
      .loginAs(users.nonExistent.email, users.nonExistent.password)
      .assertLoginErrorVisible()
      .assertNotLoggedIn()
  })

  it('TC-AE-LOGIN-006 | Negative | Empty form is blocked by HTML5 required validation', () => {
    loginPage.elements.submitButton().click()

    // The form is NOT submitted — we should still be on /login with
    // the empty email input flagged as invalid by the browser.
    cy.location('pathname').should('eq', '/login')
    loginPage.elements.emailInput()
      .then(($input) => {
        expect($input[0].checkValidity()).to.be.false
        expect($input[0].validationMessage).to.include('fill out')
      })
  })

  it('TC-AE-LOGIN-007 | Negative | Empty password is blocked by HTML5 required validation', () => {
    loginPage.elements.emailInput().type(users.valid.email)
    loginPage.elements.submitButton().click()

    cy.location('pathname').should('eq', '/login')
    loginPage.elements.passwordInput()
      .then(($input) => {
        expect($input[0].checkValidity()).to.be.false
      })
  })

  it('TC-AE-LOGIN-008 | Negative | Malformed email is rejected by HTML5 type=email', () => {
    loginPage.loginAs(users.malformedEmail.email, users.malformedEmail.password)

    cy.location('pathname').should('eq', '/login')
    loginPage.elements.emailInput()
      .then(($input) => {
        expect($input[0].checkValidity()).to.be.false
      })
  })

  // ----------------------------------------------------------
  // UI / SECURITY CHECKS
  // ----------------------------------------------------------

  it('TC-AE-LOGIN-011 | UI | Password field masks input (type=password)', () => {
    loginPage.elements.passwordInput()
      .should('have.attr', 'type', 'password')
      .type('SuperSecret_123')
      .should('have.value', 'SuperSecret_123')   // value is set in DOM
      // ...but visually rendered as dots — the type=password assertion
      // above is the contract that proves it. No screenshot needed.
  })

  it('TC-AE-LOGIN-012 | Security | XSS attempt in email field is treated as text, not script', () => {
    const xssPayload = "<script>window.__xss=true</script>@test.com"

    loginPage.elements.emailInput().type(xssPayload, { parseSpecialCharSequences: false })
    loginPage.elements.passwordInput().type('AnyPassword1')
    loginPage.elements.submitButton().click()

    // Critical: no JS from the payload executed.
    cy.window().then((win) => {
      expect(win.__xss).to.be.undefined
    })
    // Either the form rejected the input or returned the generic error —
    // both are acceptable. The hard requirement is "no code execution".
  })
})
