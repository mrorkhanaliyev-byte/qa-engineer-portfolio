# 06 — Playwright E2E Tests

Cross-browser end-to-end tests with **Playwright + TypeScript**, running on **Chromium, Firefox, and WebKit** in a CI matrix. Companion to the Cypress suite — same targets, different framework, different language.

[![Playwright Cross-Browser](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/playwright.yml)

![Playwright](https://img.shields.io/badge/Playwright-1.48-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node-20.x-339933?logo=node.js&logoColor=white)
![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)

---

## Why Playwright Alongside Cypress?

The portfolio includes BOTH Cypress (JS) and Playwright (TS) on purpose. Recruiters and team leads see a candidate who can pick the right tool for the job, not someone locked into one framework.

| Aspect | Cypress | Playwright |
|---|---|---|
| Language | JavaScript / TypeScript | TypeScript / JavaScript / Python / .NET / Java |
| Browsers | Chrome, Edge, Firefox, Electron | **Chromium, Firefox, WebKit (Safari)** |
| Parallel runs in OSS | Sharding only | **Built-in, free, multi-worker** |
| Multi-tab / multi-origin | Limited | **Native** |
| iframe testing | Workarounds | First-class |
| Mobile emulation | Limited | **Full device emulation** |
| Time-travel debugger | DOM snapshots | **Trace Viewer** — DOM + network + screenshots, scrubbable |
| `await` everywhere | No (auto-queue) | Yes (explicit async) |

The "best" answer depends on the project. This portfolio shows fluency in both.

---

## What's Covered

| Site | Spec | Test Cases | Maps to |
|---|---|---|---|
| [Demoblaze](https://www.demoblaze.com/) | `tests/demoblaze/login.spec.ts` | 6 (3 positive, 3 negative) | [`login-test-cases.csv`](../01-manual-testing/test-cases/login-test-cases.csv) |
| [Automation Exercise](https://automationexercise.com/) | `tests/automationexercise/login.spec.ts` | 12 (5 positive, 5 negative, 2 UI/security) | [`login-test-cases.csv`](../01-manual-testing/test-cases/login-test-cases.csv) |
| [Automation Exercise](https://automationexercise.com/) | `tests/automationexercise/cart.spec.ts` | 8 (7 positive, 1 negative) | [`cart-test-cases.csv`](../01-manual-testing/test-cases/cart-test-cases.csv) |

Both specs are **direct counterparts of the Cypress specs** under `05-cypress-tests/`. Same TC IDs, same assertions — different framework. A reader can compare them side-by-side to see how the same testing intent translates between Cypress and Playwright.

---

## The Page Object Model in Playwright

```ts
// pages/automationexercise/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test'

export class LoginPage {
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator

  constructor(public page: Page) {
    this.emailInput    = page.locator('input[data-qa="login-email"]')
    this.passwordInput = page.locator('input[data-qa="login-password"]')
    this.submitButton  = page.locator('button[data-qa="login-button"]')
  }

  async loginAs(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async assertLoggedInAs(name?: string) {
    const label = this.page.getByRole('link', { name: /Logged in as/ })
    await expect(label).toBeVisible()
    if (name) await expect(label).toContainText(name)
  }
}
```

**Spec reads like business intent:**

```ts
test('TC-AE-LOGIN-002 | Valid credentials log the user in', async ({ page }) => {
  test.skip(SKIP_AUTH, 'Requires pre-registered user — skipped in CI')

  const loginPage = new LoginPage(page)
  await loginPage.visit()
  await loginPage.loginAs(ae.valid.email, ae.valid.password)
  await loginPage.assertLoggedInAs(ae.valid.name)
})
```

The biggest visual difference from Cypress: **every action is `await`**. Forgetting one is the most common Playwright bug, and TypeScript's no-floating-promises lint rule catches it before commit.

---

## Project Structure

```
06-playwright-tests/
├── package.json
├── package-lock.json                # committed for CI reproducibility
├── playwright.config.ts             # matrix definition, retries, trace
├── tsconfig.json                    # strict mode, path aliases
├── fixtures/
│   └── test-data.ts                 # credentials + SKIP_AUTH flag
├── pages/
│   ├── demoblaze/
│   │   └── LoginPage.ts
│   └── automationexercise/
│       └── LoginPage.ts
├── tests/
│   ├── demoblaze/
│   │   └── login.spec.ts
│   └── automationexercise/
│       └── login.spec.ts
├── playwright-report/               # HTML report — gitignored
└── test-results/                    # traces, screenshots, videos — gitignored
```

---

## Running Locally

```bash
cd 06-playwright-tests
npm install
npx playwright install           # download browsers (first time only, ~300 MB)

npm test                         # all browsers, all tests
npm run test:chromium            # only Chromium
npm run test:firefox             # only Firefox
npm run test:webkit              # only WebKit (Safari)
npm run test:ui                  # interactive UI mode

npm run test:demoblaze           # only Demoblaze tests
npm run test:ae                  # only AE tests

npm run report                   # open last HTML report
```

If you haven't registered the demo accounts (see Preconditions below), skip auth tests:

```bash
CI_SKIP_AUTH_TESTS=true npm test
```

---

## Trace Viewer

Playwright's killer feature: when a test fails, the run produces a `.zip` trace with:

- Step-by-step actions and snapshots
- Network traffic for every request
- Console logs
- DOM snapshot at every step (scrub backward and forward like video)

To inspect:

```bash
npx playwright show-trace test-results/.../trace.zip
```

In CI, traces are uploaded as artifacts on every failure (see workflow).

---

## Preconditions

Same as Cypress — 4 AE tests and 2 Demoblaze tests need a pre-registered user.

- **CI**: `CI_SKIP_AUTH_TESTS=true` is set in the workflow, so they auto-skip.
- **Locally**: set the same env var, OR register the accounts:
  - Demoblaze: signup `qatestuser / Test1234` at https://www.demoblaze.com/
  - Automation Exercise: signup `qa_orkhan@test.com / Test@1234` at https://automationexercise.com/login

Credentials live in [`fixtures/test-data.ts`](./fixtures/test-data.ts).

---

## CI Matrix

[`.github/workflows/playwright.yml`](../.github/workflows/playwright.yml) runs each browser as a **separate parallel job**:

| Browser | Engine | Approximate timing |
|---|---|---|
| chromium | Blink (Chrome family) | ~30s |
| firefox  | Gecko                 | ~40s |
| webkit   | WebKit (Safari)       | ~45s |

`fail-fast: false` means one browser failing doesn't cancel the others — important when you need to know whether a bug is browser-specific or universal.

Failed runs upload:
- The full HTML report (per browser)
- Traces (per browser) for failure analysis in Trace Viewer

---

## Why These Choices

| Choice | Reason |
|---|---|
| TypeScript strict mode | Catches missing `await`, wrong types, and undefined access before commit |
| Matrix CI over single job | Surfaces browser-specific bugs early; failures don't mask each other |
| Trace on first retry, not always | Trace files are large; collecting only on actual flake is the right balance |
| `retries: 2` in CI, `0` locally | Stays strict during development; absorbs flake on slow third-party sites |
| Same TC IDs as Cypress | Anyone reviewing the portfolio can diff the same test in both frameworks |
| Constructor-based locators | Lazy by design (locator created, query deferred until interaction) |
