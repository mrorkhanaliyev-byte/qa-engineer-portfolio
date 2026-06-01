# Test Execution Summary Report

| Field | Value |
|---|---|
| **Project** | QA Engineer Portfolio — multi-site test cycle |
| **Cycle** | Cycle 1 |
| **Prepared by** | Orkhan Aliyev (QA) |
| **Report date** | 2026-05-30 |
| **Test period** | 2026-05-12 → 2026-05-30 |
| **Build / environment** | Public production & demo sites (see Scope) |
| **Status** | Closed |

---

## 1. Purpose

This report summarizes the results of the first end-to-end test cycle across all in-scope applications. It states what was tested, the pass/fail/blocked outcome, the defects found, and a go / no-go recommendation against the exit criteria from the [test plan](./test-plan.md).

## 2. Scope of this cycle

| Application | Layer(s) tested |
|---|---|
| Automation Exercise | Manual, UI (Cypress + Playwright), API (Postman/Newman), Accessibility |
| Demoblaze | Manual, UI (Cypress + Playwright + Selenium), API (login enumeration check) |
| ABB Bank (production) | UI (Cypress) — credit calculator, currency converter, search |
| Rabitabank (production) | UI (Cypress) — navigation |
| Tap.az (production) | UI (Cypress) — search & category browse |
| (Synthetic) e-commerce DB | SQL data-integrity validation |

Out of scope this cycle: full checkout/payment automation, performance/load, penetration testing beyond basic input-sanitization checks.

## 3. Execution metrics

### 3.1 Manual test cases

| Module | Designed | Executed | Passed | Failed | Blocked | Not Run |
|---|---|---|---|---|---|---|
| Login | 12 | 12 | 10 | 2 | 0 | 0 |
| Registration | 14 | 6 | 6 | 0 | 0 | 8 (API only this cycle) |
| Product Search | 12 | 12 | 12 | 0 | 0 | 0 |
| Cart | 13 | 12 | 11 | 1 | 0 | 1 |
| Checkout | 14 | 4 | 4 | 0 | 0 | 10 (automation planned) |
| **Total** | **65** | **46** | **43** | **3** | **0** | **19** |

**Manual pass rate (of executed):** 43 / 46 = **93.5%**

### 3.2 Automated tests (CI, latest run)

| Suite | Tests | Passed | Skipped (auth) | Failed |
|---|---|---|---|---|
| Cypress (8 specs) | 64 | 57 | 7 | 0 |
| Playwright (×3 browsers) | 18 ×3 | 36 | 18 | 0 |
| Playwright accessibility | 7 | 7 | 0 | 0 |
| Newman API | 14 req / 42 assertions | 42 | 0 | 0 |
| SQL validation | 19 | 19 | 0 | 0 |
| Selenium (in progress) | 6 | 6 (local) | 0 | 0 |

**Automated suites:** all green in CI. Skips are intentional (tests requiring a pre-provisioned account that CI can't create).

## 4. Defects

### 4.1 Defects found this cycle

| ID | Title | Severity | Priority | Status |
|---|---|---|---|---|
| [BUG-001](./bug-reports/BUG-001-login-error-message-leaks-user-existence.md) | AE login error leaks email existence | Major | High | Open |
| [BUG-002](./bug-reports/BUG-002-cart-quantity-resets-after-logout-login.md) | Cart lost after logout/login | Major | High | Open |
| [BUG-003](./bug-reports/BUG-003-password-field-allows-html5-paste-without-trim.md) | Email not trimmed on paste → login fails | Minor | Medium | Open |
| [BUG-004](./bug-reports/BUG-004-rabitabank-broken-navigation-links.md) | Rabitabank: 5 pages return 404 | Major | High | Open |
| [BUG-005](./bug-reports/BUG-005-demoblaze-api-user-enumeration.md) | Demoblaze login API enables user enumeration | Major | High | Open |
| [BUG-006](./bug-reports/BUG-006-missing-alt-text-accessibility.md) | Nav images missing alt text (WCAG A) | Major | High | Open |

### 4.2 Defects by severity

| Severity | Count |
|---|---|
| Critical | 0 |
| Major | 5 |
| Minor | 1 |
| Trivial | 0 |
| **Total** | **6** |

### 4.3 Defect density & escape

- **Defect density:** 6 defects / 6 modules ≈ **1.0 per module**.
- **Security findings:** 2 of 6 (BUG-001, BUG-005) are information-disclosure (user enumeration) — a recurring authentication anti-pattern across two different sites, worth flagging as a systemic theme rather than two isolated bugs.
- **Accessibility:** 1 of 6 (BUG-006), with additional serious/moderate findings logged in [AUDIT-RESULTS.md](../06-playwright-tests/AUDIT-RESULTS.md) and gated by baseline regression.
- **No defects escaped automation:** every functional bug has a corresponding test (or a documented intentional non-test, in the case of BUG-002).

## 5. Exit-criteria assessment

From the [test plan §5.2](./test-plan.md):

| Exit criterion | Target | Actual | Met? |
|---|---|---|---|
| P0 + P1 test cases executed | 100% | In-scope modules executed; checkout deferred | ⚠️ Partial |
| Open Critical defects | 0 | 0 | ✅ |
| Open High defects without workaround | 0 | All High defects have documented workarounds/notes | ✅ |
| Automated regression suites green | Yes | All 5 CI workflows green | ✅ |
| Summary report signed off | Yes | This document | ✅ (pending stakeholder) |

## 6. Risks & observations

- **Checkout coverage is the top gap.** Manual TCs exist; UI automation is the next priority. Until then, payment-flow regressions would only be caught manually.
- **Two user-enumeration findings on two sites** suggests this should be a standing item on the security checklist for every future project, not a one-off.
- **Production-site flakiness** (banking sites, third-party widgets) is managed with CI retries; no flaky failures in the latest run, but it's a monitored risk.

## 7. Recommendation

**GO, with conditions.**

The critical path (login → browse → cart → guest-checkout prompt) is verified across manual and automated layers with **zero open Critical defects**. The 5 Major defects are documented with reproductions, severity/priority, and fixes; none blocks the core read-and-browse journeys.

**Conditions before a production-equivalent release:**
1. Address BUG-001 / BUG-005 (user enumeration) — small fix, high security value.
2. Build checkout/payment automation to close the largest coverage gap.
3. Fix BUG-006 alt-text (trivial change, legal/accessibility value) and lower the a11y baseline to lock it in.

## 8. Sign-off

| Role | Name | Date | Signed |
|---|---|---|---|
| QA | Orkhan Aliyev | 2026-05-30 | ☑ |
| Product Owner | TBD | | ☐ |
| Engineering Lead | TBD | | ☐ |
