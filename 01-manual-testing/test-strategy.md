# Test Strategy

> A test **plan** says *what* and *when* for a specific cycle.
> A test **strategy** says *how* and *why* — and stays stable across cycles.

## 1. Philosophy

Three principles guide every choice on this project:

1. **Shift left.** Bugs found in design or code review cost a fraction of bugs found in production. Test cases are written from acceptance criteria *before* development is complete, not after.
2. **Risk-based prioritization.** Not every line of code carries equal risk. Coverage is concentrated where impact and likelihood are highest (checkout > footer links).
3. **Automate the boring, explore the interesting.** Repetitive regression checks belong in CI. Human creativity is reserved for exploratory sessions where new bugs actually live.

## 2. Test Pyramid

```
              ╱╲
             ╱E2╲           Few — slow, brittle, high confidence
            ╱────╲          (Cypress / Playwright / Selenium)
           ╱ API  ╲         Some — fast, contract-level
          ╱────────╲        (Postman / Newman)
         ╱   Unit   ╲       Many — fastest feedback, dev-owned
        ╱────────────╲      (out of QA scope here)
```

We don't own unit tests, but we **advocate** for them and verify their existence during PR review. UI E2E tests are the most expensive — kept lean, focused on critical journeys.

## 3. Test Levels & Ownership

| Level | What | Who | Cadence |
|---|---|---|---|
| **Unit** | Function-level | Developers | On every commit |
| **Integration / API** | Service boundaries | QA + Devs | Per PR |
| **E2E UI** | User journeys | QA | Per release candidate |
| **Exploratory** | Unscripted, charter-based | QA | Per feature |
| **Regression** | Full suite | QA (automated) | Nightly + per release |
| **Smoke** | Critical path only | QA (automated) | Per deploy to any env |
| **Acceptance** | Story-level criteria | QA + PO | Per story |

## 4. Test Types

### Functional
- **Positive** — happy path, valid inputs
- **Negative** — invalid, empty, malformed inputs
- **Boundary** — min, max, just above, just below
- **State-based** — workflows that span multiple screens / sessions

### Non-functional
- **Compatibility** — Chrome / Firefox / Edge, desktop & mobile viewports
- **Accessibility** — basic checks (keyboard nav, alt text, contrast). Full WCAG audit is out of scope.
- **Usability** — informal heuristic checks (Nielsen's 10)
- **Performance** — page-load smoke checks only; deep perf testing is out of scope.

## 5. Test Environments

| Env | Purpose | Test Types | Refresh |
|---|---|---|---|
| **Local** | Dev sanity | Unit, smoke | Per commit |
| **Dev** | Integration | API, smoke | Per merge to `develop` |
| **Staging** | Release validation | Full regression, E2E, exploratory | Per release branch |
| **Prod** | Smoke only — non-destructive | Read-only smoke checks | Post-deploy |

> **Hard rule:** No destructive operations in prod. Smoke checks read public catalog data only.

## 6. Test Data Strategy

| Data type | Source | Cleanup |
|---|---|---|
| **Static fixtures** | `cypress/fixtures/`, `tests/fixtures/` | Version-controlled, no cleanup needed |
| **Per-run users** | Generated with timestamp prefix (`qa_user_<ts>`) | Deleted in `afterAll` hook |
| **Per-run cart items** | Generated programmatically | Cart cleared in `beforeEach` |
| **PII** | None — synthetic data only | N/A |

## 7. Defect Lifecycle

```
   New  →  Open  →  In Progress  →  Resolved  →  In Test  →  Closed
                                        ↑                       │
                                        └───── Reopened ←───────┘
```

- **Severity** describes technical impact (Critical / Major / Minor / Trivial).
- **Priority** describes business urgency (Highest / High / Medium / Low).
- These are **independent**: a typo in the CEO's name on the homepage is Minor severity but Highest priority.

## 8. Tooling

| Concern | Tool | Why |
|---|---|---|
| Test management | Jira + Xray (sandbox) | Industry standard, integrates with Git |
| API testing | Postman + Newman | Low friction, scriptable, CI-friendly |
| UI automation (JS) | Cypress | Fast feedback, great DX |
| UI automation (TS, cross-browser) | Playwright | True multi-browser, parallel by default |
| UI automation (Java) | Selenium + TestNG | Enterprise reach, broad ecosystem |
| Data validation | SQL (MySQL / Postgres) | Direct verification of system state |
| Reporting | Mochawesome / Allure | Rich, shareable HTML |
| CI/CD | GitHub Actions | Free, integrated with this repo |

## 9. Metrics We Track

| Metric | Why we track it |
|---|---|
| **Test execution rate** | Are we keeping pace with the sprint? |
| **Pass / fail / blocked %** | Build health at a glance |
| **Defect density** (bugs per feature) | Where is the code weakest? |
| **Defect leakage** (escaped to prod) | How effective is our testing? |
| **Mean time to detect / resolve** | How fast does the feedback loop close? |
| **Automation coverage** of regression suite | Are we automating the right things? |

> Metrics inform conversations. They are not used to grade individuals.

## 10. What This Strategy Is Not

- Not a substitute for developer-owned unit tests.
- Not a guarantee of zero defects — only a strategy to reduce risk to an acceptable level.
- Not static. Reviewed every quarter; updated when tooling, team, or risk profile changes.
