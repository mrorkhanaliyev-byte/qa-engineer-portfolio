-- Basic: top 5 most expensive products currently in the catalog.
-- Demonstrates ORDER BY ... DESC + LIMIT — and a sanity check
-- you'd run after a pricing migration to make sure nothing
-- got an extra zero by accident.

SELECT
    id, name, price, stock
FROM products
ORDER BY price DESC, id
LIMIT 5;
