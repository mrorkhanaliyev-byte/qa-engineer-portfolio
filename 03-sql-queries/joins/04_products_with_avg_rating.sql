-- LEFT JOIN + AVG: each product with its review count and average
-- rating, including products with no reviews (which show as NULL).
--
-- Used during release validation: a product whose average rating
-- suddenly drops after a redesign is a signal something visible
-- broke. The LEFT JOIN keeps un-reviewed products on the report
-- so they aren't silently filtered out.

SELECT
    p.id,
    p.name              AS product,
    COUNT(r.id)         AS review_count,
    ROUND(AVG(r.rating), 2) AS avg_rating
FROM products p
LEFT JOIN reviews r ON r.product_id = p.id
GROUP BY p.id, p.name
HAVING COUNT(r.id) > 0
ORDER BY avg_rating DESC, review_count DESC, p.id;
