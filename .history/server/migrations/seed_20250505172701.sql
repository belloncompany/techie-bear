-- Clear existing data
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE ingredients CASCADE;

-- Reset sequences
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;

-- Insert initial ingredients
INSERT INTO ingredients (id, name, quantity, unit, category) VALUES
    -- Proteins
    ('p1', 'Cod Fish', 100, 'pieces', 'proteins'),
    ('p2', 'Ground Beef', 50, 'kg', 'proteins'),
    ('p3', 'Chicken Breast', 75, 'pieces', 'proteins'),
    -- Vegetables
    ('v1', 'Green Peas', 30, 'kg', 'vegetables'),
    ('v2', 'Potatoes', 100, 'kg', 'vegetables'),
    ('v3', 'Lettuce', 40, 'heads', 'vegetables'),
    -- Extras
    ('e1', 'Flour', 50, 'kg', 'extras'),
    ('e2', 'Butter', 30, 'kg', 'extras'),
    ('e3', 'Apples', 60, 'kg', 'extras');

-- Insert sample orders
INSERT INTO orders (status, created_at) VALUES
    ('completed', NOW() - INTERVAL '2 days'),
    ('pending', NOW() - INTERVAL '1 day'),
    ('processing', NOW());

-- Insert sample order items
INSERT INTO order_items (order_id, dish_name, quantity) VALUES
    (1, 'Fish & Chips', 2),
    (1, 'Mushy Peas', 1),
    (2, 'Shepherd''s Pie', 1),
    (2, 'Apple Crumble', 2),
    (3, 'Sunday Roast', 3),
    (3, 'Sticky Toffee Pudding', 3);

-- Verify data
SELECT 'Ingredients count: ' || COUNT(*) as ingredients_count FROM ingredients;
SELECT 'Orders count: ' || COUNT(*) as orders_count FROM orders;
SELECT 'Order items count: ' || COUNT(*) as order_items_count FROM order_items; 