-- ============================================================
-- Seed Data
--
-- Five INTENTIONAL data quality issues are planted so the QA
-- validation queries have something to find. Each is marked
-- with "-- ⚠ PLANTED BUG" in the relevant INSERT.
--
-- The bugs:
--   1. Duplicate email           (users)            → BUG-DUP-EMAIL
--   2. Negative stock            (products)         → BUG-NEG-STOCK
--   3. Orphan cart_item          (cart_items)       → BUG-ORPHAN-CART
--   4. Order total != line sum   (orders)           → BUG-ORDER-TOTAL
--   5. Shipped without timestamp (orders)           → BUG-SHIP-NO-TS
-- ============================================================

-- ---- Brands -------------------------------------------------
INSERT INTO brands (id, name) VALUES
    (1, 'Polo'),
    (2, 'Madame'),
    (3, 'Mast & Harbour'),
    (4, 'Babyhug'),
    (5, 'Allen Solly Junior'),
    (6, 'Kookie Kids');

-- ---- Categories ---------------------------------------------
INSERT INTO categories (id, name, parent_id) VALUES
    (1,  'Women',           NULL),
    (2,  'Women > Tops',    1),
    (3,  'Women > Dress',   1),
    (4,  'Men',             NULL),
    (5,  'Men > Tshirts',   4),
    (6,  'Men > Jeans',     4),
    (7,  'Kids',            NULL),
    (8,  'Kids > Tops',     7),
    (9,  'Kids > Dress',    7),
    (10, 'Accessories',     NULL);

-- ---- Users --------------------------------------------------
INSERT INTO users (id, email, password_hash, first_name, last_name, country, city, created_at) VALUES
    ( 1, 'orkhan@test.az',     'h_abc123', 'Orkhan',    'Aliyev',     'Azerbaijan', 'Baku',          1714000000),
    ( 2, 'nigar@test.az',      'h_def456', 'Nigar',     'Mammadova',  'Azerbaijan', 'Baku',          1714050000),
    ( 3, 'rashad@test.az',     'h_ghi789', 'Rashad',    'Huseynov',   'Azerbaijan', 'Ganja',         1714100000),
    ( 4, 'leyla@test.az',      'h_jkl012', 'Leyla',     'Aliyeva',    'Azerbaijan', 'Baku',          1714150000),
    ( 5, 'james@test.us',      'h_mno345', 'James',     'Smith',      'USA',        'New York',      1714200000),
    ( 6, 'emma@test.us',       'h_pqr678', 'Emma',      'Johnson',    'USA',        'Chicago',       1714250000),
    ( 7, 'oliver@test.uk',     'h_stu901', 'Oliver',    'Brown',      'UK',         'London',        1714300000),
    ( 8, 'sophie@test.uk',     'h_vwx234', 'Sophie',    'Wilson',     'UK',         'Manchester',    1714350000),
    ( 9, 'lukas@test.de',      'h_yza567', 'Lukas',     'Mueller',    'Germany',    'Berlin',        1714400000),
    (10, 'anna@test.de',       'h_bcd890', 'Anna',      'Schmidt',    'Germany',    'Munich',        1714450000),
    (11, 'tural@test.az',      'h_efg123', 'Tural',     'Hasanov',    'Azerbaijan', 'Baku',          1714500000),
    (12, 'ayse@test.az',       'h_hij456', 'Ayshe',     'Karimova',   'Azerbaijan', 'Sumqayit',      1714550000),
    (13, 'will@test.uk',       'h_klm789', 'William',   'Taylor',     'UK',         'Birmingham',    1714600000),
    (14, 'klaus@test.de',      'h_nop012', 'Klaus',     'Weber',      'Germany',    'Hamburg',       1714650000),
    (15, 'maria@test.us',      'h_qrs345', 'Maria',     'Davis',      'USA',        'Los Angeles',   1714700000),
    (16, 'farid@test.az',      'h_tuv678', 'Farid',     'Quliyev',    'Azerbaijan', 'Baku',          1714750000),
    (17, 'lisa@test.uk',       'h_wxy901', 'Lisa',      'Anderson',   'UK',         'Leeds',         1714800000),
    (18, 'ahmad@test.az',      'h_zab234', 'Ahmad',     'Salimov',    'Azerbaijan', 'Mingachevir',   1714850000),
    -- ⚠ PLANTED BUG (BUG-DUP-EMAIL): users 19 and 20 share an email
    (19, 'dup@test.com',       'h_cde567', 'Duplicate', 'OneA',       'USA',        'Boston',        1714900000),
    (20, 'dup@test.com',       'h_fgh890', 'Duplicate', 'OneB',       'USA',        'Boston',        1714950000);

