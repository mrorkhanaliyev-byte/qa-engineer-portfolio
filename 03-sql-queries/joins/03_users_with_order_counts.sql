-- LEFT JOIN: every user with their order count — including
-- users with zero orders (which an INNER JOIN would hide).
--
-- "How many of our users have never placed an order?" is a
-- common QA / product question. The LEFT JOIN + GROUP BY answers
-- it directly: COUNT(o.id) returns 0 for users with no orders
-- (not 1, because COUNT() ignores NULLs).

SELECT
    u.id,
    u.email,
    u.country,
    COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.email, u.country
ORDER BY order_count DESC, u.id;
