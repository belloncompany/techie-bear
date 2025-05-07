// Immutable ingredients data
const ingredients = Object.freeze({
    proteins: Object.freeze({
        fish: Object.freeze({ id: 'p1', name: 'Cod Fish', quantity: 100, unit: 'pieces' }),
        beef: Object.freeze({ id: 'p2', name: 'Ground Beef', quantity: 50, unit: 'kg' }),
        chicken: Object.freeze({ id: 'p3', name: 'Chicken Breast', quantity: 75, unit: 'pieces' })
    }),
    vegetables: Object.freeze({
        peas: Object.freeze({ id: 'v1', name: 'Green Peas', quantity: 30, unit: 'kg' }),
        potatoes: Object.freeze({ id: 'v2', name: 'Potatoes', quantity: 100, unit: 'kg' }),
        lettuce: Object.freeze({ id: 'v3', name: 'Lettuce', quantity: 40, unit: 'heads' })
    }),
    extras: Object.freeze({
        flour: Object.freeze({ id: 'e1', name: 'Flour', quantity: 50, unit: 'kg' }),
        butter: Object.freeze({ id: 'e2', name: 'Butter', quantity: 30, unit: 'kg' }),
        apples: Object.freeze({ id: 'e3', name: 'Apples', quantity: 60, unit: 'kg' })
    })
});

// Immutable recipe requirements
const recipeRequirements = Object.freeze({
    'Fish & Chips': Object.freeze({
        proteins: Object.freeze({ fish: 1 }),
        vegetables: Object.freeze({ potatoes: 0.3 }),
        extras: Object.freeze({ flour: 0.2 })
    }),
    'Shepherd\'s Pie': Object.freeze({
        proteins: Object.freeze({ beef: 0.3 }),
        vegetables: Object.freeze({ potatoes: 0.4, peas: 0.1 })
    }),
    'Sunday Roast': Object.freeze({
        proteins: Object.freeze({ beef: 0.4 }),
        vegetables: Object.freeze({ potatoes: 0.3 })
    }),
    'Mushy Peas': Object.freeze({
        vegetables: Object.freeze({ peas: 0.2 })
    }),
    'Chips': Object.freeze({
        vegetables: Object.freeze({ potatoes: 0.3 })
    }),
    'Garden Salad': Object.freeze({
        vegetables: Object.freeze({ lettuce: 1 })
    }),
    'Sticky Toffee Pudding': Object.freeze({
        extras: Object.freeze({ flour: 0.15, butter: 0.1 })
    }),
    'Apple Crumble': Object.freeze({
        extras: Object.freeze({ apples: 0.3, flour: 0.1, butter: 0.1 })
    }),
    'Bread & Butter Pudding': Object.freeze({
        extras: Object.freeze({ flour: 0.2, butter: 0.15 })
    })
});

module.exports = {
    ingredients,
    recipeRequirements
}; 