-- ---- Products -----------------------------------------------
INSERT INTO products (id, name, description, price, stock, brand_id, category_id, created_at) VALUES
    ( 1, 'Blue Top',                  'Casual blue cotton top',         25.00, 50,  1, 2,  1713000000),
    ( 2, 'Pink Dress',                'Summer pink dress',              45.00, 30,  2, 3,  1713010000),
    ( 3, 'Mens Tshirt',               'Plain crew-neck tshirt',         18.00, 80,  3, 5,  1713020000),
    ( 4, 'Slim Fit Jeans',            'Mid-rise denim',                 60.00, 40,  1, 6,  1713030000),
    ( 5, 'Cotton Tshirt',             'Comfort cotton tshirt',          20.00, 100, 3, 5,  1713040000),
    ( 6, 'Polo Tshirt',               'Pique polo, navy',               35.00, 60,  1, 5,  1713050000),
    ( 7, 'Kids Cotton Top',           'Soft kids top',                  15.00, 70,  4, 8,  1713060000),
    ( 8, 'Kids Party Dress',          'Party-wear dress for girls',     40.00, 25,  5, 9,  1713070000),
    ( 9, 'Striped Tshirt',            'Striped pattern, multi-color',   22.00, 45,  3, 5,  1713080000),
    (10, 'Black Jeans',               'Slim black jeans',               55.00, 35,  1, 6,  1713090000),
    (11, 'Floral Top',                'Floral print sleeveless',        28.00, 40,  2, 2,  1713100000),
    (12, 'Embroidered Dress',         'Heavy embroidery dress',         95.00,  8,  2, 3,  1713110000),
    (13, 'Kids Boys Tshirt',          'Cartoon print tshirt',           14.00, 90,  6, 8,  1713120000),
    (14, 'Kids Girls Dress',          'Princess style dress',           38.00, 20,  5, 9,  1713130000),
    (15, 'Leather Wallet',            'Genuine leather, brown',         50.00, 25,  1, 10, 1713140000),
    (16, 'Canvas Bag',                'Tote bag for everyday',          32.00, 55,  3, 10, 1713150000),
    (17, 'Aviator Sunglasses',        'UV-protected aviators',          75.00, 18,  1, 10, 1713160000),
    (18, 'Wool Scarf',                'Winter wool scarf',              28.00, 30,  3, 10, 1713170000),
    (19, 'Summer Hat',                'Wide-brim straw hat',            22.00, 40,  2, 10, 1713180000),
    (20, 'Mens Formal Shirt',         'Office white shirt',             42.00, 50,  1, 5,  1713190000),
    (21, 'Mens Casual Shirt',         'Checkered casual shirt',         38.00, 60,  3, 5,  1713200000),
    (22, 'Womens Blazer',             'Single-breasted blazer',         85.00, 15,  2, 2,  1713210000),
    (23, 'Kids Winter Jacket',        'Warm padded jacket',             65.00, 22,  4, 8,  1713220000),
    (24, 'Sports Shorts',             'Quick-dry training shorts',      24.00, 70,  3, 5,  1713230000),
    (25, 'Yoga Pants',                'High-waist yoga pants',          40.00, 38,  2, 2,  1713240000),
    -- ⚠ PLANTED BUG (BUG-NEG-STOCK): negative stock (race condition simulation)
    (26, 'Limited Edition Hoodie',    'Sold-out hoodie - race bug',     70.00, -3,  1, 5,  1713250000),
    (27, 'Denim Jacket',              'Classic denim jacket',           80.00, 20,  1, 5,  1713260000),
    (28, 'Knit Sweater',              'Cable-knit wool sweater',        55.00, 28,  3, 2,  1713270000),
    (29, 'Maxi Dress',                'Long flowy maxi',                65.00, 18,  2, 3,  1713280000),
    (30, 'Kids Sneakers',             'Light-up sneakers',              48.00, 25,  6, 8,  1713290000);

-- ---- Carts (a few active pre-checkout carts) ----------------
INSERT INTO carts (id, user_id, created_at) VALUES
    (1, 1, 1715000000),
    (2, 2, 1715050000),
    (3, 5, 1715100000),
    (4, 9, 1715150000),
    (5, 11, 1715200000);

INSERT INTO cart_items (id, cart_id, product_id, quantity, added_at) VALUES
    (1, 1, 1,   1, 1715000010),
    (2, 1, 3,   2, 1715000020),
    (3, 2, 2,   1, 1715050010),
    (4, 2, 11,  1, 1715050020),
    (5, 3, 4,   1, 1715100010),
    (6, 3, 15,  1, 1715100020),
    (7, 4, 8,   2, 1715150010),
    -- ⚠ PLANTED BUG (BUG-ORPHAN-CART): product_id=999 does not exist
    (8, 5, 999, 1, 1715200010),
    (9, 5, 6,   3, 1715200020);

