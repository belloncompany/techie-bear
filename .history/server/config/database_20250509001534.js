const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false
    })
  : new Pool({
      user: process.env.POSTGRES_USER || 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      database: process.env.POSTGRES_DB || 'techie_bear',
      password: process.env.POSTGRES_PASSWORD || 'BRUbru--041300',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
    });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};