# BUG-002 — Cart contents are lost after logout and login

| Field | Value |
|---|---|
| **ID** | BUG-002 |
| **Title** | Cart contents are lost when user logs out and logs back in |
| **Reporter** | Orkhan Aliyev |
| **Date reported** | 2026-05-13 |
| **Status** | Open |
| **Severity** | Major |
| **Priority** | High |
| **Type** | Functional — Data Persistence |
| **Affects** | https://automationexercise.com/view_cart |
| **Environment** | Chrome 124, Firefox 125 / Windows 11 |
| **Related TC** | [TC-CART-009](../test-cases/cart-test-cases.csv) |

## Summary

When a logged-in user adds products to their cart, logs out, and then logs back in with the same account, the cart appears empty. Expected behavior is that the cart is persisted server-side and restored on the next login.

## Steps to Reproduce

1. Open https://automationexercise.com
2. Log in with a valid account: `qa_orkhan@test.com / Test@1234`
3. Navigate to **Products**
4. Add 2 different products to the cart (e.g., *Blue Top*, *Men Tshirt*)
5. Click **Cart** in the header and verify both items are present
6. Click **Logout** in the header
7. Log back in with the **same** account
8. Click **Cart** in the header

## Expected Result

The cart still contains *Blue Top* and *Men Tshirt* with quantity 1 each. Customers expect cart contents to be tied to their account and follow them across sessions and devices.

## Actual Result

The cart shows *"Cart is empty!"*. All previously added items are lost.

## Evidence

| | |
|---|---|
| Screenshot — cart before logout | `screenshots/BUG-002-cart-before-logout.png` |
| Screenshot — cart after re-login | `screenshots/BUG-002-cart-after-relogin.png` |
| Screen recording | `screenshots/BUG-002-recording.mp4` |

## Impact

- **Lost sales** — users who get interrupted (closing the laptop, switching devices) lose their selections and may abandon the purchase.
- **Bad UX** — modern e-commerce sites (Amazon, Shopify, etc.) all persist cart contents across sessions; users expect this baseline.
- **Cross-device flow broken** — a user adding items on mobile and continuing on desktop cannot do so.

## Root-Cause Hypothesis (for triage)

Cart appears to be stored only in the browser session (cookie or `localStorage`) and is cleared on logout. Server-side persistence keyed by `user_id` is likely missing or not being read on login.

## Suggested Fix

Persist cart contents server-side under the authenticated user's ID. On login, merge any guest-session cart with the persisted server cart (de-duplicate by product ID, sum quantities).

## Workaround

Advise users not to log out before completing checkout. Not a real solution — only a stopgap.

## Notes

- Verified on Chrome 124 (Win11), Firefox 125 (Win11), and Edge 124 (Win11) — reproducible on all three.
- Not affected by browser cache clearing — the behavior is the same on a clean profile.
