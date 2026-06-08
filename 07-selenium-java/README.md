# 07 — Selenium WebDriver + Java

A test automation framework built with **Selenium 4 + Java 17 + TestNG + Maven**, mirroring the same flows as the Cypress (`05-`) and Playwright (`06-`) suites so the *same intent* can be read side-by-side in three languages. Headless-Chrome CI runs on every push.

[![Selenium Java](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/selenium.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/selenium.yml)
![Selenium](https://img.shields.io/badge/Selenium-4.25-43B02A?logo=selenium&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![TestNG](https://img.shields.io/badge/TestNG-7.10-EE0000)
![Maven](https://img.shields.io/badge/Maven-3.9-C71A36?logo=apachemaven&logoColor=white)

---

## What's here

Two sites, the full Page Object Model, and a CI gate:

| Site | Coverage | Tests | In CI? |
|---|---|---|---|
| **SauceDemo** (Swag Labs) | Login (6 personas incl. locked-out), inventory listing + sorting, add-to-cart, cart, **full purchase through "Thank you for your order!"** | 14 | login / inventory / cart ✅ · full checkout = local |
| **Demoblaze** | Login flow — positive, empty-form, wrong-password, non-existent-user | 6 | local (needs a registered account) |

- **SauceDemo** is the CI-runnable target: its credentials are public and fixed, so the authenticated journey runs headless on every push with zero account provisioning.
- **Demoblaze** mirrors the exact `TC-LOGIN-001..006` IDs from the manual cases and the Cypress / Playwright specs — the three-language comparison.

Framework pieces, all production-shaped:

- `DriverFactory` — browser-agnostic WebDriver (Chrome / Firefox), headless opt-in, WebDriverManager handles drivers. **Implicit wait is 0** — explicit `WebDriverWait` everywhere (mixing the two is a classic flaky-test source).
- `BaseTest` — per-method driver lifecycle (`@BeforeMethod` / `@AfterMethod`), parallel-safe.
- Page Objects — hand-rolled (`By` constants + explicit waits, no PageFactory magic): `LoginPage` (Demoblaze) and `Login / Inventory / Cart / Checkout` (SauceDemo).
- Two TestNG suites: `testng-ci.xml` (CI, deterministic subset) and `testng.xml` (local, everything).

---

## The CI / local split — a deliberate test-architecture decision

The two **complete multi-step checkout** cases live in a TestNG group called `fullPurchase`, and the CI suite **excludes** it. This is intentional, and worth explaining because it's exactly the kind of call a real QA engineer makes:

> SauceDemo is a free, shared public server that **throttles an IP which logs in many times in quick succession**. Under that throttling its React app degrades, and the heaviest interaction — the three-field checkout form submitted in one step — becomes intermittently flaky in headless CI. Verified across many runs: the form fills and the Continue click are silently dropped on the later, throttled requests.

A flaky test in a **blocking** CI gate is worse than a smaller reliable one — it trains the team to ignore red builds. So CI gates on the deterministic login / inventory / cart cases (green, repeatably), and the full purchase flow runs in the local `testng.xml`. **The POMs and the flow are fully implemented** — this is a gate-scope decision, not missing coverage.

What was done to make the suite as robust as possible *before* drawing that line (all in the page objects):

- **React-aware form fill** — `sendKeys` first (realistic), and if the controlled input didn't commit the value, fall back to the native value setter + a dispatched `input` event (what React actually listens for), then verify.
- **Verify-and-retry clicks** — add-to-cart and Continue confirm their *outcome* (a "Remove" button appears; the URL advances or an error shows) and re-click if the SPA dropped the first one.
- **Run order** — the heaviest flow runs first (`@Test(priority=...)`), against the freshest, un-throttled site.

That's the honest engineering story: you make it as reliable as the target allows, then you decide what's stable enough to *block* a merge.

---

## Why Selenium + Java in 2026?

Cypress and Playwright dominate the modern web-testing conversation, but **Selenium + Java still owns enterprise QA in fintech, banking, insurance, and government**:

- Massive existing test estates need long-term maintenance, not rewrites
- Java integrates with the JVM ecosystem enterprises already run (Spring, Kafka, Oracle)
- TestNG's parallel execution, data providers, groups, and priorities handle complex regression matrices
- Selenium 4 has parity with Playwright / Cypress on modern locators and grid scaling

Knowing Selenium + Java doesn't replace Cypress and Playwright — it **complements** them. Covering all three tells a hiring manager: *"this person can read whichever codebase we already have."*

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| **WebDriver** | Selenium 4.25 | The reference implementation; what enterprise codebases use |
| **Driver management** | WebDriverManager 5.9 | No manual ChromeDriver downloads or `System.setProperty(...)` boilerplate |
| **Test runner** | TestNG 7.10 | Annotations, suites, parallel, groups, priorities, `@DataProvider`. Enterprise Selenium leans TestNG |
| **Build** | Maven 3.9 | `mvn test` is the universal Java entry point |
| **Logging** | Log4j2 | Structured output for CI logs |
| **Page Object Model** | Hand-rolled (no PageFactory) | Plain `By` constants + explicit waits are more readable and debuggable than `@FindBy` magic on dynamic DOMs |

---

## Project Structure

```
07-selenium-java/
├── pom.xml                     # Maven build + pinned dep versions
├── testng.xml                  # LOCAL suite — everything (both sites, full checkout)
├── testng-ci.xml               # CI suite — SauceDemo deterministic subset
├── README.md
└── src/
    ├── main/java/
    │   ├── pages/
    │   │   ├── demoblaze/LoginPage.java
    │   │   └── saucedemo/{LoginPage,InventoryPage,CartPage,CheckoutPage}.java
    │   └── utils/DriverFactory.java
    └── test/
        ├── java/
        │   ├── base/BaseTest.java                  # driver lifecycle (test infra)
        │   └── tests/
        │       ├── demoblaze/LoginTests.java       # 6 tests, TC-LOGIN-001..006
        │       └── saucedemo/
        │           ├── LoginTests.java             # 6 tests (incl. locked-out)
        │           └── CheckoutTests.java          # inventory / cart / full purchase
        └── resources/log4j2.xml
```

> `BaseTest` lives under `src/test/java` (not `main`) on purpose: it depends on TestNG, a test-scoped dependency — test infrastructure belongs with the tests.

---

## Running

Needs **JDK 17+** and **Maven 3.9+**:

```bash
java -version        # 17 or higher
mvn -version
```

From this folder:

```bash
# CI suite — SauceDemo login / inventory / cart, headless (what GitHub runs)
mvn test -DsuiteXml=testng-ci.xml -Dheadless=true

# Full local suite — both sites + the complete purchase flow, visible browser
mvn clean test -DskipAuth=true

# Switches
mvn test -Dbrowser=firefox          # Chrome (default) or Firefox
mvn test -Dheadless=true            # no visible window
mvn test -DskipAuth=true            # skip the 2 Demoblaze tests needing an account
```

### Preconditions

- **SauceDemo** needs nothing — public credentials (`standard_user` / `secret_sauce`, `locked_out_user`).
- **Demoblaze** `tcLogin002/003` need a registered user: sign up `qatestuser` / `Test1234` at https://www.demoblaze.com/, or skip with `-DskipAuth=true`.

---

## Same flow, three frameworks

The Demoblaze login flow is implemented identically across the portfolio so the testing intent can be diffed across **JavaScript / TypeScript / Java**:

| TC | Manual ([01](../01-manual-testing/)) | Cypress ([05](../05-cypress-tests/)) | Playwright ([06](../06-playwright-tests/)) | Selenium (here) |
|---|---|---|---|---|
| TC-LOGIN-001 | Modal opens with all fields | ✅ | ✅ | ✅ `tcLogin001_*` |
| TC-LOGIN-002 | Valid credentials log in | ✅ | ✅ | ✅ `tcLogin002_*` |
| TC-LOGIN-003 | Navbar shows the username | ✅ | ✅ | ✅ `tcLogin003_*` |
| TC-LOGIN-004 | Empty form shows alert | ✅ | ✅ | ✅ `tcLogin004_*` |
| TC-LOGIN-005 | Wrong password alert | ✅ | ✅ | ✅ `tcLogin005_*` |
| TC-LOGIN-006 | Non-existent user alert | ✅ | ✅ | ✅ `tcLogin006_*` |

And the **full SauceDemo purchase flow** (login → cart → checkout → confirmation) now exists in all three frameworks too — see `05-cypress-tests` and `06-playwright-tests` for the JS/TS versions.

---

## Still growing

Honest about what's not here yet — these are Selenium ports of flows already covered elsewhere in the portfolio, added as the accompanying Java course progresses:

- Automation Exercise login + cart in Selenium (covered in Cypress/Playwright today)
- ABB Bank credit-calculator in Selenium (covered in Cypress today)
- `@DataProvider` data-driven cases and a screenshot-on-failure listener
- Allure reporting (deferred until the suite is large enough to warrant it)

The framework scaffold and the patterns above are final and production-shaped; what grows is the breadth of sites covered.
