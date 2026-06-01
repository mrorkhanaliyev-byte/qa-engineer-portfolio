import { Page, Locator, expect } from '@playwright/test'

/**
 * SauceDemo — Checkout Page Object (Playwright). Spans the two
 * checkout steps and the completion page. Mirrors the Cypress
 * CheckoutPage. This is what lets the portfolio cover a COMPLETE
 * purchase, end-to-end, in CI — the gap the RTM flagged.
 */
export class CheckoutPage {
  readonly page: Page
  readonly firstName: Locator
  readonly lastName: Locator
  readonly postalCode: Locator
  readonly continueButton: Locator
  readonly errorMessage: Locator
  readonly finishButton: Locator
  readonly overviewItems: Locator
  readonly completeHeader: Locator

  constructor(page: Page) {
    this.page = page
    this.firstName     = page.locator('[data-test="firstName"]')
    this.lastName      = page.locator('[data-test="lastName"]')
    this.postalCode    = page.locator('[data-test="postalCode"]')
    this.continueButton = page.locator('[data-test="continue"]')
    this.errorMessage  = page.locator('[data-test="error"]')
    this.finishButton  = page.locator('[data-test="finish"]')
    this.overviewItems = page.locator('.cart_item')
    this.completeHeader = page.locator('[data-test="complete-header"]')
  }

  // ---- Actions ------------------------------------------------

  async fillBuyerInfo(firstName?: string, lastName?: string, postalCode?: string): Promise<this> {
    if (firstName) await this.firstName.fill(firstName)
    if (lastName) await this.lastName.fill(lastName)
    if (postalCode) await this.postalCode.fill(postalCode)
    await this.continueButton.click()
    return this
  }

  async finish(): Promise<this> {
    await this.finishButton.click()
    return this
  }

  // ---- Assertions ---------------------------------------------

  async assertOnOverview(): Promise<this> {
    await expect(this.page).toHaveURL(/\/checkout-step-two\.html/)
    return this
  }

  async assertOverviewItemCount(expected: number): Promise<this> {
    await expect(this.overviewItems).toHaveCount(expected)
    return this
  }

  async assertErrorContains(text: string): Promise<this> {
    await expect(this.errorMessage).toBeVisible()
    await expect(this.errorMessage).toContainText(text)
    return this
  }

  async assertOrderComplete(): Promise<this> {
    await expect(this.page).toHaveURL(/\/checkout-complete\.html/)
    await expect(this.completeHeader).toBeVisible()
    await expect(this.completeHeader).toContainText('Thank you for your order!')
    return this
  }
}
