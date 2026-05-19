# 05 — Cypress E2E Tests

End-to-end UI automation for **SauceDemo** and **Automation Exercise** using Cypress with the **Page Object Model** pattern.

## Stack

- **Cypress 13.x** — modern UI testing framework
- **JavaScript (ES6+)**
- **Mochawesome** — HTML reporting
- **GitHub Actions** — CI runs on every push

## Project Structure

```
05-cypress-tests/
├── cypress/
│   ├── e2e/                # Test specs
│   │   ├── saucedemo/
│   │   │   ├── login.cy.js
│   │   │   ├── cart.cy.js
│   │   │   └── checkout.cy.js
│   │   └── automationexercise/
│   │       ├── registration.cy.js
│   │       ├── product-search.cy.js
│   │       └── contact-us.cy.js
│   ├── fixtures/           # Test data (users.json, products.json)
│   ├── pages/              # Page Object classes
│   │   ├── LoginPage.js
│   │   ├── CartPage.js
│   │   └── CheckoutPage.js
│   └── support/
│       ├── commands.js     # Custom commands (cy.login, cy.addToCart)
│       └── e2e.js
├── cypress.config.js
└── package.json
```

## Page Object Example

```js
// cypress/pages/LoginPage.js
class LoginPage {
  elements = {
    username: () => cy.get('[data-test="username"]'),
    password: () => cy.get('[data-test="password"]'),
    submit:   () => cy.get('[data-test="login-button"]'),
    error:    () => cy.get('[data-test="error"]'),
  };

  visit() {
    cy.visit('/');
    return this;
  }

  loginAs(user, pass) {
    this.elements.username().type(user);
    this.elements.password().type(pass);
    this.elements.submit().click();
    return this;
  }

  assertError(message) {
    this.elements.error().should('contain', message);
    return this;
  }
}

export default new LoginPage();
```

## Running

```bash
cd 05-cypress-tests
npm install

# Open Cypress GUI
npx cypress open

# Run all tests headlessly
npx cypress run

# Run a specific spec
npx cypress run --spec "cypress/e2e/saucedemo/login.cy.js"

# Run in a specific browser
npx cypress run --browser chrome
```

## Test Coverage

| Module | Specs | Test Cases |
|---|---|---|
| Login (SauceDemo) | 1 | 6 |
| Cart (SauceDemo) | 1 | TBD |
| Checkout (SauceDemo) | 1 | TBD |
| Registration (AE) | 1 | TBD |
| Search (AE) | 1 | TBD |

## CI/CD

`.github/workflows/cypress.yml` runs the full suite on every push to `main` and on every PR. Failed runs upload videos and screenshots as artifacts for debugging.
