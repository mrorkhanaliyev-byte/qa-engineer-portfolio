import { test, expect } from '@playwright/test'
import * as path from 'node:path'
import { InteractionsPage } from '../../pages/theinternet/InteractionsPage'

/**
 * The Internet — Advanced Interactions (Playwright).
 *
 * Mirrors 05-cypress-tests/cypress/e2e/theinternet/interactions.cy.js
 * (same TC IDs). Several techniques are cleaner in Playwright — native
 * dialog handling, native frame traversal, and REAL second-tab capture
 * (vs Cypress's single-tab workaround). The POM comments call these out.
 */

test.describe('The Internet — Advanced Interactions', () => {
  let interactions: InteractionsPage

  test.beforeEach(({ page }) => {
    interactions = new InteractionsPage(page)
  })

  // ---- Browser dialogs ----------------------------------------

  test('TC-INET-INT-001 | Positive | JS alert() is accepted and reported', async () => {
    await interactions.visitAlerts()
    await interactions.triggerAlertAndAccept('I am a JS Alert')
    await interactions.assertResultContains('You successfully clicked an alert')
  })

  test('TC-INET-INT-002 | Positive | JS confirm() — OK and Cancel produce different results', async () => {
    await interactions.visitAlerts()

    await interactions.triggerConfirm(true)
    await interactions.assertResultContains('You clicked: Ok')

    await interactions.triggerConfirm(false)
    await interactions.assertResultContains('You clicked: Cancel')
  })

  test('TC-INET-INT-003 | Positive | JS prompt() captures typed text', async () => {
    await interactions.visitAlerts()
    await interactions.triggerPromptWithText('Orkhan QA')
    await interactions.assertResultContains('You entered: Orkhan QA')
  })

  // ---- iFrame -------------------------------------------------

  test('TC-INET-INT-004 | Positive | Typing into a TinyMCE editor inside an iframe', async () => {
    await interactions.visitIframe()
    await interactions.typeIntoEditor('Automated by Playwright')
    await interactions.assertEditorContains('Automated by Playwright')
  })

  // ---- Async / explicit wait ----------------------------------

  test('TC-INET-INT-005 | Positive | Explicit wait for an async-loaded element', async () => {
    await interactions.visitDynamicLoading()
    await interactions.startDynamicLoad()
    await interactions.assertFinishText('Hello World!')
  })

  // ---- File upload --------------------------------------------

  test('TC-INET-INT-006 | Positive | Uploading a file shows its name on the result page', async () => {
    await interactions.visitUpload()
    await interactions.uploadFile(path.join(__dirname, '..', '..', 'fixtures', 'upload-sample.txt'))
    await interactions.assertUploadedFileName('upload-sample.txt')
  })

  // ---- Multiple windows (native tab) --------------------------

  test('TC-INET-INT-007 | Positive | Opening a real second tab and reading its content', async () => {
    await interactions.visitWindows()
    const popup = await interactions.openNewWindow()
    // Assert against the REAL new tab — a native Playwright capability.
    await expect(popup.locator('h3')).toContainText('New Window')
    await popup.close()
  })
})
