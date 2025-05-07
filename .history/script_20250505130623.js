// Menu data
const menuData = {
    mainCourses: [
        { id: 1, name: 'Fish & Chips', price: 12.99 },
        { id: 2, name: 'Shepherd\'s Pie', price: 11.99 },
        { id: 3, name: 'Sunday Roast', price: 14.99 }
    ],
    sides: [
        { id: 4, name: 'Mushy Peas', price: 3.99 },
        { id: 5, name: 'Chips', price: 3.49 },
        { id: 6, name: 'Garden Salad', price: 4.99 }
    ],
    desserts: [
        { id: 7, name: 'Sticky Toffee Pudding', price: 5.99 },
        { id: 8, name: 'Apple Crumble', price: 5.49 },
        { id: 9, name: 'Bread & Butter Pudding', price: 5.99 }
    ]
};

// Cart state
let cart = [];

// Helper functions
const formatPrice = (price) => `£${price.toFixed(2)}`;

const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const updateCartDisplay = () => {
    const cartItems = document.getElementById('cartItems');
    const totalAmount = document.getElementById('totalAmount');
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} x${item.quantity}</span>
            <span>${formatPrice(item.price * item.quantity)}</span>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');
    
    totalAmount.textContent = formatPrice(calculateTotal());
};

// Cart management functions
const addToCart = (itemId) => {
    const allItems = [...menuData.mainCourses, ...menuData.sides, ...menuData.desserts];
    const itemToAdd = allItems.find(item => item.id === itemId);
    
    if (itemToAdd) {
        const existingItem = cart.find(item => item.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...itemToAdd, quantity: 1 });
        }
        
        updateCartDisplay();
    }
};

const removeFromCart = (itemId) => {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
        
        updateCartDisplay();
    }
};

// Initialize menu display
const createMenuItems = (items, containerId) => {
    const container = document.getElementById(containerId);
    
    container.innerHTML = items.map(item => `
        <div class="menu-item">
            <div>
                <h3>${item.name}</h3>
                <p>${formatPrice(item.price)}</p>
            </div>
            <button onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
    `).join('');
};

// Setup purchase button
document.getElementById('purchaseBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Please add items to your cart before purchasing.');
        return;
    }
    
    const total = calculateTotal();
    alert(`Thank you for your order! Total: ${formatPrice(total)}`);
    cart = [];
    updateCartDisplay();
});

// Initialize menu
window.onload = () => {
    createMenuItems(menuData.mainCourses, 'mainCourses');
    createMenuItems(menuData.sides, 'sides');
    createMenuItems(menuData.desserts, 'desserts');
}; 