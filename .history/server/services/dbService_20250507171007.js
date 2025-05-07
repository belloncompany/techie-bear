const db = require('../config/database');

const dbService = {
    async getIngredients() {
        const result = await db.query('SELECT * FROM ingredients');
        return result.rows;
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

    async getMenuItemIngredients(menuItemId) {
        const result = await db.query(`
            SELECT i.*, mi.amount as required_amount
            FROM menu_item_ingredients mi
            JOIN ingredients i ON i.id = mi.ingredient_id
            WHERE mi.menu_item_id = $1
        `, [menuItemId]);
        return result.rows;
    },

    async checkIngredientsAvailability(menuItemId, quantity) {
        const ingredients = await this.getMenuItemIngredients(menuItemId);
        const missingIngredients = [];

        for (const ingredient of ingredients) {
            const requiredAmount = ingredient.required_amount * quantity;
            if (ingredient.quantity < requiredAmount) {
                missingIngredients.push({
                    id: ingredient.id,
                    name: ingredient.name,
                    required: requiredAmount,
                    available: ingredient.quantity,
                    unit: ingredient.unit
                });
            }
        }

        return {
            canPrepare: missingIngredients.length === 0,
            missingIngredients
        };
    },

    async updateIngredientsForOrder(menuItemId, quantity, client) {
        const ingredients = await this.getMenuItemIngredients(menuItemId);

        for (const ingredient of ingredients) {
            const newQuantity = parseFloat((ingredient.quantity - (ingredient.required_amount * quantity)).toFixed(3));
            if (newQuantity < 0) {
                throw new Error(`Insufficient ${ingredient.name} (${ingredient.unit})`);
            }
            await client.query(
                'UPDATE ingredients SET quantity = $1 WHERE id = $2',
                [newQuantity, ingredient.id]
            );
        }
    },

    async updateOrderStatus(orderId, status) {
        await db.query(
            'UPDATE orders SET status = $1 WHERE id = $2',
            [status, orderId]
        );
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
                
                // Check ingredients availability
                const availability = await this.checkIngredientsAvailability(
                    item.menuItemId,
                    item.quantity
                );
                
                if (!availability.canPrepare) {
                    throw new Error(`Insufficient ingredients for ${menuItem.name}: ${
                        availability.missingIngredients
                            .map(i => `${i.name} (need: ${i.required}${i.unit}, have: ${i.available}${i.unit})`)
                            .join(', ')
                    }`);
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
            
            // Create order with pending status initially
            const orderResult = await client.query(
                'INSERT INTO orders (status, total_amount) VALUES ($1, $2) RETURNING id',
                ['pending', totalAmount]
            );
            const orderId = orderResult.rows[0].id;

            // Create order items and update ingredients
            for (const item of orderItems) {
                await client.query(
                    'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5)',
                    [orderId, item.menuItemId, item.quantity, item.unitPrice, item.subtotal]
                );
                
                // Update ingredients quantities using the same transaction
                await this.updateIngredientsForOrder(item.menuItemId, item.quantity, client);
            }

            // Set order as completed after successful ingredient updates
            await client.query(
                'UPDATE orders SET status = $1 WHERE id = $2',
                ['completed', orderId]
            );

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

    async suggestAlternativeOrder(items) {
        const suggestions = [];
        
        for (const item of items) {
            const menuItem = await this.getMenuItem(item.menuItemId);
            const ingredients = await this.getMenuItemIngredients(item.menuItemId);
            
            // Calculate maximum possible quantity based on available ingredients
            let maxPossibleQuantity = Infinity;
            for (const ingredient of ingredients) {
                const possibleQuantity = Math.floor(ingredient.quantity / ingredient.required_amount);
                maxPossibleQuantity = Math.min(maxPossibleQuantity, possibleQuantity);
            }
            
            if (maxPossibleQuantity < item.quantity && maxPossibleQuantity > 0) {
                suggestions.push({
                    menuItemId: item.menuItemId,
                    name: menuItem.name,
                    originalQuantity: item.quantity,
                    suggestedQuantity: maxPossibleQuantity,
                    available: true
                });
            } else if (maxPossibleQuantity === 0) {
                suggestions.push({
                    menuItemId: item.menuItemId,
                    name: menuItem.name,
                    originalQuantity: item.quantity,
                    suggestedQuantity: 0,
                    available: false
                });
            }
        }
        
        return {
            hasSuggestions: suggestions.length > 0,
            suggestions,
            canPartiallyFulfill: suggestions.some(s => s.suggestedQuantity > 0)
        };
    }
};

module.exports = dbService; 