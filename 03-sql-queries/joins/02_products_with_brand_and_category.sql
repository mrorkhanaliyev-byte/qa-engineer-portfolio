-- 3-way INNER JOIN: products with their brand AND category names.
-- The catalog page renders all three together; this is what the
-- ORM would emit behind the scenes. QA uses this to sanity-check
-- the catalog migration / re-indexing job.

SELECT
    p.id,
    p.name      AS product_name,
    b.name      AS brand,
    c.name      AS category,
    p.price,
    p.stock
FROM products p
INNER JOIN brands     b ON b.id = p.brand_id
INNER JOIN categories c ON c.id = p.category_id
ORDER BY p.id;
