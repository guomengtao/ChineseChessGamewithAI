import React from 'react';
import { Move } from '../types/chess';
import { getChineseNotation } from '../utils/notation';

interface MoveHistoryProps {
  moves: Move[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <div className="w-64 bg-white rounded-lg shadow-lg p-4 ml-6 h-[600px] overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">走棋记录</h2>
      <div className="space-y-2">
        {moves.map((move, index) => (
          <div
            key={index}
            className={`p-2 rounded ${
              index % 2 === 0 ? 'bg-red-50' : 'bg-gray-50'
            }`}
          >
            <span className="inline-block w-8 text-gray-500">
              {Math.floor(index / 2) + 1}.
            </span>
            <span className={`font-medium ${
              move.piece.player === 'red' ? 'text-red-700' : 'text-gray-700'
            }`}>
              {getChineseNotation(move)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}