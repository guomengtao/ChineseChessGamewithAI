import React from 'react';
import { useGameStore } from '../store/gameStore';
import { type Position } from '../types/chess';
import { Settings, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import clsx from 'clsx';
import { MoveHistory } from './MoveHistory';

export function ModernBoard() {
  const {
    board,
    currentPlayer,
    selectedPiece,
    difficulty,
    isThinking,
    moveHistory,
    soundEnabled,
    selectPiece,
    makeMove,
    undoMove,
    setDifficulty,
    toggleSound,
  } = useGameStore();

  return (
    <div className="flex items-start justify-center min-h-screen bg-gradient-to-br from-amber-100 to-orange-50 p-8">
      <div className="flex flex-col items-center">
        <div className="mb-4 flex items-center gap-4">
          <h1 className="text-3xl font-bold text-amber-900">中国象棋</h1>
          <div className="flex items-center gap-2">
            {/* 控制按钮 */}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <div className="grid grid-cols-9 gap-px bg-amber-900 p-3 rounded-lg shadow-xl" 
                 style={{
                   backgroundImage: "url('/board-texture.png')",
                   backgroundSize: 'cover'
                 }}>
              {/* 棋盘格子 */}
              {Array.from({ length: 90 }, (_, i) => {
                const x = i % 9;
                const y = Math.floor(i / 9);
                const piece = board.find(p => p.position.x === x && p.position.y === y);
                const isSelected = selectedPiece?.position.x === x && selectedPiece?.position.y === y;

                return (
                  <div
                    key={`${x}-${y}`}
                    className={clsx(
                      'w-12 h-12 flex items-center justify-center relative',
                      'bg-transparent hover:bg-amber-100/20 transition-colors cursor-pointer',
                      isSelected && 'bg-amber-100/30'
                    )}
                    onClick={() => handleSquareClick({ x, y })}
                  >
                    {piece && (
                      <div
                        className={clsx(
                          'w-11 h-11 rounded-full flex items-center justify-center',
                          'text-xl font-bold shadow-md transition-transform',
                          piece.player === 'red' 
                            ? 'bg-gradient-to-br from-red-100 to-red-200 text-red-800 border-2 border-red-400' 
                            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 border-2 border-gray-400',
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

          <MoveHistory moves={moveHistory} />
        </div>
      </div>
    </div>
  );
}