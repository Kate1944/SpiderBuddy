import { useState } from 'react';
import Notepad from '../components/Notepad';

function NotepadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [draggedTasks, setDraggedTasks] = useState<Array<{ id: string; text: string }>>([]);

  const handleTaskDropped = (taskId: string) => {
    console.log('Sending task-dropped to main process:', taskId);
    window.electron?.send('task-dropped', taskId);
  };

  const handleDragStart = (tasks: Array<{ id: string; text: string }>, x: number, y: number) => {
    setDraggedTasks(tasks);
    setIsDragging(true);
    setDragPosition({ x, y });
  };

  const handleDragMove = (x: number, y: number) => {
    setDragPosition({ x, y });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <>
      <div style={{ 
  width: '100vw', 
  height: '100vh', 
  display: 'flex', 
  alignItems: 'flex-start',
  justifyContent: 'center',
  background: 'transparent',
  paddingTop: '20px'  // Add this
}}>
        <Notepad 
          onTaskDropped={handleTaskDropped}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        />
      </div>

      {/* Drag preview floats on top */}
      {isDragging && (
        <div 
          style={{
            position: 'fixed',
            left: dragPosition.x - 110,
            top: dragPosition.y - 50,
            width: '220px',
            background: 'linear-gradient(to bottom, #f9f9f9 0%, #ffffff 10%, #ffffff 90%, #f9f9f9 100%)',
            border: '1px solid #ddd',
            borderRadius: '2px',
            padding: '16px 12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
            fontFamily: '"Courier New", monospace',
            pointerEvents: 'none',
            zIndex: 99999,
            transform: 'rotate(-2deg)',
            fontSize: '11px',
            lineHeight: '1.4'
          }}
        >
          {/* Receipt Header */}
          <div style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '13px',
            letterSpacing: '1px',
            color: '#333',
            borderBottom: '2px double #666',
            paddingBottom: '8px',
            marginBottom: '12px'
          }}>
            ━━━ TASK RECEIPT ━━━
          </div>

          {/* Store/Date Info */}
          <div style={{
            textAlign: 'center',
            fontSize: '9px',
            color: '#666',
            marginBottom: '10px',
            borderBottom: '1px dashed #ccc',
            paddingBottom: '8px'
          }}>
            SPIDERBUDDY PRODUCTIVITY<br/>
            {new Date().toLocaleDateString()}<br/>
            {new Date().toLocaleTimeString()}
          </div>

          {/* Task List Items */}
          <div style={{ marginBottom: '10px' }}>
            {draggedTasks.map((task, index) => (
              <div key={task.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '3px 0',
                borderBottom: '1px dotted #ddd',
                fontSize: '10px'
              }}>
                <span style={{ flex: 1, color: '#333' }}>
                  {index + 1}. {task.text.slice(0, 25)}{task.text.length > 25 ? '...' : ''}
                </span>
                <span style={{ color: '#666', fontWeight: 'bold' }}>✓</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{
            borderTop: '1px solid #666',
            borderBottom: '1px solid #666',
            padding: '6px 0',
            marginBottom: '8px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              fontSize: '11px'
            }}>
              <span>TOTAL TASKS:</span>
              <span>{draggedTasks.length}</span>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            fontSize: '9px',
            color: '#999',
            borderTop: '2px double #666',
            paddingTop: '8px',
            marginTop: '8px'
          }}>
            THANK YOU FOR YOUR PRODUCTIVITY!<br/>
            ★ ★ ★
          </div>

          {/* Perforated edge effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'repeating-linear-gradient(90deg, transparent, transparent 5px, #ddd 5px, #ddd 6px)',
            borderRadius: '2px 2px 0 0'
          }}/>
        </div>
      )}
    </>
  );
}

export default NotepadPage;