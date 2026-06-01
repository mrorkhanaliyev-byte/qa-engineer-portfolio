# Requirements Traceability Matrix (RTM)

> A RTM answers one question a manager always asks: **"How do we know this requirement is actually tested?"** It maps every requirement to the test cases that verify it, the automated tests that guard it, and the bugs found against it — so coverage gaps and untested requirements are impossible to hide.

This RTM ties the **whole portfolio together**: manual test cases (`01`), API tests (`04`), Cypress (`05`), Playwright (`06`), Selenium (`07`), and the bug reports — all in one view.

**Legend:**
`M` = Manual TC · `CY` = Cypress · `PW` = Playwright · `SE` = Selenium · `API` = Postman/Newman · `A11Y` = accessibility audit
✅ covered · 🚧 planned · — not applicable

---

## Authentication (Login)

| Req ID | Requirement | Manual TC | CY | PW | SE | API | Bug(s) |
|---|---|---|---|---|---|---|---|
| AUTH-01 | Login page/modal exposes email, password, submit | TC-LOGIN-001, TC-AE-LOGIN-001 | ✅ | ✅ | ✅ | — | — |
| AUTH-02 | Valid credentials authenticate the user | TC-LOGIN-002/003, TC-AE-LOGIN-002/003 | ✅ | ✅ | ✅ | ✅ | — |
| AUTH-03 | Invalid password is rejected | TC-LOGIN-005, TC-AE-LOGIN-004 | ✅ | ✅ | ✅ | ✅ | — |
| AUTH-04 | Unknown user is rejected | TC-LOGIN-006, TC-AE-LOGIN-005 | ✅ | ✅ | ✅ | ✅ | **BUG-001, BUG-005** |
| AUTH-05 | Empty / malformed input is blocked | TC-LOGIN-004, TC-AE-LOGIN-006/007/008 | ✅ | ✅ | ✅ | ✅ | — |
| AUTH-06 | Error messages must not leak account existence | TC-LOGIN-004 | ✅ | ✅ | — | ✅ | **BUG-001 (AE UI), BUG-005 (Demoblaze API)** |
| AUTH-07 | Password field is masked | TC-AE-LOGIN-011 | ✅ | ✅ | — | — | — |
| AUTH-08 | Email field trims whitespace on paste | (TC-LOGIN-013, proposed) | 🚧 | 🚧 | — | — | **BUG-003** |
| AUTH-09 | Login form resists XSS / SQLi input | TC-LOGIN-011/012, TC-AE-LOGIN-012 | ✅ | ✅ | — | — | — |
| AUTH-10 | Logout returns user to guest state | TC-LOGIN-010, TC-AE-LOGIN-010 | ✅ | ✅ | — | — | — |

## Registration

| Req ID | Requirement | Manual TC | CY | PW | SE | API | Bug(s) |
|---|---|---|---|---|---|---|---|
| REG-01 | New account can be created end-to-end | TC-REG-002/003/011 | 🚧 | 🚧 | — | ✅ (createAccount) | — |
| REG-02 | Duplicate email is rejected | TC-REG-004 | 🚧 | — | — | ✅ | — |
| REG-03 | Required-field validation on signup | TC-REG-005/006/007/008 | 🚧 | — | — | ✅ | — |
| REG-04 | Account can be deleted | TC-REG-012 | — | — | — | ✅ (deleteAccount) | — |
| REG-05 | Created account is retrievable | — | — | — | — | ✅ (getUserDetailByEmail) | — |

## Product Catalog & Search

| Req ID | Requirement | Manual TC | CY | PW | SE | API | Bug(s) |
|---|---|---|---|---|---|---|---|
| SRCH-01 | Keyword search returns matching products | TC-SEARCH-002 | ✅ (Tapaz, ABB) | — | — | ✅ (searchProduct) | — |
| SRCH-02 | Search handles empty / no-match / special chars | TC-SEARCH-005/006/008 | ✅ (ABB) | — | — | ✅ | — |
| SRCH-03 | Category / brand filtering | TC-SEARCH-009/010 | ✅ (Tapaz) | — | — | — | — |
| SRCH-04 | Full product list is retrievable | TC-SEARCH-001 | — | — | — | ✅ (productsList) | — |
| SRCH-05 | Brand list is retrievable | — | — | — | — | ✅ (brandsList) | — |

## Cart

