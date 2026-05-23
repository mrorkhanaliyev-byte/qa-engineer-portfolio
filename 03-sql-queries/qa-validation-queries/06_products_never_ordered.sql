-- ============================================================
-- QA Insight: Products that have never been ordered
--
-- Not a "bug" query per se — but a high-value QA insight:
--   * If a product is brand new, expected
--   * If a product is months old and zero orders, the listing
--     may be broken (missing image, wrong category, search index
--     not picking it up, "add to cart" button disabled by JS bug)
--
-- QA can drive a targeted exploratory testing session on these
-- products to find UX/functional gaps the catalog team missed.
--
-- Expected result depends on the dataset — count is the signal.
-- ============================================================

SELECT
    p.id,
    p.name,
    p.price,
    b.name      AS brand,
    c.name      AS category,
    p.stock
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN brands b      ON b.id = p.brand_id
LEFT JOIN categories c  ON c.id = p.category_id
WHERE oi.id IS NULL
ORDER BY p.id;
