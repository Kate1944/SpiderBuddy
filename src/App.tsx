import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import NotepadPage from './pages/NotepadPage';
import TrashPage from './pages/TrashPage';
import BuddyOverlay from './pages/BuddyOverlay';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/notepad" element={<NotepadPage />} />
        <Route path="/trash" element={<TrashPage />} />
        <Route path="/buddy" element={<BuddyOverlay />} />
        <Route path="/" element={<div>Loading...</div>} />
      </Routes>
    </Router>
  );
}

export default App;
