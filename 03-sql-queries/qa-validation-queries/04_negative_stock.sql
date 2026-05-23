-- ============================================================
-- QA Validation: Stock counts must be non-negative
--
-- Why this matters: negative inventory usually means a race
-- condition let two concurrent orders deduct from the same
-- stock simultaneously, OR the warehouse-sync job ran with
-- stale data. Customers may have already paid for inventory
-- that doesn't exist.
--
-- This is also a leading indicator of "overselling" — common
-- on flash-sale events where back-end pessimistic locking
-- isn't tight enough.
--
-- Expected result: ZERO rows.
-- ============================================================

SELECT
    id, name, brand_id, category_id, stock
FROM products
WHERE stock < 0
ORDER BY id;
