const db = require('../config/database');

const dbService = {
    async getIngredients() {
        const result = await db.query('SELECT * FROM ingredients');
        return result.rows.reduce((acc, ingredient) => {
            const category = ingredient.category.toLowerCase();
            if (!acc[category]) acc[category] = {};
            acc[category][ingredient.id] = {
                id: ingredient.id,
                name: ingredient.name,
                quantity: parseFloat(ingredient.quantity),
                unit: ingredient.unit
            };
            return acc;
        }, {});
    },

    async updateIngredient(id, quantity) {
        await db.query(
            'UPDATE ingredients SET quantity = $1 WHERE id = $2',
            [quantity, id]
        );
    },

    async getMenuItems() {
        const result = await db.query('SELECT * FROM menu_items WHERE is_available = true');
        return result.rows.reduce((acc, item) => {
            const category = item.category;
            if (!acc[category]) acc[category] = [];
            acc[category].push({
                id: item.id,
                name: item.name,
                price: parseFloat(item.price),
                description: item.description
            });
            return acc;
        }, {});
    },

    async getMenuItem(id) {
        const result = await db.query('SELECT * FROM menu_items WHERE id = $1 AND is_available = true', [id]);
        if (result.rows.length === 0) {
            throw new Error(`Menu item not found or not available: ${id}`);
        }
        return {
            ...result.rows[0],
            price: parseFloat(result.rows[0].price)
        };
    },

    async createOrder(items) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
            
            // Calculate total amount and prepare order items
            let totalAmount = 0;
            const orderItems = [];
            
            // Validate and get prices from database for each item
            for (const item of items) {
                const menuItem = await this.getMenuItem(item.menuItemId);
                if (!menuItem) {
                    throw new Error(`Invalid menu item: ${item.menuItemId}`);
                }
                
                const subtotal = parseFloat((menuItem.price * item.quantity).toFixed(2));
                totalAmount += subtotal;
                
                orderItems.push({
                    menuItemId: item.menuItemId,
                    quantity: item.quantity,
                    unitPrice: menuItem.price,
                    subtotal
                });
            }
            
            // Create order with total amount
            const orderResult = await client.query(
                'INSERT INTO orders (status, total_amount) VALUES ($1, $2) RETURNING id',
                ['pending', totalAmount]
            );
            const orderId = orderResult.rows[0].id;

            // Create order items with prices
            for (const item of orderItems) {
                await client.query(
                    'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5)',
                    [orderId, item.menuItemId, item.quantity, item.unitPrice, item.subtotal]
                );
            }

            await client.query('COMMIT');
            return orderId;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async getOrder(orderId) {
        const orderResult = await db.query(
            `SELECT o.*, 
                    json_agg(json_build_object(
                        'id', oi.menu_item_id,
                        'name', mi.name,
                        'quantity', oi.quantity,
                        'unitPrice', oi.unit_price,
                        'subtotal', oi.subtotal
                    )) as items
             FROM orders o 
             LEFT JOIN order_items oi ON o.id = oi.order_id 
             LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
             WHERE o.id = $1
             GROUP BY o.id`,
            [orderId]
        );
        
        if (orderResult.rows.length === 0) {
            throw new Error(`Order not found: ${orderId}`);
        }

        const order = orderResult.rows[0];
        return {
            id: order.id,
            status: order.status,
            totalAmount: parseFloat(order.total_amount),
            createdAt: order.created_at,
            items: order.items || []
        };
    },

    async checkIngredientsAvailability(menuItemId, quantity) {
        const menuItem = await this.getMenuItem(menuItemId);
        const ingredients = await this.getIngredients();
        
        const missingIngredients = [];
        
        for (const [ingredientId, required] of Object.entries(menuItem.ingredients)) {
            const category = required.category.toLowerCase();
            const ingredient = ingredients[category]?.[ingredientId];
            
            if (!ingredient || ingredient.quantity < required.amount * quantity) {
                missingIngredients.push({
                    id: ingredientId,
                    name: required.name,
                    required: required.amount * quantity,
                    available: ingredient?.quantity || 0
                });
            }
        }
        
        return {
            canPrepare: missingIngredients.length === 0,
            missingIngredients
        };
    }
};

module.exports = dbService; 