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
        <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
          {squares.map((square, index) => (
            <div
              key={square.id}
              className={`
                aspect-square rounded-2xl border-4 flex items-center justify-center relative shadow-sm transition-transform hover:scale-105
                ${square.type === 'META' ? 'bg-gradient-to-br from-yellow-300 to-orange-400 border-yellow-600' : 'bg-white border-gray-100'}
              `}
            >
              <span className="text-[11px] font-black text-gray-600 absolute top-1.5 left-1.5">{index + 1}</span>
              {square.type === 'META' && (
                <motion.span 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-3xl"
                >
                  🏆
                </motion.span>
              )}
              
              <div className="flex flex-wrap gap-1 justify-center p-1">
                {players.filter(p => p.position === index).map(p => (
                  <motion.div
                    key={p.id}
                    layoutId={`player-${p.id}`}
                    className="w-7 h-7 md:w-9 md:h-9 rounded-full border-4 border-white shadow-lg"
                    style={{ backgroundColor: p.color }}
                    initial={{ scale: 0, y: -20 }}
                    animate={{ scale: 1, y: 0 }}
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
  const getSquareStyles = (index: number) => {
    // Standard Parchis Safe Squares indices (0-based)
    const redSafe = [4, 11, 16];
    const greenSafe = [21, 28, 33];
    const blueSafe = [55, 62, 3]; // Wraparound logic
    const yellowSafe = [38, 45, 50];

    if (redSafe.includes(index)) return 'bg-red-50 border-red-200';
    if (greenSafe.includes(index)) return 'bg-green-50 border-green-200';
    if (yellowSafe.includes(index)) return 'bg-yellow-50 border-yellow-200';
    if (blueSafe.includes(index)) return 'bg-blue-50 border-blue-200';
    
    return 'bg-white border-gray-100';
  };

  const getSafeIndicator = (index: number) => {
    if ([4, 11, 16].includes(index)) return <div className="w-2 h-2 rounded-full bg-red-400/40" />;
    if ([21, 28, 33].includes(index)) return <div className="w-2 h-2 rounded-full bg-green-400/40" />;
    if ([38, 45, 50].includes(index)) return <div className="w-2 h-2 rounded-full bg-yellow-400/40" />;
    if ([55, 62, 3].includes(index)) return <div className="w-2 h-2 rounded-full bg-blue-400/40" />;
    return null;
  };

  return (
    <div className="w-full max-w-[95vh] aspect-square mx-auto p-2 md:p-6 bg-gray-50 rounded-[4rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[12px] border-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-400" />
        <div className="absolute top-0 left-1/2 w-1 h-full bg-gray-400" />
      </div>

      {/* Houses (Corners) */}
      <div className="absolute top-0 left-0 w-[42%] h-[42%] bg-gradient-to-br from-red-50 to-red-100 rounded-br-[5rem] border-r-8 border-b-8 border-white flex items-center justify-center shadow-inner">
        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-xl flex items-center justify-center border-8 border-red-500">
           <div className="absolute inset-0 bg-red-500/10 rounded-full animate-pulse" />
           <div className="grid grid-cols-2 gap-4 p-4">
            {players.filter(p => p.position === -1 && p.homeIndex === 0).map(p => (
              <motion.div
                key={p.id}
                layoutId={`player-${p.id}`}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white shadow-lg"
                style={{ backgroundColor: p.color }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-[42%] h-[42%] bg-gradient-to-bl from-green-50 to-green-100 rounded-bl-[5rem] border-l-8 border-b-8 border-white flex items-center justify-center shadow-inner">
        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-xl flex items-center justify-center border-8 border-green-500">
          <div className="absolute inset-0 bg-green-500/10 rounded-full animate-pulse" />
          <div className="grid grid-cols-2 gap-4 p-4">
            {players.filter(p => p.position === -1 && p.homeIndex === 1).map(p => (
              <motion.div
                key={p.id}
                layoutId={`player-${p.id}`}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white shadow-lg"
                style={{ backgroundColor: p.color }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-[42%] h-[42%] bg-gradient-to-tr from-blue-50 to-blue-100 rounded-tr-[5rem] border-r-8 border-t-8 border-white flex items-center justify-center shadow-inner">
        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-xl flex items-center justify-center border-8 border-blue-500">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse" />
          <div className="grid grid-cols-2 gap-4 p-4">
            {players.filter(p => p.position === -1 && p.homeIndex === 2).map(p => (
              <motion.div
                key={p.id}
                layoutId={`player-${p.id}`}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white shadow-lg"
                style={{ backgroundColor: p.color }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-[42%] h-[42%] bg-gradient-to-tl from-yellow-50 to-yellow-100 rounded-tl-[5rem] border-l-8 border-t-8 border-white flex items-center justify-center shadow-inner">
        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-xl flex items-center justify-center border-8 border-yellow-500">
          <div className="absolute inset-0 bg-yellow-500/10 rounded-full animate-pulse" />
          <div className="grid grid-cols-2 gap-4 p-4">
            {players.filter(p => p.position === -1 && p.homeIndex === 3).map(p => (
              <motion.div
                key={p.id}
                layoutId={`player-${p.id}`}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white shadow-lg"
                style={{ backgroundColor: p.color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Center Goal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20%] h-[20%] bg-white border-8 border-gray-100 rounded-full z-20 flex items-center justify-center shadow-2xl">
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
           <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-4xl md:text-5xl drop-shadow-lg"
          >
            🏆
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {players.filter(p => p.position === squares.length - 1).map((p, i) => (
              <motion.div
                key={p.id}
                layoutId={`player-${p.id}`}
                className="w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-white shadow-xl absolute"
                style={{ 
                  backgroundColor: p.color,
                  transform: `translate(${(i - 1) * 15}px, ${(i - 1) * 15}px)`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Path Squares */}
      <div 
        className="grid w-full h-full p-2"
        style={{ 
          gridTemplateColumns: 'repeat(19, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(19, minmax(0, 1fr))'
        }}
      >
        {TRADITIONAL_COORDS.map((coord, index) => {
          const square = squares[index];
          if (!square) return null;

          const isStart = square.type === 'SALIDA';
          
          return (
            <div
              key={square.id}
              style={{
                gridColumnStart: coord.x + 1,
                gridRowStart: coord.y + 1,
              }}
              className={`
                border border-gray-100 flex items-center justify-center relative transition-colors
                ${getSquareStyles(index)}
                ${isStart ? 'border-gray-300 border-2 z-10' : ''}
              `}
            >
              <span className="text-[8px] md:text-[10px] font-black text-gray-700 absolute top-0.5 left-0.5 pointer-events-none">
                {index + 1}
              </span>
              
              {getSafeIndicator(index)}
              
              <div className="flex flex-wrap gap-0 justify-center z-10 p-0.5">
                {players.filter(p => {
                  if (p.position === -1 || p.position === squares.length - 1) return false;
                  // Handle wraparound for traditional visual indexing
                  const visualPos = (p.startPos + p.position) % 68;
                  return visualPos === index;
                }).map(p => (
                  <motion.div
                    key={p.id}
                    layoutId={`player-${p.id}`}
                    className="w-3.5 h-3.5 md:w-5 md:h-5 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: p.color }}
                    initial={{ scale: 0, y: -5 }}
                    animate={{ scale: 1, y: 0 }}
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
