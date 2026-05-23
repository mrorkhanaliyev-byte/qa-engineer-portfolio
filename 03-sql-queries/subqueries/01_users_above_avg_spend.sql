-- Subquery in WHERE: customers who spent more than the global
-- average per-user spend.
--
-- Pattern: outer query reads from a per-user aggregate, then
-- filters using a scalar subquery that returns the average.
-- This is the right pattern when the "threshold" itself depends
-- on the data and can't be hard-coded.

SELECT
    u.id,
    u.email,
    ROUND(SUM(o.total), 2) AS lifetime_spend
FROM users u
JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.email
HAVING SUM(o.total) > (
    SELECT AVG(per_user_total)
    FROM (
        SELECT SUM(total) AS per_user_total
        FROM orders
        GROUP BY user_id
    )
)
ORDER BY lifetime_spend DESC;
