import { Page, Locator, expect } from '@playwright/test'

/**
 * SauceDemo — Inventory (Products) Page Object (Playwright).
 * Mirrors the Cypress InventoryPage.
 */
export class InventoryPage {
  readonly page: Page
  readonly inventoryItems: Locator
  readonly itemNames: Locator
  readonly itemPrices: Locator
  readonly sortDropdown: Locator
  readonly cartBadge: Locator
  readonly cartLink: Locator

  constructor(page: Page) {
    this.page = page
    this.inventoryItems = page.locator('.inventory_item')
    this.itemNames      = page.locator('.inventory_item_name')
    this.itemPrices     = page.locator('.inventory_item_price')
    this.sortDropdown   = page.locator('[data-test="product-sort-container"]')
    this.cartBadge      = page.locator('.shopping_cart_badge')
    this.cartLink       = page.locator('.shopping_cart_link')
  }

  addToCartButton(slug: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${slug}"]`)
  }

  removeButton(slug: string): Locator {
    return this.page.locator(`[data-test="remove-${slug}"]`)
  }

  // ---- Actions ------------------------------------------------

  /** Sort values: az | za | lohi | hilo */
  async sortBy(value: string): Promise<this> {
    await this.sortDropdown.selectOption(value)
    return this
  }

  async addToCart(slug: string): Promise<this> {
    await this.addToCartButton(slug).click()
    return this
  }

  async openCart(): Promise<this> {
    await this.cartLink.click()
    return this
  }

  /**
   * Reset to a clean, empty-cart inventory between tests that share
   * one logged-in session (the serial checkout spec).
   *
   * Implementation: clear SauceDemo's cart (stored in the
   * `cart-contents` localStorage key) and reload the inventory. This
   * is deterministic — unlike the burger-menu "Reset App State" path,
   * which depends on slide-out animation timing and intermittently
   * blocks the next menu interaction. The session cookie persists, so
   * the reloaded SPA renders the inventory already authenticated.
   * (page.goto tolerates the 404 status the SPA host returns for
   * /inventory.html — it serves the app body regardless.)
   */
  async resetToCleanInventory(): Promise<this> {
    await this.page.evaluate(() => window.localStorage.removeItem('cart-contents'))
    await this.page.goto('https://www.saucedemo.com/inventory.html')
    await expect(this.inventoryItems).toHaveCount(6)
    await expect(this.cartBadge).toHaveCount(0)
    return this
  }

  // ---- Assertions ---------------------------------------------

  async assertItemCount(expected: number): Promise<this> {
    await expect(this.inventoryItems).toHaveCount(expected)
    return this
  }

  async assertCartBadgeCount(expected: number): Promise<this> {
    await expect(this.cartBadge).toHaveText(String(expected))
    return this
  }

  async assertPricesAscending(): Promise<this> {
    const texts = await this.itemPrices.allInnerTexts()
    const prices = texts.map((t) => parseFloat(t.replace('$', '')))
    const sorted = [...prices].sort((a, b) => a - b)
    expect(prices, 'prices should be ascending').toEqual(sorted)
    return this
  }

  async assertNamesDescending(): Promise<this> {
    const names = await this.itemNames.allInnerTexts()
    const sorted = [...names].sort().reverse()
    expect(names, 'names should be Z→A').toEqual(sorted)
    return this
  }
}
