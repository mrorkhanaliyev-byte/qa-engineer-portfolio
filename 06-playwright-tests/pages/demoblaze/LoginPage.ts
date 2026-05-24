import { Page, Locator, expect } from '@playwright/test'

/**
 * Demoblaze — Login Page Object (TypeScript / Playwright).
 *
 * Direct counterpart to the Cypress LoginPage at:
 *   05-cypress-tests/cypress/pages/demoblaze/LoginPage.js
 *
 * Key differences from Cypress:
 *   - All actions are `async`. Forgetting `await` is a silent bug.
 *   - Locators are CREATED in the constructor (lazy by design)
 *     instead of being closures over cy.get(...).
 *   - Assertions use `expect(locator).toBe...()` and auto-retry
 *     for `expect.timeout` ms — no need to chain `should()`.
 *   - Browser alert() is captured with `page.on('dialog', ...)`,
 *     not Cypress's `cy.on('window:alert', ...)`.
 */
export class LoginPage {
  readonly page: Page

  // ---- Selectors ----------------------------------------------
  readonly headerLoginLink: Locator
  readonly loginModal: Locator
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly welcomeLabel: Locator

  constructor(page: Page) {
    this.page = page
    this.headerLoginLink = page.locator('#login2')
    this.loginModal      = page.locator('#logInModal')
    this.usernameInput   = page.locator('#loginusername')
    this.passwordInput   = page.locator('#loginpassword')
    // Demoblaze submit button has no id — wired via inline onclick.
    this.submitButton    = page.locator('button[onclick="logIn()"]')
    this.welcomeLabel    = page.locator('#nameofuser')
  }

  // ---- Actions ------------------------------------------------

  async visit(): Promise<this> {
    await this.page.goto('https://www.demoblaze.com/')
    await expect(this.headerLoginLink).toBeVisible()
    return this
  }

  async openLoginModal(): Promise<this> {
    await this.headerLoginLink.click()
    await expect(this.loginModal).toBeVisible()
    await expect(this.usernameInput).toBeVisible()
    return this
  }

  /**
   * Type credentials and submit. Does NOT assert the outcome —
   * the test decides whether success or an alert is expected.
   */
  async loginAs(username?: string, password?: string): Promise<this> {
    if (username) await this.usernameInput.fill(username)
    if (password) await this.passwordInput.fill(password)
    await this.submitButton.click()
    return this
  }

  // ---- Alert handling -----------------------------------------
  // Demoblaze surfaces login failures via browser alert() dialogs.
  // The listener MUST be registered BEFORE the action that triggers
  // the dialog, or Playwright will reject it as un-handled and the
  // browser will hang.

  /**
   * Register a listener that asserts the next alert dialog contains
   * the given text, then dismisses it.
   */
  expectAlertContaining(expectedText: string): void {
    this.page.once('dialog', async (dialog) => {
      try {
        expect(dialog.message()).toContain(expectedText)
      } finally {
        await dialog.accept()
      }
    })
  }

  // ---- Assertions ---------------------------------------------

  async assertLoggedInAs(expectedUsername?: string): Promise<this> {
    await expect(this.welcomeLabel).toBeVisible()
    if (expectedUsername) {
      await expect(this.welcomeLabel).toContainText(expectedUsername)
    }
    return this
  }

  async assertModalStillOpen(): Promise<this> {
    await expect(this.loginModal).toBeVisible()
    return this
  }

  async assertNotLoggedIn(): Promise<this> {
    await expect(this.welcomeLabel).toBeHidden()
    return this
  }
}
