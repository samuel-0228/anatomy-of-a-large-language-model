import React, { useState } from 'react';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import './index.css';

function App() {
  const [learningMode, setLearningMode] = useState('simple');
  const [activeLayer, setActiveLayer] = useState(null);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Scene activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
      <UIOverlay 
        learningMode={learningMode} 
        setLearningMode={setLearningMode}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
      />
    </div>
  );
}

export default App;
