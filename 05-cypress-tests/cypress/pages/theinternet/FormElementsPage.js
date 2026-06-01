// ============================================================
// The Internet (herokuapp) — Form Elements & Dynamic DOM
//
// https://the-internet.herokuapp.com/ is the classic automation
// playground. Unlike the e-commerce specs in this suite, these
// tests exercise distinct ELEMENT-HANDLING techniques that show
// up constantly in real work but rarely in a happy-path login:
//   - native <select> dropdowns
//   - checkbox state toggling
//   - DOM that grows/shrinks at runtime (add/remove)
//   - number inputs
//
// The site is plain server-rendered HTML with rock-stable
// selectors, so these tests are deterministic — no SPA quirks.
// ============================================================

const BASE = 'https://the-internet.herokuapp.com'

class FormElementsPage {
  elements = {
    // /dropdown
    dropdown:       () => cy.get('#dropdown'),
    // /checkboxes
    checkboxes:     () => cy.get('#checkboxes input[type="checkbox"]'),
    // /add_remove_elements/
    addButton:      () => cy.get('button[onclick="addElement()"]'),
    deleteButtons:  () => cy.get('.added-manually'),
    // /inputs
    numberInput:    () => cy.get('input[type="number"]'),
  }

  // ---- Dropdown -----------------------------------------------

  visitDropdown() {
    cy.useDesktopViewport()
    cy.visit(`${BASE}/dropdown`)
    return this
  }

  selectDropdownOption(value) {
    this.elements.dropdown().select(value)
    return this
  }

  assertDropdownSelected(value) {
    this.elements.dropdown().should('have.value', value)
    return this
  }

  // ---- Checkboxes ---------------------------------------------

  visitCheckboxes() {
    cy.useDesktopViewport()
    cy.visit(`${BASE}/checkboxes`)
    return this
  }

  /** Toggle the checkbox at index (0 or 1) and return it for assertion. */
  toggleCheckbox(index) {
    this.elements.checkboxes().eq(index).click()
    return this
  }

  assertCheckboxChecked(index, expected) {
    const assertion = expected ? 'be.checked' : 'not.be.checked'
    this.elements.checkboxes().eq(index).should(assertion)
    return this
  }

  // ---- Add / Remove elements ----------------------------------

  visitAddRemove() {
    cy.useDesktopViewport()
    cy.visit(`${BASE}/add_remove_elements/`)
    return this
  }

  addElements(count) {
    for (let i = 0; i < count; i++) this.elements.addButton().click()
    return this
  }

  removeElement(index) {
    this.elements.deleteButtons().eq(index).click()
    return this
  }

  assertDeleteButtonCount(expected) {
    if (expected === 0) {
      this.elements.deleteButtons().should('not.exist')
    } else {
      this.elements.deleteButtons().should('have.length', expected)
    }
    return this
  }

  // ---- Number input -------------------------------------------

  visitInputs() {
    cy.useDesktopViewport()
    cy.visit(`${BASE}/inputs`)
    return this
  }

  typeNumber(value) {
    this.elements.numberInput().type(String(value))
    return this
  }

  assertNumberValue(value) {
    this.elements.numberInput().should('have.value', String(value))
    return this
  }
}

export default new FormElementsPage()
