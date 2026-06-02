# Master Test Strategy — QA Engineer Portfolio

> **What this document is:** the portfolio-wide quality strategy — the *one* model that explains how all eight sections fit together into a single, coherent testing approach. It answers *"how does this person think about quality across an entire product, not just one test?"*
>
> **What it is not:** a per-cycle test plan. The detailed, time-boxed plan and the Cycle 1 results live in [`01-manual-testing/test-plan.md`](./01-manual-testing/test-plan.md), [`test-strategy.md`](./01-manual-testing/test-strategy.md), and [`test-execution-summary.md`](./01-manual-testing/test-execution-summary.md). This is the umbrella above them.

---

## 1. The core idea: defense in depth

No single test layer catches everything. Unit tests miss integration bugs; API tests miss rendering bugs; UI tests are too slow and brittle to cover every edge; none of them catch a slow page or an inaccessible one. **A serious quality strategy layers cheap, fast, broad checks under expensive, slow, narrow ones** — so a defect that slips through one layer is caught by the next.

This portfolio is built as exactly that layered defense. Each section is one layer:

```
                        ┌─────────────────────────────────────────────┐
   slower, narrower     │  06  Accessibility (WCAG 2.1 AA, axe-core)   │  can a real user perceive/operate it?
   higher confidence    ├─────────────────────────────────────────────┤
        ▲               │  08  Performance (k6: smoke / load / stress) │  does it hold up under load?
        │               ├─────────────────────────────────────────────┤
        │               │  05 / 06 / 07  E2E UI (Cypress · Playwright  │  do real user journeys work,
        │               │                · Selenium) — POM, CI matrix  │  in real browsers?
        │               ├─────────────────────────────────────────────┤
        │               │  04  API / contract (Postman + Newman)       │  do the service boundaries behave?
        │               ├─────────────────────────────────────────────┤
        │               │  03  Data integrity (SQL validation)         │  is the stored state actually correct?
        │               ├─────────────────────────────────────────────┤
   faster, broader      │  01 / 02  Manual design + exploratory + Jira │  what should be true, and what breaks
   lower per-test cost  │                                              │  that no script would think to try?
                        └─────────────────────────────────────────────┘
```

The same requirement is deliberately verified at **more than one** layer. Login, for example:

| Layer | How login is checked | Section |
|---|---|---|
| Manual / design | 12 test cases incl. negative, boundary, security | `01` |
| API / contract | `verifyLogin` (AE) + `POST /auth` token flow (restful-booker) | `04` |
| UI E2E | login specs in Cypress **and** Playwright (×3 browsers) **and** Selenium | `05` `06` `07` |
| Security (cross-layer) | user-enumeration checked at the UI **and** at the API → **BUG-001** + **BUG-005** | `01` `04` |

That overlap is not waste — it's how the two user-enumeration findings surfaced: the *same* weakness, caught independently at two layers on two different sites.

---

## 2. Test pyramid, mapped to real sections

```
              ╱╲
             ╱  ╲   A11Y + PERF      non-functional gates — small in count,
            ╱ 06 ╲  (06 axe / 08 k6) high signal (a11y regressions, latency)
           ╱──────╲
          ╱  E2E   ╲  05 Cypress · 06 Playwright · 07 Selenium
         ╱  (UI)    ╲ few, slow, brittle, high confidence — critical journeys only
        ╱────────────╲
       ╱   API /      ╲  04 Postman + Newman (2 APIs, 27 requests, 65+ assertions)
      ╱   contract     ╲ more, fast, stable — every service boundary
     ╱──────────────────╲
    ╱   Data + Unit      ╲  03 SQL validation (state) · unit (dev-owned, advocated not authored)
   ╱──────────────────────╲ most, fastest — verify the foundation
```

**Deliberate shape:** the UI tip is kept lean (critical paths only — a full purchase flow, login, cart), because UI tests are the slowest and most fragile. The wide, cheap base (API + SQL) carries the bulk of the assertion count. Unit tests are dev-owned and out of QA-authored scope, but **advocated for and verified in PR review** — the strategy names them rather than pretending they don't exist.

---

## 3. Risk-based coverage — the decisions actually made

A strategy is proven by its trade-offs, not its intentions. The real ones in this portfolio:

| Decision | Why | Where |
|---|---|---|
| **Checkout closed via SauceDemo, not AE** | AE/Demoblaze can't complete a real purchase in CI (payment / account provisioning). SauceDemo's public creds let the full flow — through *"Thank you for your order!"* — run on every push. | `05` `06`, RTM CHK-01..05 |
| **Cart-persistence is intentionally NOT automated green** | Automating it as a passing test would *mask* **BUG-002**. The ❌ in the RTM is documented, deliberate non-coverage. | RTM CART-07 |
| **Performance runs smoke-only in CI** | The target is a free public server. A 10-VU load test on every push would be abusive; load/stress are local-and-deliberate. The technique scales to owned infra; the blast radius does not. | `08`, CI |
| **Auth-required tests skip themselves in CI** | CI can't provision real accounts on public sites. Tests detect `CI=true` and skip rather than fail — honest red/green, no fake passes. | `04` `05` `06` |
| **Per-endpoint (tagged) latency budgets** | One pathological endpoint (a 10 MB list) must not be allowed to hide latency regressions in the others. | `08` load.js |
| **Production banks tested read-only** | ABB / Rabitabank are live production sites. We assert on rendering and navigation, never mutate. One real 404 finding (**BUG-004**) came out of it. | `05` |

Coverage is concentrated where **impact × likelihood** is highest: *checkout and auth get multi-layer coverage; footer links get a smoke check.*

---

## 4. Shift-left & CI architecture

Every layer that *can* be automated runs in CI on every push, path-scoped so each workflow only fires when its area changes:

