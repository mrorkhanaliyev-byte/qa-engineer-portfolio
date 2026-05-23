-- ============================================================
-- QA Validation: Order total must equal sum of line items
--
-- Why this matters: a mismatch between the stored `orders.total`
-- and the sum of `order_items.quantity * unit_price` means the
-- customer was charged a different amount than what their cart
-- actually contained. This is a high-severity correctness bug.
--
-- Expected result: ZERO rows in a clean dataset. If any row
-- comes back, the application has a checkout-total drift bug.
--
-- Tolerance: 0.01 to allow for harmless float rounding.
-- ============================================================

SELECT
    o.id                                              AS order_id,
    o.total                                           AS reported_total,
    ROUND(SUM(oi.quantity * oi.unit_price), 2)        AS calculated_total,
    ROUND(o.total - SUM(oi.quantity * oi.unit_price), 2) AS variance
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.total
HAVING ABS(o.total - SUM(oi.quantity * oi.unit_price)) > 0.01
ORDER BY o.id;
