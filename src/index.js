require('dotenv').config();
const express = require('express');
const router = require('./routes');

const app = express();
app.use(express.json());
app.use('/', router);

const db = require('./db');
db.query('SELECT 1', (err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
  } else {
    console.log('Database connected successfully');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});