-- ---- Orders -------------------------------------------------
INSERT INTO orders (id, user_id, total, status, shipped_at, created_at) VALUES
    ( 1,  1, 100.00, 'delivered', 1714200000, 1714100000),
    ( 2,  1,  60.00, 'delivered', 1714400000, 1714300000),
    ( 3,  2,  45.00, 'shipped',   1714500000, 1714400000),
    ( 4,  3,  38.00, 'paid',      NULL,       1714450000),
    ( 5,  3, 144.00, 'delivered', 1714650000, 1714500000),
    ( 6,  5, 110.00, 'delivered', 1714750000, 1714600000),
    ( 7,  6,  90.00, 'pending',   NULL,       1714700000),
    ( 8,  7,  84.00, 'shipped',   1714850000, 1714750000),
    ( 9,  9,  65.00, 'cancelled', NULL,       1714800000),
    (10, 10, 175.00, 'delivered', 1714950000, 1714850000),
    -- ⚠ PLANTED BUG (BUG-ORDER-TOTAL): order says $50.00, line items sum to $52.50
    (11, 11,  50.00, 'paid',      NULL,       1714900000),
    (12, 13,  75.00, 'delivered', 1715050000, 1714950000),
    -- ⚠ PLANTED BUG (BUG-SHIP-NO-TS): status='shipped' but shipped_at is NULL
    (13, 15,  42.00, 'shipped',   NULL,       1715000000),
    (14, 16,  88.00, 'delivered', 1715200000, 1715050000),
    (15, 17,  55.00, 'paid',      NULL,       1715150000);

-- All order totals are intentionally CONSISTENT with the sum of
-- their line items EXCEPT order 11 (the planted BUG-ORDER-TOTAL).
-- The unit_price column reflects price-at-time-of-order, which is
-- why some values differ from the current products.price (sales,
-- discounts, etc. — a realistic ecommerce concern).
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES
    ( 1,  1,  1,  1, 25.00),
    ( 2,  1,  3,  1, 15.00),
    ( 3,  1,  4,  1, 60.00),         -- ord 1: 25 + 15 + 60 = 100 ✓

    ( 4,  2,  4,  1, 60.00),         -- ord 2: 60 ✓

    ( 5,  3,  2,  1, 45.00),         -- ord 3: 45 ✓

    ( 6,  4,  9,  1, 18.00),
    ( 7,  4,  5,  1, 20.00),         -- ord 4: 38 ✓

    ( 8,  5, 12,  1, 95.00),
    ( 9,  5, 22,  1, 49.00),         -- ord 5: 144 ✓ (blazer on sale)

    (10,  6, 17,  1, 78.00),
    (11,  6, 16,  1, 32.00),         -- ord 6: 110 ✓

    (12,  7, 23,  1, 65.00),
    (13,  7, 19,  1, 25.00),         -- ord 7: 90 ✓

    (14,  8, 27,  1, 84.00),         -- ord 8: 84 ✓

    (15,  9, 28,  1, 65.00),         -- ord 9: 65 ✓ (cancelled but ok)

    (16, 10, 12,  1, 90.00),
    (17, 10, 22,  1, 85.00),         -- ord 10: 175 ✓

    -- ⚠ PLANTED BUG (BUG-ORDER-TOTAL): orders.total = 50.00, lines sum to 52.50
    (18, 11,  5,  1, 20.00),
    (19, 11,  6,  1, 32.50),

    (20, 12, 17,  1, 75.00),         -- ord 12: 75 ✓

    (21, 13, 20,  1, 42.00),         -- ord 13: 42 ✓

    (22, 14, 27,  1, 88.00),         -- ord 14: 88 ✓

    (23, 15, 28,  1, 55.00);         -- ord 15: 55 ✓

-- ---- Reviews ------------------------------------------------
INSERT INTO reviews (id, product_id, user_id, rating, comment, created_at) VALUES
    ( 1,  1,  1, 5, 'Beautiful colour, perfect fit',     1714200000),
    ( 2,  1,  2, 4, 'Nice but runs a bit small',         1714300000),
    ( 3,  3,  5, 5, 'Best basic tshirt I own',           1714400000),
    ( 4,  4,  1, 3, 'OK fit, fabric is rough',           1714500000),
    ( 5,  6,  7, 5, 'Premium feel, worth the price',     1714600000),
    ( 6, 12,  3, 5, 'Stunning, lots of compliments',     1714700000),
    ( 7, 22,  6, 4, 'Great cut, slightly stiff',         1714800000),
    ( 8, 17,  9, 5, 'Solid sunglasses for the price',    1714900000),
    ( 9, 27, 11, 2, 'Color faded after one wash',        1715000000),
    (10, 23, 13, 5, 'Kept my kid warm all winter',       1715100000);
