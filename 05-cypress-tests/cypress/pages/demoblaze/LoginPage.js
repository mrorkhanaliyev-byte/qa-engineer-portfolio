// ============================================================
// Demoblaze — Login Page Object
//
// Encapsulates every selector and action on the login modal so
// specs read like business intent, not DOM noise. If Demoblaze
// changes an ID tomorrow, we fix it in ONE place — here.
// ============================================================

class LoginPage {
  // ---- Selectors ----------------------------------------------
  // Grouped at the top so anyone scanning the file can see the
  // full surface area of the page at a glance.

  elements = {
    headerLoginLink: () => cy.get('#login2'),
    loginModal:      () => cy.get('#logInModal'),
    usernameInput:   () => cy.get('#loginusername'),
    passwordInput:   () => cy.get('#loginpassword'),
    // Demoblaze submit button has no id — it's wired via inline onclick.
    submitButton:    () => cy.get('button[onclick="logIn()"]'),
    welcomeLabel:    () => cy.get('#nameofuser'),
  }

  // ---- Actions ------------------------------------------------

  /**
   * Open the Demoblaze home page and wait until the login link
   * in the header is visible (signals page is interactive).
   */
  visit() {
    cy.useDesktopViewport()
    cy.visit('https://www.demoblaze.com/')
    this.elements.headerLoginLink().should('be.visible')
    return this
  }

  /**
   * Click "Log in" in the header and wait for the modal to be
   * fully open before returning. Returning `this` enables fluent
   * chaining: loginPage.openModal().loginAs(...).
   */
  openLoginModal() {
    this.elements.headerLoginLink().click()
    this.elements.loginModal().should('be.visible')
    this.elements.usernameInput().should('be.visible')
    return this
  }

  /**
   * Fill credentials and submit. Does NOT assert outcome —
   * the test decides what to expect (success vs alert).
   */
  loginAs(username, password) {
    if (username) this.elements.usernameInput().type(username)
    if (password) this.elements.passwordInput().type(password)
    this.elements.submitButton().click()
    return this
  }

  // ---- Assertions ---------------------------------------------
  // Page-level assertions live here too — they're the most stable
  // way to express "the page is in state X" without leaking DOM.

  /**
   * Verify the user is logged in by checking the welcome label
   * in the navbar. Optionally check the displayed username.
   */
  assertLoggedInAs(expectedUsername) {
    const label = this.elements.welcomeLabel().should('be.visible')
    if (expectedUsername) label.and('contain', expectedUsername)
    return this
  }

  /**
   * Verify the modal is still open — used after a failed login
   * attempt to confirm the user wasn't navigated away.
   */
  assertModalStillOpen() {
    this.elements.loginModal().should('be.visible')
    return this
  }
}

// Singleton export — only one Login page exists per spec run.
export default new LoginPage()
