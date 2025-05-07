-- Clear existing data
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE menu_items CASCADE;
TRUNCATE TABLE menu_item_ingredients CASCADE;
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

-- Insert menu items
INSERT INTO menu_items (id, name, price, category, description) VALUES
    -- Main Courses
    ('main_1', 'Fish & Chips', 12.99, 'mainCourses', 'Classic beer-battered cod with chunky chips'),
    ('main_2', 'Shepherd''s Pie', 11.99, 'mainCourses', 'Traditional minced lamb with mashed potato topping'),
    ('main_3', 'Sunday Roast', 14.99, 'mainCourses', 'Roast beef with Yorkshire pudding and vegetables'),
    -- Sides
    ('side_1', 'Mushy Peas', 3.99, 'sides', 'Traditional mushy peas'),
    ('side_2', 'Chips', 3.49, 'sides', 'Crispy hand-cut chips'),
    ('side_3', 'Garden Salad', 4.99, 'sides', 'Fresh mixed salad with house dressing'),
    -- Desserts
    ('dessert_1', 'Sticky Toffee Pudding', 5.99, 'desserts', 'Classic date pudding with toffee sauce'),
    ('dessert_2', 'Apple Crumble', 5.49, 'desserts', 'Bramley apple crumble with custard'),
    ('dessert_3', 'Bread & Butter Pudding', 5.99, 'desserts', 'Traditional bread and butter pudding with vanilla custard');

-- Insert recipes (menu item ingredients)
INSERT INTO menu_item_ingredients (menu_item_id, ingredient_id, amount) VALUES
    -- Fish & Chips recipe
    ('main_1', 'p1', 1),    -- 1 piece of cod
    ('main_1', 'v2', 0.3),  -- 300g potatoes
    ('main_1', 'e1', 0.2),  -- 200g flour for batter
    
    -- Shepherd's Pie recipe
    ('main_2', 'p2', 0.5),  -- 500g ground beef
    ('main_2', 'v2', 0.4),  -- 400g potatoes
    ('main_2', 'e2', 0.1),  -- 100g butter
    
    -- Mushy Peas recipe
    ('side_1', 'v1', 0.2),  -- 200g green peas
    ('side_1', 'e2', 0.05), -- 50g butter
    
    -- Chips recipe
    ('side_2', 'v2', 0.3),  -- 300g potatoes
    
    -- Garden Salad recipe
    ('side_3', 'v3', 0.5),  -- Half a head of lettuce
    
    -- Apple Crumble recipe
    ('dessert_2', 'e3', 0.3),  -- 300g apples
    ('dessert_2', 'e1', 0.1),  -- 100g flour
    ('dessert_2', 'e2', 0.1);  -- 100g butter

-- Insert sample orders
INSERT INTO orders (status, total_amount, created_at) VALUES
    ('completed', 29.97, NOW() - INTERVAL '2 days'),
    ('pending', 23.47, NOW() - INTERVAL '1 day'),
    ('processing', 62.94, NOW());

-- Insert sample order items
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES
    (1, 'main_1', 2, 12.99, 25.98),
    (1, 'side_1', 1, 3.99, 3.99),
    (2, 'main_2', 1, 11.99, 11.99),
    (2, 'dessert_2', 2, 5.49, 10.98),
    (3, 'main_3', 3, 14.99, 44.97),
    (3, 'dessert_1', 3, 5.99, 17.97);

-- Verify data
SELECT 'Ingredients count: ' || COUNT(*) as ingredients_count FROM ingredients;
SELECT 'Menu items count: ' || COUNT(*) as menu_items_count FROM menu_items;
SELECT 'Recipes count: ' || COUNT(*) as recipes_count FROM menu_item_ingredients;
SELECT 'Orders count: ' || COUNT(*) as orders_count FROM orders;
SELECT 'Order items count: ' || COUNT(*) as order_items_count FROM order_items; 