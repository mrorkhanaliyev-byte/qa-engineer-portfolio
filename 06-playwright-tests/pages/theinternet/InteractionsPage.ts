import { Page, Locator, expect } from '@playwright/test'

/**
 * The Internet (herokuapp) — Advanced Interactions (Playwright).
 *
 * Mirrors the Cypress InteractionsPage, but several techniques are
 * MORE natural in Playwright, which is part of the comparison value:
 *   - dialogs: page.on('dialog', ...) instead of cy.on('window:confirm')
 *   - iframes: page.frameLocator() crosses frame boundaries first-class
 *   - new tabs: Playwright handles real second tabs (context popup),
 *     where Cypress has to strip target="_blank" and stay single-tab
 */
const BASE = 'https://the-internet.herokuapp.com'

export class InteractionsPage {
  readonly page: Page
  readonly alertButton: Locator
  readonly confirmButton: Locator
  readonly promptButton: Locator
  readonly result: Locator
  readonly startButton: Locator
  readonly finishText: Locator
  readonly fileInput: Locator
  readonly uploadButton: Locator
  readonly uploadedFiles: Locator
  readonly newWindowLink: Locator

  constructor(page: Page) {
    this.page = page
    this.alertButton   = page.locator('button', { hasText: 'Click for JS Alert' })
    this.confirmButton = page.locator('button', { hasText: 'Click for JS Confirm' })
    this.promptButton  = page.locator('button', { hasText: 'Click for JS Prompt' })
    this.result        = page.locator('#result')
    this.startButton   = page.locator('#start button')
    this.finishText    = page.locator('#finish')
    this.fileInput     = page.locator('#file-upload')
    this.uploadButton  = page.locator('#file-submit')
    this.uploadedFiles = page.locator('#uploaded-files')
    this.newWindowLink = page.locator('.example a', { hasText: 'Click Here' })
  }

  // ---- Browser dialogs ----------------------------------------

  async visitAlerts(): Promise<this> {
    await this.page.goto(`${BASE}/javascript_alerts`)
    return this
  }

  /**
   * Accept the next alert and assert its message. The handler must be
   * registered BEFORE the click that triggers the dialog.
   */
  async triggerAlertAndAccept(expectedMessage: string): Promise<this> {
    this.page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe(expectedMessage)
      await dialog.accept()
    })
    await this.alertButton.click()
    return this
  }

  /** Trigger confirm(); accept true → OK, false → Cancel. */
  async triggerConfirm(accept: boolean): Promise<this> {
    this.page.once('dialog', async (dialog) => {
      if (accept) await dialog.accept()
      else await dialog.dismiss()
    })
    await this.confirmButton.click()
    return this
  }

  /** Trigger prompt() and enter the given text. */
  async triggerPromptWithText(text: string): Promise<this> {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept(text)
    })
    await this.promptButton.click()
    return this
  }

  async assertResultContains(text: string): Promise<this> {
    await expect(this.result).toContainText(text)
    return this
  }

  // ---- iFrame -------------------------------------------------

  async visitIframe(): Promise<this> {
    await this.page.goto(`${BASE}/iframe`)
    return this
  }

  /**
   * Set the editor content via TinyMCE's own API (global `tinyMCE`).
   * TinyMCE keeps its iframe <body> in a transient readonly state during
   * init, which makes raw key-by-key typing flaky; driving the editor
   * through its public API is the deterministic, intended way to
   * programmatically populate it. We still ASSERT by reading the iframe
   * body (proving cross-frame access via frameLocator).
   */
  async typeIntoEditor(text: string): Promise<this> {
    await this.page.evaluate((t) => {
      const w = window as unknown as { tinyMCE?: any; tinymce?: any }
      const tm = w.tinyMCE || w.tinymce
      tm.activeEditor.setContent(`<p>${t}</p>`)
    }, text)
    return this
  }

  async assertEditorContains(text: string): Promise<this> {
    const body = this.page.frameLocator('#mce_0_ifr').locator('body')
    await expect(body).toContainText(text)
    return this
  }

  // ---- Dynamic loading (explicit wait) ------------------------

  async visitDynamicLoading(): Promise<this> {
    await this.page.goto(`${BASE}/dynamic_loading/1`)
    return this
  }

  async startDynamicLoad(): Promise<this> {
    await this.startButton.click()
    return this
  }

  /**
   * #finish is hidden until the simulated async load completes.
   * Playwright auto-waits for visibility — no fixed sleep.
   */
  async assertFinishText(text: string): Promise<this> {
    await expect(this.finishText).toBeVisible({ timeout: 15_000 })
    await expect(this.finishText).toContainText(text)
    return this
  }

  // ---- File upload --------------------------------------------

  async visitUpload(): Promise<this> {
    await this.page.goto(`${BASE}/upload`)
    return this
  }

  async uploadFile(filePath: string): Promise<this> {
    await this.fileInput.setInputFiles(filePath)
    await this.uploadButton.click()
    return this
  }

  async assertUploadedFileName(fileName: string): Promise<this> {
    await expect(this.uploadedFiles).toContainText(fileName)
    return this
  }

  // ---- Multiple windows (native tab handling) -----------------

  async visitWindows(): Promise<this> {
    await this.page.goto(`${BASE}/windows`)
    return this
  }

  /**
   * Click the target="_blank" link and capture the REAL new tab that
   * opens — a first-class Playwright capability (Cypress can't switch
   * tabs and has to strip the target attribute instead). Returns the
   * new Page so the caller can assert against it.
   */
  async openNewWindow(): Promise<Page> {
    const [popup] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.newWindowLink.click(),
    ])
    await popup.waitForLoadState()
    return popup
  }
}
