-- ============================================================
-- QA Validation: Cart items must point to existing products
--
-- Why this matters: an orphan cart_item references a product
-- that no longer exists in the catalog (deleted, archived, or
-- never inserted in the first place). When the user clicks
-- "checkout" the application either crashes or silently drops
-- the line — both are bugs.
--
-- The cart_items table intentionally has NO FK on product_id
-- in the schema, mirroring real-world lax schemas. This query
-- is the safety net.
--
-- Expected result: ZERO rows on a healthy system.
-- ============================================================

SELECT
    ci.id          AS cart_item_id,
    ci.cart_id,
    ci.product_id  AS missing_product_id,
    ci.quantity
FROM cart_items ci
LEFT JOIN products p ON p.id = ci.product_id
WHERE p.id IS NULL
ORDER BY ci.id;
