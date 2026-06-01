# QA Engineer Portfolio

> End-to-end Quality Assurance portfolio demonstrating the **full QA lifecycle** on real-world e-commerce applications — from manual test design and bug reporting through API testing, database validation, and UI automation across multiple frameworks.

[![Cypress E2E](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/cypress.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/cypress.yml)
[![Playwright Cross-Browser](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/playwright.yml)
[![Accessibility](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/accessibility.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/accessibility.yml)
[![Newman API](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/newman.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/newman.yml)
[![SQL Queries](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/sql.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/sql.yml)

![Manual Testing](https://img.shields.io/badge/Manual_Testing-✓-success)
![Jira](https://img.shields.io/badge/Jira-0052CC?logo=jira&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-4479A1?logo=mysql&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-17202C?logo=cypress&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![Selenium](https://img.shields.io/badge/Selenium-43B02A?logo=selenium&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?logo=openjdk&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)

---

## About This Portfolio

This repository documents my work as a **QA Engineer** testing two e-commerce applications end-to-end:

- **[Automation Exercise](https://automationexercise.com/)** — full e-commerce flow (UI + REST API)
- **[SauceDemo](https://www.saucedemo.com/)** — Swag Labs storefront (UI focus)

Each section covers a distinct QA discipline. Together they tell one story: **a tester who can design coverage, find bugs, communicate them clearly, and prevent regressions through automation.**

---

## What's Inside

| # | Section | Focus | Tech |
|---|---|---|---|
| 01 | [Manual Testing](./01-manual-testing/) | Test plans, test cases, bug reports, checklists | Excel, Markdown |
| 02 | [Jira Workflow](./02-jira-workflow/) | Sprint boards, bug lifecycle, dashboards | Jira |
| 03 | [SQL Queries](./03-sql-queries/) | Data validation queries, joins, window functions | SQL |
| 04 | [API Testing](./04-postman-api-testing/) | REST API collections, env variables, CI runs | Postman, Newman |
| 05 | [Cypress E2E](./05-cypress-tests/) | UI automation, Page Object Model | Cypress, JavaScript |
| 06 | [Playwright E2E](./06-playwright-tests/) | Cross-browser automation, fixtures | Playwright, TypeScript |
| 07 | [Selenium + Java](./07-selenium-java/) 🚧 | Hybrid framework, TestNG, Page Objects (in progress, built alongside course) | Selenium 4, Java 17, TestNG, Maven |

Each section has its own README with run instructions and screenshots.

---

## Highlights

- **65 manual test cases** covering login, registration, search, cart, and checkout flows
- **6 documented bug reports** — two user-enumeration security findings (one UI, one API), a 404 broken-links finding on a production bank, a WCAG accessibility failure, a cart-persistence bug, and a UX whitespace bug — each surfaced through a *different* testing layer
- **Requirements Traceability Matrix** mapping 46 requirements → test cases → automated tests → bugs across all sections, plus a **Cycle 1 test execution summary** with metrics and a go/no-go recommendation
- **Smoke + regression checklists** with P0/P1/P2 prioritization
- **Jira workflow** — custom bug-lifecycle diagram (Mermaid), 15+ JQL queries grouped by daily use case, drag-droppable CSV that imports the bug reports as real Jira tickets
- **Cypress E2E framework** with Page Object Model and Mochawesome reporting — 10 specs across 6 sites (SauceDemo, Demoblaze, Automation Exercise login+cart, **two production banks** ABB Bank + Rabitabank, Tap.az), **78 test cases** — including a **complete SauceDemo purchase flow through order confirmation** that closes the checkout-coverage gap
- **Postman + Newman API suite** — full coverage of Automation Exercise's 14 documented endpoints (45+ assertions), with a chained user-lifecycle scenario that cleans up after itself
- **SQL validation suite** — SQLite e-commerce schema, 19 queries (basic / joins / subqueries / window functions / QA validation), 5 intentionally planted data-quality bugs that the validation queries surface, runs in <10s
- **Playwright cross-browser suite** in **TypeScript** — mirrors the Cypress login + cart + **full SauceDemo checkout** flows on **Chromium, Firefox, and WebKit (Safari)** in a parallel CI matrix; Trace Viewer artifacts on failure
- **Accessibility audit (WCAG 2.1 AA)** with `@axe-core/playwright` — 7 page audits across AE + Demoblaze, baseline-as-regression-gate so CI catches a11y debt growing without failing on every minor warning; full findings documented in [`AUDIT-RESULTS.md`](./06-playwright-tests/AUDIT-RESULTS.md)
- **Selenium 4 + Java 17 + TestNG framework** *(in progress alongside a Java Core + Selenium course)* — `DriverFactory`, `BaseTest`, hand-rolled POM, 6 Demoblaze login tests mirroring the same TC IDs as the Cypress and Playwright suites; same flow testable in **3 languages** for a side-by-side comparison
- **GitHub Actions CI** runs Cypress, Playwright (×3 browsers), Newman, AND SQL on every push, uploads reports as artifacts, and shows four live green badges in this README

---

## How to Run

Each automation framework has its own setup instructions in its folder. Quick start:

```bash
# Clone the repo
git clone https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio.git
cd qa-engineer-portfolio

# Run Cypress tests
cd 05-cypress-tests
npm install
npx cypress run

# Run Playwright tests
cd ../06-playwright-tests
npm install
npx playwright test

# Run API tests with Newman
cd ../04-postman-api-testing
newman run collections/automation-exercise-api.postman_collection.json
```

---

## Test Strategy at a Glance

```
                   ┌─────────────────────────┐
                   │   Manual Exploration    │   ← discover, design coverage
                   └───────────┬─────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
       ┌──────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
       │  Bug Report │  │ Test Cases  │  │  Checklist │   ← document
       │   (Jira)    │  │   (Excel)   │  │ (Markdown) │
       └──────┬──────┘  └──────┬──────┘  └─────┬──────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                   ┌───────────▼─────────────┐
                   │  Regression Automation  │   ← prevent recurrence
                   │ (Cypress / Playwright)  │
                   └───────────┬─────────────┘
                               │
                   ┌───────────▼─────────────┐
                   │     CI/CD on push       │   ← shift-left feedback
                   │   (GitHub Actions)      │
                   └─────────────────────────┘
```

---

## About Me

**Orkhan Aliyev** — QA Engineer focused on building reliable, scalable test coverage for web applications.

- 📧 mr.orkhan.aliyev@gmail.com
- 💼 [LinkedIn](https://www.linkedin.com/in/orkhan-aliyev-qa/)
- 🐙 [GitHub](https://github.com/mrorkhanaliyev-byte)
- 🦊 [GitLab](https://gitlab.com/orkhanaliyev)

---

## License

This portfolio is for educational and demonstration purposes. Test targets are public demo sites that explicitly permit automated testing.
