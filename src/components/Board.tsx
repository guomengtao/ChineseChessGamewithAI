import React from 'react';
import { useGameStore } from '../store/gameStore';
import { type Position } from '../types/chess';
import { Settings, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

export function Board() {
  const {
    board,
    currentPlayer,
    selectedPiece,
    difficulty,
    isThinking,
    selectPiece,
    makeMove,
    undoMove,
    setDifficulty
  } = useGameStore();

  const handleSquareClick = (position: Position) => {
    if (isThinking) return;

    const pieceAtPosition = board.find(
      p => p.position.x === position.x && p.position.y === position.y
    );

    if (selectedPiece) {
      if (pieceAtPosition?.player === currentPlayer) {
        selectPiece(pieceAtPosition);
      } else {
        makeMove(selectedPiece.position, position);
      }
    } else if (pieceAtPosition?.player === currentPlayer) {
      selectPiece(pieceAtPosition);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-red-50">
      <div className="mb-8 flex items-center gap-4">
        <h1 className="text-4xl font-bold text-red-800">中国象棋</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => undoMove()}
            className="p-2 rounded-full hover:bg-red-100 transition-colors"
            title="悔棋"
          >
            <RotateCcw className="w-6 h-6 text-red-800" />
          </button>
          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-red-100 transition-colors">
              <Settings className="w-6 h-6 text-red-800" />
            </button>
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="px-4 py-2 text-sm text-gray-700">难度设置</div>
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <button
                  key={level}
                  className={clsx(
                    'block w-full px-4 py-2 text-sm text-left hover:bg-red-50 transition-colors',
                    difficulty === level && 'text-red-600 font-medium'
                  )}
                  onClick={() => setDifficulty(level)}
                >
                  {level === 'easy' ? '初级' : level === 'medium' ? '中级' : '高级'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {isThinking && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded-lg">
            <div className="bg-white px-4 py-2 rounded-full shadow-lg">
              思考中...
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-9 gap-px bg-red-900 p-4 rounded-lg shadow-xl">
          {Array.from({ length: 90 }, (_, i) => {
            const x = i % 9;
            const y = Math.floor(i / 9);
            const piece = board.find(p => p.position.x === x && p.position.y === y);
            const isSelected = selectedPiece?.position.x === x && selectedPiece?.position.y === y;

            return (
              <div
                key={`${x}-${y}`}
                className={clsx(
                  'w-16 h-16 flex items-center justify-center relative',
                  'bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer',
                  isSelected && 'bg-red-100'
                )}
                onClick={() => handleSquareClick({ x, y })}
              >
                {piece && (
                  <div
                    className={clsx(
                      'w-14 h-14 rounded-full flex items-center justify-center',
                      'text-2xl font-bold shadow-md transition-transform',
                      piece.player === 'red' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800',
                      isSelected && 'transform scale-110'
                    )}
                  >
                    {piece.type}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 text-lg font-medium text-gray-700">
        {currentPlayer === 'red' ? '红方走棋' : '黑方思考中...'}
      </div>
    </div>
  );
}