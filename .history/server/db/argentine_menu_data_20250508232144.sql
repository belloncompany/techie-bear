-- Clear existing data
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE menu_items CASCADE;
TRUNCATE TABLE menu_item_ingredients CASCADE;
TRUNCATE TABLE ingredients CASCADE;

-- Reset sequences
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;

-- Insert Argentine ingredients
INSERT INTO ingredients (id, name, quantity, unit, category) VALUES
    -- Proteins
    ('p1', 'Carne de Vaca', 50, 'kg', 'proteins'),
    ('p2', 'Pechuga de Pollo', 75, 'pieces', 'proteins'),
    ('p3', 'Chorizo', 40, 'pieces', 'proteins'),
    ('p4', 'Morcilla', 40, 'pieces', 'proteins'),
    ('p5', 'Tira de Asado', 30, 'kg', 'proteins'),
    ('p6', 'Matambre', 25, 'kg', 'proteins'),
    ('p7', 'Vacío', 35, 'kg', 'proteins'),
    ('p8', 'Molida Especial', 20, 'kg', 'proteins'),
    
    -- Vegetables & Herbs
    ('v1', 'Cebolla', 30, 'kg', 'vegetables'),
    ('v2', 'Papa', 100, 'kg', 'vegetables'),
    ('v3', 'Lechuga', 40, 'heads', 'vegetables'),
    ('v4', 'Tomate', 45, 'kg', 'vegetables'),
    ('v5', 'Morrón', 20, 'kg', 'vegetables'),
    ('v6', 'Ajo', 10, 'kg', 'vegetables'),
    ('v7', 'Perejil', 5, 'kg', 'vegetables'),
    ('v8', 'Zapallo', 25, 'kg', 'vegetables'),
    ('v9', 'Choclo', 30, 'pieces', 'vegetables'),
    ('v10', 'Acelga', 15, 'kg', 'vegetables'),
    
    -- Extras & Pantry
    ('e1', 'Harina 0000', 50, 'kg', 'extras'),
    ('e2', 'Manteca', 30, 'kg', 'extras'),
    ('e3', 'Pan Rallado', 20, 'kg', 'extras'),
    ('e4', 'Huevos', 500, 'pieces', 'extras'),
    ('e5', 'Leche', 50, 'litres', 'extras'),
    ('e6', 'Dulce de Leche', 20, 'kg', 'extras'),
    ('e7', 'Azúcar', 25, 'kg', 'extras'),
    ('e8', 'Queso Rallado', 15, 'kg', 'extras'),
    ('e9', 'Aceite de Oliva', 20, 'litres', 'extras'),
    ('e10', 'Chimichurri', 10, 'kg', 'extras'),
    ('e11', 'Maicena', 10, 'kg', 'extras'),
    ('e12', 'Vainilla', 2, 'litres', 'extras'),
    ('e13', 'Membrillo', 15, 'kg', 'extras'),
    ('e14', 'Batata', 15, 'kg', 'extras');

-- Insert Argentine menu items
INSERT INTO menu_items (id, name, price, category, description) VALUES
    -- Main Courses (Platos Principales)
    ('main_1', 'Milanesa Napolitana', 14.99, 'mainCourses', 'Milanesa de carne con salsa, jamón, queso y puré'),
    ('main_2', 'Asado Tradicional', 24.99, 'mainCourses', 'Selección de cortes argentinos con chimichurri'),
    ('main_3', 'Empanadas de Carne', 11.99, 'mainCourses', 'Media docena de empanadas criollas'),
    ('main_4', 'Locro Criollo', 16.99, 'mainCourses', 'Guiso tradicional con maíz, porotos y carne'),
    ('main_5', 'Matambre a la Pizza', 18.99, 'mainCourses', 'Matambre con salsa de tomate, queso y orégano'),
    ('main_6', 'Sorrentinos de Jamón y Queso', 15.99, 'mainCourses', 'Pasta rellena con salsa a elección'),
    ('main_7', 'Choripán', 9.99, 'mainCourses', 'Chorizo en pan con chimichurri'),
    ('main_8', 'Pastel de Papa', 13.99, 'mainCourses', 'Gratinado de carne y papas'),
    
    -- Sides (Guarniciones)
    ('side_1', 'Puré de Papa', 4.99, 'sides', 'Puré de papas con manteca'),
    ('side_2', 'Ensalada Mixta', 3.99, 'sides', 'Lechuga, tomate y cebolla'),
    ('side_3', 'Papas Fritas', 4.49, 'sides', 'Papas fritas crocantes'),
    ('side_4', 'Ensalada Rusa', 4.99, 'sides', 'Papa, zanahoria, arvejas y mayonesa'),
    ('side_5', 'Tortilla de Papa', 5.99, 'sides', 'Tortilla española estilo argentino'),
    ('side_6', 'Morrones Asados', 4.99, 'sides', 'Morrones asados con ajo y aceite'),
    
    -- Desserts (Postres)
    ('dessert_1', 'Flan Casero', 5.99, 'desserts', 'Flan con dulce de leche y crema'),
    ('dessert_2', 'Alfajores de Maicena', 4.99, 'desserts', 'Tres alfajores con dulce de leche'),
    ('dessert_3', 'Vigilante', 5.49, 'desserts', 'Queso y dulce de membrillo o batata'),
    ('dessert_4', 'Panqueques con Dulce de Leche', 5.99, 'desserts', 'Panqueques caseros'),
    ('dessert_5', 'Budín de Pan', 5.49, 'desserts', 'Budín tradicional con caramelo'),
    ('dessert_6', 'Tiramisú Argentino', 6.99, 'desserts', 'Con dulce de leche y café');

