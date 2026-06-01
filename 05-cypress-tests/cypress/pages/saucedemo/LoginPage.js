// ============================================================
// SauceDemo (Swag Labs) — Login Page Object
//
// https://www.saucedemo.com/ — the most widely-recognized QA
// practice site. Unlike Automation Exercise / Demoblaze, its
// credentials are PUBLIC and fixed, which means the full
// authenticated flow (login → cart → checkout → confirmation)
// runs in CI with no account provisioning. That's why SauceDemo
// is what finally closes the checkout-coverage gap in the RTM.
//
// SauceDemo exposes stable data-test attributes on every control,
// so selectors here are robust (no brittle CSS / text matching).
// ============================================================

class LoginPage {
  // ---- Selectors ----------------------------------------------
  elements = {
    username:    () => cy.get('[data-test="username"]'),
    password:    () => cy.get('[data-test="password"]'),
    loginButton: () => cy.get('[data-test="login-button"]'),
    errorMessage:() => cy.get('[data-test="error"]'),
  }

  // ---- Actions ------------------------------------------------

  visit() {
    cy.useDesktopViewport()
    cy.visit('https://www.saucedemo.com/')
    this.elements.username().should('be.visible')
    return this
  }

  /**
   * Fill credentials and submit. Either field may be omitted to
   * exercise the empty-field error paths.
   */
  loginAs(username, password) {
    if (username) this.elements.username().type(username)
    if (password) this.elements.password().type(password)
    this.elements.loginButton().click()
    return this
  }

  // ---- Assertions ---------------------------------------------

  assertOnInventory() {
    cy.url().should('include', '/inventory.html')
    return this
  }

  assertErrorContains(text) {
    this.elements.errorMessage()
      .should('be.visible')
      .and('contain', text)
    return this
  }

  assertStillOnLogin() {
    cy.url().should('eq', 'https://www.saucedemo.com/')
    return this
  }
}

export default new LoginPage()
