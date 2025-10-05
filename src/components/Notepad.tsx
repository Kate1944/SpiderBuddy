import { useState } from 'react';
import './Notepad.css';

interface Task {
  id: string;
  text: string;
}

function Notepad() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTask = () => {
    if (inputValue.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: inputValue.trim()
      };
      setTasks([...tasks, newTask]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    console.log('Dragging task:', taskId);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  return (
    <div className="notepad">
      <div className="notepad-header">
        <h3>Ì≥ù Tasks</h3>
      </div>
      
      <div className="notepad-input">
        <input
          type="text"
          placeholder="Add a task..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={addTask}>+</button>
      </div>

      <div className="task-list">
        {tasks.map(task => (
          <div
            key={task.id}
            className="task-item"
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
          >
            <span className="task-drag-handle">‚ãÆ‚ãÆ</span>
            <span className="task-text">{task.text}</span>
            <button 
              className="delete-btn"
              onClick={() => deleteTask(task.id)}
            >
              √ó
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notepad;
