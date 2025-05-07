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

    async updateIngredients(ingredients) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
            
            for (const category in ingredients) {
                for (const [id, ingredient] of Object.entries(ingredients[category])) {
                    await client.query(
                        'UPDATE ingredients SET quantity = $1 WHERE id = $2',
                        [ingredient.quantity, id]
                    );
                }
            }
            
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
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
        const result = await db.query('SELECT * FROM menu_items WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error(`Menu item not found: ${id}`);
        }
        return result.rows[0];
    },

    async getRecipeRequirements(menuItemId) {
        const result = await db.query(`
            SELECT r.ingredient_id, r.amount, r.category, i.name, i.unit
            FROM recipe_requirements r
            JOIN ingredients i ON r.ingredient_id = i.id
            WHERE r.menu_item_id = $1
        `, [menuItemId]);

        return result.rows.reduce((acc, req) => {
            const category = req.category.toLowerCase();
            if (!acc[category]) acc[category] = {};
            acc[category][req.ingredient_id] = req.amount;
            return acc;
        }, {});
    },

    async createOrder(items) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
            
            // Calculate total amount and prepare order items
            let totalAmount = 0;
            const orderItems = [];
            
            for (const item of items) {
                const menuItem = await this.getMenuItem(item.menuItemId);
                const subtotal = menuItem.price * item.quantity;
                totalAmount += subtotal;
                
                orderItems.push({
                    menuItemId: item.menuItemId,
                    quantity: item.quantity,
                    unitPrice: menuItem.price,
                    subtotal
                });
            }
            
            // Create order
            const orderResult = await client.query(
                'INSERT INTO orders (status, total_amount) VALUES ($1, $2) RETURNING id',
                ['pending', totalAmount]
            );
            const orderId = orderResult.rows[0].id;

            // Create order items
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
    }
};

module.exports = dbService; 