# BUG-001 — Signup form reveals whether an email is already registered

| Field | Value |
|---|---|
| **ID** | BUG-001 |
| **Title** | Signup form leaks account existence via "Email Address already exist!" (user enumeration) |
| **Reporter** | Orkhan Aliyev |
| **Date reported** | 2026-05-12 |
| **Last verified** | 2026-07-04 |
| **Status** | Open |
| **Severity** | Major |
| **Priority** | High |
| **Type** | Security — Information Disclosure (User Enumeration) |
| **Affects** | https://automationexercise.com/signup (the "New User Signup" form on `/login`) |
| **Environment** | Chrome 138 / Windows 11 / 1920×1080; also reproducible with `curl` |
| **Related TC** | [TC-REG-004](../test-cases/registration-test-cases.csv) |
| **Related** | Same class as [BUG-005](./BUG-005-demoblaze-api-user-enumeration.md) (Demoblaze **API** layer) — this one is the **UI** layer of a different site |

## Summary

The **New User Signup** form (name + email) returns a different response depending on whether the submitted email is already registered. An attacker can submit a list of candidate emails and read the response to learn which addresses have accounts — a classic **user enumeration** vulnerability. Enumerated accounts become targets for phishing, credential-stuffing, and password-spray attacks.

> **Note on the login form:** I first suspected the *login* form leaked this (see the original title of this ticket). On re-testing (2026-07-04), the login form is actually **safe** — it returns the same generic *"Your email or password is incorrect!"* for both an unregistered email and a registered email with the wrong password (verified — see [TC-LOGIN-004](../test-cases/login-test-cases.csv)). The real leak is on the **signup** form, documented below. Keeping the ticket ID and re-scoping it rather than opening a new one.

## Steps to Reproduce

1. Open https://automationexercise.com/login
2. In the **New User Signup** box, enter any name and an email that is **already registered** (e.g. `qa_orkhan@test.com`)
3. Click **Signup**
4. Observe the response
5. Repeat steps 1–3 with an email that has **never** been registered (e.g. `no_such_user_zz9@example.com`)
6. Compare the two responses

### Reproduce directly against the server (`curl`)

```bash
# 1. Grab a CSRF token + session cookie
csrf=$(curl -s -c cookies.txt https://automationexercise.com/login \
  | grep -o 'csrfmiddlewaretoken" value="[^"]*"' | head -1 | sed 's/.*value="//;s/"//')

# 2. Already-registered email  → leaks existence
curl -s -b cookies.txt -e https://automationexercise.com/login \
  -d "csrfmiddlewaretoken=$csrf&name=X&email=qa_orkhan@test.com&form_type=signup" \
  https://automationexercise.com/signup | grep -o 'color: red;">[^<]*'
# → color: red;">Email Address already exist!

# 3. Unregistered email  → proceeds to the account form (no error)
curl -s -b cookies.txt -e https://automationexercise.com/login \
  -d "csrfmiddlewaretoken=$csrf&name=X&email=no_such_user_zz9@example.com&form_type=signup" \
  https://automationexercise.com/signup | grep -o 'Enter Account Information'
# → Enter Account Information
```

## Expected Result

The signup flow should not reveal whether an email is already registered to an unauthenticated user. Standard mitigations:

- Show the **same neutral outcome** regardless of whether the email exists (e.g. *"If this email can be registered, continue below"* / send a verification email either way), **or**
- Require email verification before disclosing account state, so a bare "already exists" response is never returned pre-verification.

## Actual Result

The two paths are trivially distinguishable:

| Input | Response |
|---|---|
| Already-registered email | `Email Address already exist!` (red text, stays on `/login`) |
| Unregistered email | Proceeds to **"Enter Account Information"** (`/signup`) |

An attacker can script a wordlist of emails through the signup endpoint and harvest the valid ones in seconds.

## Evidence

| | |
|---|---|
| Screenshot — registered email → "already exist!" | `screenshots/BUG-001-registered-exists.png` |
| Screenshot — unregistered email → account form | `screenshots/BUG-001-unregistered-proceeds.png` |
| `curl` transcript | reproduced 2026-07-04 (commands above) |

> Screenshots are placeholders until captured; the `curl` reproduction above is self-contained and does not need them.

## Impact

- **User enumeration** — attackers can build a verified list of customer emails for phishing and credential stuffing.
- **Compliance risk** — generic, non-disclosing responses are a baseline requirement in OWASP ASVS V2.2 and most security audits.
- **Reputation** — even a low-stakes leak is routinely flagged by security researchers and bug-bounty hunters.

## Suggested Fix

Return an identical, non-disclosing response for both cases at the signup step, and move any "email already in use" feedback behind an email-verification step so it is never exposed to an anonymous requester.

## Notes

This is a classic OWASP issue (*A07:2021 — Identification and Authentication Failures*). Reference: https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/

The same vulnerability class appears at the **API** layer on a different site — see [BUG-005](./BUG-005-demoblaze-api-user-enumeration.md). Reporting both as one **theme** (a standing "check auth responses for enumeration" checklist item) is more useful than treating them as two isolated tickets.