| Req ID | Requirement | Manual TC | CY | PW | SE | API | Bug(s) |
|---|---|---|---|---|---|---|---|
| CART-01 | Empty cart shows correct state | TC-CART-001 | ✅ | ✅ | — | — | — |
| CART-02 | Add single product to cart | TC-CART-002 | ✅ | ✅ | — | — | — |
| CART-03 | Adding same product increments quantity | TC-CART-003 | ✅ | ✅ | — | — | — |
| CART-04 | Different products appear as separate rows | TC-CART-004 | ✅ | ✅ | — | — | — |
| CART-05 | Remove product from cart | TC-CART-005 | ✅ | ✅ | — | — | — |
| CART-06 | Cart persists across navigation | TC-CART-008 | ✅ | ✅ | — | — | — |
| CART-07 | Cart persists across logout/login | TC-CART-009 | ❌ (documents bug) | ❌ (documents bug) | — | — | **BUG-002** |
| CART-08 | Guest checkout prompts register/login | TC-CART-012 | ✅ | ✅ | — | — | — |

## Checkout & Payment

| Req ID | Requirement | Manual TC | CY | PW | SE | API | Bug(s) |
|---|---|---|---|---|---|---|---|
| CHK-01 | Logged-in user reaches checkout | TC-CHECKOUT-001 | 🚧 | 🚧 | — | — | — |
| CHK-02 | Address details shown correctly | TC-CHECKOUT-002 | 🚧 | — | — | — | — |
| CHK-03 | Order total = sum of line items | TC-CHECKOUT-003 | — | — | — | — | (see SQL §) |
| CHK-04 | Payment form validation | TC-CHECKOUT-006/012/013 | 🚧 | — | — | — | — |
| CHK-05 | Successful payment → confirmation | TC-CHECKOUT-007 | 🚧 | — | — | — | — |

## Production-Site Reliability (banking / classifieds)

| Req ID | Requirement | Manual TC | CY | PW | SE | API | Bug(s) |
|---|---|---|---|---|---|---|---|
| PROD-01 | ABB credit calculator updates on input | — | ✅ | — | — | — | — |
| PROD-02 | ABB currency rates render | — | ✅ | — | — | — | — |
| PROD-03 | ABB site search is resilient | TC-SEARCH-00x | ✅ | — | — | — | — |
| PROD-04 | Rabitabank key pages return 200 + render | TC-RBANK-NAV-* | ✅ | — | — | — | **BUG-004** |
| PROD-05 | Tap.az search & category routes work | TC-TAPAZ-* | ✅ | — | — | — | — |

## Data Integrity (verified via SQL)

| Req ID | Requirement | Verified by | Bug class it guards |
|---|---|---|---|
| DATA-01 | Order total equals sum of line items | `03-sql-queries/qa-validation-queries/01_order_total_integrity.sql` | mischarge |
| DATA-02 | Cart items reference existing products | `02_orphan_cart_items.sql` | checkout crash |
| DATA-03 | Email uniqueness holds | `03_duplicate_user_emails.sql` | ambiguous reset |
| DATA-04 | Stock is non-negative | `04_negative_stock.sql` | overselling |
| DATA-05 | Shipped orders have a timestamp | `05_shipped_without_timestamp.sql` | SLA undercount |

## Accessibility (WCAG 2.1 AA)

| Req ID | Requirement | Verified by | Bug(s) |
|---|---|---|---|
| A11Y-01 | Images have alternative text | `06-playwright-tests/tests/accessibility/*` | **BUG-006** |
| A11Y-02 | No NEW critical violations per page | a11y baseline gate | — |
| A11Y-03 | Form inputs have labels | a11y audit (serious findings logged) | (tracked in AUDIT-RESULTS.md) |

---

## Coverage summary

| Area | Requirements | Fully covered | Partially / planned | Bugs found |
|---|---|---|---|---|
| Authentication | 10 | 8 | 2 (whitespace, SE parity) | 3 |
| Registration | 5 | 2 (API) | 3 (UI automation) | 0 |
| Search | 5 | 4 | 1 | 0 |
| Cart | 8 | 7 | 1 (known bug) | 1 |
| Checkout | 5 | 0 | 5 (planned) | 0 |
| Production reliability | 5 | 5 | 0 | 1 |
| Data integrity | 5 | 5 | 0 | (5 planted, all caught) |
| Accessibility | 3 | 2 | 1 | 1 |
| **Total** | **46** | **33** | **13** | **6** |

## How to read the gaps

- **Checkout (CHK-*)** is the biggest open area — manual test cases exist (TC-CHECKOUT-001..014) but UI automation is planned, not built. This is the honest next-priority for the automation suites.
- **Selenium (SE)** column is sparse on purpose — section `07` is in progress alongside a course. Login is covered; the rest follows the course roadmap.
- **Cart persistence (CART-07)** is deliberately NOT automated as a passing test — doing so would mask **BUG-002**. The ❌ marks intentional, documented non-coverage.

This matrix is the single source of truth for "what's tested, where, and what broke." It's updated whenever a test case, automated spec, or bug report is added.
