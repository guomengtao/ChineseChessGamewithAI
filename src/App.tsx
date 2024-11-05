import React from 'react';
import { Board } from './components/Board';
import { ModernBoard } from './components/ModernBoard';
import { TraditionalBoard } from './components/TraditionalBoard';
import { useGameStore } from './store/gameStore';
import { MonitorPlay } from 'lucide-react';

function App() {
  const { uiVersion, toggleUIVersion } = useGameStore();

  return (
    <>
      <button
        onClick={toggleUIVersion}
        className="fixed top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors z-50"
        title="切换界面"
      >
        <MonitorPlay className="w-6 h-6 text-gray-700" />
      </button>
      {uiVersion === 'classic' ? (
        <Board />
      ) : uiVersion === 'modern' ? (
        <ModernBoard />
      ) : (
        <TraditionalBoard />
      )}
    </>
  );
}

export default App;