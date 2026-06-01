// ============================================================
// SauceDemo (Swag Labs) — Login Flow
// 6 test cases covering the documented user personas.
//
// Site under test: https://www.saucedemo.com/
// Page Object: pages/saucedemo/LoginPage.js
//
// SauceDemo's credentials are public and fixed, so every test here
// runs in CI with no provisioning — including the locked-out and
// problem-user paths that demo sites rarely expose so cleanly.
// ============================================================

import loginPage from '../../pages/saucedemo/LoginPage'

describe('SauceDemo — Login Flow', () => {
  let users

  before(() => {
    cy.fixture('users').then((data) => {
      users = data.saucedemo
    })
  })

  beforeEach(() => {
    loginPage.visit()
  })

  // ----------------------------------------------------------
  // POSITIVE
  // ----------------------------------------------------------

  it('TC-SAUCE-LOGIN-001 | Positive | Login page renders username, password, and button', () => {
    loginPage.elements.username().should('be.visible')
    loginPage.elements.password().should('be.visible')
    loginPage.elements.loginButton().should('be.visible')
  })

  it('TC-SAUCE-LOGIN-002 | Positive | standard_user logs in and reaches the inventory', () => {
    loginPage
      .loginAs(users.standard, users.password)
      .assertOnInventory()
  })

  // ----------------------------------------------------------
  // NEGATIVE
  // ----------------------------------------------------------

  it('TC-SAUCE-LOGIN-003 | Negative | locked_out_user sees the lockout error', () => {
    loginPage
      .loginAs(users.lockedOut, users.password)
      .assertErrorContains('Sorry, this user has been locked out')
    loginPage.assertStillOnLogin()
  })

  it('TC-SAUCE-LOGIN-004 | Negative | Wrong password is rejected', () => {
    loginPage
      .loginAs(users.standard, users.wrongPassword)
      .assertErrorContains('Username and password do not match')
    loginPage.assertStillOnLogin()
  })

  it('TC-SAUCE-LOGIN-005 | Negative | Missing username is rejected', () => {
    loginPage
      .loginAs(null, users.password)
      .assertErrorContains('Username is required')
  })

  it('TC-SAUCE-LOGIN-006 | Negative | Missing password is rejected', () => {
    loginPage
      .loginAs(users.standard, null)
      .assertErrorContains('Password is required')
  })
})
