# BUG-005 — Demoblaze login API enables username enumeration

| Field | Value |
|---|---|
| **ID** | BUG-005 |
| **Title** | Login API returns distinct errors for "user not found" vs "wrong password" |
| **Reporter** | Orkhan Aliyev |
| **Date reported** | 2026-05-30 |
| **Status** | Open |
| **Severity** | Major |
| **Priority** | High |
| **Type** | Security — Information Disclosure (User Enumeration) |
| **Affects** | `POST https://api.demoblaze.com/login` (used by https://www.demoblaze.com/) |
| **Environment** | API-level — reproducible with `curl`; browser-independent |
| **Related TC** | [TC-LOGIN-005, TC-LOGIN-006](../test-cases/login-test-cases.csv) |
| **Related** | Same class as [BUG-001](./BUG-001-login-error-message-leaks-user-existence.md) (Automation Exercise UI) — this one is at the **API** layer of a different site |

## Summary

The Demoblaze login API returns **different error messages** depending on whether the submitted username exists. An attacker can submit a list of candidate usernames and read the response to learn which accounts are real — a classic **username enumeration** vulnerability. Enumerated accounts become targets for credential-stuffing and password-spray attacks.

## Steps to Reproduce

The Demoblaze frontend base64-encodes the password before POSTing. Reproduce directly against the API:

```bash
# 1. A username that does NOT exist
curl -s -X POST "https://api.demoblaze.com/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"nonexistent_xyz_999","password":"dGVzdA=="}'
# → {"errorMessage":"User does not exist."}

# 2. A username that DOES exist, with the wrong password
curl -s -X POST "https://api.demoblaze.com/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"qatestuser","password":"d3JvbmdwYXNz"}'
# → {"errorMessage":"Wrong password."}
```

The two responses differ. `qatestuser` is confirmed to exist (it returns *"Wrong password."* rather than *"User does not exist."*).

## Expected Result

For **both** cases the API should return an **identical, generic** error, e.g.:

```json
{"errorMessage":"Invalid username or password."}
```

This prevents an attacker from distinguishing "this username exists" from "this username does not."

## Actual Result

| Input | Response |
|---|---|
| Non-existent username | `{"errorMessage":"User does not exist."}` |
| Existing username, wrong password | `{"errorMessage":"Wrong password."}` |

The differing messages let an attacker enumerate valid usernames at scale by scripting requests through a username wordlist.

## Impact

- **Username enumeration** — an attacker can build a verified list of real accounts in seconds with a simple loop.
- **Amplifies credential stuffing** — knowing which usernames are valid focuses a password-spray attack on real targets, raising its success rate.
- **No rate-limit observed** — the endpoint answered repeated automated requests without throttling or CAPTCHA, making enumeration cheap. *(Worth a separate ticket: add rate limiting / lockout.)*

## Severity vs Priority rationale

- **Severity = Major:** it's an information-disclosure flaw, not a full account takeover on its own, but it materially weakens authentication security.
- **Priority = High:** the fix is small (one generic message) and it's a well-known finding any security review or bug-bounty hunter would flag immediately.

## Suggested Fix

1. Return one generic error string for both failure modes (`"Invalid username or password."`).
2. Log the specific reason server-side only, for debugging.
3. Add rate limiting / exponential backoff on repeated failures from the same IP.
4. Consider a CAPTCHA after N failed attempts.

## Notes

- Reference: OWASP *A07:2021 — Identification and Authentication Failures*, and OWASP WSTG-IDNT-04 (Testing for Account Enumeration).
- This is the **API-layer** counterpart to BUG-001 (which describes the same vulnerability class in the Automation Exercise **UI**). Documenting both shows the issue isn't site-specific — it's a recurring authentication anti-pattern worth checking on every project.
- The portfolio's Cypress and Playwright login specs (`TC-LOGIN-005`, `TC-LOGIN-006`) already assert the *current* alert text, so they document the present behavior; if the site fixes this, those assertions are the regression signal.
