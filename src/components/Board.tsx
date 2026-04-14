import React from 'react';
import { motion } from 'motion/react';
import { Player, Square, GameMode } from '../types';

interface BoardProps {
  mode: GameMode;
  players: Player[];
  squares: Square[];
}

// Helper to generate coordinates for a traditional 68-square Parchis board
// Based on a 19x19 grid
const getParchisCoordinates = () => {
  const coords: { x: number; y: number }[] = [];
  
  // Arm 1 (Top) - Squares 1 to 17
  // Going down the left side of top arm, across, then up the right side
  for (let i = 0; i < 8; i++) coords.push({ x: 8, y: 7 - i }); // 1-8
  coords.push({ x: 9, y: 0 }); // 9 (Top center)
  for (let i = 0; i < 8; i++) coords.push({ x: 10, y: i }); // 10-17

  // Arm 2 (Right) - Squares 18 to 34
  for (let i = 0; i < 8; i++) coords.push({ x: 11 + i, y: 8 }); // 18-25
  coords.push({ x: 18, y: 9 }); // 26 (Right center)
  for (let i = 0; i < 8; i++) coords.push({ x: 18 - i, y: 10 }); // 27-34

  // Arm 3 (Bottom) - Squares 35 to 51
  for (let i = 0; i < 8; i++) coords.push({ x: 10, y: 11 + i }); // 35-42
  coords.push({ x: 9, y: 18 }); // 43 (Bottom center)
  for (let i = 0; i < 8; i++) coords.push({ x: 8, y: 18 - i }); // 44-51

  // Arm 4 (Left) - Squares 52 to 68
  for (let i = 0; i < 8; i++) coords.push({ x: 7 - i, y: 10 }); // 52-59
  coords.push({ x: 0, y: 9 }); // 60 (Left center)
  for (let i = 0; i < 8; i++) coords.push({ x: i, y: 8 }); // 61-68

  return coords;
};

const TRADITIONAL_COORDS = getParchisCoordinates();

export default function Board({ mode, players, squares }: BoardProps) {
  if (mode === 'RAPIDO') {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
          {squares.map((square, index) => (
            <div
              key={square.id}
              className={`
                aspect-square rounded-xl border-4 flex items-center justify-center relative
                ${square.type === 'META' ? 'bg-yellow-400 border-yellow-600' : 'bg-white border-gray-200'}
              `}
            >
              <span className="text-xs font-bold text-gray-300 absolute top-1 left-1">{index + 1}</span>
              {square.type === 'META' && <span className="text-2xl">🏁</span>}
              
              <div className="flex flex-wrap gap-1 justify-center p-1">
                {players.filter(p => p.position === index).map(p => (
                  <motion.div
                    key={p.id}
                    layoutId={`player-${p.id}`}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: p.color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Traditional Parchis Board
  return (
    <div className="w-full max-w-[95vh] aspect-square mx-auto p-2 md:p-4 bg-white rounded-3xl shadow-2xl border-8 border-gray-100 relative overflow-hidden">
      {/* Houses (Corners) */}
      <div className="absolute top-0 left-0 w-[42%] h-[42%] bg-red-100 rounded-br-[4rem] border-r-4 border-b-4 border-red-200 flex items-center justify-center">
        <div className="relative w-24 h-24 rounded-full bg-red-500 border-8 border-white shadow-inner flex items-center justify-center">
          {players.filter(p => p.position === -1 && p.homeIndex === 0).map(p => (
            <motion.div
              key={p.id}
              layoutId={`player-${p.id}`}
              className="w-8 h-8 rounded-full border-2 border-white shadow-md absolute"
              style={{ backgroundColor: p.color }}
            />
          ))}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-[42%] h-[42%] bg-green-100 rounded-bl-[4rem] border-l-4 border-b-4 border-green-200 flex items-center justify-center">
        <div className="relative w-24 h-24 rounded-full bg-green-500 border-8 border-white shadow-inner flex items-center justify-center">
          {players.filter(p => p.position === -1 && p.homeIndex === 1).map(p => (
            <motion.div
              key={p.id}
              layoutId={`player-${p.id}`}
              className="w-8 h-8 rounded-full border-2 border-white shadow-md absolute"
              style={{ backgroundColor: p.color }}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-[42%] h-[42%] bg-blue-100 rounded-tr-[4rem] border-r-4 border-t-4 border-blue-200 flex items-center justify-center">
        <div className="relative w-24 h-24 rounded-full bg-blue-500 border-8 border-white shadow-inner flex items-center justify-center">
          {players.filter(p => p.position === -1 && p.homeIndex === 2).map(p => (
            <motion.div
              key={p.id}
              layoutId={`player-${p.id}`}
              className="w-8 h-8 rounded-full border-2 border-white shadow-md absolute"
              style={{ backgroundColor: p.color }}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-[42%] h-[42%] bg-yellow-100 rounded-tl-[4rem] border-l-4 border-t-4 border-yellow-200 flex items-center justify-center">
        <div className="relative w-24 h-24 rounded-full bg-yellow-500 border-8 border-white shadow-inner flex items-center justify-center">
          {players.filter(p => p.position === -1 && p.homeIndex === 3).map(p => (
            <motion.div
              key={p.id}
              layoutId={`player-${p.id}`}
              className="w-8 h-8 rounded-full border-2 border-white shadow-md absolute"
              style={{ backgroundColor: p.color }}
            />
          ))}
        </div>
      </div>

      {/* Center Goal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[16%] h-[16%] bg-white border-4 border-gray-200 rounded-full z-20 flex items-center justify-center shadow-lg">
        <div className="text-4xl">🏆</div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {players.filter(p => p.position === squares.length - 1).map((p, i) => (
            <motion.div
              key={p.id}
              layoutId={`player-${p.id}`}
              className="w-4 h-4 md:w-6 md:h-6 rounded-full border-2 border-white shadow-md absolute"
              style={{ 
                backgroundColor: p.color,
                transform: `translate(${(i - 1) * 10}px, ${(i - 1) * 10}px)`
              }}
            />
          ))}
        </div>
      </div>

      {/* Path Squares */}
      <div 
        className="grid w-full h-full"
        style={{ 
          gridTemplateColumns: 'repeat(19, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(19, minmax(0, 1fr))'
        }}
      >
        {TRADITIONAL_COORDS.map((coord, index) => {
          const square = squares[index];
          if (!square) return null;

          const isSafe = square.type === 'SEGURO' || square.type === 'SALIDA';
          const isStart = square.type === 'SALIDA';
          
          return (
            <div
              key={square.id}
              style={{
                gridColumnStart: coord.x + 1,
                gridRowStart: coord.y + 1,
              }}
              className={`
                border border-gray-200 flex items-center justify-center relative
                ${isSafe ? 'bg-blue-50' : 'bg-white'}
                ${isStart ? 'border-gray-400 border-2' : ''}
              `}
            >
              <span className="text-[8px] text-gray-300 absolute top-0.5 left-0.5">{index + 1}</span>
              {isSafe && <div className="w-1.5 h-1.5 rounded-full bg-blue-300 opacity-50" />}
              
              <div className="flex flex-wrap gap-0.5 justify-center z-10">
                {players.filter(p => {
                  if (p.position === -1 || p.position === squares.length - 1) return false;
                  const visualPos = (p.startPos + p.position) % 68;
                  return visualPos === index;
                }).map(p => (
                  <motion.div
                    key={p.id}
                    layoutId={`player-${p.id}`}
                    className="w-3 h-3 md:w-5 md:h-5 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: p.color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
