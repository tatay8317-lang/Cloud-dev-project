import { useEffect, useState } from 'react';
import { getTasks, createTask, deleteTask, updateTask } from './api/taskApi';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './styles/App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (title) => {
    setLoading(true);
    try {
      await createTask(title);
      await loadTasks();
    } catch (err) {
      console.error('Failed to add task:', err);
      alert('Failed to add task');
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await deleteTask(id);
        await loadTasks();
      } catch (err) {
        console.error('Failed to delete task:', err);
        alert('Failed to delete task');
        setLoading(false);
      }
    }
  };

  const handleUpdateTask = async (id, updates) => {
    setLoading(true);
    try {
      await updateTask(id, updates);
      await loadTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
      alert('Failed to update task');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>📝 Task Manager</h1>
          <p>Stay organized and productive</p>
        </header>

        <main className="app-main">
          <TaskForm onAddTask={handleAddTask} loading={loading} />
          {loading && tasks.length === 0 ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading tasks...</p>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
              loading={loading}
            />
          )}
        </main>

        <footer className="app-footer">
          <p>© 2026 Task Manager | Stay productive, stay organized</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
