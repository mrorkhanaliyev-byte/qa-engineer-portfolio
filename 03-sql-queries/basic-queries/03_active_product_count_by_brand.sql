-- Basic: how many in-stock products does each brand have?
-- "Active" = stock > 0. Useful before a promotion launch to
-- confirm there's inventory to actually promote.

SELECT
    b.name              AS brand,
    COUNT(p.id)         AS active_product_count
FROM brands b
LEFT JOIN products p ON p.brand_id = b.id AND p.stock > 0
GROUP BY b.id, b.name
ORDER BY active_product_count DESC, brand;
