// API endpoints
//const API_BASE_URL = 'http://localhost:3000/api';
const API_BASE_URL = 'https://techie-bear-production.up.railway.app/api';

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

const createOrder = async (acceptSuggestion = false) => {
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
            body: JSON.stringify({ 
                items: orderItems,
                acceptSuggestion 
            })
        });

        const responseData = await response.json();
        console.log('Order response:', responseData); // Debug log

        if (!response.ok) {
            if (response.status === 409) {
                if (responseData.suggestions && responseData.suggestions.length > 0) {
                    // Format suggestions message
                    const suggestionsMessage = responseData.suggestions
                        .map(s => {
                            if (s.suggestedQuantity > 0) {
                                return `- ${s.name}: We can prepare ${s.suggestedQuantity} instead of ${s.originalQuantity}`;
                            } else {
                                return `- ${s.name}: Currently unavailable`;
                            }
                        })
                        .join('\n');

                    // Show modal or confirmation dialog with suggestions
                    const wantsSuggestion = confirm(
                        `Some items are not available in the requested quantities:\n\n${suggestionsMessage}\n\nWould you like to proceed with the suggested quantities?`
                    );

                    if (wantsSuggestion) {
                        // Update cart with suggested quantities
                        cart = cart.map(item => {
                            const suggestion = responseData.suggestions.find(s => s.menuItemId === item.id);
                            if (suggestion) {
                                return {
                                    ...item,
                                    quantity: suggestion.suggestedQuantity
                                };
                            }
                            return item;
                        }).filter(item => item.quantity > 0);

                        // Update cart display
                        updateCartDisplay();

                        // Try again with suggested quantities
                        return await createOrder(true);
                    } else {
                        throw new Error('Order cancelled - Please adjust quantities manually');
                    }
                } else if (responseData.unavailableItems) {
                    const unavailableMessage = responseData.unavailableItems
                        .map(item => {
                            const missingList = item.missingIngredients
                                .map(ing => `${ing.name}: need ${ing.required}${ing.unit}, have ${ing.available}${ing.unit}`)
                                .join(', ');
                            return `- ${item.name}: Missing ingredients (${missingList})`;
                        })
                        .join('\n');
                    throw new Error(`Cannot prepare some items:\n${unavailableMessage}`);
                }
            }
            throw new Error(responseData.error || 'Failed to create order');
        }

        return responseData;
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

        // Check if item is available
        if (!menuItem.isAvailable) {
            alert('Sorry, this item is currently not available.');
            return;
        }
        
        const existingItem = cart.find(item => item.id === itemId);
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        
        // Check if adding one more would exceed the maximum possible quantity
        if (menuItem.maxPossibleQuantity !== null && 
            currentQuantity + 1 > menuItem.maxPossibleQuantity) {
            alert(`Sorry, we can only prepare up to ${menuItem.maxPossibleQuantity} of this item.`);
            return;
        }
        
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
                ${Array.isArray(items) ? items.map(item => {
                    const unavailableClass = !item.isAvailable ? 'menu-item-unavailable' : '';
                    
                    // Create availability message
                    let availabilityMessage = '';
                    if (!item.isAvailable && item.unavailableIngredients) {
                        const missingList = item.unavailableIngredients
                            .map(i => `${i.name} (need: ${i.required}${i.unit}, have: ${i.available}${i.unit})`)
                            .join(', ');
                        availabilityMessage = `
                            <div class="unavailable-message">
                                Currently unavailable due to missing ingredients:<br>
                                ${missingList}
                            </div>`;
                    }
                    
                    // Create quantity indicator
                    let quantityIndicator = '';
                    if (item.isAvailable && item.maxPossibleQuantity !== null) {
                        const quantityClass = item.maxPossibleQuantity <= 3 ? 'quantity-danger' : 'quantity-warning';
                        quantityIndicator = `
                            <span class="quantity-indicator ${quantityClass}">
                                Only ${item.maxPossibleQuantity} available
                            </span>`;
                    }
                    
                    return `
                        <div class="menu-item ${unavailableClass}" ${!item.isAvailable ? 'title="Currently Unavailable"' : ''}>
                            <div>
                                <h3>
                                    ${item.name}
                                    ${quantityIndicator}
                                </h3>
                                <p>${formatPrice(parseFloat(item.price))}</p>
                                <p class="description">${item.description || ''}</p>
                                ${availabilityMessage}
                                ${item.isAvailable && item.maxPossibleQuantity !== null ? `
                                    <div class="max-quantity-message">
                                        Maximum order quantity: ${item.maxPossibleQuantity}
                                    </div>
                                ` : ''}
                            </div>
                            <button 
                                onclick="addToCart('${item.id}')"
                                ${!item.isAvailable ? 'disabled' : ''}
                                title="${!item.isAvailable ? 'This item is currently unavailable' : 
                                       item.maxPossibleQuantity !== null ? `Maximum quantity: ${item.maxPossibleQuantity}` : ''}"
                            >
                                ${item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                            </button>
                        </div>
                    `;
                }).join('') : ''}
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
        // Show error message in a more user-friendly way
        const errorMessage = error.message.includes('\n') 
            ? error.message 
            : 'Failed to create order. Please try again.';
        alert(errorMessage);
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