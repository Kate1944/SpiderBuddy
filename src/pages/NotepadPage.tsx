import Notepad from '../components/Notepad';

function NotepadPage() {
  const handleTaskDropped = (taskId: string) => {
    console.log('Sending task-dropped to main process:', taskId);
    window.electron?.send('task-dropped', taskId);
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'transparent'
    }}>
      <Notepad onTaskDropped={handleTaskDropped} />
    </div>
  );
}

export default NotepadPage;
