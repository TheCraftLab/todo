import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const todoCount = useMemo(() => todos.length, [todos]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const res = await axios.get(`${API_BASE}/todos`);
        setTodos(res.data);
      } catch (err) {
        console.error(err);
        setError('Unable to load todos. Check backend/API routing.');
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const addTodo = async (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || saving) return;

    setSaving(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE}/todos`, { text: trimmed });
      setTodos((prev) => [...prev, res.data]);
      setText('');
    } catch (err) {
      console.error(err);
      setError('Unable to create todo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <main style={styles.card}>
        <header style={styles.header}>
          <h1 style={styles.title}>Todo SaaS</h1>
          <p style={styles.subtitle}>Simple, self-hosted task tracker</p>
          <div style={styles.badge}>{todoCount} item(s)</div>
        </header>

        <form onSubmit={addTodo} style={styles.form}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new todo"
            style={styles.input}
            maxLength={200}
          />
          <button type="submit" style={styles.button} disabled={saving}>
            {saving ? 'Saving...' : 'Add'}
          </button>
        </form>

        {error ? <div style={styles.error}>{error}</div> : null}

        <section style={styles.listWrap}>
          {loading ? (
            <p style={styles.hint}>Loading...</p>
          ) : todos.length === 0 ? (
            <p style={styles.hint}>No todos yet.</p>
          ) : (
            <ul style={styles.list}>
              {todos.map((todo) => (
                <li key={todo.id} style={styles.item}>
                  <span>{todo.text}</span>
                  {todo.created_at ? (
                    <small style={styles.date}>
                      {new Date(todo.created_at).toLocaleString()}
                    </small>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    margin: 0,
    background:
      'linear-gradient(135deg, #f8fafc 0%, #e6f2ff 55%, #fff7ed 100%)',
    padding: '32px 16px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: '#102a43'
  },
  card: {
    maxWidth: 760,
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: 18,
    boxShadow: '0 20px 40px rgba(16, 42, 67, 0.12)',
    border: '1px solid #d9e2ec',
    overflow: 'hidden'
  },
  header: {
    padding: '28px 24px 14px',
    borderBottom: '1px solid #e4ecf3'
  },
  title: {
    margin: 0,
    fontSize: 34,
    lineHeight: 1.1
  },
  subtitle: {
    margin: '8px 0 0',
    color: '#486581'
  },
  badge: {
    marginTop: 12,
    display: 'inline-block',
    background: '#e1effe',
    color: '#0b4f8a',
    padding: '6px 10px',
    borderRadius: 999,
    fontWeight: 600,
    fontSize: 12
  },
  form: {
    display: 'flex',
    gap: 12,
    padding: 24,
    borderBottom: '1px solid #e4ecf3'
  },
  input: {
    flex: 1,
    height: 46,
    border: '1px solid #bcccdc',
    borderRadius: 12,
    padding: '0 14px',
    fontSize: 16,
    outline: 'none'
  },
  button: {
    height: 46,
    border: 0,
    borderRadius: 12,
    background: '#0b69a3',
    color: '#fff',
    fontWeight: 700,
    padding: '0 18px',
    cursor: 'pointer'
  },
  error: {
    margin: '16px 24px 0',
    background: '#ffe3e3',
    border: '1px solid #ffb3b3',
    color: '#8a1c1c',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 14
  },
  listWrap: {
    padding: 24
  },
  hint: {
    margin: 0,
    color: '#486581'
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'grid',
    gap: 10
  },
  item: {
    border: '1px solid #d9e2ec',
    borderRadius: 12,
    padding: '12px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'center'
  },
  date: {
    color: '#627d98',
    fontSize: 12,
    whiteSpace: 'nowrap'
  }
};

export default App;
