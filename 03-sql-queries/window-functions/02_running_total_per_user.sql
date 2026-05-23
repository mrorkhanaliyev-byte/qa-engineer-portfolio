-- SUM() OVER (PARTITION BY ... ORDER BY ...): per-user running
-- total of order spend, ordered by order date.
--
-- Use case: support team gets "I spent X with you so far" claims
-- — this is the query that gives a definitive timeline.

SELECT
    u.id                                    AS user_id,
    u.email,
    o.id                                    AS order_id,
    o.created_at,
    o.total,
    ROUND(SUM(o.total) OVER (
        PARTITION BY u.id
        ORDER BY o.created_at, o.id
    ), 2)                                   AS lifetime_running_total
FROM users u
JOIN orders o ON o.user_id = u.id
ORDER BY u.id, o.created_at, o.id;