-- Insert Argentine recipes (menu item ingredients)
INSERT INTO menu_item_ingredients (menu_item_id, ingredient_id, amount) VALUES
    -- Milanesa Napolitana
    ('main_1', 'p2', 1),    -- 1 pechuga
    ('main_1', 'e3', 0.2),  -- pan rallado
    ('main_1', 'e4', 2),    -- huevos
    ('main_1', 'v2', 0.3),  -- papas para puré
    
    -- Asado Tradicional
    ('main_2', 'p3', 1),    -- chorizo
    ('main_2', 'p4', 1),    -- morcilla
    ('main_2', 'p5', 0.5),  -- tira de asado
    ('main_2', 'e10', 0.1), -- chimichurri
    
    -- Empanadas de Carne
    ('main_3', 'p8', 0.3),  -- carne molida
    ('main_3', 'v1', 0.2),  -- cebolla
    ('main_3', 'e1', 0.3),  -- harina
    ('main_3', 'e2', 0.1),  -- manteca
    
    -- Locro Criollo
    ('main_4', 'p1', 0.3),  -- carne
    ('main_4', 'v8', 0.3),  -- zapallo
    ('main_4', 'v9', 2),    -- choclo
    
    -- Matambre a la Pizza
    ('main_5', 'p6', 0.4),  -- matambre
    ('main_5', 'v4', 0.2),  -- tomate
    ('main_5', 'e8', 0.1),  -- queso rallado
    
    -- Sorrentinos
    ('main_6', 'e1', 0.3),  -- harina
    ('main_6', 'e4', 2),    -- huevos
    ('main_6', 'e8', 0.2),  -- queso rallado
    
    -- Choripán
    ('main_7', 'p3', 1),    -- chorizo
    ('main_7', 'e10', 0.05),-- chimichurri
    
    -- Pastel de Papa
    ('main_8', 'p8', 0.3),  -- carne molida
    ('main_8', 'v2', 0.5),  -- papa
    ('main_8', 'e8', 0.1),  -- queso rallado

    -- Side dishes
    ('side_1', 'v2', 0.3),  -- papa
    ('side_1', 'e2', 0.05), -- manteca
    
    ('side_2', 'v3', 0.2),  -- lechuga
    ('side_2', 'v4', 0.2),  -- tomate
    ('side_2', 'v1', 0.1),  -- cebolla
    
    ('side_3', 'v2', 0.3),  -- papa
    
    ('side_4', 'v2', 0.2),  -- papa
    ('side_4', 'v4', 0.1),  -- zanahoria
    
    ('side_5', 'v2', 0.4),  -- papa
    ('side_5', 'e4', 2),    -- huevos
    
    ('side_6', 'v5', 0.3),  -- morrón
    ('side_6', 'v6', 0.05), -- ajo

    -- Desserts
    ('dessert_1', 'e4', 4),     -- huevos
    ('dessert_1', 'e5', 0.5),   -- leche
    ('dessert_1', 'e6', 0.2),   -- dulce de leche
    
    ('dessert_2', 'e11', 0.3),  -- maicena
    ('dessert_2', 'e6', 0.2),   -- dulce de leche
    ('dessert_2', 'e2', 0.1),   -- manteca
    
    ('dessert_3', 'e13', 0.2),  -- membrillo
    ('dessert_3', 'e14', 0.2),  -- batata
    
    ('dessert_4', 'e1', 0.2),   -- harina
    ('dessert_4', 'e4', 2),     -- huevos
    ('dessert_4', 'e6', 0.2),   -- dulce de leche
    
    ('dessert_5', 'e4', 3),     -- huevos
    ('dessert_5', 'e5', 0.5),   -- leche
    ('dessert_5', 'e7', 0.2),   -- azúcar
    
    ('dessert_6', 'e6', 0.3),   -- dulce de leche
    ('dessert_6', 'e4', 3),     -- huevos
    ('dessert_6', 'e12', 0.05); -- vainilla

-- Verify data
SELECT 'Ingredients count: ' || COUNT(*) as ingredients_count FROM ingredients;
SELECT 'Menu items count: ' || COUNT(*) as menu_items_count FROM menu_items;
SELECT 'Recipes count: ' || COUNT(*) as recipes_count FROM menu_item_ingredients; 