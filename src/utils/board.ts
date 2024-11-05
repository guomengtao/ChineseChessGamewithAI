import { type Piece } from '../types/chess';

export const initialBoard: Piece[] = [
  // Red pieces
  { type: '車', position: { x: 0, y: 9 }, player: 'red' },
  { type: '馬', position: { x: 1, y: 9 }, player: 'red' },
  { type: '相', position: { x: 2, y: 9 }, player: 'red' },
  { type: '仕', position: { x: 3, y: 9 }, player: 'red' },
  { type: '帥', position: { x: 4, y: 9 }, player: 'red' },
  { type: '仕', position: { x: 5, y: 9 }, player: 'red' },
  { type: '相', position: { x: 6, y: 9 }, player: 'red' },
  { type: '馬', position: { x: 7, y: 9 }, player: 'red' },
  { type: '車', position: { x: 8, y: 9 }, player: 'red' },
  { type: '炮', position: { x: 1, y: 7 }, player: 'red' },
  { type: '炮', position: { x: 7, y: 7 }, player: 'red' },
  { type: '兵', position: { x: 0, y: 6 }, player: 'red' },
  { type: '兵', position: { x: 2, y: 6 }, player: 'red' },
  { type: '兵', position: { x: 4, y: 6 }, player: 'red' },
  { type: '兵', position: { x: 6, y: 6 }, player: 'red' },
  { type: '兵', position: { x: 8, y: 6 }, player: 'red' },

  // Black pieces
  { type: '車', position: { x: 0, y: 0 }, player: 'black' },
  { type: '馬', position: { x: 1, y: 0 }, player: 'black' },
  { type: '象', position: { x: 2, y: 0 }, player: 'black' },
  { type: '士', position: { x: 3, y: 0 }, player: 'black' },
  { type: '將', position: { x: 4, y: 0 }, player: 'black' },
  { type: '士', position: { x: 5, y: 0 }, player: 'black' },
  { type: '象', position: { x: 6, y: 0 }, player: 'black' },
  { type: '馬', position: { x: 7, y: 0 }, player: 'black' },
  { type: '車', position: { x: 8, y: 0 }, player: 'black' },
  { type: '炮', position: { x: 1, y: 2 }, player: 'black' },
  { type: '炮', position: { x: 7, y: 2 }, player: 'black' },
  { type: '卒', position: { x: 0, y: 3 }, player: 'black' },
  { type: '卒', position: { x: 2, y: 3 }, player: 'black' },
  { type: '卒', position: { x: 4, y: 3 }, player: 'black' },
  { type: '卒', position: { x: 6, y: 3 }, player: 'black' },
  { type: '卒', position: { x: 8, y: 3 }, player: 'black' },
];