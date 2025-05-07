const fs = require('fs').promises;
const path = require('path');
const db = require('../config/database');
const { initialIngredients } = require('../data/ingredients');

async function initializeDatabase() {
    const client = await db.pool.connect();
    try {
        // Read and execute schema
        const schemaPath = path.join(__dirname, '..', 'migrations', 'init.sql');
        const schema = await fs.readFile(schemaPath, 'utf-8');
        await client.query(schema);

        // Insert initial ingredients
        for (const ingredient of initialIngredients) {
            await client.query(
                'INSERT INTO ingredients (id, name, quantity, unit, category) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET quantity = $3',
                [ingredient.id, ingredient.name, ingredient.quantity, ingredient.unit, ingredient.category]
            );
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Run if called directly
if (require.main === module) {
    initializeDatabase()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = initializeDatabase; 