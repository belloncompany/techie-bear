const { recipeRequirements } = require('../data/ingredients');
const dbService = require('../db/dbService');

// Pure function to check ingredients availability
const checkIngredientsAvailability = (ingredients, dishName, quantity = 1) => {
    const recipe = recipeRequirements[dishName];
    if (!recipe) {
        throw new Error(`Recipe not found for dish: ${dishName}`);
    }

    const missingIngredients = Object.entries(recipe)
        .flatMap(([category, items]) => 
            Object.entries(items)
                .map(([ingredientId, requiredAmount]) => {
                    const available = ingredients[category]?.[ingredientId];
                    return (!available || available.quantity < (requiredAmount * quantity))
                        ? {
                            name: available?.name ?? ingredientId,
                            required: requiredAmount * quantity,
                            available: available?.quantity ?? 0,
                            unit: available?.unit ?? 'unknown'
                        }
                        : null;
                })
                .filter(Boolean)
        );

    return {
        canPrepare: missingIngredients.length === 0,
        missingIngredients
    };
};

// Pure function to calculate new inventory after deducting ingredients
const calculateNewInventory = (currentInventory, items) => {
    const newInventory = JSON.parse(JSON.stringify(currentInventory));

    items.forEach(item => {
        const recipe = recipeRequirements[item.name];
        Object.entries(recipe).forEach(([category, ingredients]) => {
            Object.entries(ingredients).forEach(([ingredientId, amount]) => {
                newInventory[category][ingredientId].quantity -= (amount * item.quantity);
            });
        });
    });

    return newInventory;
};

// Factory function to create the order manager
const createOrderManager = () => {
    return {
        createOrder: async (items) => {
            const inventory = await dbService.getIngredients();
            
            const orderResult = items.reduce((acc, item) => {
                const availability = checkIngredientsAvailability(inventory, item.name, item.quantity);
                
                if (availability.canPrepare) {
                    return {
                        ...acc,
                        processedItems: [...acc.processedItems, item]
                    };
                }
                
                return {
                    ...acc,
                    unavailableItems: [...acc.unavailableItems, {
                        item: item.name,
                        quantity: item.quantity,
                        missing: availability.missingIngredients
                    }]
                };
            }, { processedItems: [], unavailableItems: [] });

            if (orderResult.processedItems.length === 0) {
                return {
                    orderId: null,
                    success: false,
                    ...orderResult
                };
            }

            const newInventory = calculateNewInventory(inventory, orderResult.processedItems);
            
            try {
                await dbService.updateIngredients(newInventory);
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