-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS techie_bear;

-- Connect to the database
\c techie_bear;

-- Create tables
CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    is_available BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    menu_item_id VARCHAR(50) REFERENCES menu_items(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- Insert sample menu items
INSERT INTO menu_items (id, name, price, description, category) VALUES
-- Main Courses
('main_1', 'Fish & Chips', 12.99, 'Classic beer-battered cod with chunky chips', 'mainCourses'),
('main_2', 'Shepherd''s Pie', 11.99, 'Traditional minced lamb with mashed potato topping', 'mainCourses'),
('main_3', 'Sunday Roast', 14.99, 'Roast beef with Yorkshire pudding and vegetables', 'mainCourses'),
('main_4', 'Grilled Salmon', 16.99, 'Fresh Scottish salmon with seasonal vegetables', 'mainCourses'),
('main_5', 'Duck à l''Orange', 18.99, 'Classic French duck breast with orange sauce', 'mainCourses'),
('main_6', 'Lamb Shank', 17.99, 'Slow-cooked lamb shank with minted gravy', 'mainCourses'),

-- Sides
('side_1', 'Mushy Peas', 3.99, 'Traditional mushy peas', 'sides'),
('side_2', 'Chips', 3.49, 'Crispy hand-cut chips', 'sides'),
('side_3', 'Garden Salad', 4.99, 'Fresh mixed salad with house dressing', 'sides'),
('side_4', 'Roasted Root Vegetables', 4.99, 'Seasonal root vegetables with honey glaze', 'sides'),
('side_5', 'Cauliflower Cheese', 4.49, 'Creamy cauliflower with mature cheddar', 'sides'),

-- Desserts
('dessert_1', 'Sticky Toffee Pudding', 5.99, 'Classic date pudding with toffee sauce', 'desserts'),
('dessert_2', 'Apple Crumble', 5.49, 'Bramley apple crumble with custard', 'desserts'),
('dessert_3', 'Bread & Butter Pudding', 5.99, 'Traditional bread and butter pudding with vanilla custard', 'desserts'),
('dessert_4', 'Eton Mess', 5.99, 'Classic British dessert with fresh berries', 'desserts'),
('dessert_5', 'Treacle Tart', 5.49, 'Traditional golden syrup tart with cream', 'desserts'); 