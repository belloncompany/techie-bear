// Initial ingredients data for database seeding
const initialIngredients = [
    { id: 'p1', name: 'Cod Fish', quantity: 100, unit: 'pieces', category: 'proteins' },
    { id: 'p2', name: 'Ground Beef', quantity: 50, unit: 'kg', category: 'proteins' },
    { id: 'p3', name: 'Chicken Breast', quantity: 75, unit: 'pieces', category: 'proteins' },
    { id: 'v1', name: 'Green Peas', quantity: 30, unit: 'kg', category: 'vegetables' },
    { id: 'v2', name: 'Potatoes', quantity: 100, unit: 'kg', category: 'vegetables' },
    { id: 'v3', name: 'Lettuce', quantity: 40, unit: 'heads', category: 'vegetables' },
    { id: 'e1', name: 'Flour', quantity: 50, unit: 'kg', category: 'extras' },
    { id: 'e2', name: 'Butter', quantity: 30, unit: 'kg', category: 'extras' },
    { id: 'e3', name: 'Apples', quantity: 60, unit: 'kg', category: 'extras' }
];

// Recipe requirements remain unchanged
const recipeRequirements = Object.freeze({
    'Fish & Chips': Object.freeze({
        proteins: Object.freeze({ p1: 1 }),
        vegetables: Object.freeze({ v2: 0.3 }),
        extras: Object.freeze({ e1: 0.2 })
    }),
    'Shepherd\'s Pie': Object.freeze({
        proteins: Object.freeze({ p2: 0.3 }),
        vegetables: Object.freeze({ v2: 0.4, v1: 0.1 })
    }),
    'Sunday Roast': Object.freeze({
        proteins: Object.freeze({ p2: 0.4 }),
        vegetables: Object.freeze({ v2: 0.3 })
    }),
    'Mushy Peas': Object.freeze({
        vegetables: Object.freeze({ v1: 0.2 })
    }),
    'Chips': Object.freeze({
        vegetables: Object.freeze({ v2: 0.3 })
    }),
    'Garden Salad': Object.freeze({
        vegetables: Object.freeze({ v3: 1 })
    }),
    'Sticky Toffee Pudding': Object.freeze({
        extras: Object.freeze({ e1: 0.15, e2: 0.1 })
    }),
    'Apple Crumble': Object.freeze({
        extras: Object.freeze({ e3: 0.3, e1: 0.1, e2: 0.1 })
    }),
    'Bread & Butter Pudding': Object.freeze({
        extras: Object.freeze({ e1: 0.2, e2: 0.15 })
    })
});

module.exports = {
    initialIngredients,
    recipeRequirements
}; 