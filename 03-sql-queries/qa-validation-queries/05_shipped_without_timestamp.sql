-- ============================================================
-- QA Validation: Shipped orders must have a shipped_at timestamp
--
-- Why this matters: order status transitions and the audit
-- columns that record them must stay in sync. An order marked
-- 'shipped' without `shipped_at` populated means either:
--   (a) the status was updated manually (bypassing the trigger
--       that sets the timestamp) — process violation
--   (b) the trigger / service is broken — code bug
-- Either way, customer support can't answer "when was it shipped?"
-- and shipping-SLA reports will undercount.
--
-- Expected result: ZERO rows.
-- ============================================================

SELECT
    id          AS order_id,
    user_id,
    status,
    shipped_at,
    created_at
FROM orders
WHERE status = 'shipped' AND shipped_at IS NULL
ORDER BY id;
