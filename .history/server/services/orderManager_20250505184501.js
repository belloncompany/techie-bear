const dbService = require('./dbService');

// Pure function to check ingredients availability
const checkIngredientsAvailability = async (menuItemId, quantity = 1) => {
    try {
        const menuItem = await dbService.getMenuItem(menuItemId);
        const inventory = await dbService.getIngredients();
        
        if (!menuItem) {
            throw new Error(`Menu item not found: ${menuItemId}`);
        }

        // Get recipe requirements from menu item
        const requiredIngredients = await dbService.getRecipeRequirements(menuItemId);
        
        const missingIngredients = [];
        
        for (const [category, items] of Object.entries(requiredIngredients)) {
            for (const [ingredientId, requiredAmount] of Object.entries(items)) {
                const available = inventory[category]?.[ingredientId];
                if (!available || available.quantity < (requiredAmount * quantity)) {
                    missingIngredients.push({
                        name: available?.name ?? ingredientId,
                        required: requiredAmount * quantity,
                        available: available?.quantity ?? 0,
                        unit: available?.unit ?? 'unknown'
                    });
                }
            }
        }

        return {
            canPrepare: missingIngredients.length === 0,
            missingIngredients
        };
    } catch (error) {
        console.error('Error checking ingredients availability:', error);
        throw error;
    }
};

// Pure function to calculate new inventory after deducting ingredients
const calculateNewInventory = async (orderItems) => {
    try {
        const currentInventory = await dbService.getIngredients();
        const newInventory = JSON.parse(JSON.stringify(currentInventory));

        for (const item of orderItems) {
            const menuItem = await dbService.getMenuItem(item.menuItemId);
            const recipe = await dbService.getRecipeRequirements(item.menuItemId);

            Object.entries(recipe).forEach(([category, ingredients]) => {
                Object.entries(ingredients).forEach(([ingredientId, amount]) => {
                    if (newInventory[category]?.[ingredientId]) {
                        newInventory[category][ingredientId].quantity -= (amount * item.quantity);
                    }
                });
            });
        }

        return newInventory;
    } catch (error) {
        console.error('Error calculating new inventory:', error);
        throw error;
    }
};

// Factory function to create the order manager
const createOrderManager = () => {
    return {
        createOrder: async (items) => {
            try {
                // Validate and check availability for all items
                const orderResult = { processedItems: [], unavailableItems: [] };
                
                for (const item of items) {
                    const availability = await checkIngredientsAvailability(item.menuItemId, item.quantity);
                    
                    if (availability.canPrepare) {
                        orderResult.processedItems.push(item);
                    } else {
                        orderResult.unavailableItems.push({
                            item: item.menuItemId,
                            quantity: item.quantity,
                            missing: availability.missingIngredients
                        });
                    }
                }

                if (orderResult.processedItems.length === 0) {
                    return {
                        orderId: null,
                        success: false,
                        ...orderResult
                    };
                }

                // Calculate and update new inventory
                const newInventory = await calculateNewInventory(orderResult.processedItems);
                await dbService.updateIngredients(newInventory);
                
                // Create the order
                const orderId = await dbService.createOrder(orderResult.processedItems);
                
                return {
                    orderId,
                    success: true,
                    ...orderResult
                };
            } catch (error) {
                console.error('Failed to create order:', error);
                return {
                    orderId: null,
                    success: false,
                    error: 'Failed to create order'
                };
            }
        },
        
        getOrder: (orderId) => dbService.getOrder(orderId),
        getInventory: () => dbService.getIngredients()
    };
};

module.exports = createOrderManager; 