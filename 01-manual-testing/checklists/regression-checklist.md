# Regression Checklist — Automation Exercise

> **Purpose:** Verify that *existing* features still work after any non-trivial change (refactor, dependency bump, infra migration, multi-feature release).
> **Scope:** Broader than smoke — every module exercised at least once. Lighter than full re-execution of all 60+ test cases.
> **Duration:** ~90 minutes manual / ~15 minutes automated.
> **Run when:** Before promoting a release candidate to staging or production. Nightly in CI.

---

## How to read this checklist

- **[ ]** = item to verify. Tick when passed.
- Each item is a **representative** check — it does not replace the full test suite for that module.
- If any **P0** item fails, stop the regression run and raise a Blocker.
- If a **P1** item fails, continue but flag it; ship decision is product-led.

---

## 1. Authentication (full suite: `login-test-cases.csv`)

- [ ] **P0** Valid login redirects to home with `Logged in as` in header
- [ ] **P0** Invalid password shows generic error, stays on login page
- [ ] **P0** Logout returns user to home as guest
- [ ] **P1** Empty form submission triggers HTML5 validation
- [ ] **P1** Email field is case-insensitive
- [ ] **P2** Password input is masked (security check)

## 2. Registration (full suite: `registration-test-cases.csv`)

- [ ] **P0** New account can be created end-to-end and user is auto-logged-in
- [ ] **P0** Duplicate email returns `Email Address already exist!`
- [ ] **P0** `Delete Account` flow removes the user and returns to logged-out state
- [ ] **P1** Required fields on account info page block submit when empty
- [ ] **P2** Newsletter checkbox state is honored

## 3. Product Catalog & Search (full suite: `product-search-test-cases.csv`)

- [ ] **P0** `/products` loads with at least one product card
- [ ] **P0** Search with a known term returns matching products
- [ ] **P0** Clicking a product opens its detail page
- [ ] **P1** Category sidebar filters correctly
- [ ] **P1** Brand sidebar filters correctly
- [ ] **P1** Empty-result search shows empty state, no crash
- [ ] **P2** Search is case-insensitive
- [ ] **P2** Special characters in search do not break the page

## 4. Cart (full suite: `cart-test-cases.csv`)

- [ ] **P0** Adding a product from `/products` lands it in `/view_cart`
- [ ] **P0** Adding the same product twice increments quantity
- [ ] **P0** Removing a product removes the row and updates totals
- [ ] **P0** Cart persists across page navigation within the same session
- [ ] **P1** Different products appear as separate rows
- [ ] **P1** Empty cart shows correct message and CTA
- [ ] **P1** Cart persists across logout/login *(known bug: BUG-002)*

## 5. Checkout & Payment (full suite: `checkout-test-cases.csv`)

- [ ] **P0** `Proceed To Checkout` (logged in) opens `/checkout` with address + order review
- [ ] **P0** `Proceed To Checkout` (logged out) shows register/login modal
- [ ] **P0** Address card displays the data entered at registration
- [ ] **P0** `Place Order` navigates to `/payment`
- [ ] **P0** Valid card details produce `ORDER PLACED!` confirmation
- [ ] **P0** After confirmation the cart is empty
- [ ] **P1** Invoice download works
- [ ] **P1** Empty payment form blocks submit with validation
- [ ] **P2** Expired year is rejected
- [ ] **P2** XSS in comment field is escaped on confirmation

## 6. Cross-cutting / non-functional

- [ ] **P0** Site has no 5xx errors across the regression run (check DevTools network tab)
- [ ] **P0** No JS errors in browser console on Home / Products / Cart / Checkout
- [ ] **P1** Header navigation works on every page (Home, Products, Cart, Login, Contact Us)
- [ ] **P1** Footer subscribe email shows success message with valid input
- [ ] **P1** Layout renders correctly at 1920×1080, 1440×900, 375×667 (mobile)
- [ ] **P2** Chrome, Firefox, and Edge produce the same behavior on the P0 path

## 7. Known issues (re-verify each run)

- [ ] **BUG-001** Login error message — still leaking user existence? *(if fixed, close ticket)*
- [ ] **BUG-002** Cart not persisted across logout/login? *(if fixed, close ticket)*
- [ ] **BUG-003** Email field does not trim whitespace on paste? *(if fixed, close ticket)*

---

## Result template

```
Regression run — <env> — <date> — build <hash>
Tester: Orkhan Aliyev
Duration: <minutes>

Module          P0 pass    P1 pass    P2 pass
Auth            X/Y        X/Y        X/Y
Registration    X/Y        X/Y        X/Y
Search          X/Y        X/Y        X/Y
Cart            X/Y        X/Y        X/Y
Checkout        X/Y        X/Y        X/Y
Cross-cutting   X/Y        X/Y        X/Y

New defects opened:
  - BUG-XXX — title — severity

Existing defects re-verified:
  - BUG-001 — still reproducible
  - BUG-002 — still reproducible
  - BUG-003 — FIXED in this build, ticket closed

Verdict: GO / NO-GO for release
Sign-off: Orkhan Aliyev (QA), <name> (PO)
```
