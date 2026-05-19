# 01 — Manual Testing

This section contains the **foundation** of QA work — the artifacts a tester produces before any line of automation code is written.

## Contents

| Folder / File | What's Inside |
|---|---|
| [test-plan.md](./test-plan.md) | High-level test plan: scope, approach, entry/exit criteria, risks |
| [test-strategy.md](./test-strategy.md) | Test strategy: levels, types, tools, environments |
| [test-cases/](./test-cases/) | Detailed test cases as CSV (Excel-compatible) for Login, Registration, Search, Cart, Checkout |
| [bug-reports/](./bug-reports/) | Real bugs found during exploratory testing, with screenshots |
| [checklists/](./checklists/) | Smoke test and regression checklists |
| [mind-maps/](./mind-maps/) | Visual coverage maps |

## Targets Under Test

- [Automation Exercise](https://automationexercise.com/) — full e-commerce flow
- [SauceDemo](https://www.saucedemo.com/) — Swag Labs storefront

## Coverage Summary

| Module | Test Cases | Bugs Found |
|---|---|---|
| Login | 12 | 2 (BUG-001, BUG-003) |
| Registration | 14 | — |
| Product Search | 12 | — |
| Cart | 13 | 1 (BUG-002) |
| Checkout | 14 | — |
| **Total** | **65** | **3** |

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
