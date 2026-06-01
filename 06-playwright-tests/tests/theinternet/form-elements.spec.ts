import { test } from '@playwright/test'
import { FormElementsPage } from '../../pages/theinternet/FormElementsPage'

/**
 * The Internet — Form Elements & Dynamic DOM (Playwright).
 * Mirrors 05-cypress-tests/cypress/e2e/theinternet/form-elements.cy.js
 * with the same TC IDs.
 */

test.describe('The Internet — Form Elements & Dynamic DOM', () => {
  let form: FormElementsPage

  test.beforeEach(({ page }) => {
    form = new FormElementsPage(page)
  })

  test('TC-INET-FORM-001 | Positive | Native <select> dropdown selects an option', async () => {
    await form.visitDropdown()
    await form.selectDropdownOption('2')
    await form.assertDropdownSelected('2')
    await form.selectDropdownOption('1')
    await form.assertDropdownSelected('1')
  })

  test('TC-INET-FORM-002 | Positive | Checkboxes toggle their checked state', async () => {
    await form.visitCheckboxes()
    await form.assertCheckboxChecked(0, false)
    await form.assertCheckboxChecked(1, true)

    await form.toggleCheckbox(0)
    await form.assertCheckboxChecked(0, true)
    await form.toggleCheckbox(1)
    await form.assertCheckboxChecked(1, false)
  })

  test('TC-INET-FORM-003 | Positive | DOM grows and shrinks at runtime (add/remove)', async () => {
    await form.visitAddRemove()
    await form.assertDeleteButtonCount(0)

    await form.addElements(3)
    await form.assertDeleteButtonCount(3)
    await form.removeElement(0)
    await form.assertDeleteButtonCount(2)
  })

  test('TC-INET-FORM-004 | Positive | Number input accepts a numeric value', async () => {
    await form.visitInputs()
    await form.typeNumber(2026)
    await form.assertNumberValue(2026)
  })
})
