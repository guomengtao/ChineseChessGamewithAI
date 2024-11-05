export type PieceType = 
  | '帥' | '仕' | '相' | '馬' | '車' | '炮' | '兵'  // Red pieces
  | '將' | '士' | '象' | '馬' | '車' | '炮' | '卒'; // Black pieces

export type Player = 'red' | 'black';

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: PieceType;
  position: Position;
  player: Player;
}

export interface Move {
  piece: Piece;
  from: Position;
  to: Position;
  captured?: Piece;
}

export type Difficulty = 'easy' | 'medium' | 'hard';