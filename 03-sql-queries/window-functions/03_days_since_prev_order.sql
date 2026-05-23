-- LAG(): for each order, look back at the user's PREVIOUS order
-- to compute the gap in days. Useful for churn analysis ("how
-- long did this customer go silent before they returned?") and
-- for catching duplicate-submit bugs (gap = 0 seconds).
--
-- created_at is stored as a Unix timestamp (INTEGER seconds).

SELECT
    user_id,
    id                                                   AS order_id,
    created_at,
    LAG(created_at) OVER (
        PARTITION BY user_id
        ORDER BY created_at, id
    )                                                    AS prev_order_at,
    CASE
        WHEN LAG(created_at) OVER (PARTITION BY user_id ORDER BY created_at, id) IS NULL THEN NULL
        ELSE (created_at - LAG(created_at) OVER (PARTITION BY user_id ORDER BY created_at, id)) / 86400
    END                                                  AS days_since_prev_order
FROM orders
ORDER BY user_id, created_at, id;
