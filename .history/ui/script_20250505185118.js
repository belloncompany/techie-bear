// API endpoints
const API_BASE_URL = 'http://localhost:3000/api';

// Cart state
let cart = [];
let menuData = {};

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
            <button onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
    `).join('');
    
    totalAmount.textContent = formatPrice(calculateTotal());
};

// API functions
const fetchMenu = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/menu`);
        if (!response.ok) throw new Error('Failed to fetch menu');
        menuData = await response.json();
        return menuData;
    } catch (error) {
        console.error('Error fetching menu:', error);
        alert('Failed to load menu. Please try again later.');
    }
};

const createOrder = async () => {
    try {
        const orderItems = cart.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity
        }));

        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items: orderItems })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create order');
        }

        const order = await response.json();
        return order;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// Cart management functions
const addToCart = async (itemId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/menu/${itemId}`);
        if (!response.ok) throw new Error('Failed to fetch menu item');
        const itemToAdd = await response.json();
        
        if (itemToAdd) {
            const existingItem = cart.find(item => item.id === itemId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ 
                    id: itemToAdd.id,
                    name: itemToAdd.name,
                    price: parseFloat(itemToAdd.price),
                    quantity: 1 
                });
            }
            
            updateCartDisplay();
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        alert('Failed to add item to cart. Please try again.');
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
                <p>${formatPrice(parseFloat(item.price))}</p>
                <p class="description">${item.description || ''}</p>
            </div>
            <button onclick="addToCart('${item.id}')">Add to Cart</button>
        </div>
    `).join('');
};

// Setup purchase button
document.getElementById('purchaseBtn').addEventListener('click', async () => {
    if (cart.length === 0) {
        alert('Please add items to your cart before purchasing.');
        return;
    }
    
    try {
        const order = await createOrder();
        alert(`Order created successfully! Order ID: ${order.id}\nTotal: ${formatPrice(order.totalAmount)}`);
        cart = [];
        updateCartDisplay();
    } catch (error) {
        alert(error.message || 'Failed to create order. Please try again.');
    }
});

// Initialize menu
window.onload = async () => {
    try {
        const menu = await fetchMenu();
        createMenuItems(menu.mainCourses || [], 'mainCourses');
        createMenuItems(menu.sides || [], 'sides');
        createMenuItems(menu.desserts || [], 'desserts');
    } catch (error) {
        console.error('Failed to initialize menu:', error);
    }
}; 