| Workflow | Triggers on | Runs | Gate |
|---|---|---|---|
| `cypress.yml` | `05-cypress-tests/**` | 12 specs / 7 sites | functional regression |
| `playwright.yml` | `06-playwright-tests/**` | login + cart + checkout ×3 browsers | cross-browser parity |
| `accessibility.yml` | a11y specs | 7 page audits | WCAG baseline-as-regression-gate |
| `newman.yml` | `04-postman-api-testing/**` | 2 collections | API contract |
| `sql.yml` | `03-sql-queries/**` | 19 queries / 5 planted bugs | data integrity |
| `k6.yml` | `08-performance-k6/**` | smoke (1 VU) | performance smoke |

**Six green badges** on the main README are the at-a-glance build-health signal. Reports (Mochawesome, Playwright traces, Newman HTML/JUnit, k6 summary) upload as artifacts on every run — green is necessary, evidence is retained.

The principle: **a test is only a gate if it can fail the build.** k6 thresholds exit non-zero; the a11y baseline fails on *new* critical violations; SQL validation fails if a planted-bug query returns rows. None of these are reports you have to remember to read.

---

## 5. Functional & non-functional coverage

### Functional
- **Positive / negative / boundary / state-based** — the standard four, applied via equivalence partitioning, BVA, decision tables, and state-transition design (documented in `01`).
- Verified across manual, API, and UI layers (see §1).

### Non-functional — *built, not just claimed*
| Attribute | How it's actually tested | Section |
|---|---|---|
| **Accessibility** | `@axe-core/playwright`, WCAG 2.1 AA, 7 page audits, baseline regression gate, findings in `AUDIT-RESULTS.md` | `06` |
| **Performance** | k6 smoke / load / stress, thresholds-as-gates, per-endpoint budgets, two findings (XML-default, cold-start) | `08` |
| **Compatibility** | Playwright matrix — Chromium, Firefox, WebKit | `06` |
| **Security (light)** | input-sanitization checks + two user-enumeration findings (UI + API) | `01` `04` |

> Earlier cycle documents (`01`) scoped performance and full-WCAG audits *out*; later cycles brought them *in*. This master strategy reflects the current, expanded reality — the per-cycle docs remain accurate snapshots of when they were written.

---

## 6. Test data, environments & ethics

| Principle | Implementation |
|---|---|
| **No PII** | Synthetic data only; per-run users generated with a timestamp prefix |
| **Self-cleaning** | API user-lifecycle chain and k6 smoke create-then-delete their own data — zero orphans on shared servers |
| **Respectful load** | Load/stress kept modest (≤25 VUs) against free public servers; only smoke runs in CI; read-only against production sites |
| **No destructive prod ops** | Banking sites are asserted on, never mutated |
| **Reproducible CI** | Lockfiles committed; browser/k6 versions pinned via setup actions |

Testing responsibly against infrastructure you don't own is itself part of the discipline — understanding *blast radius*, not just *technique*.

---

## 7. Defect strategy

- **Severity ≠ priority.** Severity is technical impact; priority is business urgency; they're tracked independently (a homepage typo is Minor severity / Highest priority).
- **Lifecycle & Jira workflow** documented in `02`, with a Mermaid bug-lifecycle diagram and an importable CSV that turns the bug reports into real tickets.
- **Systemic findings beat isolated tickets.** Two user-enumeration bugs on two different sites (**BUG-001**, **BUG-005**) are reported as a *theme* — "make this a standing security-checklist item" — not two unrelated defects.
- **Six documented defects**, each surfaced through a *different* testing layer (UI, API, production-site reliability, accessibility, data, UX), proving the layered model actually finds things.

---

## 8. Traceability — the single source of truth

[`01-manual-testing/requirements-traceability-matrix.md`](./01-manual-testing/requirements-traceability-matrix.md) maps **every requirement → manual TC → automated test (CY/PW/SE/API/k6) → bug**. It's the answer to *"how do we know this requirement is actually tested?"* and the place coverage gaps are made impossible to hide. It is updated whenever a test case, spec, or bug is added — including this cycle's Booking-API and Performance requirement groups.

---

## 9. Tooling — and why

| Concern | Tool | Why this one |
|---|---|---|
| Test management | Jira (+ workflow diagrams) | Industry standard; integrates with Git |
| API / contract | Postman + Newman | Low friction, scriptable, CI-friendly |
| UI (JS) | Cypress | Fast feedback loop, excellent DX |
| UI (TS, cross-browser) | Playwright | True multi-browser, parallel by default, Trace Viewer |
| UI (Java) | Selenium + TestNG | Enterprise reach, broad ecosystem |
| Accessibility | axe-core (via Playwright) | De-facto standard rules engine, WCAG-mapped |
| Performance | Grafana k6 | Scriptable JS, thresholds-as-code, CI-native |
| Data validation | SQL | Direct verification of stored state |
| CI/CD | GitHub Actions | Free, integrated, path-scoped |

The same login flow is intentionally testable in **three languages** (Cypress/JS, Playwright/TS, Selenium/Java) — a deliberate side-by-side of how each ecosystem solves the same problem.

---

## 10. This is a living document

Reviewed when tooling, scope, or risk profile changes. The portfolio grew from 5 sections to 8 (adding API depth, performance, and accessibility) and this strategy was updated to match — which is exactly how a real strategy should behave: **stable in principle, current in detail.**

---

**Author:** Orkhan Aliyev — QA Engineer
📧 mr.orkhan.aliyev@gmail.com · 💼 [LinkedIn](https://www.linkedin.com/in/orkhan-aliyev-qa/) · 🐙 [GitHub](https://github.com/mrorkhanaliyev-byte)
