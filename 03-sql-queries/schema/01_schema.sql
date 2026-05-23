-- ============================================================
-- E-Commerce Schema (SQLite)
-- Modeled after Automation Exercise to keep the portfolio
-- internally consistent: the same domain we test in Cypress
-- and Postman is the one we query with SQL.
--
-- Notes on conventions:
--   * Snake_case for table and column names
--   * Surrogate INTEGER PRIMARY KEY everywhere
--   * created_at on every entity (Unix timestamps as INTEGER)
--   * FK declarations even though SQLite doesn't enforce them
--     by default — they're documentation AND foreign_keys=ON
--     in the runner enables enforcement
--   * No "soft delete" — keeps the validation queries crisp
-- ============================================================

PRAGMA foreign_keys = ON;

-- ---- Users ---------------------------------------------------
CREATE TABLE users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    email           TEXT    NOT NULL,
    password_hash   TEXT    NOT NULL,
    first_name      TEXT    NOT NULL,
    last_name       TEXT    NOT NULL,
    country         TEXT    NOT NULL,
    city            TEXT,
    created_at      INTEGER NOT NULL
    -- INTENTIONAL: no UNIQUE on email. A QA validation query
    -- proves whether the application layer is enforcing it.
);

-- ---- Catalog -------------------------------------------------
CREATE TABLE categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    parent_id   INTEGER REFERENCES categories(id)
);

CREATE TABLE brands (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT    NOT NULL UNIQUE
);

CREATE TABLE products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT,
    price       REAL    NOT NULL,
    stock       INTEGER NOT NULL DEFAULT 0,
    brand_id    INTEGER NOT NULL REFERENCES brands(id),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    created_at  INTEGER NOT NULL
);

CREATE INDEX idx_products_brand    ON products(brand_id);
CREATE INDEX idx_products_category ON products(category_id);

-- ---- Carts (pre-checkout) -----------------------------------
CREATE TABLE carts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    created_at  INTEGER NOT NULL
);

CREATE TABLE cart_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id     INTEGER NOT NULL REFERENCES carts(id),
    product_id  INTEGER NOT NULL,  -- NO REFERENCES on purpose; an
                                   -- orphan-item validation query
                                   -- demonstrates the leak this allows.
    quantity    INTEGER NOT NULL,
    added_at    INTEGER NOT NULL
);

CREATE INDEX idx_cart_items_cart    ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);

-- ---- Orders (post-checkout) ---------------------------------
CREATE TABLE orders (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    total       REAL    NOT NULL,
    status      TEXT    NOT NULL CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
    shipped_at  INTEGER,
    created_at  INTEGER NOT NULL
);

CREATE INDEX idx_orders_user   ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE order_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id    INTEGER NOT NULL REFERENCES orders(id),
    product_id  INTEGER NOT NULL REFERENCES products(id),
    quantity    INTEGER NOT NULL,
    unit_price  REAL    NOT NULL
);

CREATE INDEX idx_order_items_order   ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ---- Reviews ------------------------------------------------
CREATE TABLE reviews (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id  INTEGER NOT NULL REFERENCES products(id),
    user_id     INTEGER NOT NULL REFERENCES users(id),
    rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  INTEGER NOT NULL
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
