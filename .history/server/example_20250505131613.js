const OrderManager = require('./orderManager');

// Create a new instance of OrderManager
const orderManager = new OrderManager();

// Example: Create an order with multiple items
const orderItems = [
    { name: 'Fish & Chips', quantity: 2 },
    { name: 'Apple Crumble', quantity: 1 },
    { name: 'Garden Salad', quantity: 1 }
];

console.log('Creating new order...');
const orderResult = orderManager.createOrder(orderItems);
console.log('Order result:', JSON.stringify(orderResult, null, 2));

if (orderResult.orderId) {
    // Get the order details
    console.log('\nRetrieving order details...');
    const orderDetails = orderManager.getOrder(orderResult.orderId);
    console.log('Order details:', JSON.stringify(orderDetails, null, 2));
}

// Check current inventory levels
console.log('\nCurrent inventory levels:');
const inventory = orderManager.getInventory();
console.log(JSON.stringify(inventory, null, 2)); 