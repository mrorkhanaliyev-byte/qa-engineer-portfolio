# Test Plan — Automation Exercise

| Field | Value |
|---|---|
| **Project** | Automation Exercise — e-commerce demo |
| **URL** | https://automationexercise.com/ |
| **Document version** | 1.0 |
| **Author** | Orkhan Aliyev |
| **Date** | 2026-05-19 |
| **Status** | Draft |

---

## 1. Introduction

This document defines the test plan for the Automation Exercise e-commerce application. It covers what will be tested, how, by whom, and what will define a successful test cycle. This plan is the **single source of truth** for the test cycle and is updated as scope or risk changes.

## 2. Objectives

- Verify that core customer journeys (login → browse → cart → checkout) work as expected.
- Identify defects that would block a real user from completing a purchase.
- Establish a baseline regression suite that can be re-run before each release.
- Hand off documented evidence (test cases, bug reports, checklists) for stakeholder review.

## 3. Scope

### 3.1 In Scope (this cycle)

| Module | Coverage |
|---|---|
| **Authentication** | Login, logout, error handling, basic security checks |
| **Registration** | Signup flow, validation, duplicate handling, account deletion |
| **Product Catalog & Search** | Search, filters (category / brand), product detail navigation |
| **Cart** | Add, remove, quantity, persistence across sessions |
| **Checkout & Payment** | Address, order review, payment, confirmation, invoice |

### 3.2 Out of Scope (this cycle)

- Performance / load testing
- Deep penetration testing (basic input-sanitization checks are included)
- Localization & internationalization
- Native mobile apps
- Third-party integrations (analytics, recommendation engine)

### 3.3 Browsers & Environments

| Browser | Version | Priority |
|---|---|---|
| Chrome | Latest stable | P0 — primary |
| Firefox | Latest stable | P1 |
| Edge | Latest stable | P2 |
| Safari | N/A (Windows test box) | Skipped |

| Resolution | Priority |
|---|---|
| 1920×1080 | P0 |
| 1440×900 | P0 |
| 375×667 (mobile) | P1 |

## 4. Test Approach

### 4.1 Levels

| Level | Owner | Tooling |
|---|---|---|
| **Component / Unit** | Dev team (out of scope here) | — |
| **Integration / API** | QA — Postman | Postman, Newman |
| **End-to-end UI** | QA — manual + automation | Manual, Cypress, Playwright |
| **Exploratory** | QA — manual session-based | Mind maps, screen recording |

### 4.2 Types

- **Functional** — does each feature do what it claims?
- **Negative** — what happens with invalid / empty / boundary inputs?
- **Regression** — do existing features still work after changes?
- **Smoke** — does the critical path work at all?
- **UI / Visual** — layout, copy, responsiveness
- **Cross-browser** — Chrome / Firefox / Edge parity

### 4.3 Test Case Design Techniques

- Equivalence partitioning (e.g. valid / invalid email formats)
- Boundary value analysis (cart quantity: 0, 1, max, max+1)
- Decision tables (login: user-exists × password-valid)
- State transition (cart: empty → has item → checkout)
- Error guessing based on prior experience with similar apps

## 5. Entry & Exit Criteria

### 5.1 Entry Criteria
- Test environment is reachable and stable
- All P0 features are deployed and code-complete
- Test data (user accounts, test products) is available
- Test cases for in-scope modules are reviewed and approved

### 5.2 Exit Criteria
- 100% of P0 and P1 test cases executed
- 0 open Critical defects
- 0 open High defects without an agreed workaround
- Test summary report signed off by stakeholders

## 6. Deliverables

| Artifact | Location |
|---|---|
| Test plan (this document) | `01-manual-testing/test-plan.md` |
| Test cases | `01-manual-testing/test-cases/*.csv` |
| Bug reports | `01-manual-testing/bug-reports/*.md` |
| Smoke checklist | `01-manual-testing/checklists/smoke-test-checklist.md` |
| Test summary report | (generated at cycle end) |

## 7. Schedule

| Phase | Duration | Output |
|---|---|---|
| Test design | 2 days | Test cases reviewed |
| Smoke test | 0.5 day | Smoke checklist run |
| Functional execution | 3 days | Test cases pass/fail |
| Bug retest | 1 day | Defects verified fixed |
| Regression | 1 day | Full suite re-run |
| Reporting | 0.5 day | Summary delivered |

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Demo site goes down mid-cycle | Medium | High | Capture screenshots/recordings of each test for evidence |
| Test data leakage between runs (cart items persist) | High | Medium | Clear cart in setup; use fresh accounts per run |
| Browser updates break automation overnight | Low | Medium | Pin browser versions in CI |
| Anti-bot / rate limiting on demo site | Medium | Medium | Add delays; throttle parallel runs |

## 9. Defect Management

- Tracked in [Jira](../02-jira-workflow/) under the `AQA` project
- Severity / priority matrix and bug lifecycle: see [02-jira-workflow/README.md](../02-jira-workflow/README.md)
- Every defect has steps to reproduce, expected vs actual, severity, environment, and at least one screenshot

## 10. Sign-off

| Role | Name | Signed |
|---|---|---|
| QA Lead | Orkhan Aliyev | ☐ |
| Product Owner | TBD | ☐ |
| Engineering Lead | TBD | ☐ |
