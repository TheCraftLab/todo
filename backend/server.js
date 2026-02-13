const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Routes To-Do
app.get('/todos', async (req, res) => {
  const result = await pool.query('SELECT * FROM todos ORDER BY id ASC');
  res.json(result.rows);
});

app.post('/todos', async (req, res) => {
  const { text } = req.body;
  const result = await pool.query('INSERT INTO todos(text) VALUES() RETURNING *', [text]);
  res.json(result.rows[0]);
});

app.listen(3000, () => console.log('Backend running on port 3000'));
