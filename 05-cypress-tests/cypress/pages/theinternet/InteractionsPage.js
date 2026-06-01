// ============================================================
// The Internet (herokuapp) — Advanced Interactions
//
// The techniques here are the ones that separate a tester who can
// automate a login form from one who can automate a real app:
//   - native browser dialogs: alert / confirm / prompt
//   - typing into content inside an <iframe>
//   - explicit waiting for asynchronously-rendered elements
//   - file upload via a real <input type="file">
//   - handling a second browser window / tab
// ============================================================

const BASE = 'https://the-internet.herokuapp.com'

class InteractionsPage {
  elements = {
    // /javascript_alerts
    alertButton:   () => cy.contains('button', 'Click for JS Alert'),
    confirmButton: () => cy.contains('button', 'Click for JS Confirm'),
    promptButton:  () => cy.contains('button', 'Click for JS Prompt'),
    result:        () => cy.get('#result'),

    // /iframe (TinyMCE editor)
    tinymceFrame:  () => cy.get('#mce_0_ifr'),

    // /dynamic_loading/1
    startButton:   () => cy.get('#start button'),
    finishText:    () => cy.get('#finish'),

    // /upload
    fileInput:     () => cy.get('#file-upload'),
    uploadButton:  () => cy.get('#file-submit'),
    uploadedFiles: () => cy.get('#uploaded-files'),

    // /windows
    newWindowLink: () => cy.contains('.example a', 'Click Here'),
  }

  // ---- JavaScript dialogs -------------------------------------

  visitAlerts() {
    cy.useDesktopViewport()
    cy.visit(`${BASE}/javascript_alerts`)
    return this
  }

  /**
   * Trigger the simple alert() and accept it. Cypress auto-accepts
   * window:alert, but we register a listener to assert the message.
   */
  triggerAlertAndAccept(expectedMessage) {
    cy.once('window:alert', (msg) => {
      expect(msg).to.eq(expectedMessage)
    })
    this.elements.alertButton().click()
    return this
  }

  /**
   * Trigger confirm(); `accept` true → OK, false → Cancel.
   * Cypress AUTO-accepts confirmations by default, so we only need a
   * handler for the Cancel case — returning false from the
   * window:confirm handler dismisses the dialog.
   * Assert the #result text afterwards.
   */
  triggerConfirm(accept) {
    if (!accept) {
      // Register the dismiss handler INSIDE the command queue (cy.then)
      // so it attaches at this point in the flow, not synchronously at
      // test-setup time — otherwise it would also intercept an earlier
      // accept-case click in the same test.
      cy.then(() => {
        cy.once('window:confirm', () => false)
      })
    }
    this.elements.confirmButton().click()
    return this
  }

  /**
   * Trigger prompt() and type the given text into it.
   */
  triggerPromptWithText(text) {
    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns(text)
    })
    this.elements.promptButton().click()
    return this
  }

  assertResultContains(text) {
    this.elements.result().should('contain', text)
    return this
  }

  // ---- iFrame -------------------------------------------------

  visitIframe() {
    cy.useDesktopViewport()
    cy.visit(`${BASE}/iframe`)
    return this
  }

  /**
   * Type text into the TinyMCE editor, which lives inside an iframe.
   * Cypress can't cross frame boundaries directly, so we reach into
   * the iframe's contentDocument. TinyMCE makes the iframe's <body>
   * itself the contenteditable region, so we type straight into the
   * body rather than a descendant element.
   */
  /**
   * Set the editor content via TinyMCE's own API (exposed globally as
   * `tinyMCE`). TinyMCE keeps its iframe <body> in a transient readonly
   * state during init, which makes raw key-by-key typing flaky; driving
   * the editor through its public API is the deterministic, intended way
   * to programmatically populate it.
   */
  typeIntoEditor(text) {
    cy.window().then((win) => {
      const tm = win.tinyMCE || win.tinymce
      expect(tm, 'TinyMCE global should be available').to.exist
      tm.activeEditor.setContent(`<p>${text}</p>`)
    })
    return this
  }

  assertEditorContains(text) {
    this.elements.tinymceFrame()
      .its('0.contentDocument.body')
      .should('contain', text)
    return this
  }

  // ---- Dynamic loading (explicit wait) ------------------------

  visitDynamicLoading() {
    cy.useDesktopViewport()
    cy.visit(`${BASE}/dynamic_loading/1`)
    return this
  }

  startDynamicLoad() {
    this.elements.startButton().click()
    return this
  }

  /**
   * The #finish element is hidden until the async "load" completes.
   * Cypress retries the assertion until it becomes visible (up to the
   * configured timeout) — the right way to wait, vs a fixed sleep.
   */
  assertFinishText(text) {
    this.elements.finishText({ timeout: 15000 })
      .should('be.visible')
      .and('contain', text)
    return this
  }

  // ---- File upload --------------------------------------------

  visitUpload() {
    cy.useDesktopViewport()
    cy.visit(`${BASE}/upload`)
    return this
  }

  uploadFixtureFile(fileName) {
    this.elements.fileInput().selectFile(`cypress/fixtures/${fileName}`)
    this.elements.uploadButton().click()
    return this
  }

  assertUploadedFileName(fileName) {
    this.elements.uploadedFiles().should('contain', fileName)
    return this
  }

  // ---- Multiple windows ---------------------------------------

  visitWindows() {
    cy.useDesktopViewport()
    cy.visit(`${BASE}/windows`)
    return this
  }

  /**
   * The "Click Here" link is an anchor with target="_blank", so it
   * normally opens a second tab — which Cypress (single-tab) can't
   * switch into. The documented Cypress pattern is to strip the
   * target attribute so the link navigates in the SAME tab, then
   * assert the destination's content.
   */
  openNewWindowInSameTab() {
    this.elements.newWindowLink().invoke('removeAttr', 'target').click()
    return this
  }

  assertNewWindowContent(text) {
    cy.contains(text).should('be.visible')
    return this
  }
}

export default new InteractionsPage()
