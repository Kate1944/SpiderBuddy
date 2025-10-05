import { useEffect, useState } from 'react';

interface Task {
  id: string;
  text: string;
}

function DragPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const tasksParam = params.get('tasks');
    
    if (tasksParam) {
      try {
        const parsedTasks = JSON.parse(decodeURIComponent(tasksParam));
        setTasks(parsedTasks);
      } catch (e) {
        console.error('Failed to parse tasks:', e);
      }
    }
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      pointerEvents: 'none'
    }}>
      <div style={{
        width: '220px',
        background: 'linear-gradient(to bottom, #f9f9f9 0%, #ffffff 10%, #ffffff 90%, #f9f9f9 100%)',
        border: '1px solid #ddd',
        borderRadius: '2px',
        padding: '16px 12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
        fontFamily: '"Courier New", monospace',
        transform: 'rotate(-2deg)',
        fontSize: '11px',
        lineHeight: '1.4',
        position: 'relative'
      }}>
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
          {tasks.map((task, index) => (
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
            <span>{tasks.length}</span>
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
    </div>
  );
}

export default DragPage;