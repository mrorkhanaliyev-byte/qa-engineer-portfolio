# BUG-004 — Rabitabank: five customer-facing navigation links return HTTP 404

| Field | Value |
|---|---|
| **ID** | BUG-004 |
| **Title** | Five customer-facing pages return HTTP 404 (broken or renamed links) |
| **Reporter** | Orkhan Aliyev |
| **Date reported** | 2026-05-30 |
| **Status** | Open |
| **Severity** | Major |
| **Priority** | High |
| **Type** | Functional — Broken Links / Navigation |
| **Affects** | https://www.rabitabank.com |
| **Environment** | Chrome 138 / Windows 11 / 1440×900 |
| **Related TC** | [TC-RBANK-NAV-*](../../05-cypress-tests/cypress/e2e/rabitabank/navigation.cy.js) |

## Summary

Five customer-facing URLs on the Rabitabank site return **HTTP 404** instead of rendering their pages. These are paths a user would reach from older bookmarks, search-engine results, or internal links that weren't updated after a site restructure. A bank's product pages (loans, deposits) returning 404 directly costs conversions and erodes trust.

## Affected URLs

| URL | HTTP status | Likely correct path |
|---|---|---|
| `https://www.rabitabank.com/corporate-customer` | 404 | (unknown — needs PO/content team) |
| `https://www.rabitabank.com/about` | 404 | `/about-bank` (returns 200) |
| `https://www.rabitabank.com/individual-customer/loans` | 404 | (unknown) |
| `https://www.rabitabank.com/individual-customer/deposits` | 404 | (unknown) |
| `https://www.rabitabank.com/branches` | 404 | `/filiallar` (returns 200) |

Two of the five have an obvious working equivalent (`/about-bank`, `/filiallar`), suggesting a site restructure left the old slugs without redirects. The other three (corporate, loans, deposits) need the content/product team to confirm the current paths.

## Steps to Reproduce

1. Open a terminal (or browser) and request any affected URL, e.g.:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" https://www.rabitabank.com/about
   ```
2. Observe the response code is `404`.
3. Repeat for the other four URLs in the table above.
4. For contrast, request the working equivalents:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" https://www.rabitabank.com/about-bank   # 200
   curl -s -o /dev/null -w "%{http_code}" https://www.rabitabank.com/filiallar    # 200
   ```

## Expected Result

Either:
- **(a)** The old URLs serve the content (still valid routes), OR
- **(b)** The old URLs issue a `301 Permanent Redirect` to the new slug, preserving bookmarks, SEO ranking, and inbound links.

For a bank, **(b)** is strongly preferred — `/loans` and `/deposits` are high-intent landing pages that likely have inbound marketing links and SEO equity.

## Actual Result

The old URLs return a bare `404`, with no redirect. Any external link, bookmark, or stale internal reference to these paths is dead.

## How this was found

This is a textbook example of why **a real assertion beats a cosmetic one**.

An earlier version of the Rabitabank navigation test (in the Cypress suite) asserted only:

```js
cy.visit(path)
cy.url().should('include', 'rabitabank.com')
```

That assertion **passed on all 10 paths** — including the 5 broken ones — because a 404 error page *still keeps the domain in the URL*. The test was a false-positive generator.

While migrating that test into the portfolio, the assertions were strengthened to verify **HTTP 200 + a rendered, non-empty body**:

```js
cy.request({ url, failOnStatusCode: false }).its('status').should('eq', 200)
cy.get('body').should('be.visible').and('not.be.empty')
```

The strengthened test immediately failed on the 5 broken paths, surfacing this bug. See [`05-cypress-tests/cypress/pages/rabitabank/NavigationPage.js`](../../05-cypress-tests/cypress/pages/rabitabank/NavigationPage.js) for the documented detail.

## Impact

- **Lost conversions** — `/loans` and `/deposits` are product pages; a 404 there sends a ready-to-convert customer to a competitor.
- **SEO equity loss** — without `301` redirects, any ranking these URLs earned is discarded.
- **Broken bookmarks & marketing links** — campaigns or emails linking to old paths now dead-end.
- **Trust** — a bank site throwing 404s on its own product pages reads as neglected.

## Suggested Fix

1. Audit all old routes against the current sitemap.
2. Add `301` redirects from each retired slug to its replacement.
3. For the three with unknown replacements (corporate, loans, deposits), confirm the live paths with the content team and redirect accordingly.
4. Add a CI check (or scheduled monitor) that crawls the published sitemap and flags any non-200 — so the next restructure can't silently break links.

## Notes

- Verified via direct HTTP request (`curl`) and via the automated Cypress navigation suite — both agree.
- This finding is the reason the portfolio's Rabitabank test only covers **verified-reachable** pages; the broken paths are documented here rather than asserted as permanently-404 (which would be a brittle test that breaks the day the bank fixes them).
