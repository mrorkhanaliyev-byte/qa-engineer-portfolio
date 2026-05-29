import { Page, Locator, expect } from '@playwright/test'

/**
 * Automation Exercise — Cart Page Object (Playwright).
 *
 * Counterpart to the Cypress CartPage. Same shape, same TC IDs.
 */
export class CartPage {
  readonly page: Page

  readonly emptyState: Locator
  readonly cartTable: Locator
  readonly cartRows: Locator
  readonly proceedToCheckout: Locator
  readonly guestCheckoutModal: Locator
  readonly guestCheckoutModalLink: Locator

  constructor(page: Page) {
    this.page = page
    this.emptyState        = page.locator('#empty_cart')
    this.cartTable         = page.locator('#cart_info_table')
    this.cartRows          = page.locator('#cart_info_table tbody tr')
    // Note: AE's "Proceed To Checkout" is an <a> WITHOUT href, which
    // makes Playwright's accessibility tree expose it as `generic`
    // instead of `link`. getByRole('link', ...) misses it — use a
    // CSS/text combo selector instead.
    this.proceedToCheckout = page.locator('a.check_out, a').filter({ hasText: 'Proceed To Checkout' }).first()
    this.guestCheckoutModal = page.locator('.modal-content')
      .filter({ hasText: 'Register / Login account' })
    this.guestCheckoutModalLink = page.locator('.modal-body')
      .getByRole('link', { name: 'Register / Login' })
  }

  // ---- Locator helpers ----------------------------------------

  private row(productName: string): Locator {
    return this.page
      .locator('#cart_info_table tbody tr')
      .filter({ hasText: productName })
  }

  // ---- Actions ------------------------------------------------

  async visit(): Promise<this> {
    await this.page.goto('https://automationexercise.com/view_cart')
    return this
  }

  async removeItem(productName: string): Promise<this> {
    await this.row(productName).locator('a.cart_quantity_delete').click()
    // Wait for the row to disappear.
    await expect(this.row(productName)).toHaveCount(0)
    return this
  }

  async clickProceedToCheckout(): Promise<this> {
    await this.proceedToCheckout.click()
    return this
  }

  // ---- Assertions ---------------------------------------------

  async assertEmpty(): Promise<this> {
    await expect(this.emptyState).toBeVisible()
    await expect(this.cartTable).toHaveCount(0)
    return this
  }

  async assertItemInCart(productName: string, expectedQuantity?: number): Promise<this> {
    const row = this.row(productName)
    await expect(row).toBeVisible()
    if (expectedQuantity !== undefined) {
      await expect(row.locator('.cart_quantity button')).toContainText(String(expectedQuantity))
    }
    return this
  }

  async assertRowCount(expectedCount: number): Promise<this> {
    await expect(this.cartRows).toHaveCount(expectedCount)
    return this
  }

  async assertGuestCheckoutBlocker(): Promise<this> {
    await expect(this.guestCheckoutModal).toBeVisible()
    await expect(this.guestCheckoutModalLink).toBeVisible()
    return this
  }
}
