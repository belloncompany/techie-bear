-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    quantity DECIMAL NOT NULL,
    unit VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    is_available BOOLEAN DEFAULT true
);

-- Create menu_item_ingredients table (recipes)
CREATE TABLE IF NOT EXISTS menu_item_ingredients (
    menu_item_id VARCHAR(20) REFERENCES menu_items(id),
    ingredient_id VARCHAR(10) REFERENCES ingredients(id),
    amount DECIMAL NOT NULL,
    PRIMARY KEY (menu_item_id, ingredient_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    menu_item_id VARCHAR(20) REFERENCES menu_items(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
); 

-- Clear existing data
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE menu_items CASCADE;
TRUNCATE TABLE menu_item_ingredients CASCADE;
TRUNCATE TABLE ingredients CASCADE;

-- Reset sequences
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;

-- Insert all ingredients
INSERT INTO ingredients (id, name, quantity, unit, category) VALUES
    -- Proteins
    ('p1', 'Cod Fish', 100, 'pieces', 'proteins'),
    ('p2', 'Ground Beef', 50, 'kg', 'proteins'),
    ('p3', 'Chicken Breast', 75, 'pieces', 'proteins'),
    ('p4', 'Salmon Fillet', 40, 'pieces', 'proteins'),
    ('p5', 'Duck Breast', 30, 'pieces', 'proteins'),
    ('p6', 'Lamb Shank', 25, 'pieces', 'proteins'),
    ('p7', 'Pork Belly', 35, 'kg', 'proteins'),
    ('p8', 'Venison', 20, 'kg', 'proteins'),
    -- Vegetables
    ('v1', 'Green Peas', 30, 'kg', 'vegetables'),
    ('v2', 'Potatoes', 100, 'kg', 'vegetables'),
    ('v3', 'Lettuce', 40, 'heads', 'vegetables'),
    ('v4', 'Carrots', 45, 'kg', 'vegetables'),
    ('v5', 'Brussels Sprouts', 20, 'kg', 'vegetables'),
    ('v6', 'Parsnips', 25, 'kg', 'vegetables'),
    ('v7', 'Cabbage', 30, 'heads', 'vegetables'),
    ('v8', 'Swede', 25, 'kg', 'vegetables'),
    -- Extras
    ('e1', 'Flour', 50, 'kg', 'extras'),
    ('e2', 'Butter', 30, 'kg', 'extras'),
    ('e3', 'Apples', 60, 'kg', 'extras'),
    ('e4', 'Yorkshire Pudding Mix', 15, 'kg', 'extras'),
    ('e5', 'Custard', 20, 'litres', 'extras'),
    ('e6', 'Gravy Granules', 10, 'kg', 'extras'),
    ('e7', 'Mint Sauce', 8, 'litres', 'extras'),
    ('e8', 'Cream', 25, 'litres', 'extras'),
    ('e9', 'Blackberries', 15, 'kg', 'extras'),
    ('e10', 'Golden Syrup', 10, 'kg', 'extras'),
    ('e11', 'Breadcrumbs', 20, 'kg', 'extras'),
    ('e12', 'Eggs', 500, 'pieces', 'extras');

-- Insert all menu items
INSERT INTO menu_items (id, name, price, category, description) VALUES
    -- Main Courses
    ('main_1', 'Fish & Chips', 12.99, 'mainCourses', 'Classic beer-battered cod with chunky chips'),
    ('main_2', 'Shepherd''s Pie', 11.99, 'mainCourses', 'Traditional minced lamb with mashed potato topping'),
    ('main_3', 'Sunday Roast', 14.99, 'mainCourses', 'Roast beef with Yorkshire pudding and vegetables'),
    ('main_4', 'Grilled Salmon', 16.99, 'mainCourses', 'Fresh Scottish salmon with seasonal vegetables'),
    ('main_5', 'Duck à l''Orange', 18.99, 'mainCourses', 'Classic French duck breast with orange sauce'),
    ('main_6', 'Lamb Shank', 17.99, 'mainCourses', 'Slow-cooked lamb shank with minted gravy'),
    ('main_7', 'Pork Belly', 15.99, 'mainCourses', 'Crispy pork belly with apple sauce'),
    ('main_8', 'Venison Stew', 19.99, 'mainCourses', 'Rich venison stew with root vegetables'),
    -- Sides
    ('side_1', 'Mushy Peas', 3.99, 'sides', 'Traditional mushy peas'),
    ('side_2', 'Chips', 3.49, 'sides', 'Crispy hand-cut chips'),
    ('side_3', 'Garden Salad', 4.99, 'sides', 'Fresh mixed salad with house dressing'),
    ('side_4', 'Roasted Root Vegetables', 4.99, 'sides', 'Seasonal root vegetables with honey glaze'),
    ('side_5', 'Cauliflower Cheese', 4.49, 'sides', 'Creamy cauliflower with mature cheddar'),
    ('side_6', 'Bubble and Squeak', 4.29, 'sides', 'Traditional potato and cabbage cake'),
    -- Desserts
    ('dessert_1', 'Sticky Toffee Pudding', 5.99, 'desserts', 'Classic date pudding with toffee sauce'),
    ('dessert_2', 'Apple Crumble', 5.49, 'desserts', 'Bramley apple crumble with custard'),
    ('dessert_3', 'Bread & Butter Pudding', 5.99, 'desserts', 'Traditional bread and butter pudding with vanilla custard'),
    ('dessert_4', 'Eton Mess', 5.99, 'desserts', 'Classic British dessert with fresh berries'),
    ('dessert_5', 'Treacle Tart', 5.49, 'desserts', 'Traditional golden syrup tart with cream'),
    ('dessert_6', 'Summer Pudding', 5.99, 'desserts', 'Berry-soaked bread pudding with cream');

-- Insert all recipes (menu item ingredients)
INSERT INTO menu_item_ingredients (menu_item_id, ingredient_id, amount) VALUES
    -- Fish & Chips recipe
    ('main_1', 'p1', 1),    -- 1 piece of cod
    ('main_1', 'v2', 0.3),  -- 300g potatoes
    ('main_1', 'e1', 0.2),  -- 200g flour for batter
    
    -- Shepherd's Pie recipe
    ('main_2', 'p2', 0.5),  -- 500g ground beef
    ('main_2', 'v2', 0.4),  -- 400g potatoes
    ('main_2', 'v4', 0.2),  -- 200g carrots
    ('main_2', 'e2', 0.1),  -- 100g butter
    
    -- Sunday Roast recipe
    ('main_3', 'p2', 0.3),  -- 300g beef
    ('main_3', 'v2', 0.3),  -- 300g potatoes
    ('main_3', 'v4', 0.2),  -- 200g carrots
    ('main_3', 'e4', 0.1),  -- Yorkshire pudding mix
    ('main_3', 'e6', 0.05), -- Gravy

    -- Grilled Salmon recipe
    ('main_4', 'p4', 1),    -- 1 salmon fillet
    ('main_4', 'v4', 0.2),  -- 200g carrots
    ('main_4', 'v5', 0.2),  -- 200g brussels sprouts
    
    -- Duck à l'Orange recipe
    ('main_5', 'p5', 1),    -- 1 duck breast
    ('main_5', 'v6', 0.2),  -- 200g parsnips
    ('main_5', 'e2', 0.05), -- 50g butter
    
    -- Lamb Shank recipe
    ('main_6', 'p6', 1),    -- 1 lamb shank
    ('main_6', 'v2', 0.3),  -- 300g potatoes
    ('main_6', 'e7', 0.1),  -- 100ml mint sauce
    
    -- Pork Belly recipe
    ('main_7', 'p7', 0.4),  -- 400g pork belly
    ('main_7', 'v2', 0.3),  -- 300g potatoes
    ('main_7', 'e3', 0.2),  -- 200g apples for sauce
    
    -- Venison Stew recipe
    ('main_8', 'p8', 0.4),  -- 400g venison
    ('main_8', 'v4', 0.2),  -- 200g carrots
    ('main_8', 'v6', 0.2),  -- 200g parsnips
    ('main_8', 'v8', 0.2),  -- 200g swede

    -- Side dishes recipes
    ('side_1', 'v1', 0.2),  -- 200g green peas
    ('side_1', 'e2', 0.05), -- 50g butter
    
    ('side_2', 'v2', 0.3),  -- 300g potatoes
    
    ('side_3', 'v3', 0.5),  -- Half a head of lettuce
    
    ('side_4', 'v4', 0.2),  -- 200g carrots
    ('side_4', 'v6', 0.2),  -- 200g parsnips
    ('side_4', 'v8', 0.2),  -- 200g swede
    
    ('side_5', 'v5', 0.3),  -- 300g brussels sprouts
    ('side_5', 'e2', 0.1),  -- 100g butter
    
    ('side_6', 'v2', 0.3),  -- 300g potatoes
    ('side_6', 'v7', 0.2),  -- 200g cabbage

    -- Dessert recipes
    ('dessert_1', 'e1', 0.15),  -- 150g flour
    ('dessert_1', 'e2', 0.1),   -- 100g butter
    ('dessert_1', 'e8', 0.2),   -- 200ml cream
    
    ('dessert_2', 'e3', 0.3),   -- 300g apples
    ('dessert_2', 'e1', 0.1),   -- 100g flour
    ('dessert_2', 'e2', 0.1),   -- 100g butter
    
    ('dessert_3', 'e1', 0.1),   -- 100g flour
    ('dessert_3', 'e2', 0.1),   -- 100g butter
    ('dessert_3', 'e5', 0.2),   -- 200ml custard
    
    ('dessert_4', 'e8', 0.2),   -- 200ml cream
    ('dessert_4', 'e9', 0.2),   -- 200g blackberries
    ('dessert_4', 'e12', 2),    -- 2 eggs
    
    ('dessert_5', 'e10', 0.2),  -- 200g golden syrup
    ('dessert_5', 'e11', 0.1),  -- 100g breadcrumbs
    ('dessert_5', 'e8', 0.1),   -- 100ml cream
    
    ('dessert_6', 'e9', 0.3),   -- 300g blackberries
    ('dessert_6', 'e8', 0.2),   -- 200ml cream
    ('dessert_6', 'e11', 0.15); -- 150g breadcrumbs

-- Insert sample orders
INSERT INTO orders (status, total_amount, created_at) VALUES
    ('completed', 29.97, NOW() - INTERVAL '2 days'),
    ('pending', 23.47, NOW() - INTERVAL '1 day'),
    ('processing', 62.94, NOW()),
    ('completed', 45.96, NOW() - INTERVAL '12 hours'),
    ('processing', 38.97, NOW() - INTERVAL '6 hours'),
    ('pending', 52.45, NOW() - INTERVAL '1 hour');

-- Insert sample order items
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES
    -- Existing orders
    (1, 'main_1', 2, 12.99, 25.98),
    (1, 'side_1', 1, 3.99, 3.99),
    (2, 'main_2', 1, 11.99, 11.99),
    (2, 'dessert_2', 2, 5.49, 10.98),
    (3, 'main_3', 3, 14.99, 44.97),
    (3, 'dessert_1', 3, 5.99, 17.97),
    -- New orders
    (4, 'main_4', 2, 16.99, 33.98),
    (4, 'side_4', 2, 4.99, 9.98),
    (4, 'dessert_4', 1, 5.99, 5.99),
    (5, 'main_5', 1, 18.99, 18.99),
    (5, 'side_5', 2, 4.49, 8.98),
    (5, 'dessert_5', 2, 5.49, 10.98),
    (6, 'main_6', 2, 17.99, 35.98),
    (6, 'side_3', 2, 4.99, 9.98),
    (6, 'dessert_2', 1, 5.49, 5.49);

-- Verify data
SELECT 'Ingredients count: ' || COUNT(*) as ingredients_count FROM ingredients;
SELECT 'Menu items count: ' || COUNT(*) as menu_items_count FROM menu_items;
SELECT 'Recipes count: ' || COUNT(*) as recipes_count FROM menu_item_ingredients;
SELECT 'Orders count: ' || COUNT(*) as orders_count FROM orders;
SELECT 'Order items count: ' || COUNT(*) as order_items_count FROM order_items; 