import { useEffect, useState } from 'react';
import TrashCan from '../components/TrashCan';

function TrashPage() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Listen for animate-trash messages from main process
    window.electron?.on('animate-trash', (taskId: string) => {
      console.log('Trash received task:', taskId);
      setScore(prev => prev + 10);
    });
  }, []);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'transparent'
    }}>
      <TrashCan score={score} />
    </div>
  );
}

export default TrashPage;
