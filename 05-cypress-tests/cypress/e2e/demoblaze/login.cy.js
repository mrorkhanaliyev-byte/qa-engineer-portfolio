// ============================================================
// Demoblaze — Login Flow
// Positive and Negative test cases
//
// PRECONDITION:
//   TC-LOGIN-002, TC-LOGIN-003, and TC-LOGIN-005 require a
//   pre-registered user on demoblaze.com. If they fail with
//   "User does not exist":
//     1. Open https://www.demoblaze.com/
//     2. Click "Sign up"
//     3. Username: "qatestuser" | Password: "Test1234"
//     4. Re-run the spec
//
// TC IDs in this file map 1:1 to the manual test cases in
// /01-manual-testing/test-cases/login-test-cases.csv
// ============================================================

import loginPage from '../../pages/demoblaze/LoginPage'

describe('Demoblaze — Login Flow', () => {
  let users

  before(() => {
    cy.fixture('users').then((data) => {
      users = data.demoblaze
    })
  })

  beforeEach(() => {
    loginPage.visit().openLoginModal()
  })

  // ----------------------------------------------------------
  // POSITIVE TEST CASES
  // ----------------------------------------------------------

  it('TC-LOGIN-001 | Positive | Login modal opens with all required fields', () => {
    loginPage.elements.usernameInput().should('be.visible')
    loginPage.elements.passwordInput().should('be.visible')
    loginPage.elements.submitButton()
      .should('be.visible')
      .and('contain', 'Log in')
  })

  it('TC-LOGIN-002 | Positive | Valid credentials log the user in', () => {
    loginPage
      .loginAs(users.valid.username, users.valid.password)
      .assertLoggedInAs()
  })

  it('TC-LOGIN-003 | Positive | Navbar shows "Welcome <username>" after login', () => {
    loginPage
      .loginAs(users.valid.username, users.valid.password)
      .assertLoggedInAs(users.valid.username)
  })

  // ----------------------------------------------------------
  // NEGATIVE TEST CASES
  // ----------------------------------------------------------

  it('TC-LOGIN-004 | Negative | Empty form submission shows alert and keeps modal open', () => {
    // The alert listener must be registered BEFORE the click.
    cy.expectAlert('fill out')
    loginPage.elements.submitButton().click()
    loginPage.assertModalStillOpen()
  })

  it('TC-LOGIN-005 | Negative | Wrong password shows "Wrong password" alert', () => {
    cy.expectAlert('Wrong password')
    loginPage.loginAs(users.invalidPassword.username, users.invalidPassword.password)

    // Ensure the page didn't crash and the user is NOT logged in.
    cy.get('body').should('be.visible')
    loginPage.elements.welcomeLabel().should('not.be.visible')
  })

  it('TC-LOGIN-006 | Negative | Non-existent user shows "User does not exist" alert', () => {
    cy.expectAlert('User does not exist')
    loginPage.loginAs(users.nonExistent.username, users.nonExistent.password)

    cy.get('body').should('be.visible')
    loginPage.elements.welcomeLabel().should('not.be.visible')
  })
})
