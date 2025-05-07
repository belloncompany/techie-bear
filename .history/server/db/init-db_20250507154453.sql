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