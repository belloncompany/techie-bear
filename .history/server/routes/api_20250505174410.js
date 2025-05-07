const express = require('express');
const router = express.Router();
const dbService = require('../services/dbService');
const createOrderManager = require('../services/orderManager');

const orderManager = createOrderManager();

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
        if (error.message.includes('not found')) {
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
        const { items } = req.body;
        
        // Validate request
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Invalid order items' });
        }

        // Validate each item
        for (const item of items) {
            if (!item.menuItemId || !item.quantity || item.quantity < 1) {
                return res.status(400).json({ error: 'Invalid item format' });
            }
        }

        // Check ingredients availability
        const inventory = await dbService.getIngredients();
        const orderItems = [];
        
        for (const item of items) {
            const menuItem = await dbService.getMenuItem(item.menuItemId);
            const availability = orderManager.checkIngredientsAvailability(inventory, menuItem.name, item.quantity);
            
            if (!availability.canPrepare) {
                return res.status(400).json({
                    error: 'Insufficient ingredients',
                    details: availability.missingIngredients
                });
            }
            
            orderItems.push({
                menuItemId: item.menuItemId,
                quantity: item.quantity
            });
        }

        // Create order and update inventory
        const orderId = await dbService.createOrder(orderItems);
        const order = await dbService.getOrder(orderId);
        
        res.status(201).json(order);
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