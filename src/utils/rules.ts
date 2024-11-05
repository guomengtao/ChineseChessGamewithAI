import { type Piece, type Position, type Move, type Player } from '../types/chess';

// 评估函数
export function evaluatePosition(board: Piece[], player: Player, depth: number): number {
  if (depth === 0) return evaluateBoard(board, player);

  const pieces = board.filter(p => p.player === player);
  let bestScore = player === 'black' ? -Infinity : Infinity;

  for (const piece of pieces) {
    const moves = getValidMoves(board, piece);
    for (const move of moves) {
      const newBoard = makeMove(board, piece.position, move)?.newBoard;
      if (newBoard) {
        const score = evaluatePosition(
          newBoard,
          player === 'red' ? 'black' : 'red',
          depth - 1
        );
        if (player === 'black') {
          bestScore = Math.max(bestScore, score);
        } else {
          bestScore = Math.min(bestScore, score);
        }
      }
    }
  }

  return bestScore;
}

// 棋子价值
const pieceValues: Record<string, number> = {
  '帥': 10000, '將': 10000,
  '車': 900, 
  '馬': 400,
  '炮': 450,
  '相': 200, '象': 200,
  '仕': 200, '士': 200,
  '兵': 100, '卒': 100
};

function evaluateBoard(board: Piece[], player: Player): number {
  let score = 0;
  for (const piece of board) {
    const value = pieceValues[piece.type] || 0;
    score += piece.player === player ? value : -value;
  }
  return score;
}

// 检查路径上是否有棋子
function hasObstacle(board: Piece[], from: Position, to: Position): boolean {
  const dx = Math.sign(to.x - from.x);
  const dy = Math.sign(to.y - from.y);
  let x = from.x + dx;
  let y = from.y + dy;
  
  while (x !== to.x || y !== to.y) {
    if (board.some(p => p.position.x === x && p.position.y === y)) {
      return true;
    }
    x += dx;
    y += dy;
  }
  return false;
}

// 检查是否在九宫格内
function isWithinPalace(x: number, y: number, player: Player): boolean {
  const minX = 3;
  const maxX = 5;
  const minY = player === 'red' ? 7 : 0;
  const maxY = player === 'red' ? 9 : 2;
  return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

// 检查是否同色棋子
function isSameColorPiece(board: Piece[], x: number, y: number, player: Player): boolean {
  const piece = board.find(p => p.position.x === x && p.position.y === y);
  return piece?.player === player;
}

export function getValidMoves(board: Piece[], piece: Piece): Position[] {
  const validMoves: Position[] = [];
  const { x, y } = piece.position;

  switch (piece.type) {
    case '帥':
    case '將':
      // 九宫格内走动
      for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const newX = x + dx;
        const newY = y + dy;
        if (isWithinPalace(newX, newY, piece.player) && 
            !isSameColorPiece(board, newX, newY, piece.player)) {
          validMoves.push({ x: newX, y: newY });
        }
      }
      break;

    case '車':
      // 横向移动
      for (let i = x + 1; i < 9; i++) {
        if (!addMoveIfValid(board, piece, { x: i, y })) break;
      }
      for (let i = x - 1; i >= 0; i--) {
        if (!addMoveIfValid(board, piece, { x: i, y })) break;
      }
      // 纵向移动
      for (let j = y + 1; j < 10; j++) {
        if (!addMoveIfValid(board, piece, { x, y: j })) break;
      }
      for (let j = y - 1; j >= 0; j--) {
        if (!addMoveIfValid(board, piece, { x, y: j })) break;
      }
      break;

    case '馬':
      const horseJumps = [
        [-2, -1], [-2, 1], [2, -1], [2, 1],
        [-1, -2], [1, -2], [-1, 2], [1, 2]
      ];
      for (const [dx, dy] of horseJumps) {
        const newX = x + dx;
        const newY = y + dy;
        const legX = x + Math.sign(dx);
        const legY = y + Math.sign(dy);
        
        if (newX >= 0 && newX < 9 && newY >= 0 && newY < 10 &&
            !board.some(p => p.position.x === legX && p.position.y === legY) &&
            !isSameColorPiece(board, newX, newY, piece.player)) {
          validMoves.push({ x: newX, y: newY });
        }
      }
      break;

    case '炮':
      let hasJumped = false;
      // 横向移动
      for (let i = x + 1; i < 9; i++) {
        const target = board.find(p => p.position.x === i && p.position.y === y);
        if (target) {
          if (!hasJumped) {
            hasJumped = true;
          } else if (target.player !== piece.player) {
            validMoves.push({ x: i, y });
            break;
          }
        } else if (!hasJumped) {
          validMoves.push({ x: i, y });
        }
      }
      // 其他方向类似...
      break;
  }

  return validMoves;
}

function addMoveIfValid(board: Piece[], piece: Piece, pos: Position): boolean {
  const target = board.find(p => p.position.x === pos.x && p.position.y === pos.y);
  if (!target) {
    validMoves.push(pos);
    return true;
  }
  if (target.player !== piece.player) {
    validMoves.push(pos);
  }
  return false;
}

export function makeMove(board: Piece[], from: Position, to: Position): { newBoard: Piece[], move: Move } | null {
  const piece = board.find(p => p.position.x === from.x && p.position.y === from.y);
  if (!piece) return null;

  const validMoves = getValidMoves(board, piece);
  if (!validMoves.some(m => m.x === to.x && m.y === to.y)) return null;

  const newBoard = [...board];
  const pieceIndex = newBoard.findIndex(p => p.position.x === from.x && p.position.y === from.y);
  const capturedPiece = newBoard.find(p => p.position.x === to.x && p.position.y === to.y);

  if (capturedPiece) {
    newBoard.splice(newBoard.indexOf(capturedPiece), 1);
  }

  newBoard[pieceIndex] = {
    ...piece,
    position: { ...to }
  };

  return {
    newBoard,
    move: {
      piece,
      from,
      to,
      captured: capturedPiece
    }
  };
}