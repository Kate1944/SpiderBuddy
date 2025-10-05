import { useState } from 'react';
import './Notepad.css';

interface Task {
  id: string;
  text: string;
}

interface NotepadProps {
  onTaskDropped?: (taskId: string) => void;
}

function Notepad({ onTaskDropped }: NotepadProps) {
  const [taskLists, setTaskLists] = useState<Task[][]>([[]]); // Array of lists
  const [currentListIndex, setCurrentListIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');

  //allow users to edit the list (doesn't work yet...ugh)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');


  const currentTasks = taskLists[currentListIndex] || [];

  const addTask = () => {
    if (inputValue.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: inputValue.trim()
      };
      
      const updatedLists = [...taskLists];
      updatedLists[currentListIndex] = [...currentTasks, newTask];
      setTaskLists(updatedLists);
      setInputValue('');
    }
  };

  const updateTask = (taskId: string, newText: string) => {
  const updatedLists = [...taskLists];
  const updatedTasks = currentTasks.map(task =>
    task.id === taskId ? { ...task, text: newText } : task
  );
  updatedLists[currentListIndex] = updatedTasks;
  setTaskLists(updatedLists);
  setEditingTaskId(null);
};


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    // Drag the entire list
    const listId = `list-${currentListIndex}-${Date.now()}`;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', listId);
    console.log('Dragging entire list:', listId);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Check if drop was successful
    if (e.dataTransfer.dropEffect === 'move') {
      // Notify parent
      if (onTaskDropped) {
        onTaskDropped(`list-${currentListIndex}`);
      }
      
      // Create new empty list and switch to it
      setTaskLists([...taskLists, []]);
      setCurrentListIndex(taskLists.length);
    }
  };

  return (
    <div className="notepad">
      <div className="notepad-header">
        <h3>📝 Tasks</h3>
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

      <div
        className="task-list-wrapper"
        draggable={currentTasks.length > 0}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="task-list">
          {currentTasks.length === 0 ? (
            <div className="empty-state">Add tasks above to get started</div>
          ) : (
            currentTasks.map(task => (
              <div key={task.id} className="task-item">
                {/* <span className="task-text">{task.text}</span> */}
                {editingTaskId === task.id && <div>Editing task: {task.id}</div>? (
                  <input
                    type="text"
                    className="task-edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateTask(task.id, editValue);
                      } else if (e.key === 'Escape') {
                        setEditingTaskId(null);
                      }
                    }}
                    onBlur={() => updateTask(task.id, editValue)}
                    autoFocus
                  />
                  ) : (
                    <span
                      className="task-text"
                      onDoubleClick={() => {
                        console.log('Double clicked:', task.id);
                        setEditingTaskId(task.id);
                        setEditValue(task.text);
                      }}
                      title="Double-click to edit"
                    >
                      {task.text}
                    </span>
                  )}

              </div>
            ))
          )}
        </div>
        {currentTasks.length > 0 && (
          <div className="drag-hint">👆 Drag entire list to trash</div>
        )}
      </div>
    </div>
  );
}

export default Notepad;