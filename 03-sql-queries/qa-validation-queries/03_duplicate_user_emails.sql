-- ============================================================
-- QA Validation: Email address uniqueness
--
-- Why this matters: most apps enforce one-account-per-email at
-- the application layer, but if a race condition or missing DB
-- constraint slips through, two accounts can share an email.
-- Downstream: password resets are ambiguous, login is non-
-- deterministic, GDPR data-export requests are corrupted.
--
-- This query confirms whether the uniqueness invariant holds
-- in production data even if the schema doesn't enforce it.
--
-- Expected result: ZERO rows. If any group has count > 1, file
-- a bug against the registration / signup flow.
-- ============================================================

SELECT
    email,
    COUNT(*)            AS account_count,
    GROUP_CONCAT(id)    AS user_ids
FROM users
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY email;
