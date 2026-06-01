// ============================================================
// The Internet — Advanced Interactions
// Browser dialogs, iframes, async waits, file upload, windows.
//
// Site under test: https://the-internet.herokuapp.com/
// Page Object: pages/theinternet/InteractionsPage.js
//
// These are the techniques that come up constantly in real apps
// but never in a happy-path login test. Read the POM for the
// Cypress-specific patterns (iframe contentDocument access, the
// window.open stub for multi-window flows, dialog stubbing).
// ============================================================

import interactions from '../../pages/theinternet/InteractionsPage'

describe('The Internet — Advanced Interactions', () => {
  // ---- Browser dialogs ----------------------------------------

  it('TC-INET-INT-001 | Positive | JS alert() is accepted and reported', () => {
    interactions.visitAlerts()
    interactions.triggerAlertAndAccept('I am a JS Alert')
    interactions.assertResultContains('You successfully clicked an alert')
  })

  it('TC-INET-INT-002 | Positive | JS confirm() — OK and Cancel produce different results', () => {
    interactions.visitAlerts()

    interactions.triggerConfirm(true)
    interactions.assertResultContains('You clicked: Ok')

    interactions.triggerConfirm(false)
    interactions.assertResultContains('You clicked: Cancel')
  })

  it('TC-INET-INT-003 | Positive | JS prompt() captures typed text', () => {
    interactions.visitAlerts()
    interactions.triggerPromptWithText('Orkhan QA')
    interactions.assertResultContains('You entered: Orkhan QA')
  })

  // ---- iFrame -------------------------------------------------

  it('TC-INET-INT-004 | Positive | Typing into a TinyMCE editor inside an iframe', () => {
    interactions.visitIframe()
    interactions.typeIntoEditor('Automated by Cypress')
    interactions.assertEditorContains('Automated by Cypress')
  })

  // ---- Async / explicit wait ----------------------------------

  it('TC-INET-INT-005 | Positive | Explicit wait for an async-loaded element', () => {
    interactions.visitDynamicLoading()
    interactions.startDynamicLoad()
    // #finish is hidden until the simulated load completes; the
    // assertion retries until it appears — no fixed sleep.
    interactions.assertFinishText('Hello World!')
  })

  // ---- File upload --------------------------------------------

  it('TC-INET-INT-006 | Positive | Uploading a file shows its name on the result page', () => {
    interactions.visitUpload()
    interactions.uploadFixtureFile('upload-sample.txt')
    interactions.assertUploadedFileName('upload-sample.txt')
  })

  // ---- Multiple windows ---------------------------------------

  it('TC-INET-INT-007 | Positive | Opening a second window and reading its content', () => {
    interactions.visitWindows()
    interactions.openNewWindowInSameTab()
    interactions.assertNewWindowContent('New Window')
  })
})
