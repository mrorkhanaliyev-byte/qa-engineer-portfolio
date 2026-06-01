import { Page, Locator, expect } from '@playwright/test'

/**
 * The Internet (herokuapp) — Form Elements & Dynamic DOM (Playwright).
 * Mirrors the Cypress FormElementsPage. Plain server-rendered HTML with
 * rock-stable selectors — deterministic, no SPA quirks.
 */
const BASE = 'https://the-internet.herokuapp.com'

export class FormElementsPage {
  readonly page: Page
  readonly dropdown: Locator
  readonly checkboxes: Locator
  readonly addButton: Locator
  readonly deleteButtons: Locator
  readonly numberInput: Locator

  constructor(page: Page) {
    this.page = page
    this.dropdown      = page.locator('#dropdown')
    this.checkboxes    = page.locator('#checkboxes input[type="checkbox"]')
    this.addButton     = page.locator('button', { hasText: 'Add Element' })
    this.deleteButtons = page.locator('.added-manually')
    this.numberInput   = page.locator('input[type="number"]')
  }

  // ---- Dropdown -----------------------------------------------

  async visitDropdown(): Promise<this> {
    await this.page.goto(`${BASE}/dropdown`)
    return this
  }

  async selectDropdownOption(value: string): Promise<this> {
    await this.dropdown.selectOption(value)
    return this
  }

  async assertDropdownSelected(value: string): Promise<this> {
    await expect(this.dropdown).toHaveValue(value)
    return this
  }

  // ---- Checkboxes ---------------------------------------------

  async visitCheckboxes(): Promise<this> {
    await this.page.goto(`${BASE}/checkboxes`)
    return this
  }

  async toggleCheckbox(index: number): Promise<this> {
    await this.checkboxes.nth(index).click()
    return this
  }

  async assertCheckboxChecked(index: number, expected: boolean): Promise<this> {
    if (expected) await expect(this.checkboxes.nth(index)).toBeChecked()
    else await expect(this.checkboxes.nth(index)).not.toBeChecked()
    return this
  }

  // ---- Add / Remove elements ----------------------------------

  async visitAddRemove(): Promise<this> {
    await this.page.goto(`${BASE}/add_remove_elements/`)
    return this
  }

  async addElements(count: number): Promise<this> {
    for (let i = 0; i < count; i++) await this.addButton.click()
    return this
  }

  async removeElement(index: number): Promise<this> {
    await this.deleteButtons.nth(index).click()
    return this
  }

  async assertDeleteButtonCount(expected: number): Promise<this> {
    await expect(this.deleteButtons).toHaveCount(expected)
    return this
  }

  // ---- Number input -------------------------------------------

  async visitInputs(): Promise<this> {
    await this.page.goto(`${BASE}/inputs`)
    return this
  }

  async typeNumber(value: number): Promise<this> {
    await this.numberInput.fill(String(value))
    return this
  }

  async assertNumberValue(value: number): Promise<this> {
    await expect(this.numberInput).toHaveValue(String(value))
    return this
  }
}
