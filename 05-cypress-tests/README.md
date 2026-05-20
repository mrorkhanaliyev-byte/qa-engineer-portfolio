# 05 — Cypress E2E Tests

End-to-end UI automation built with **Cypress + JavaScript**, applying the **Page Object Model** to keep specs readable and maintainable.

![Cypress](https://img.shields.io/badge/Cypress-13.x-17202C?logo=cypress&logoColor=white)
![Node](https://img.shields.io/badge/Node-20.x-339933?logo=node.js&logoColor=white)
![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)

---

## What's Covered Today

| Site | Domain | Spec | Test Cases | Maps to |
|---|---|---|---|---|
| [Demoblaze](https://www.demoblaze.com/) | Demo e-commerce | `e2e/demoblaze/login.cy.js` | 6 (3 positive, 3 negative) | [`login-test-cases.csv`](../01-manual-testing/test-cases/login-test-cases.csv) |
| [Automation Exercise](https://automationexercise.com/) | Demo e-commerce | `e2e/automationexercise/login.cy.js` | 12 (5 positive, 5 negative, 2 UI/security) | [`login-test-cases.csv`](../01-manual-testing/test-cases/login-test-cases.csv) |
| [ABB Bank](https://kredit.abb-bank.az/cash-loan) | **Production banking** | `e2e/abbbank/credit-calculator.cy.js` | 6 (4 positive, 2 boundary) | Standalone — no manual CSV |

**Roadmap** (added one at a time as each is stabilized):

- [x] Automation Exercise — login (12 TCs)
- [x] ABB Bank — credit calculator (6 TCs)
- [ ] Automation Exercise — cart and checkout flows
- [ ] Demoblaze — product browse + cart
- [ ] ABB Bank — currency converter (`abb_valyuta_konvertor`)
- [ ] ABB Bank — site search (`abb_search`)
- [ ] Tapaz — search and listing detail

> **Why both production sites and demo sites?** Demo sites prove I can write clean automation against a controlled target. Production sites (ABB Bank, Tapaz) prove I can handle real-world DOM noise, third-party widgets, analytics scripts, and intermittent latency — which is what the job actually looks like.

---

## Stack

- **Cypress 13.x** — modern end-to-end testing framework
- **JavaScript (ES6+ modules)** — used by the majority of QA teams on a JS stack
- **Mochawesome reporter** — pretty HTML reports, embedded screenshots, charts
- **Page Object Model** — selectors and actions encapsulated per page
- **Fixtures** — test data lives in JSON, separate from spec logic
- **GitHub Actions** — runs on every push and PR; failed runs upload screenshots + report

---

## Project Structure

```
05-cypress-tests/
├── cypress/
│   ├── e2e/                              # Test specs, grouped by site
│   │   ├── demoblaze/
│   │   │   └── login.cy.js
│   │   ├── automationexercise/
│   │   │   └── login.cy.js
│   │   └── abbbank/
│   │       └── credit-calculator.cy.js
│   ├── fixtures/                         # Test data (users, products, etc.)
│   │   └── users.json
│   ├── pages/                            # Page Object classes, grouped by site
│   │   ├── demoblaze/
│   │   │   └── LoginPage.js
│   │   ├── automationexercise/
│   │   │   └── LoginPage.js
│   │   └── abbbank/
│   │       └── CreditCalculatorPage.js
│   ├── support/
│   │   ├── commands.js                   # Custom Cypress commands
│   │   └── e2e.js                        # Runs before every spec
│   ├── reports/                          # Mochawesome HTML output (gitignored)
│   └── screenshots/                      # Failure screenshots (gitignored)
├── cypress.config.js
├── package.json
└── README.md
```

---

## The Page Object Model in Practice

Without POM, every spec has to know which DOM selectors point at the username field. The day Demoblaze renames `#loginusername` to `#login-email`, you fix 50 specs. With POM, you fix it in one place.

**Selector definition** lives in `pages/demoblaze/LoginPage.js`:

```js
class LoginPage {
  elements = {
    usernameInput: () => cy.get('#loginusername'),
    passwordInput: () => cy.get('#loginpassword'),
    submitButton:  () => cy.get('button[onclick="logIn()"]'),
    // ...
  }

  loginAs(username, password) {
    if (username) this.elements.usernameInput().type(username)
    if (password) this.elements.passwordInput().type(password)
    this.elements.submitButton().click()
    return this  // fluent chaining
  }
}
```

**The spec reads like business intent** (no DOM noise):

```js
it('TC-LOGIN-002 | Positive | Valid credentials log the user in', () => {
  loginPage
    .loginAs(users.valid.username, users.valid.password)
    .assertLoggedInAs()
})
```

---

## Running the Tests

```bash
cd 05-cypress-tests
npm install                # First time only

npm run cy:open            # Interactive runner — best for development
npm run cy:run             # Headless

npm run test:demoblaze          # Only Demoblaze specs
npm run test:automationexercise # Only Automation Exercise specs
npm run test:abbbank            # Only ABB Bank specs (production banking)
npx cypress run --spec "cypress/e2e/demoblaze/login.cy.js"  # Single file
```

### Reports

After a run, generate the HTML report:

```bash
npm run report:merge && npm run report:generate
# Open cypress/reports/html/index.html in a browser
```

---

## Preconditions for Some Tests

A few positive-path tests need a **pre-registered user** on each site.

### Demoblaze
`TC-LOGIN-002`, `003`, and `005` — if they fail with `User does not exist`:

1. Open https://www.demoblaze.com/
2. Click **Sign up**
3. Username: `qatestuser` | Password: `Test1234`

### Automation Exercise
`TC-AE-LOGIN-002`, `003`, `009`, and `010` — if they fail with `Your email or password is incorrect!`:

1. Open https://automationexercise.com/login
2. On the **New User Signup!** form, register:
   - Name: `Orkhan QA`
   - Email: `qa_orkhan@test.com`
3. On the account info page, set Password: `Test@1234` + fill any valid data for the rest

Credentials live in [`fixtures/users.json`](./cypress/fixtures/users.json) — change them in one place to swap accounts.

---

## CI/CD

[`.github/workflows/cypress.yml`](../.github/workflows/cypress.yml) runs on every push to `main` and every PR that touches:

- `05-cypress-tests/**`
- `.github/workflows/cypress.yml`

Path-scoped triggers keep CI fast — markdown-only commits to other sections don't burn minutes here.

**On failure:** screenshots and the full Mochawesome report are uploaded as build artifacts (downloadable from the Actions run page) for debugging.

**Matrix:** currently `chrome` only. Adding `firefox` and `edge` is a one-line change in the workflow matrix.

---

## Why This Spec, This Way

| Choice | Reason |
|---|---|
| Page Object Model | Fixes selector changes in one place; specs stay readable |
| Fluent chaining (`return this`) | Specs read like prose: `loginPage.openModal().loginAs(...).assertLoggedIn()` |
| Fixtures instead of inline data | Swap test data without editing specs |
| `cy.expectAlert` custom command | The alert listener must be registered before the click — encapsulating that timing rule prevents flakiness |
| `Cypress.on('uncaught:exception')` returns `false` | Third-party widgets on production sites throw harmless errors; ignoring them keeps tests focused on OUR flow |
| Retries in CI only (`runMode: 2`) | Transient network issues on demo sites shouldn't break CI; interactive mode stays strict for debugging |
