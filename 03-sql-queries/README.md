# 03 — SQL for QA

SQL is one of the most underrated tools in QA. This section shows how I use it for **data validation, test setup, and bug investigation**.

## Why a QA Engineer Needs SQL

| Use Case | Example |
|---|---|
| **Test data setup** | Create 50 users with specific roles before a regression run |
| **Data integrity validation** | Verify the order total in the DB matches the value shown in the UI |
| **Bug triage** | Find which user IDs are affected by a checkout failure |
| **Coverage analysis** | Identify which product categories have zero orders this month |
| **Cleanup** | Remove test data after automation runs |

## Contents

| Folder | Description |
|---|---|
| [schema/](./schema/) | Sample e-commerce database schema (DDL) |
| [basic-queries/](./basic-queries/) | SELECT, WHERE, ORDER BY, LIMIT |
| [joins/](./joins/) | INNER / LEFT / RIGHT / FULL OUTER joins |
| [subqueries/](./subqueries/) | Correlated subqueries, EXISTS, IN |
| [window-functions/](./window-functions/) | ROW_NUMBER, RANK, LAG, LEAD, running totals |
| [qa-validation-queries/](./qa-validation-queries/) | **Real QA scenarios** — order totals, inventory checks, referential integrity |

## Example Validation Query

```sql
-- Verify every order's total matches the sum of its line items.
-- If this returns rows, we have a data-integrity bug.
SELECT
  o.order_id,
  o.total       AS reported_total,
  SUM(oi.qty * oi.unit_price) AS calculated_total,
  o.total - SUM(oi.qty * oi.unit_price) AS variance
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY o.order_id, o.total
HAVING ABS(o.total - SUM(oi.qty * oi.unit_price)) > 0.01;
```

## Database Used

A local MySQL 8 instance with the [Sakila](https://dev.mysql.com/doc/sakila/en/) sample schema, extended with an e-commerce overlay (orders, products, cart_items).
