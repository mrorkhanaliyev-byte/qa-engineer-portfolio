# 03 — SQL for QA

A working SQLite database, 19 hand-written queries, and a CI runner that proves each query returns exactly the result a QA engineer would expect. The whole section is reproducible from a clean checkout in under 5 seconds.

[![SQL Queries](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/sql.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/sql.yml)

![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)

---

## Why SQL is in a QA Portfolio

In every QA role I've held, the most under-asked-for skill on day one is SQL. UI automation gets the spotlight, but the day a customer reports "I was charged $50 but my cart was $45" you need to *find* the order, *prove* the discrepancy, and *quantify* the blast radius — and the only tool that does all three in one query is SQL.

This section documents the SQL patterns I actually use as a tester:

| Use case | Example here |
|---|---|
| **Set up test data** for a deterministic regression run | `schema/02_seed_data.sql` — 20 users, 30 products, 15 orders, etc. |
| **Validate data integrity** after a release | `qa-validation-queries/` — 6 queries that catch real bug classes |
| **Investigate** a customer support ticket | `joins/01_orders_with_user.sql`, `window-functions/03_days_since_prev_order.sql` |
| **Analyze coverage gaps** in catalog / orders | `qa-validation-queries/06_products_never_ordered.sql` |
| **Profile** a user / order over time | `window-functions/02_running_total_per_user.sql` |

---

## The Schema in One Picture

```
                ┌─────────────┐         ┌─────────────┐
                │   brands    │         │ categories  │
                └──────┬──────┘         └──────┬──────┘
                       │                       │
                       └──────┬────────────────┘
                              ▼
┌──────────┐         ┌──────────────┐         ┌──────────┐
│  users   │────┐    │   products   │────┐    │ reviews  │
└────┬─────┘    │    └──────┬───────┘    │    └──────────┘
     │          │           │            │
     ▼          ▼           ▼            ▼
┌─────────┐ ┌──────┐  ┌──────────────┐ ┌──────────┐
│ orders  │ │carts │  │ order_items  │ │cart_items│
└────┬────┘ └───┬──┘  └──────────────┘ └──────────┘
     │          │
     └──────────┴───── linked via FK
```

See [`schema/01_schema.sql`](./schema/01_schema.sql) for the full DDL.

---

## The Planted Bugs

Seed data ships with **five intentional data quality issues** so the validation queries actually find something:

| # | Bug | Found by | Why it matters |
|---|---|---|---|
| 1 | Order total `$50` ≠ line items `$52.50` | `qa-validation-queries/01_order_total_integrity.sql` | Customer charged the wrong amount |
| 2 | Two users share `dup@test.com` | `qa-validation-queries/03_duplicate_user_emails.sql` | Password resets become ambiguous |
| 3 | Cart item points to nonexistent product 999 | `qa-validation-queries/02_orphan_cart_items.sql` | Checkout will crash or silently drop the item |
| 4 | Product 26 has `stock = -3` | `qa-validation-queries/04_negative_stock.sql` | Overselling — customer paid for inventory we don't have |
| 5 | Order 13 marked `shipped` with `shipped_at = NULL` | `qa-validation-queries/05_shipped_without_timestamp.sql` | Shipping-SLA reports undercount; support can't answer "when?" |

Each `.sql` has a clear "why this matters" header explaining the failure mode it catches. The CI runner asserts the expected (planted) result.

---

## Query Inventory — 19 queries, all CI-verified

| Folder | Queries | Topics covered |
|---|---|---|
| [`basic-queries/`](./basic-queries/)             | 3 | SELECT, WHERE, ORDER BY, LIMIT, LEFT JOIN + GROUP BY |
| [`joins/`](./joins/)                             | 4 | INNER, LEFT, 3-way, aggregation across joins |
| [`subqueries/`](./subqueries/)                   | 3 | Scalar subquery in HAVING, EXISTS, IN |
| [`window-functions/`](./window-functions/)       | 3 | `ROW_NUMBER OVER PARTITION BY`, running `SUM`, `LAG` |
| [`qa-validation-queries/`](./qa-validation-queries/) | 6 | Real QA scenarios — integrity, orphans, duplicates, drift |

Every query has a sibling `.expected` file with the exact pipe-separated output. The CI runner diffs actual vs expected for each one.

---

## Running Locally

You need **Python 3** (no other dependencies — Python ships with `sqlite3`):

```bash
cd 03-sql-queries
python scripts/run_all_queries.py
```

Expected output ends with:

```
========================================================
  Passed:  19 / 19
  Failed:  0
========================================================
```

If you change a query and the new behavior is intentional, regenerate the expected outputs:

```bash
python scripts/run_all_queries.py --regen
```

### Inspecting individual queries

The schema and seed work with any SQLite tool — DBeaver, DB Browser for SQLite, the `sqlite3` CLI, etc.:

```bash
sqlite3 portfolio.db < schema/01_schema.sql
sqlite3 portfolio.db < schema/02_seed_data.sql
sqlite3 portfolio.db < qa-validation-queries/01_order_total_integrity.sql
```

---

## Project Structure

```
03-sql-queries/
├── README.md
├── schema/
│   ├── 01_schema.sql                 # CREATE TABLE + indexes
│   └── 02_seed_data.sql              # INSERTs (with 5 planted bugs)
├── basic-queries/         (3 .sql + 3 .expected)
├── joins/                 (4 .sql + 4 .expected)
├── subqueries/            (3 .sql + 3 .expected)
├── window-functions/      (3 .sql + 3 .expected)
├── qa-validation-queries/ (6 .sql + 6 .expected)
└── scripts/
    └── run_all_queries.py            # Test runner (CI + local)
```

---

## CI

[`.github/workflows/sql.yml`](../.github/workflows/sql.yml) runs `scripts/run_all_queries.py` on every push to `main` and every PR touching `03-sql-queries/**`. Runs in **< 10 seconds** on a fresh runner — no dependencies, no database server, no installation, just Python's built-in `sqlite3`.

The badge above is live; click it for the run history.

---

## Why SQLite (and Why Python in the Runner)?

| Choice | Reason |
|---|---|
| SQLite over Postgres / MySQL | Zero install, ships with Python, deterministic byte-for-byte output, perfect for a portfolio anyone should be able to clone and run in under a minute |
| Python runner over `bash + sqlite3` | Output format differences between sqlite3 CLI versions break diffs; Python's `sqlite3` module is stable across the runner and my dev box |
| `.expected` files alongside `.sql` | Reviewing a PR that changes both query and expected output side-by-side in GitHub is the right unit of change |
| `--regen` flag instead of "just edit the expected" | Forces a deliberate step. You think harder about whether the new output is really what you wanted |
| Planted bugs in the seed | Validation queries that always return zero rows are unverifiable. Planting bugs makes the validation queries *demonstrate* their value |
