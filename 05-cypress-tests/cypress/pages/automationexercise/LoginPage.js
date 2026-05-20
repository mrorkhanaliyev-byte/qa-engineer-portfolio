// ============================================================
// Automation Exercise — Login Page Object
//
// AE's login page has a much cleaner DOM than Demoblaze:
//   - dedicated /login URL (no modal)
//   - data-qa attributes on all form inputs (test-friendly)
//   - inline error messages (no browser alert() pop-ups)
//
// Same POM pattern as Demoblaze LoginPage — only the selectors
// and assertion targets change. This consistency is intentional:
// anyone reading the codebase can move between sites without
// re-learning the structure.
// ============================================================

class LoginPage {
  // ---- Selectors ----------------------------------------------

  elements = {
    // Header navigation
    headerSignupLoginLink: () => cy.get('a[href="/login"]').first(),
    headerLoggedInLabel:   () => cy.contains('a', 'Logged in as'),
    headerLogoutLink:      () => cy.get('a[href="/logout"]'),

    // Login form (right side of /login page is "Login to your account")
    loginHeading:   () => cy.contains('h2', 'Login to your account'),
    emailInput:     () => cy.get('input[data-qa="login-email"]'),
    passwordInput:  () => cy.get('input[data-qa="login-password"]'),
    submitButton:   () => cy.get('button[data-qa="login-button"]'),

    // Inline error shown on failed login attempts
    loginErrorMessage: () =>
      cy.contains('p', 'Your email or password is incorrect!'),
  }

  // ---- Actions ------------------------------------------------

  /**
   * Open the AE login page directly. We don't navigate from the
   * home page because that's a different concern (header navigation).
   * Tests should be focused — one journey per spec.
   */
  visit() {
    cy.useDesktopViewport()
    cy.visit('https://automationexercise.com/login')
    this.elements.loginHeading().should('be.visible')
    return this
  }

  /**
   * Fill credentials and submit. Either field can be omitted to
   * test HTML5 required-field validation (TC-LOGIN-005, 006).
   */
  loginAs(email, password) {
    if (email) this.elements.emailInput().type(email)
    if (password) this.elements.passwordInput().type(password)
    this.elements.submitButton().click()
    return this
  }

  /**
   * Click the "Logout" link in the header. Only available when
   * the user is logged in.
   */
  logout() {
    this.elements.headerLogoutLink().click()
    return this
  }

  // ---- Assertions ---------------------------------------------

  /**
   * Verify the user is logged in by checking the "Logged in as"
   * label in the navbar. Optionally check the displayed username.
   */
  assertLoggedInAs(expectedUsername) {
    const label = this.elements.headerLoggedInLabel().should('be.visible')
    if (expectedUsername) label.and('contain', expectedUsername)
    return this
  }

  /**
   * Verify the failed-login inline error is visible.
   * Used to assert AE returns the SAME error for "wrong password"
   * and "non-existent email" — a security best practice.
   */
  assertLoginErrorVisible() {
    this.elements.loginErrorMessage().should('be.visible')
    return this
  }

  /**
   * Verify the user is NOT logged in (used in negative-path
   * post-conditions and after logout).
   */
  assertNotLoggedIn() {
    this.elements.headerLoggedInLabel().should('not.exist')
    return this
  }
}

export default new LoginPage()
