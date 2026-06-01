# 01 — Manual Testing

This section contains the **foundation** of QA work — the artifacts a tester produces before any line of automation code is written.

## Contents

| Folder / File | What's Inside |
|---|---|
| [test-plan.md](./test-plan.md) | High-level test plan: scope, approach, entry/exit criteria, risks |
| [test-strategy.md](./test-strategy.md) | Test strategy: levels, types, tools, environments |
| [requirements-traceability-matrix.md](./requirements-traceability-matrix.md) | **RTM** — maps every requirement to its test cases, automated tests, and bugs across the whole portfolio |
| [test-execution-summary.md](./test-execution-summary.md) | **Cycle 1 summary report** — execution metrics, defects, exit-criteria assessment, go/no-go |
| [test-cases/](./test-cases/) | Detailed test cases as CSV (Excel-compatible) for Login, Registration, Search, Cart, Checkout |
| [bug-reports/](./bug-reports/) | 6 documented bugs with reproduction, severity, impact, and suggested fixes |
| [checklists/](./checklists/) | Smoke test and regression checklists |
| [mind-maps/](./mind-maps/) | Visual coverage maps |

## Targets Under Test

- [Automation Exercise](https://automationexercise.com/) — full e-commerce flow (UI + API)
- [Demoblaze](https://www.demoblaze.com/) — storefront with a login API
- Production sites: [ABB Bank](https://abb-bank.az/), [Rabitabank](https://www.rabitabank.com/), [Tap.az](https://tap.az/)

## Coverage Summary

| Module | Test Cases | Bugs Found |
|---|---|---|
| Login | 12 | 3 (BUG-001, BUG-003, BUG-005) |
| Registration | 14 | — |
| Product Search | 12 | — |
| Cart | 13 | 1 (BUG-002) |
| Checkout | 14 | — |
| Production reliability | (covered in `05`) | 1 (BUG-004) |
| Accessibility | (covered in `06`) | 1 (BUG-006) |
| **Total** | **65** | **6** |

## Bug Reports

| ID | Title | Severity | Type |
|---|---|---|---|
| [BUG-001](./bug-reports/BUG-001-login-error-message-leaks-user-existence.md) | AE login error leaks email existence | Major | Security |
| [BUG-002](./bug-reports/BUG-002-cart-quantity-resets-after-logout-login.md) | Cart lost after logout/login | Major | Functional |
| [BUG-003](./bug-reports/BUG-003-password-field-allows-html5-paste-without-trim.md) | Email not trimmed on paste → login fails | Minor | UX |
| [BUG-004](./bug-reports/BUG-004-rabitabank-broken-navigation-links.md) | Rabitabank: 5 pages return HTTP 404 | Major | Broken links |
| [BUG-005](./bug-reports/BUG-005-demoblaze-api-user-enumeration.md) | Demoblaze login API enables user enumeration | Major | Security |
| [BUG-006](./bug-reports/BUG-006-missing-alt-text-accessibility.md) | Nav images missing alt text (WCAG A) | Major | Accessibility |

> BUG-004, 005, 006 were each found through a different layer — strengthened UI assertions, direct API probing, and the automated axe-core audit respectively — showing the value of testing at every layer, not just the UI happy path.

## How Test Cases Are Written

Each test case follows the structure:

| Field | Example |
|---|---|
| **TC ID** | TC-LOGIN-001 |
| **Title** | Valid credentials should log user in |
| **Module** | Authentication |
| **Priority** | High |
| **Type** | Positive / Negative |
| **Preconditions** | User account exists |
| **Steps** | 1. Open login page<br>2. Enter valid email<br>3. Enter valid password<br>4. Click "Login" |
| **Expected Result** | User redirected to home page with name in header |
| **Actual Result** | (filled during execution) |
| **Status** | Pass / Fail / Blocked |
