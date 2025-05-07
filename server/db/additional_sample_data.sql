-- Add more ingredients
INSERT INTO ingredients (id, name, quantity, unit, category) VALUES
    -- Proteins
    ('p4', 'Salmon Fillet', 40, 'pieces', 'proteins'),
    ('p5', 'Duck Breast', 30, 'pieces', 'proteins'),
    ('p6', 'Lamb Shank', 25, 'pieces', 'proteins'),
    -- Vegetables
    ('v4', 'Carrots', 45, 'kg', 'vegetables'),
    ('v5', 'Brussels Sprouts', 20, 'kg', 'vegetables'),
    ('v6', 'Parsnips', 25, 'kg', 'vegetables'),
    -- Extras
    ('e4', 'Yorkshire Pudding Mix', 15, 'kg', 'extras'),
    ('e5', 'Custard', 20, 'litres', 'extras'),
    ('e6', 'Gravy Granules', 10, 'kg', 'extras'),
    ('e7', 'Mint Sauce', 8, 'litres', 'extras');

-- Add more menu items
INSERT INTO menu_items (id, name, price, category, description) VALUES
    -- Main Courses
    ('main_4', 'Grilled Salmon', 16.99, 'mainCourses', 'Fresh Scottish salmon with seasonal vegetables'),
    ('main_5', 'Duck à l''Orange', 18.99, 'mainCourses', 'Classic French duck breast with orange sauce'),
    ('main_6', 'Lamb Shank', 17.99, 'mainCourses', 'Slow-cooked lamb shank with minted gravy'),
    -- Sides
    ('side_4', 'Roasted Root Vegetables', 4.99, 'sides', 'Seasonal root vegetables with honey glaze'),
    ('side_5', 'Cauliflower Cheese', 4.49, 'sides', 'Creamy cauliflower with mature cheddar'),
    -- Desserts
    ('dessert_4', 'Eton Mess', 5.99, 'desserts', 'Classic British dessert with fresh berries'),
    ('dessert_5', 'Treacle Tart', 5.49, 'desserts', 'Traditional golden syrup tart with cream');

-- Add more sample orders
INSERT INTO orders (status, total_amount, created_at) VALUES
    ('completed', 45.96, NOW() - INTERVAL '12 hours'),
    ('processing', 38.97, NOW() - INTERVAL '6 hours'),
    ('pending', 52.45, NOW() - INTERVAL '1 hour');

-- Add more order items
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES
    -- Order with mixed new and existing items
    (4, 'main_4', 2, 16.99, 33.98),
    (4, 'side_4', 2, 4.99, 9.98),
    (4, 'dessert_4', 1, 5.99, 5.99),
    -- Order with new premium items
    (5, 'main_5', 1, 18.99, 18.99),
    (5, 'side_5', 2, 4.49, 8.98),
    (5, 'dessert_5', 2, 5.49, 10.98),
    -- Mixed order with existing and new items
    (6, 'main_6', 2, 17.99, 35.98),
    (6, 'side_3', 2, 4.99, 9.98),
    (6, 'dessert_2', 1, 5.49, 5.49); 