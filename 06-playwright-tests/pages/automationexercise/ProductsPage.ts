import { Page, Locator, expect } from '@playwright/test'

/**
 * Automation Exercise — Products Listing Page Object (Playwright).
 *
 * Direct counterpart to the Cypress ProductsPage at
 * 05-cypress-tests/cypress/pages/automationexercise/ProductsPage.js
 *
 * Used by the cart spec as the source of products to add.
 * Cart-specific operations live in CartPage so each page object
 * owns one concern.
 */
export class ProductsPage {
  readonly page: Page

  readonly productsHeading: Locator
  readonly addedModal: Locator
  readonly addedModalContinue: Locator
  readonly addedModalViewCart: Locator

  constructor(page: Page) {
    this.page = page
    this.productsHeading    = page.getByRole('heading', { name: 'All Products' })
    this.addedModal         = page.locator('#cartModal')
    this.addedModalContinue = page.locator('#cartModal').getByRole('button', { name: 'Continue Shopping' })
    this.addedModalViewCart = page.locator('#cartModal').getByRole('link', { name: 'View Cart' })
  }

  // ---- Actions ------------------------------------------------

  async visit(): Promise<this> {
    await this.page.goto('https://automationexercise.com/products')
    await expect(this.productsHeading).toBeVisible()
    return this
  }

  /**
   * Find a product card by name and add it to the cart.
   *
   * AE's "Add to cart" link is duplicated per card — one inside
   * the visible .productinfo box, one inside the .product-overlay
   * that fades in on hover. Both share the same onclick handler.
   *
   * We click the .productinfo version with `force: true`:
   *   - bypasses Playwright's actionability check for the hover-
   *     gated overlay element
   *   - same approach the Cypress spec uses successfully
   *   - the JS onclick triggers regardless of CSS :hover state
   */
  async addToCart(productName: string): Promise<this> {
    // Why this is harder than it looks on AE:
    //   * Each product has TWO add-to-cart links — one in the
    //     visible card, one in the hover-only overlay
    //   * Browser-level click() with force:true sometimes fires
    //     before AE's jQuery onclick handler has rebound after
    //     the hover, especially under parallel load
    //
    // Most reliable approach: scope to the visible .productinfo
    // card, then dispatch a direct DOM-level click() via evaluate().
    // This bypasses Playwright's actionability + the hover-state
    // dance entirely, while still firing AE's real handler.
    const cardInfo = this.page
      .locator('.productinfo')
      .filter({ hasText: productName })
      .first()

    await cardInfo.scrollIntoViewIfNeeded()

    await cardInfo.evaluate((node) => {
      const link = node.querySelector<HTMLElement>('a.add-to-cart')
      if (!link) throw new Error('add-to-cart link not found in .productinfo card')
      link.click()
    })

    await expect(this.addedModal).toBeVisible()
    return this
  }

  async dismissAddedModal(): Promise<this> {
    await this.addedModalContinue.click()
    await expect(this.addedModal).toBeHidden()
    return this
  }

  async goToCartFromModal(): Promise<void> {
    await this.addedModalViewCart.click()
  }
}
