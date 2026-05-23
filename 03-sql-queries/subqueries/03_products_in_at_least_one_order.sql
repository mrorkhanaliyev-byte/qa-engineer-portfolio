-- IN subquery: products that have been ordered at least once.
-- Counterpart of qa-validation-queries/06 (products NEVER ordered).
--
-- Pattern: IN (SELECT ...) is the most readable form when the
-- inner query returns a single column. Postgres / MySQL optimize
-- this similarly to EXISTS — choose whichever reads better.

SELECT
    id, name, price
FROM products
WHERE id IN (
    SELECT DISTINCT product_id
    FROM order_items
)
ORDER BY id;
