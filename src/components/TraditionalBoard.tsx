import React from 'react';
import { useGameStore } from '../store/gameStore';
import { type Position } from '../types/chess';
import { Settings, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { MoveHistory } from './MoveHistory';

export function TraditionalBoard() {
  const {
    board,
    currentPlayer,
    selectedPiece,
    difficulty,
    isThinking,
    moveHistory,
    selectPiece,
    makeMove,
    undoMove,
    setDifficulty,
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
    <div className="flex items-start justify-center min-h-screen bg-[#f4e4bc] p-8">
      <div className="flex flex-col items-center">
        <div className="mb-4 flex items-center gap-4">
          <h1 className="text-3xl font-bold text-[#8b4513]">中国象棋</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => undoMove()}
              className="p-2 rounded-full hover:bg-[#e6d5ae] transition-colors"
              title="悔棋"
            >
              <RotateCcw className="w-6 h-6 text-[#8b4513]" />
            </button>
            <div className="relative group">
              <button className="p-2 rounded-full hover:bg-[#e6d5ae] transition-colors">
                <Settings className="w-6 h-6 text-[#8b4513]" />
              </button>
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-4 py-2 text-sm text-[#8b4513]">难度设置</div>
                {(['easy', 'medium', 'hard'] as const).map((level) => (
                  <button
                    key={level}
                    className={clsx(
                      'block w-full px-4 py-2 text-sm text-left hover:bg-[#f4e4bc] transition-colors',
                      difficulty === level && 'text-[#8b4513] font-medium'
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

        <div className="flex gap-8">
          <div className="relative">
            <div 
              className="grid grid-cols-9 gap-px bg-[#d4b78c] p-4 rounded-lg shadow-xl"
              style={{
                backgroundImage: "url('/board-texture-traditional.png')",
                backgroundSize: 'cover'
              }}
            >
              {Array.from({ length: 90 }, (_, i) => {
                const x = i % 9;
                const y = Math.floor(i / 9);
                const piece = board.find(p => p.position.x === x && p.position.y === y);
                const isSelected = selectedPiece?.position.x === x && selectedPiece?.position.y === y;

                return (
                  <div
                    key={`${x}-${y}`}
                    className={clsx(
                      'w-14 h-14 flex items-center justify-center relative',
                      'hover:bg-[#e6d5ae]/20 transition-colors cursor-pointer',
                      isSelected && 'bg-[#e6d5ae]/30'
                    )}
                    onClick={() => handleSquareClick({ x, y })}
                  >
                    {piece && (
                      <div
                        className={clsx(
                          'w-12 h-12 rounded-full flex items-center justify-center',
                          'text-xl font-bold shadow-md transition-transform',
                          piece.player === 'red'
                            ? 'bg-[#f4d03f] text-[#c0392b] border-2 border-[#c0392b]'
                            : 'bg-[#f5ebd7] text-[#2c3e50] border-2 border-[#2c3e50]',
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