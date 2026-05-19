# 06 — Playwright E2E Tests

Cross-browser end-to-end automation with **Playwright + TypeScript**, demonstrating modern UI testing patterns: fixtures, parallel execution, trace viewer, and visual snapshots.

## Why Playwright Alongside Cypress?

This portfolio includes **both** Cypress and Playwright on purpose — to show I can choose the right tool for the job. Brief comparison:

| Aspect | Cypress | Playwright |
|---|---|---|
| Language | JavaScript | TypeScript / JS / Python / .NET |
| Browsers | Chrome, Edge, Firefox, Electron | Chromium, Firefox, WebKit |
| Parallel runs | Paid feature (Cloud) or sharding | Free, built-in |
| Multi-tab / multi-domain | Limited | Native support |
| Iframe testing | Workarounds needed | First-class |
| Mobile emulation | Limited | Full device emulation |

## Stack

- **Playwright 1.4x**
- **TypeScript 5.x**
- **Allure** — rich reporting
- **GitHub Actions** — matrix runs (chromium / firefox / webkit)

## Project Structure

```
06-playwright-tests/
├── tests/
│   ├── saucedemo/
│   │   └── login.spec.ts
│   └── automationexercise/
│       ├── registration.spec.ts
│       └── checkout.spec.ts
├── pages/                  # Page Object classes
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   └── CheckoutPage.ts
├── fixtures/               # Custom fixtures (logged-in user, seeded cart)
│   └── auth.ts
├── playwright.config.ts
└── package.json
```

## Page Object Example

```ts
// pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(private page: Page) {
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.submit   = page.getByTestId('login-button');
    this.error    = page.getByTestId('error');
  }

  async visit() {
    await this.page.goto('/');
  }

  async loginAs(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submit.click();
  }

  async expectError(text: string) {
    await expect(this.error).toContainText(text);
  }
}
```

## Running

```bash
cd 06-playwright-tests
npm install
npx playwright install                # Download browsers

npx playwright test                    # All tests, all browsers
npx playwright test --project=chromium # One browser only
npx playwright test --ui               # Interactive UI mode
npx playwright show-report             # Open last HTML report
npx playwright show-trace trace.zip    # Time-travel debugger
```

## CI Matrix

`.github/workflows/playwright.yml` runs the suite across **chromium**, **firefox**, and **webkit** in parallel on every PR. Failed runs upload traces — open them in the Playwright trace viewer for full DOM/network replay.
