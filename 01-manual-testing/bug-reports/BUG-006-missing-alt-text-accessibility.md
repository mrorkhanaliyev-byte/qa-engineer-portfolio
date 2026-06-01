# BUG-006 — Navigation images lack alternative text (WCAG 2.1 A failure)

| Field | Value |
|---|---|
| **ID** | BUG-006 |
| **Title** | `<img>` elements in the navbar have no `alt` attribute — invisible to screen readers |
| **Reporter** | Orkhan Aliyev |
| **Date reported** | 2026-05-30 |
| **Status** | Open |
| **Severity** | Major |
| **Priority** | High |
| **Type** | Accessibility — WCAG 2.1 Level A (1.1.1 Non-text Content) |
| **Affects** | https://www.demoblaze.com/ (navbar logo) — same class on Automation Exercise pages |
| **Environment** | Found via automated axe-core audit (Chromium); rule is browser-independent |
| **Related TC** | Accessibility audit — [`06-playwright-tests/AUDIT-RESULTS.md`](../../06-playwright-tests/AUDIT-RESULTS.md) |

## Summary

The site's navigation contains `<img>` elements with no `alt` attribute. Screen readers either skip these images entirely or announce the raw file name (e.g. *"PIC underscore one PNG"*), giving blind and low-vision users no idea what the image is. For a logo that doubles as the home link, this means a screen-reader user can't tell what the link does. This is a **WCAG 2.1 Level A** failure — the most basic conformance tier.

## How it was found

Detected by the automated accessibility audit in the portfolio's Playwright suite ([`tests/accessibility/demoblaze.a11y.spec.ts`](../../06-playwright-tests/tests/accessibility/demoblaze.a11y.spec.ts)), which runs `@axe-core/playwright` against the page. axe reported:

```
CRITICAL: [image-alt] Images must have alternative text (×2, #nava > img)
  https://dequeuniversity.com/rules/axe/4.x/image-alt
```

The same `image-alt` rule fires on Automation Exercise pages too — see the findings table in [`AUDIT-RESULTS.md`](../../06-playwright-tests/AUDIT-RESULTS.md).

## Steps to Reproduce

**Option A — automated (how it was found):**
```bash
cd 06-playwright-tests
npm run test:a11y
# Inspect playwright-report/a11y-findings-ae.json, or the console output,
# for the "image-alt" rule.
```

**Option B — manual, in the browser:**
1. Open https://www.demoblaze.com/
2. Open DevTools → Elements
3. Inspect the navbar logo image (`#nava > img`)
4. Confirm the `<img>` has **no** `alt` attribute
5. (Optional) Turn on a screen reader (NVDA / VoiceOver) and Tab to the logo — note it announces nothing meaningful

## Expected Result

Every `<img>` has an appropriate `alt`:
- **Meaningful images** (the logo): `alt="Demoblaze home"` — describes the destination, since the logo is a home link.
- **Purely decorative images:** `alt=""` (empty) so screen readers skip them deliberately rather than reading the filename.

## Actual Result

The navbar `<img>` elements have no `alt` attribute at all, so assistive technology falls back to the file name or silence. WCAG 2.1 SC 1.1.1 (Level A) is not met.

## Impact

- **Blind / low-vision users** can't identify the logo-as-home-link — a core navigation element.
- **Legal exposure** — WCAG 2.1 AA is the reference standard for the EU Accessibility Act (in force 2025), the US ADA (case law), Section 508, and most public-sector procurement. A Level **A** failure is the easiest kind to be cited for.
- **SEO** — `alt` text is also read by search-engine crawlers; missing it is a minor SEO loss on top of the accessibility issue.

## Severity vs Priority rationale

- **Severity = Major:** it fully blocks one user group (screen-reader users) from a core element, but doesn't crash the app for everyone.
- **Priority = High:** the fix is trivial (one attribute per image) and the reach is large (every assistive-tech user on every page load).

## Suggested Fix

```html
<!-- Logo that links to home -->
<img src="/imgs/logo.png" alt="Demoblaze home">

<!-- Decorative-only image -->
<img src="/imgs/divider.png" alt="">
```

Then re-run `npm run test:a11y` and lower the per-page `image-alt` count in the baseline to lock in the fix.

## Notes

- This is a recurring rule across the audited sites, not a one-off — which is exactly why an automated axe gate in CI is valuable: it catches the whole class, not one instance.
- The portfolio's accessibility suite uses a **baseline-as-regression-gate** policy, so this known issue doesn't fail CI today — but the moment a developer adds *another* alt-less image, the count grows past baseline and CI flags it.
