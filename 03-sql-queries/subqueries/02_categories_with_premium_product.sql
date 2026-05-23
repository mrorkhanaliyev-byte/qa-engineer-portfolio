-- EXISTS: top-level categories that contain at least one product
-- priced above $50. EXISTS short-circuits as soon as it finds a
-- match, making it ideal when you only care about "is there any?"
-- rather than counting all matches.

SELECT
    c.id, c.name
FROM categories c
WHERE EXISTS (
    SELECT 1
    FROM products p
    WHERE p.category_id = c.id
      AND p.price > 50
)
ORDER BY c.id;
