-- ROW_NUMBER() OVER (PARTITION BY ...): the classic "top N per
-- group" pattern. For each category, return the 3 priciest
-- products.
--
-- Without window functions you'd need a correlated subquery per
-- row — much slower at scale. With ROW_NUMBER() it's a single
-- pass.

WITH ranked AS (
    SELECT
        p.id,
        p.name,
        p.price,
        c.name AS category,
        ROW_NUMBER() OVER (
            PARTITION BY p.category_id
            ORDER BY p.price DESC, p.id
        ) AS rank_in_category
    FROM products p
    JOIN categories c ON c.id = p.category_id
)
SELECT
    category, rank_in_category, id, name, price
FROM ranked
WHERE rank_in_category <= 3
ORDER BY category, rank_in_category;
