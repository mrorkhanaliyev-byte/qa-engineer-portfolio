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

> **📌 This is the Cycle 1 report (closed 2026-05-30).** The portfolio has grown since — see the **[Addendum — Cycle 2 delta](#addendum--cycle-2-delta-2026-06-02)** at the end for what changed (checkout coverage closed, API suite doubled, performance + accessibility added, two more CI workflows — k6 then Selenium). The Cycle 1 body below is preserved as an accurate snapshot of its time.

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
| [BUG-001](./bug-reports/BUG-001-signup-email-enumeration.md) | AE signup form leaks email existence | Major | High | Open |
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

---

## Addendum — Cycle 2 delta (2026-06-02)

The sections below the Cycle 1 sign-off are a snapshot of 2026-05-30. Since then the portfolio expanded; this addendum records what changed so the report stays useful without rewriting history.

### What closed or grew

| Area | Cycle 1 status | Now |
|---|---|---|
| **Checkout** | Automation *planned* (manual TCs only) | **Closed** end-to-end via SauceDemo — full purchase through *"Thank you for your order!"* in Cypress **and** Playwright, on every push (RTM CHK-01..05 ✅) |
| **API suite** | 1 collection — Automation Exercise (14 req / 42 assertions) | **2 collections** — added **restful-booker** (token auth, full CRUD, 403/404). **27 requests / 65+ assertions** |
| **Performance** | Out of scope | **Built** — k6 smoke / load / stress (section `08`); smoke is a CI gate (40/40 checks), load verified locally (1308/1308 checks, 0 failures) |
| **UI breadth** | 10 specs | **12 Cypress specs / 82 cases** + The Internet element-handling playground (iframes, alerts, file upload, multi-window) |
| **CI workflows** | 5 green | **7 green** (added `k6.yml`, then headless-Chrome `selenium.yml`); GitLab CI mirror added for the headless suites |
| **Strategy docs** | RTM + plan + strategy | + root **[Master Test Strategy](../TEST-STRATEGY.md)**; RTM grown to **63 requirements** incl. Booking-API and Performance groups |

### Updated automated-suite snapshot (latest CI run)

| Suite | Result |
|---|---|
| Cypress (12 specs) | green |
| Playwright (×3 browsers) | green |
| Playwright accessibility (7 audits) | green |
| Newman API (2 collections, 27 req) | green |
| SQL validation (19 queries) | green |
| **k6 performance smoke** (new) | green |
| **Selenium (SauceDemo, headless CI)** (new) | green (12/12 in CI; full purchase runs local) |

### What this means for the recommendation

The single largest Cycle 1 gap — **checkout automation** — is now closed for the SauceDemo target, and the **performance** dimension that was explicitly out of scope is now a CI-gated reality. The Cycle 1 **GO, with conditions** stands; condition #2 (build checkout automation) is **met**. Conditions #1 (user-enumeration fixes) and #3 (alt-text) remain open on the *target applications* — they are application bugs, not test-suite gaps, and stay tracked in the bug reports.
