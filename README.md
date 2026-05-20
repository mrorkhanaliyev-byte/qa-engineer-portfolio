# QA Engineer Portfolio

> End-to-end Quality Assurance portfolio demonstrating the **full QA lifecycle** on real-world e-commerce applications — from manual test design and bug reporting through API testing, database validation, and UI automation across multiple frameworks.

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
| 07 | [Selenium Framework](./07-selenium-java/) | Hybrid framework, TestNG, Page Objects | Selenium, Java, Maven |

Each section has its own README with run instructions and screenshots.

---

## Highlights

- **65 manual test cases** covering login, registration, search, cart, and checkout flows
- **3 documented bug reports** with reproduction steps, severity, environment, and impact analysis
- **Smoke + regression checklists** with P0/P1/P2 prioritization
- **Cypress E2E framework** with Page Object Model and Mochawesome reporting (2 specs live across 2 sites: Demoblaze + Automation Exercise, 18 test cases)
- **GitHub Actions CI** that runs the Cypress suite on every push and PR with artifact upload on failure
- **Postman collection** with environment variables and Newman CI integration *(in progress)*
- **Playwright cross-browser suite** *(in progress)*
- **SQL validation suite** verifying order totals, inventory, and referential integrity *(in progress)*

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
- 💼 [LinkedIn](https://www.linkedin.com/in/orkhan-aliyev-88718939b/)
- 🐙 [GitHub](https://github.com/mrorkhanaliyev-byte)
- 🦊 [GitLab](https://gitlab.com/orkhanaliyev)

---

## License

This portfolio is for educational and demonstration purposes. Test targets are public demo sites that explicitly permit automated testing.
