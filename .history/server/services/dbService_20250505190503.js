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
        const result = await db.query('SELECT * FROM menu_items');
        return result.rows;
    },

    async getMenuItem(id) {
        const result = await db.query('SELECT * FROM menu_items WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error(`Menu item not found: ${id}`);
        }
        return result.rows[0];
    },

    async createOrder(items) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
            
            // Create order
            const orderResult = await client.query(
                'INSERT INTO orders (status) VALUES ($1) RETURNING id',
                ['pending']
            );
            const orderId = orderResult.rows[0].id;

            // Add order items
            for (const item of items) {
                await client.query(
                    'INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES ($1, $2, $3)',
                    [orderId, item.menuItemId, item.quantity]
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

    async getOrder(id) {
        const result = await db.query(
            `SELECT o.id, o.status, o.created_at,
                    json_agg(json_build_object(
                        'menuItemId', oi.menu_item_id,
                        'quantity', oi.quantity,
                        'menuItem', mi.*
                    )) as items
             FROM orders o
             JOIN order_items oi ON o.id = oi.order_id
             JOIN menu_items mi ON oi.menu_item_id = mi.id
             WHERE o.id = $1
             GROUP BY o.id`,
            [id]
        );
        
        if (result.rows.length === 0) {
            throw new Error(`Order not found: ${id}`);
        }
        return result.rows[0];
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