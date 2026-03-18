import React, { useState } from 'react';
import '../styles/TaskForm.css';

function TaskForm({ onAddTask, loading }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title cannot be empty');
      return;
    }

    try {
      await onAddTask(title.trim());
      setTitle('');
    } catch (err) {
      setError('Failed to add task. Please try again.');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          placeholder="✍️ Add a new task..."
          className="task-input"
          disabled={loading}
        />
        <button
          type="submit"
          className="add-btn"
          disabled={loading}
        >
          {loading ? 'Adding...' : '➕ Add Task'}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default TaskForm;
