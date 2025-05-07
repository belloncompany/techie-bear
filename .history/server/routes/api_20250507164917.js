const express = require('express');
const router = express.Router();
const dbService = require('../services/dbService');

// Get menu items
router.get('/menu', async (req, res) => {
    try {
        const menuItems = await dbService.getMenuItems();
        res.json(menuItems);
    } catch (error) {
        console.error('Failed to get menu items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get menu item by id
router.get('/menu/:id', async (req, res) => {
    try {
        const menuItem = await dbService.getMenuItem(req.params.id);
        res.json(menuItem);
    } catch (error) {
        if (error.message.includes('not found') || error.message.includes('not available')) {
            res.status(404).json({ error: error.message });
        } else {
            console.error('Failed to get menu item:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Create order
router.post('/orders', async (req, res) => {
    try {
        const { items, acceptSuggestion } = req.body;
        
        // Validate request
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Invalid order items' });
        }

        // Validate each item
        for (const item of items) {
            if (!item.menuItemId || !Number.isInteger(item.quantity) || item.quantity < 1) {
                return res.status(400).json({ 
                    error: 'Invalid item format',
                    details: 'Each item must have menuItemId and quantity (positive integer)'
                });
            }

            try {
                // Check if menu item exists and is available
                await dbService.getMenuItem(item.menuItemId);
            } catch (error) {
                if (error.message.includes('not found') || error.message.includes('not available')) {
                    return res.status(400).json({ 
                        error: 'Invalid menu item',
                        details: error.message 
                    });
                }
                throw error;
            }
        }

        try {
            // Create order - prices are calculated in the service
            const orderId = await dbService.createOrder(items);
            const order = await dbService.getOrder(orderId);
            res.status(201).json(order);
        } catch (error) {
            if (error.message.includes('Insufficient')) {
                // Get alternative suggestions
                const suggestions = await dbService.suggestAlternativeOrder(items);
                
                if (acceptSuggestion && suggestions.canPartiallyFulfill) {
                    // If client accepts suggestions, create order with suggested quantities
                    const adjustedItems = items.map(item => {
                        const suggestion = suggestions.suggestions.find(s => s.menuItemId === item.menuItemId);
                        return {
                            menuItemId: item.menuItemId,
                            quantity: suggestion ? suggestion.suggestedQuantity : item.quantity
                        };
                    }).filter(item => item.quantity > 0);

                    const orderId = await dbService.createOrder(adjustedItems);
                    const order = await dbService.getOrder(orderId);
                    return res.status(201).json({
                        order,
                        adjustedFromSuggestion: true
                    });
                }

                // Return suggestions to client
                return res.status(409).json({
                    error: 'Insufficient ingredients',
                    suggestions
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Failed to create order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get order by id
router.get('/orders/:id', async (req, res) => {
    try {
        const order = await dbService.getOrder(req.params.id);
        res.json(order);
    } catch (error) {
        if (error.message.includes('not found')) {
            res.status(404).json({ error: error.message });
        } else {
            console.error('Failed to get order:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

module.exports = router; 