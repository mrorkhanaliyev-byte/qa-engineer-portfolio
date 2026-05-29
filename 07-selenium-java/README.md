# 07 — Selenium WebDriver + Java

A hybrid test automation framework built with **Selenium 4 + Java 17 + TestNG + Maven** — currently being grown alongside an in-progress Java Core + Selenium course.

![Selenium](https://img.shields.io/badge/Selenium-4.25-43B02A?logo=selenium&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![TestNG](https://img.shields.io/badge/TestNG-7.10-EE0000)
![Maven](https://img.shields.io/badge/Maven-3.9-C71A36?logo=apachemaven&logoColor=white)
![Status](https://img.shields.io/badge/Status-In_Progress-yellow)

---

## Status: building this alongside a Java Core + Selenium course

I started a structured Java Core + Selenium WebDriver course in May 2026. This section is the working portfolio output of that course — committed incrementally as I cover topics, not after-the-fact theatre.

What's already here:

- ✅ Maven project (`pom.xml`) with pinned versions for reproducibility
- ✅ `DriverFactory` — browser-agnostic WebDriver creation (Chrome, Firefox), WebDriverManager handles drivers
- ✅ `BaseTest` — per-method driver lifecycle, `@BeforeMethod` / `@AfterMethod`
- ✅ `LoginPage` (Demoblaze) — full Page Object Model with `By` constants, explicit waits
- ✅ `LoginTests` — 6 TestNG tests mirroring TC-LOGIN-001..006 from the manual test cases (and the Cypress / Playwright specs in `05-` and `06-`)
- ✅ `testng.xml` suite, log4j2 logging
- ✅ `-DskipAuth=true` system property pattern matching the Cypress / Playwright `CI_SKIP_AUTH_TESTS` flag

What's coming as the course progresses (see [Course roadmap](#course-roadmap) below):

- 🚧 Automation Exercise login + cart tests (after I cover Java collections + generics)
- 🚧 ABB Bank credit calculator (after Java exceptions + custom exception classes)
- 🚧 GitHub Actions CI workflow (after the framework is stable — committing CI for a moving target wastes minutes)
- 🚧 Allure reporting
- 🚧 Cross-browser matrix (Chrome / Firefox / Edge)
- 🚧 Data-driven tests via `@DataProvider`

---

## Why Selenium + Java in 2026?

Cypress and Playwright dominate the modern web-testing conversation, but **Selenium + Java still owns enterprise QA in fintech, banking, insurance, and government**. The skill stays on job descriptions because:

- Massive existing test estates need long-term maintenance, not rewrites
- Java integrates cleanly with the JVM ecosystem most enterprises already run (Spring, Kafka, Oracle DBs)
- TestNG's parallel execution, data providers, and suite groups handle complex regression matrices that JS test runners only recently caught up to
- Selenium 4 finally has parity with Playwright / Cypress for modern locator strategies (`relative locators`, `RelativeLocators.with(...)`) and grid scaling

Knowing Selenium + Java doesn't replace knowing Cypress and Playwright — it **complements** them. This portfolio covers all three so a hiring manager sees: *"this person can read whichever codebase we already have."*

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| **WebDriver** | Selenium 4.25 | The reference implementation; what enterprise codebases use |
| **Driver management** | WebDriverManager 5.9 | Eliminates manual ChromeDriver downloads and `System.setProperty(...)` boilerplate |
| **Test runner** | TestNG 7.10 | Annotations, suites, parallel execution, `@DataProvider`, rich assertions. JUnit 5 is fine too, but enterprise Selenium codebases tend to use TestNG |
| **Build** | Maven 3.9 | Industry standard for Java; `mvn test` is the universal entry point |
| **Logging** | Log4j2 | Plays well with TestNG; structured output for CI logs |
| **Page Object Model** | Hand-rolled (no PageFactory) | `@FindBy` adds magic that breaks in subtle ways with modern dynamic DOMs. Plain `By` constants + explicit waits is more readable and easier to debug |

---

## Project Structure

```
07-selenium-java/
├── pom.xml                                # Maven build + dep pins
├── testng.xml                             # Full-suite TestNG config
├── README.md
├── learning-notes/                        # Course note-taking (private to me)
└── src/
    ├── main/java/
    │   ├── base/
    │   │   └── BaseTest.java              # Driver lifecycle parent class
    │   ├── pages/
    │   │   └── demoblaze/
    │   │       └── LoginPage.java         # POM with By constants + explicit waits
    │   └── utils/
    │       └── DriverFactory.java         # WebDriver creator (Chrome / Firefox)
    └── test/
        ├── java/tests/
        │   └── demoblaze/
        │       └── LoginTests.java        # 6 tests, TC-LOGIN-001..006
        └── resources/
            └── log4j2.xml                 # Log4j2 config
```

---

## Running

You need **JDK 17+** and **Maven 3.9+** installed. Verify:

```bash
java -version       # should print 17 or higher
mvn -version
```

Then from this folder:

```bash
mvn clean test                              # full suite, default browser (Chrome)
mvn test -Dbrowser=firefox                  # switch browser
mvn test -DskipAuth=true                    # skip the 2 tests needing a registered user
mvn test -Dheadless=true                    # headless mode (CI default once wired)
mvn test -Dtest=LoginTests#tcLogin004_*     # run a single test method
```

### Preconditions for some tests

`tcLogin002_*` and `tcLogin003_*` need a pre-registered user on demoblaze.com:

1. Open https://www.demoblaze.com/
2. Click **Sign up**
3. Username: `qatestuser` | Password: `Test1234`

Or skip them with `-DskipAuth=true`. Same pattern as the Cypress and Playwright suites.

---

## How this mirrors the Cypress and Playwright suites

The same flow is tested in three frameworks:

| TC | Manual ([01](../01-manual-testing/test-cases/login-test-cases.csv)) | Cypress ([05](../05-cypress-tests/cypress/e2e/demoblaze/login.cy.js)) | Playwright ([06](../06-playwright-tests/tests/demoblaze/login.spec.ts)) | Selenium (this folder) |
|---|---|---|---|---|
| TC-LOGIN-001 | Login modal opens with all required fields | ✅ | ✅ | ✅ `tcLogin001_*` |
| TC-LOGIN-002 | Valid credentials log the user in | ✅ | ✅ | ✅ `tcLogin002_*` |
| TC-LOGIN-003 | Navbar shows "Welcome <username>" after login | ✅ | ✅ | ✅ `tcLogin003_*` |
| TC-LOGIN-004 | Empty form submission shows alert | ✅ | ✅ | ✅ `tcLogin004_*` |
| TC-LOGIN-005 | Wrong password shows "Wrong password" alert | ✅ | ✅ | ✅ `tcLogin005_*` |
| TC-LOGIN-006 | Non-existent user shows alert | ✅ | ✅ | ✅ `tcLogin006_*` |

Same test, three languages — a reader can diff them side-by-side to see how the testing intent translates between **JavaScript / TypeScript / Java**.

---

## Course roadmap

I'm building this section alongside structured learning. The roadmap below shows what's planned and roughly when, based on course progression. As I finish each topic I commit the corresponding portfolio code.

### Phase 1 — Foundations (Weeks 1–2) — ✅ in progress

Java Core:
- ✅ Primitive types, control flow, methods
- ✅ OOP fundamentals: classes, objects, constructors, encapsulation
- ✅ Inheritance, polymorphism, abstract classes, interfaces
- 🚧 Collections (`List`, `Map`, `Set`) — needed before I add data providers
- 🚧 Generics

Selenium:
- ✅ WebDriver setup, browser launching, basic locators (`By.id`, `By.cssSelector`)
- ✅ Explicit waits via `WebDriverWait` + `ExpectedConditions`
- ✅ Page Object Model basics
- ✅ Handling browser alerts

**Portfolio output this phase:** ✅ Demoblaze LoginPage + LoginTests (now live in this folder).

### Phase 2 — Real test patterns (Weeks 3–4) — 🚧 next

Java Core:
- 🚧 Exceptions and custom exception classes
- 🚧 Streams and lambdas
- 🚧 File I/O (for reading config files)
- 🚧 Optional and null safety

Selenium / TestNG:
- 🚧 Data-driven tests with `@DataProvider`
- 🚧 Test groups, dependencies, retry analyzers
- 🚧 Listeners for screenshot-on-failure
- 🚧 Custom `ConfigReader` reading from `config.properties`

**Portfolio output planned:**
- Automation Exercise LoginPage + tests (mirrors the AE flow in `05-` / `06-`)
- ABB Bank credit calculator tests (banking domain like the Cypress version)

### Phase 3 — Framework hardening (Weeks 5–6)

- 🚧 Allure reporting integration
- 🚧 Cross-browser matrix via TestNG parameters
- 🚧 GitHub Actions CI workflow (Chrome only initially, then matrix)
- 🚧 Selenium Grid + Dockerized browsers (only if I make it that far)

### Phase 4 — Advanced (later)

- 🚧 API tests in the same framework via REST-Assured (compares to Postman + Newman in `04-`)
- 🚧 Database validation via JDBC (compares to SQL section in `03-`)
- 🚧 Cucumber BDD layer (optional — only if a job description specifically asks for it)

---

## Why this section grows incrementally

I could've copy-pasted a tutorial framework here on day one and called it a portfolio entry. I didn't, because:

1. **Recruiters can tell.** Tutorial frameworks all look identical — same imports, same comments, same `By.xpath` strings everywhere. Hand-grown code with consistent style across phases shows actual ownership.
2. **The Cypress and Playwright sections in this portfolio are honest** — they include the production-site workarounds I had to debug (the AE hover-overlay click, the Chakra slider `force:true`, the `getByRole('link')` failure on hrefless anchors). The Selenium section should be honest the same way.
3. **Pacing matches the learning.** I add code when I understand it well enough to explain it in an interview.

The status badge at the top stays yellow until Phase 2 is complete. The roadmap above is the verification — anyone reading the portfolio sees exactly where this stands.

---

## What's intentionally NOT here yet

- **GitHub Actions CI** — will be added when Phase 2 lands. Adding CI for a framework that's still gaining shape just wastes runner minutes and trains me to ignore failed builds.
- **Allure / ExtentReports** — same reason. Reports for a 1-spec suite are theatre.
- **Cucumber / BDD** — only if a real job description asks for it. Cucumber adds significant complexity that's only worth it when product owners are actually writing Gherkin.

---

## What IS already production-quality here

The architectural choices ARE final and ARE production-quality:

- POM pattern (constants + explicit waits, no PageFactory magic)
- Driver lifecycle (per-method, parallel-safe)
- System-property pattern for browser switch + auth skip
- Maven build with pinned dependency versions
- TestNG suite structure

These don't change as more tests get added. The framework SCAFFOLD is solid; what's growing is the COVERAGE.
