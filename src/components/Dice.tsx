import React, { useState } from 'react';
import { motion } from 'motion/react';

interface DiceProps {
  onRoll: (value: number) => void;
  disabled: boolean;
  color: string;
}

export default function Dice({ onRoll, disabled, color }: DiceProps) {
  const [rolling, setRolling] = useState(false);
  const [value, setValue] = useState(1);

  const roll = () => {
    if (disabled || rolling) return;

    setRolling(true);
    
    // Animation effect
    let count = 0;
    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setValue(finalValue);
        setRolling(false);
        onRoll(finalValue);
      }
    }, 50);
  };

  const renderDots = (val: number) => {
    const dots = [];
    const positions = [
      [], // 0
      [4], // 1
      [0, 8], // 2
      [0, 4, 8], // 3
      [0, 2, 6, 8], // 4
      [0, 2, 4, 6, 8], // 5
      [0, 2, 3, 5, 6, 8], // 6
    ];

    for (let i = 0; i < 9; i++) {
      dots.push(
        <div key={i} className="flex items-center justify-center w-full h-full">
          {positions[val].includes(i) && (
            <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-800 rounded-full shadow-inner" />
          )}
        </div>
      );
    }
    return dots;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        whileHover={!disabled ? { scale: 1.1 } : {}}
        whileTap={!disabled ? { scale: 0.9 } : {}}
        onClick={roll}
        disabled={disabled}
        className={`
          w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-xl flex items-center justify-center
          ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}
          transition-all duration-300
        `}
        style={{ backgroundColor: color }}
      >
        <motion.div
          animate={rolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5, repeat: rolling ? Infinity : 0 }}
          className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl grid grid-cols-3 p-2 border-2 border-gray-200"
        >
          {renderDots(value)}
        </motion.div>
      </motion.button>
      <p className="text-xl font-black text-gray-700 uppercase tracking-tighter">
        {rolling ? '¡Rodando!' : 'Toca el dado'}
      </p>
    </div>
  );
}
