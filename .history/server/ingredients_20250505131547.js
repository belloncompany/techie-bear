// In-memory ingredients storage
const ingredients = {
    proteins: {
        fish: { id: 'p1', name: 'Cod Fish', quantity: 100, unit: 'pieces' },
        beef: { id: 'p2', name: 'Ground Beef', quantity: 50, unit: 'kg' },
        chicken: { id: 'p3', name: 'Chicken Breast', quantity: 75, unit: 'pieces' }
    },
    vegetables: {
        peas: { id: 'v1', name: 'Green Peas', quantity: 30, unit: 'kg' },
        potatoes: { id: 'v2', name: 'Potatoes', quantity: 100, unit: 'kg' },
        lettuce: { id: 'v3', name: 'Lettuce', quantity: 40, unit: 'heads' }
    },
    extras: {
        flour: { id: 'e1', name: 'Flour', quantity: 50, unit: 'kg' },
        butter: { id: 'e2', name: 'Butter', quantity: 30, unit: 'kg' },
        apples: { id: 'e3', name: 'Apples', quantity: 60, unit: 'kg' }
    }
};

// Recipe requirements for each menu item
const recipeRequirements = {
    'Fish & Chips': {
        proteins: { fish: 1 },
        vegetables: { potatoes: 0.3 },
        extras: { flour: 0.2 }
    },
    'Shepherd\'s Pie': {
        proteins: { beef: 0.3 },
        vegetables: { potatoes: 0.4, peas: 0.1 }
    },
    'Sunday Roast': {
        proteins: { beef: 0.4 },
        vegetables: { potatoes: 0.3 }
    },
    'Mushy Peas': {
        vegetables: { peas: 0.2 }
    },
    'Chips': {
        vegetables: { potatoes: 0.3 }
    },
    'Garden Salad': {
        vegetables: { lettuce: 1 }
    },
    'Sticky Toffee Pudding': {
        extras: { flour: 0.15, butter: 0.1 }
    },
    'Apple Crumble': {
        extras: { apples: 0.3, flour: 0.1, butter: 0.1 }
    },
    'Bread & Butter Pudding': {
        extras: { flour: 0.2, butter: 0.15 }
    }
};

module.exports = {
    ingredients,
    recipeRequirements
}; 