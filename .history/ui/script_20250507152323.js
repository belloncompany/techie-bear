// API endpoints
const API_BASE_URL = 'http://localhost:3000/api';

// Cart state
let cart = [];
let menuItems = {};

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
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch menu');
        }
        const data = await response.json();
        console.log('Menu data:', data); // Debug log
        menuItems = data;
        return data;
    } catch (error) {
        console.error('Error fetching menu:', error);
        throw error;
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
        // Find item in menuItems (search through all categories)
        let menuItem = null;
        for (const category in menuItems) {
            const found = menuItems[category].find(item => item.id === itemId);
            if (found) {
                menuItem = found;
                break;
            }
        }
        
        if (!menuItem) {
            throw new Error('Item not found in menu');
        }
        
        const existingItem = cart.find(item => item.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ 
                id: menuItem.id,
                name: menuItem.name,
                price: parseFloat(menuItem.price),
                quantity: 1 
            });
        }
        
        updateCartDisplay();
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
const createMenuItems = (menuData) => {
    const container = document.getElementById('menu-items');
    if (!container) {
        console.error('Menu container not found');
        return;
    }
    
    console.log('Creating menu with data:', menuData); // Debug log
    
    if (!menuData || typeof menuData !== 'object') {
        console.error('Invalid menu data:', menuData);
        return;
    }
    
    const menuHtml = Object.entries(menuData).map(([category, items]) => `
        <div class="menu-category">
            <h3 class="category-title">${category}</h3>
            <div class="category-items">
                ${Array.isArray(items) ? items.map(item => `
                    <div class="menu-item">
                        <div>
                            <h3>${item.name}</h3>
                            <p>${formatPrice(parseFloat(item.price))}</p>
                            <p class="description">${item.description || ''}</p>
                        </div>
                        <button onclick="addToCart('${item.id}')">Add to Cart</button>
                    </div>
                `).join('') : ''}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = menuHtml;
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
        console.log('Menu loaded:', menu); // Debug log
        createMenuItems(menu);
    } catch (error) {
        console.error('Failed to initialize menu:', error);
        alert('Failed to load menu. Please try again later.');
    }
}; 