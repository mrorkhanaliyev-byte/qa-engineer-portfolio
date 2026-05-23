-- INNER JOIN: every order with the customer who placed it.
-- Default investigation query: "show me all orders and who they
-- belong to" — used dozens of times a week in support / QA work.

SELECT
    o.id                                AS order_id,
    o.status,
    o.total,
    u.email                             AS customer_email,
    u.country
FROM orders o
INNER JOIN users u ON u.id = o.user_id
ORDER BY o.id;
