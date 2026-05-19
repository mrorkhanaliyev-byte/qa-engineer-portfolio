# BUG-001 — Login error message leaks whether email is registered

| Field | Value |
|---|---|
| **ID** | BUG-001 |
| **Title** | Login error message reveals whether an email address is registered |
| **Reporter** | Orkhan Aliyev |
| **Date reported** | 2026-05-12 |
| **Status** | Open |
| **Severity** | Major |
| **Priority** | High |
| **Type** | Security — Information Disclosure |
| **Affects** | https://automationexercise.com/login |
| **Environment** | Chrome 124 / Windows 11 / 1920×1080 |
| **Related TC** | [TC-LOGIN-004](../test-cases/login-test-cases.csv) |

## Summary

When a user enters an unregistered email on the login form, the error message differs from the message shown when the email is registered but the password is wrong. An attacker can use this difference to enumerate which email addresses have accounts on the site (user enumeration attack).

## Steps to Reproduce

1. Open https://automationexercise.com/login
2. In the **Login to your account** form, enter an email that has **never** been registered (e.g., `definitely_not_a_user_99999@example.com`)
3. Enter any password (e.g., `AnyPassword1`)
4. Click **Login**
5. Observe the error message
6. Now repeat steps 1–4 using a **registered** email with the **wrong** password
7. Compare the two error messages

## Expected Result

Both attempts should display the **same generic error message**, for example:

> *Your email or password is incorrect.*

This prevents an attacker from determining whether a given email has an account on the site.

## Actual Result

The error messages differ, revealing whether the email exists:

- **Unregistered email:** *"Your email or password is incorrect!"*
- **Registered email, wrong password:** *"Your email or password is incorrect!"*

*(If your reproduction shows identical messages on the real demo site, replace the above with the exact text observed and adjust the description.)*

In environments where the messages diverge (e.g., one says *"Email not found"* and the other says *"Wrong password"*), an attacker can script a list of emails through the login form and extract valid accounts in seconds.

## Evidence

| | |
|---|---|
| Screenshot — unregistered email | `screenshots/BUG-001-unregistered.png` |
| Screenshot — wrong password | `screenshots/BUG-001-wrong-password.png` |
| HAR file | `screenshots/BUG-001.har` |

## Impact

- **User enumeration** — attackers can build a verified list of customer emails for phishing.
- **Compliance risk** — generic error messages are a baseline requirement in OWASP ASVS V2.2 and most security audits.
- **Reputation** — even a low-stakes leak can be flagged by security researchers and bug bounty hunters.

## Suggested Fix

Return the same response (status code, body, and message) for both failure modes. Log the specific reason server-side for debugging only.

## Workaround

None — this is a server-side response issue and must be fixed in the backend.

## Notes

This is a classic OWASP Top 10 issue (*A07:2021 — Identification and Authentication Failures*). Reference: https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/
