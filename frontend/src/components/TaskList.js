import React, { useState } from 'react';
import '../styles/TaskList.css';

function TaskList({ tasks, onDelete, onUpdate, loading }) {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim()) {
      alert('Task title cannot be empty');
      return;
    }

    try {
      await onUpdate(id, { title: editTitle.trim() });
      setEditId(null);
      setEditTitle('');
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await onUpdate(id, { completed: !currentStatus });
    } catch (err) {
      alert('Failed to toggle task');
    }
  };

  return (
    <div className="task-list-container">
      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No tasks yet. Add one to get started!</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-content">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task._id, task.completed)}
                  className="task-checkbox"
                  disabled={loading}
                />

                {editId === task._id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-input"
                    autoFocus
                  />
                ) : (
                  <span className="task-title">{task.title}</span>
                )}
              </div>

              <div className="task-actions">
                {editId === task._id ? (
                  <>
                    <button
                      className="save-btn"
                      onClick={() => handleSaveEdit(task._id)}
                      disabled={loading}
                    >
                      ✅ Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setEditId(null)}
                      disabled={loading}
                    >
                      ❌ Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(task)}
                      disabled={loading}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => onDelete(task._id)}
                      disabled={loading}
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {tasks.length > 0 && (
        <div className="task-stats">
          <span>Total: {tasks.length}</span>
          <span>Completed: {tasks.filter(t => t.completed).length}</span>
          <span>Remaining: {tasks.filter(t => !t.completed).length}</span>
        </div>
      )}
    </div>
  );
}

export default TaskList;
