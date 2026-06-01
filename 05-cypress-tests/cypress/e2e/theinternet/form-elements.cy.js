// ============================================================
// The Internet — Form Elements & Dynamic DOM
// Distinct element-handling techniques: <select>, checkboxes,
// runtime DOM changes, number inputs.
//
// Site under test: https://the-internet.herokuapp.com/
// Page Object: pages/theinternet/FormElementsPage.js
// ============================================================

import formPage from '../../pages/theinternet/FormElementsPage'

describe('The Internet — Form Elements & Dynamic DOM', () => {
  it('TC-INET-FORM-001 | Positive | Native <select> dropdown selects an option', () => {
    formPage.visitDropdown()
    formPage.selectDropdownOption('2').assertDropdownSelected('2')
    formPage.selectDropdownOption('1').assertDropdownSelected('1')
  })

  it('TC-INET-FORM-002 | Positive | Checkboxes toggle their checked state', () => {
    formPage.visitCheckboxes()
    // Page ships: checkbox 0 unchecked, checkbox 1 checked.
    formPage.assertCheckboxChecked(0, false)
    formPage.assertCheckboxChecked(1, true)

    formPage.toggleCheckbox(0).assertCheckboxChecked(0, true)
    formPage.toggleCheckbox(1).assertCheckboxChecked(1, false)
  })

  it('TC-INET-FORM-003 | Positive | DOM grows and shrinks at runtime (add/remove)', () => {
    formPage.visitAddRemove()
    formPage.assertDeleteButtonCount(0)

    formPage.addElements(3).assertDeleteButtonCount(3)
    formPage.removeElement(0).assertDeleteButtonCount(2)
  })

  it('TC-INET-FORM-004 | Positive | Number input accepts a numeric value', () => {
    formPage.visitInputs()
    formPage.typeNumber(2026).assertNumberValue(2026)
  })
})
