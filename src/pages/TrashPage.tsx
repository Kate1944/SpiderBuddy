import { useState } from 'react';
import TrashCan from '../components/TrashCan';

function TrashPage() {  // ← Remove the props parameter here!
  const [score, setScore] = useState(0);

  const handleScoreIncrease = () => {
    setScore(prev => prev + 1);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'transparent'
    }}>
      <TrashCan score={score} onScoreIncrease={handleScoreIncrease} />
    </div>
  );
}

export default TrashPage;