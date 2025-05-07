const { ingredients, recipeRequirements } = require('./ingredients');

class OrderManager {
    constructor() {
        this.ingredients = JSON.parse(JSON.stringify(ingredients)); // Deep copy of ingredients
        this.orders = new Map();
        this.nextOrderId = 1;
    }

    // Check if we have enough ingredients for a dish
    checkIngredientsAvailability(dishName, quantity = 1) {
        const recipe = recipeRequirements[dishName];
        if (!recipe) {
            throw new Error(`Recipe not found for dish: ${dishName}`);
        }

        const missingIngredients = [];

        for (const [category, items] of Object.entries(recipe)) {
            for (const [ingredient, requiredAmount] of Object.entries(items)) {
                const available = this.ingredients[category][ingredient];
                if (!available || available.quantity < (requiredAmount * quantity)) {
                    missingIngredients.push({
                        name: available ? available.name : ingredient,
                        required: requiredAmount * quantity,
                        available: available ? available.quantity : 0,
                        unit: available ? available.unit : 'unknown'
                    });
                }
            }
        }

        return {
            canPrepare: missingIngredients.length === 0,
            missingIngredients
        };
    }

    // Create a new order
    createOrder(items) {
        const orderId = this.nextOrderId++;
        const orderItems = [];
        const unavailableItems = [];

        // Check each item in the order
        for (const item of items) {
            const availability = this.checkIngredientsAvailability(item.name, item.quantity);
            
            if (availability.canPrepare) {
                orderItems.push(item);
            } else {
                unavailableItems.push({
                    item: item.name,
                    quantity: item.quantity,
                    missing: availability.missingIngredients
                });
            }
        }

        // If we can prepare at least some items, create the order
        if (orderItems.length > 0) {
            this.orders.set(orderId, {
                id: orderId,
                items: orderItems,
                status: 'pending',
                createdAt: new Date()
            });

            // Deduct ingredients for the order
            this.deductIngredients(orderItems);
        }

        return {
            orderId: orderItems.length > 0 ? orderId : null,
            success: orderItems.length > 0,
            processedItems: orderItems,
            unavailableItems
        };
    }

    // Deduct ingredients used in an order
    deductIngredients(items) {
        for (const item of items) {
            const recipe = recipeRequirements[item.name];
            
            for (const [category, ingredients] of Object.entries(recipe)) {
                for (const [ingredient, amount] of Object.entries(ingredients)) {
                    this.ingredients[category][ingredient].quantity -= (amount * item.quantity);
                }
            }
        }
    }

    // Get order status
    getOrder(orderId) {
        const order = this.orders.get(orderId);
        if (!order) {
            throw new Error(`Order not found: ${orderId}`);
        }
        return order;
    }

    // Get current ingredients inventory
    getInventory() {
        return this.ingredients;
    }
}

module.exports = OrderManager; 