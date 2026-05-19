# BUG-003 — Login fails when email is pasted with leading/trailing whitespace

| Field | Value |
|---|---|
| **ID** | BUG-003 |
| **Title** | Login fails when email contains leading or trailing whitespace from paste |
| **Reporter** | Orkhan Aliyev |
| **Date reported** | 2026-05-14 |
| **Status** | Open |
| **Severity** | Minor |
| **Priority** | Medium |
| **Type** | Functional — Input Sanitization / UX |
| **Affects** | https://automationexercise.com/login |
| **Environment** | Chrome 124 / Windows 11 / 1920×1080 |
| **Related TC** | (No existing TC — add as TC-LOGIN-013) |

## Summary

When a user copies their email address from another application (e.g., a password manager that selects the surrounding line, or an email signature) and pastes it into the login form, leading or trailing whitespace is preserved. The server treats `" qa_orkhan@test.com "` as a different value from `"qa_orkhan@test.com"` and rejects the login with a generic *"Your email or password is incorrect"* error, leaving the user confused.

## Steps to Reproduce

1. Open https://automationexercise.com/login
2. In any text editor, type: ` qa_orkhan@test.com ` (note the leading and trailing spaces)
3. Select the entire string including spaces and copy it
4. Paste it into the **Email Address** field on the login form
5. Enter the correct password
6. Click **Login**

## Expected Result

The form should automatically `.trim()` whitespace from the email field on input or on submit, so the login succeeds despite the accidental spaces. This is standard practice in modern login forms.

## Actual Result

Login fails with the generic *"Your email or password is incorrect!"* message. The user has no way to know that whitespace is the cause — the spaces are invisible inside the input field.

## Evidence

| | |
|---|---|
| Screenshot — pasted value with spaces (DOM inspector) | `screenshots/BUG-003-paste-with-spaces.png` |
| Screenshot — error message | `screenshots/BUG-003-error.png` |

## Impact

- **User frustration** — affected users believe their password is wrong, attempt to reset it, and may abandon the login flow.
- **Increased support load** — "I can't log in" tickets that turn out to be invisible whitespace.
- **Common with password managers** — many password managers (1Password, Bitwarden) trim whitespace on their side, but users who copy from email signatures, Slack, or other apps do not get this protection.

## Suggested Fix

In the email input handler, apply `value.trim()` on:
1. The `paste` event (preferred — fixes it before the user even submits)
2. The `submit` event (backup safety net)

A two-line change in JS. Server-side should also `trim()` defensively before lookup.

## Workaround

User can manually click into the email field and use `Ctrl+A`, then retype — but this defeats the purpose of paste.

## Notes

- Not reproducible if the user *types* the email manually.
- The password field has the same issue but trimming password is **dangerous** — some users intentionally use trailing spaces in passwords. Recommend trimming email only.
