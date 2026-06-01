import { Page, Locator, expect } from '@playwright/test'

/**
 * SauceDemo (Swag Labs) — Login Page Object (Playwright / TypeScript).
 *
 * Counterpart to the Cypress version at
 * 05-cypress-tests/cypress/pages/saucedemo/LoginPage.js
 *
 * SauceDemo's public, fixed credentials let the FULL authenticated
 * flow (login → cart → checkout → confirmation) run in CI without
 * account provisioning — which is what finally closes the checkout
 * gap in the RTM. Selectors use the site's stable data-test attrs.
 */
export class LoginPage {
  readonly page: Page
  readonly username: Locator
  readonly password: Locator
  readonly loginButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.username    = page.locator('[data-test="username"]')
    this.password    = page.locator('[data-test="password"]')
    this.loginButton = page.locator('[data-test="login-button"]')
    this.errorMessage = page.locator('[data-test="error"]')
  }

  async visit(): Promise<this> {
    await this.page.goto('https://www.saucedemo.com/')
    await expect(this.username).toBeVisible()
    return this
  }

  async loginAs(username?: string, password?: string): Promise<this> {
    if (username) await this.username.fill(username)
    if (password) await this.password.fill(password)
    await this.loginButton.click()
    return this
  }

  async assertOnInventory(): Promise<this> {
    await expect(this.page).toHaveURL(/\/inventory\.html/)
    return this
  }

  async assertErrorContains(text: string): Promise<this> {
    await expect(this.errorMessage).toBeVisible()
    await expect(this.errorMessage).toContainText(text)
    return this
  }

  async assertStillOnLogin(): Promise<this> {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/')
    return this
  }
}
