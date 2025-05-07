const { ingredients: initialIngredients, recipeRequirements } = require('./ingredients');

// Pure function to check ingredients availability
const checkIngredientsAvailability = (ingredients, dishName, quantity = 1) => {
    const recipe = recipeRequirements[dishName];
    if (!recipe) {
        throw new Error(`Recipe not found for dish: ${dishName}`);
    }

    const missingIngredients = Object.entries(recipe)
        .flatMap(([category, items]) => 
            Object.entries(items)
                .map(([ingredient, requiredAmount]) => {
                    const available = ingredients[category]?.[ingredient];
                    return (!available || available.quantity < (requiredAmount * quantity))
                        ? {
                            name: available?.name ?? ingredient,
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
            Object.entries(ingredients).forEach(([ingredient, amount]) => {
                newInventory[category][ingredient].quantity -= (amount * item.quantity);
            });
        });
    });

    return Object.freeze(newInventory);
};

// Pure function to create an order
const createOrder = (orderState, items) => {
    const { inventory, orders, nextOrderId } = orderState;
    
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
            orderState,
            result: {
                orderId: null,
                success: false,
                ...orderResult
            }
        };
    }

    const newOrder = Object.freeze({
        id: nextOrderId,
        items: orderResult.processedItems,
        status: 'pending',
        createdAt: new Date()
    });

    const newInventory = calculateNewInventory(inventory, orderResult.processedItems);
    
    const newOrderState = Object.freeze({
        inventory: newInventory,
        orders: new Map([...orders, [nextOrderId, newOrder]]),
        nextOrderId: nextOrderId + 1
    });

    return {
        orderState: newOrderState,
        result: {
            orderId: nextOrderId,
            success: true,
            ...orderResult
        }
    };
};

// Pure function to get order details
const getOrder = (orders, orderId) => {
    const order = orders.get(orderId);
    if (!order) {
        throw new Error(`Order not found: ${orderId}`);
    }
    return order;
};

// Create the initial state
const createInitialState = () => Object.freeze({
    inventory: initialIngredients,
    orders: new Map(),
    nextOrderId: 1
});

// Factory function to create the order manager
const createOrderManager = () => {
    let state = createInitialState();

    return {
        createOrder: (items) => {
            const { orderState, result } = createOrder(state, items);
            state = orderState;
            return result;
        },
        
        getOrder: (orderId) => getOrder(state.orders, orderId),
        
        getInventory: () => state.inventory
    };
};

module.exports = createOrderManager; 