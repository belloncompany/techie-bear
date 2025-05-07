const createOrderManager = require('./orderManager');

// Create a new order manager instance
const orderManager = createOrderManager();

// Example order items
const orderItems = [
    { name: 'Fish & Chips', quantity: 2 },
    { name: 'Apple Crumble', quantity: 1 },
    { name: 'Garden Salad', quantity: 1 }
];

// Create an order and handle the result using functional composition
const processOrder = (items) => {
    console.log('Creating new order...');
    const orderResult = orderManager.createOrder(items);
    console.log('Order result:', JSON.stringify(orderResult, null, 2));
    
    return orderResult;
};

const displayOrderDetails = (orderResult) => {
    if (orderResult.orderId) {
        console.log('\nRetrieving order details...');
        const orderDetails = orderManager.getOrder(orderResult.orderId);
        console.log('Order details:', JSON.stringify(orderDetails, null, 2));
    }
    return orderResult;
};

const displayInventory = () => {
    console.log('\nCurrent inventory levels:');
    const inventory = orderManager.getInventory();
    console.log(JSON.stringify(inventory, null, 2));
};

// Process the order using function composition
Promise.resolve(orderItems)
    .then(processOrder)
    .then(displayOrderDetails)
    .then(() => displayInventory())
    .catch(error => console.error('Error processing order:', error)); 