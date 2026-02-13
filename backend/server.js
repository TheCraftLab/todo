const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/todos', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, text, created_at FROM todos ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('GET /todos failed:', error);
    res.status(500).json({ error: 'internal_error' });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const text = (req.body?.text || '').trim();
    if (!text) {
      return res.status(400).json({ error: 'text_required' });
    }

    const result = await pool.query(
      'INSERT INTO todos(text) VALUES($1) RETURNING id, text, created_at',
      [text]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST /todos failed:', error);
    res.status(500).json({ error: 'internal_error' });
  }
});

const port = Number(process.env.PORT) || 3000;

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
