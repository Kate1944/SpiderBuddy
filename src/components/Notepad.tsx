import { useState } from 'react';
import './Notepad.css';

interface Task {
  id: string;
  text: string;
}

interface NotepadProps {
  onTaskDropped?: (taskId: string) => void;
  onDragStart?: (tasks: Task[], x: number, y: number) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: () => void;
}

function Notepad({ onTaskDropped, onDragStart, onDragMove, onDragEnd }: NotepadProps) {
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
  const listId = `list-${currentListIndex}-${Date.now()}`;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', listId);
  
  // Create custom receipt-style drag preview
  const dragPreview = document.createElement('div');
  dragPreview.style.cssText = `
    width: 220px;
    background: linear-gradient(to bottom, #f9f9f9 0%, #ffffff 10%, #ffffff 90%, #f9f9f9 100%);
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 16px 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    font-family: "Courier New", monospace;
    font-size: 11px;
    position: absolute;
    top: -9999px;
    left: -9999px;
  `;
  
  dragPreview.innerHTML = `
    <div style="text-align: center; font-weight: bold; font-size: 13px; color: #333; border-bottom: 2px double #666; padding-bottom: 8px; margin-bottom: 12px;">
      ━━━ TASK RECEIPT ━━━
    </div>
    <div style="text-align: center; font-size: 9px; color: #666; margin-bottom: 10px; border-bottom: 1px dashed #ccc; padding-bottom: 8px;">
      SPIDERBUDDY PRODUCTIVITY<br/>
      ${new Date().toLocaleDateString()}<br/>
      ${new Date().toLocaleTimeString()}
    </div>
    <div>
      ${currentTasks.map((task, i) => `
        <div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px dotted #ddd; font-size: 10px;">
          <span>${i + 1}. ${task.text.slice(0, 25)}${task.text.length > 25 ? '...' : ''}</span>
          <span>✓</span>
        </div>
      `).join('')}
    </div>
    <div style="border-top: 1px solid #666; border-bottom: 1px solid #666; padding: 6px 0; margin: 8px 0;">
      <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px;">
        <span>TOTAL TASKS:</span>
        <span>${currentTasks.length}</span>
      </div>
    </div>
    <div style="text-align: center; font-size: 9px; color: #999; border-top: 2px double #666; padding-top: 8px;">
      THANK YOU!<br/>★ ★ ★
    </div>
  `;
  
  document.body.appendChild(dragPreview);
  e.dataTransfer.setDragImage(dragPreview, 110, 50);
  
  // Clean up the preview element after drag starts
  setTimeout(() => document.body.removeChild(dragPreview), 0);
  
  console.log('Dragging entire list:', listId);
};

 const handleDragEnd = (e: React.DragEvent) => {
  if (e.dataTransfer.dropEffect === 'move') {
    if (onTaskDropped) {
      onTaskDropped(`list-${currentListIndex}`);
    }
    
    setTaskLists([...taskLists, []]);
    setCurrentListIndex(taskLists.length);
  }
  
  // Notify parent that drag ended
  onDragEnd?.();
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