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

    async createOrder(items, status = 'pending') {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
            
            const orderResult = await client.query(
                'INSERT INTO orders (status) VALUES ($1) RETURNING id',
                [status]
            );
            const orderId = orderResult.rows[0].id;

            for (const item of items) {
                await client.query(
                    'INSERT INTO order_items (order_id, dish_name, quantity) VALUES ($1, $2, $3)',
                    [orderId, item.name, item.quantity]
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
            'SELECT o.*, oi.dish_name, oi.quantity FROM orders o ' +
            'LEFT JOIN order_items oi ON o.id = oi.order_id ' +
            'WHERE o.id = $1',
            [orderId]
        );

        if (orderResult.rows.length === 0) {
            throw new Error(`Order not found: ${orderId}`);
        }

        return {
            id: orderResult.rows[0].id,
            status: orderResult.rows[0].status,
            createdAt: orderResult.rows[0].created_at,
            items: orderResult.rows.map(row => ({
                name: row.dish_name,
                quantity: row.quantity
            }))
        };
    }
};

module.exports = dbService; 