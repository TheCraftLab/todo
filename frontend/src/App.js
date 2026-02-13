import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/todos').then(res => setTodos(res.data));
  }, []);

  const addTodo = async () => {
    if (!text) return;
    const res = await axios.post('http://localhost:3000/todos', { text });
    setTodos([...todos, res.data]);
    setText('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Todo SaaS</h1>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="New todo" />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
      </ul>
    </div>
  );
}

export default App;
