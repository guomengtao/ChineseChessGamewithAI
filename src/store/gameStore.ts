import { create } from 'zustand';
import { type Move, type Piece, type Player, type Position, type Difficulty } from '../types/chess';
import { initialBoard } from '../utils/board';
import { getValidMoves, makeMove, evaluatePosition } from '../utils/rules';

interface GameState {
  board: Piece[];
  currentPlayer: Player;
  selectedPiece: Piece | null;
  moveHistory: Move[];
  difficulty: Difficulty;
  isThinking: boolean;
  soundEnabled: boolean;
  uiVersion: 'classic' | 'modern' | 'traditional';
  setDifficulty: (difficulty: Difficulty) => void;
  selectPiece: (piece: Piece | null) => void;
  makeMove: (from: Position, to: Position) => void;
  undoMove: () => void;
  aiMove: () => void;
  toggleSound: () => void;
  toggleUIVersion: () => void;
}

const moveSound = new Audio('/sounds/move.mp3');
const captureSound = new Audio('/sounds/capture.mp3');

export const useGameStore = create<GameState>((set, get) => ({
  board: initialBoard,
  currentPlayer: 'red',
  selectedPiece: null,
  moveHistory: [],
  difficulty: 'medium',
  isThinking: false,
  soundEnabled: true,
  uiVersion: 'modern',

  setDifficulty: (difficulty) => set({ difficulty }),
  toggleSound: () => set(state => ({ soundEnabled: !state.soundEnabled })),
  toggleUIVersion: () => set(state => ({ 
    uiVersion: state.uiVersion === 'classic' 
      ? 'modern' 
      : state.uiVersion === 'modern' 
        ? 'traditional' 
        : 'classic'
  })),

  selectPiece: (piece) => set({ selectedPiece: piece }),

  makeMove: (from, to) => {
    const { board, currentPlayer, moveHistory, soundEnabled } = get();
    const result = makeMove(board, from, to);
    
    if (result) {
      if (soundEnabled) {
        const audio = result.move.captured ? captureSound : moveSound;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }

      set({
        board: result.newBoard,
        currentPlayer: currentPlayer === 'red' ? 'black' : 'red',
        selectedPiece: null,
        moveHistory: [...moveHistory, result.move],
      });

      if (currentPlayer === 'red') {
        setTimeout(() => get().aiMove(), 500);
      }
    }
  },

  undoMove: () => {
    const { moveHistory, board, soundEnabled } = get();
    if (moveHistory.length === 0) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    const newBoard = [...board];

    const pieceIndex = newBoard.findIndex(
      (p) => p.position.x === lastMove.to.x && p.position.y === lastMove.to.y
    );
    if (pieceIndex !== -1) {
      newBoard[pieceIndex] = {
        ...newBoard[pieceIndex],
        position: { ...lastMove.from }
      };
    }

    if (lastMove.captured) {
      newBoard.push(lastMove.captured);
    }

    if (soundEnabled) {
      moveSound.currentTime = 0;
      moveSound.play().catch(() => {});
    }

    set({
      board: newBoard,
      currentPlayer: 'red',
      moveHistory: moveHistory.slice(0, -1),
    });
  },

  aiMove: async () => {
    const { board, difficulty, currentPlayer } = get();
    if (currentPlayer !== 'black') return;

    set({ isThinking: true });

    const depth = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
    
    const allPieces = board.filter(p => p.player === 'black');
    let bestScore = -Infinity;
    let bestMove: Move | null = null;

    for (const piece of allPieces) {
      const validMoves = getValidMoves(board, piece);
      for (const move of validMoves) {
        const result = makeMove(board, piece.position, move);
        if (result) {
          const score = evaluatePosition(result.newBoard, 'black', depth);
          if (score > bestScore) {
            bestScore = score;
            bestMove = result.move;
          }
        }
      }
    }

    if (bestMove) {
      setTimeout(() => {
        get().makeMove(bestMove!.from, bestMove!.to);
        set({ isThinking: false });
      }, 500);
    }
  },
}));