const fs = require('fs');
const path = require('path');
const db = require('../config/database');

const sql = fs.readFileSync(path.join(__dirname, 'init-db.sql')).toString();

db.pool.query(sql)
  .then(() => {
    console.log('Database initialized');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error initializing database:', err);
    process.exit(1);
  });