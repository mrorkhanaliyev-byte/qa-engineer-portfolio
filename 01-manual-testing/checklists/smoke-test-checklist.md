# Smoke Test Checklist — Automation Exercise

> **Purpose:** Verify that the critical happy paths still work after any deploy.
> **Duration:** ~15 minutes manual / ~3 minutes automated.
> **Run when:** Every deploy to dev / staging / prod, and before kicking off a regression cycle.
> **Stop condition:** If any P0 item fails, halt further testing and raise a Blocker bug immediately.

---

## Pre-flight

- [ ] Site URL is reachable (200 response on `/`)
- [ ] No 5xx errors in browser console on home page
- [ ] HTTPS certificate is valid (no browser warning)
- [ ] Test account credentials are known and accessible

## P0 — Critical Path (must pass)

### Home & Navigation
- [ ] Home page loads in < 3 seconds
- [ ] Header logo, **Home / Products / Cart / Signup-Login / Test Cases / API Testing / Video Tutorials / Contact us** links all render
- [ ] Footer subscription input is visible
- [ ] No console errors visible in DevTools

### Authentication
- [ ] **Signup / Login** link opens the login page
- [ ] Logging in with a known valid account succeeds and redirects to home
- [ ] Header now shows *"Logged in as &lt;username&gt;"*
- [ ] Logout link is visible and clicking it logs the user out

### Product Catalog
- [ ] **Products** page loads and displays at least one product card
- [ ] Clicking a product opens its detail page with image, name, price, availability
- [ ] **Add to cart** button is visible and clickable

### Cart
- [ ] Adding one product from the Products page surfaces the modal *"Added!"*
- [ ] **View Cart** in the modal opens the cart page with the correct product
- [ ] Quantity and price are displayed correctly
- [ ] **X** (remove) button removes the line
- [ ] **Proceed To Checkout** is visible

### Checkout entry
- [ ] **Proceed To Checkout** (logged in) opens the Address Details page
- [ ] **Proceed To Checkout** (logged out) shows the *"Register / Login"* prompt modal

## P1 — Important (run if time allows)

- [ ] Footer subscribe with a valid email shows success message
- [ ] Contact-us page loads and form fields are present
- [ ] Test cases / API testing links open their respective pages
- [ ] Search bar accepts input and returns results

## Post-flight

- [ ] Log any new failures as bug reports with screenshots
- [ ] Update the regression suite if a new gap was discovered
- [ ] Post a one-line *PASS / FAIL* result in the team channel with the build hash

---

## Result template

```
Smoke run — <env> — <date> — build <hash>
Tester: Orkhan Aliyev

P0 items:  X / Y passed
P1 items:  X / Y passed

Issues found:
  - BUG-XXX — short title
  - BUG-XXX — short title

Verdict: PASS / FAIL
```
