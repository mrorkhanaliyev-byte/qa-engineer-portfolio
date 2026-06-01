import { Page, Locator, expect } from '@playwright/test'

/**
 * SauceDemo — Cart Page Object (Playwright). Mirrors the Cypress
 * CartPage.
 */
export class CartPage {
  readonly page: Page
  readonly cartItems: Locator
  readonly itemNames: Locator
  readonly checkoutButton: Locator
  readonly continueShoppingButton: Locator

  constructor(page: Page) {
    this.page = page
    this.cartItems = page.locator('.cart_item')
    this.itemNames = page.locator('.inventory_item_name')
    this.checkoutButton = page.locator('[data-test="checkout"]')
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]')
  }

  removeButton(slug: string): Locator {
    return this.page.locator(`[data-test="remove-${slug}"]`)
  }

  // ---- Actions ------------------------------------------------

  async removeItem(slug: string): Promise<this> {
    await this.removeButton(slug).click()
    return this
  }

  async checkout(): Promise<this> {
    await this.checkoutButton.click()
    return this
  }

  // ---- Assertions ---------------------------------------------

  async assertItemCount(expected: number): Promise<this> {
    await expect(this.cartItems).toHaveCount(expected)
    return this
  }

  async assertContainsItem(name: string): Promise<this> {
    await expect(this.itemNames.filter({ hasText: name })).toBeVisible()
    return this
  }
}
