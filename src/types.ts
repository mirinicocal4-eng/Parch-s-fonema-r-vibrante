export type GameMode = 'RAPIDO' | 'COMPLETO';

export interface Player {
  id: number;
  name: string;
  color: string;
  position: number; // Steps from start. -1 means in home.
  startPos: number; // Absolute index on board
  isWinner: boolean;
  homeIndex: number; // 0: Red, 1: Green, 2: Blue, 3: Yellow
}

export interface Square {
  id: number;
  type: 'NORMAL' | 'SEGURO' | 'META' | 'SALIDA';
  color?: string;
}
