import { Move } from '../types/chess';

const numbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
const files = ['前', '中', '后'];

export function getChineseNotation(move: Move): string {
  const { piece, from, to } = move;
  const isRed = piece.player === 'red';
  const forward = isRed ? -1 : 1;
  
  // Get piece name
  let notation = piece.type;
  
  // Get file number (column)
  notation += numbers[isRed ? 8 - from.x : from.x];
  
  // Get movement type
  if (from.y === to.y) {
    notation += '平' + numbers[isRed ? 8 - to.x : to.x];
  } else {
    notation += (to.y - from.y) * forward > 0 ? '进' : '退';
    notation += numbers[Math.abs(to.y - from.y)];
  }
  
  return notation;
}