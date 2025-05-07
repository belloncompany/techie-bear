// In-memory database
const db = {
    menuItems: [
        { id: '1', name: 'Classic Burger', price: '12.99', category: 'mainCourses', description: 'Juicy beef patty with fresh lettuce and tomato' },
        { id: '2', name: 'Grilled Chicken', price: '14.99', category: 'mainCourses', description: 'Tender grilled chicken breast with herbs' },
        { id: '3', name: 'Chips', price: '3.99', category: 'sides', description: 'Crispy hand-cut chips' },
        { id: '4', name: 'Salad', price: '4.99', category: 'sides', description: 'Fresh garden salad' },
        { id: '5', name: 'Chocolate Cake', price: '6.99', category: 'desserts', description: 'Rich chocolate cake' },
        { id: '6', name: 'Ice Cream', price: '4.99', category: 'desserts', description: 'Vanilla ice cream' }
    ],
    orders: new Map(),
    orderIdCounter: 1
};

// Helper function to group menu items by category
const groupMenuItemsByCategory = (items) => {
    return items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});
};

// Database service functions
const dbService = {
    // Get all menu items grouped by category
    getMenuItems: async () => {
        return groupMenuItemsByCategory(db.menuItems);
    },

    // Get a specific menu item by ID
    getMenuItem: async (id) => {
        const item = db.menuItems.find(item => item.id === id);
        if (!item) {
            throw new Error('Menu item not found');
        }
        return item;
    },

    // Check if ingredients are available (simplified)
    checkIngredientsAvailability: async (menuItemId, quantity) => {
        // In this demo, we'll assume all ingredients are always available
        return {
            canPrepare: true,
            missingIngredients: []
        };
    },

    // Create a new order
    createOrder: async (items) => {
        const orderId = db.orderIdCounter++;
        const orderItems = await Promise.all(items.map(async item => {
            const menuItem = await dbService.getMenuItem(item.menuItemId);
            return {
                ...item,
                price: parseFloat(menuItem.price),
                name: menuItem.name
            };
        }));

        const totalAmount = orderItems.reduce((total, item) => 
            total + (item.price * item.quantity), 0);

        const order = {
            id: orderId.toString(),
            items: orderItems,
            totalAmount,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        db.orders.set(orderId.toString(), order);
        return orderId.toString();
    },

    // Get an order by ID
    getOrder: async (id) => {
        const order = db.orders.get(id);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }
};

module.exports = dbService; 