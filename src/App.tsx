import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play, Zap, Users } from 'lucide-react';
import { GameMode, Player, Square } from './types';
import { FRASES_RR, TRABALENGUAS_RR } from './data/frases';
import Board from './components/Board';
import Dice from './components/Dice';
import ReadingModal from './components/ReadingModal';

const COLORS = ['#FF5252', '#4CAF50', '#2196F3', '#FFEB3B'];
const PLAYER_NAMES = ['Rojo', 'Verde', 'Azul', 'Amarillo'];

export default function App() {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [squares, setSquares] = useState<Square[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [availableTexts, setAvailableTexts] = useState<string[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);

  const initGame = (selectedMode: GameMode) => {
    const numSquares = selectedMode === 'RAPIDO' ? 24 : 68;
    const newSquares: Square[] = Array.from({ length: numSquares }, (_, i) => {
      let type: Square['type'] = 'NORMAL';
      if (i === numSquares - 1) type = 'META';
      else if (selectedMode === 'COMPLETO') {
        const safeIndices = [4, 11, 16, 21, 28, 33, 38, 45, 50, 55, 62];
        if (safeIndices.includes(i)) type = 'SEGURO';
        if (i === 0) type = 'SALIDA';
      }
      return { id: i, type };
    });

    const initialPlayers: Player[] = Array.from({ length: numPlayers }, (_, i) => ({
      id: i + 1,
      name: `Jugador ${PLAYER_NAMES[i]}`,
      color: COLORS[i],
      position: -1, // Start in home
      isWinner: false,
      homeIndex: i
    }));

    setSquares(newSquares);
    setPlayers(initialPlayers);
    setMode(selectedMode);
    setCurrentPlayerIndex(0);
    setWinner(null);
    
    // Initialize available texts pool
    setAvailableTexts([...FRASES_RR, ...TRABALENGUAS_RR]);
  };

  const handleRoll = (value: number) => {
    const player = players[currentPlayerIndex];
    let newPosition = player.position;

    if (player.position === -1) {
      newPosition = 0;
    } else {
      newPosition += value;
    }

    if (newPosition >= squares.length - 1) {
      newPosition = squares.length - 1;
    }

    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = { ...player, position: newPosition };
    setPlayers(updatedPlayers);

    // Get a non-repeating random text
    let pool = availableTexts.length > 0 ? [...availableTexts] : [...FRASES_RR, ...TRABALENGUAS_RR];
    const randomIndex = Math.floor(Math.random() * pool.length);
    const randomText = pool[randomIndex];
    
    // Remove used text from pool
    pool.splice(randomIndex, 1);
    setAvailableTexts(pool);
    
    setCurrentPhrase(randomText);
    setIsModalOpen(true);

    if (newPosition === squares.length - 1) {
      setWinner(updatedPlayers[currentPlayerIndex]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (!winner) {
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }
  };

  const resetGame = () => {
    setMode(null);
    setPlayers([]);
    setWinner(null);
  };

  if (!mode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-black text-orange-600 mb-4 drop-shadow-xl tracking-tighter">
            PARCHÍS <span className="text-blue-600">RR</span>
          </h1>
          <p className="text-2xl text-gray-600 font-bold uppercase tracking-widest">¡A leer y destrabar la lengua!</p>
        </motion.div>

        {/* Player Selection */}
        <div className="mb-12 bg-white p-6 rounded-3xl shadow-xl border-4 border-sky-200">
          <p className="text-xl font-black text-sky-600 mb-4 flex items-center justify-center gap-2">
            <Users size={24} /> ¿CUÁNTOS JUGADORES?
          </p>
          <div className="flex gap-4 justify-center">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setNumPlayers(n)}
                className={`
                  w-16 h-16 rounded-2xl font-black text-3xl transition-all
                  ${numPlayers === n 
                    ? 'bg-sky-500 text-white scale-110 shadow-lg ring-4 ring-sky-200' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}
                `}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => initGame('RAPIDO')}
            className="child-button btn-secondary flex items-center gap-3"
          >
            <Zap size={32} />
            TABLERO RÁPIDO
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => initGame('COMPLETO')}
            className="child-button btn-primary flex items-center gap-3"
          >
            <Play size={32} />
            TABLERO COMPLETO
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={resetGame}
          className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <RotateCcw size={24} className="text-gray-600" />
        </button>

        <div className="flex flex-wrap gap-2 justify-center">
          {players.map((p, idx) => (
            <div
              key={p.id}
              className={`
                px-4 py-2 rounded-2xl border-4 transition-all
                ${currentPlayerIndex === idx ? 'scale-110 shadow-lg' : 'opacity-50'}
              `}
              style={{ 
                backgroundColor: p.color,
                borderColor: currentPlayerIndex === idx ? 'white' : 'transparent',
                color: 'white'
              }}
            >
              <span className="font-black text-sm md:text-base">{p.name}</span>
            </div>
          ))}
        </div>

        <div className="w-12" />
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <Board mode={mode} players={players} squares={squares} />
        
        {!winner && (
          <div className="mt-4">
            <Dice
              onRoll={handleRoll}
              disabled={isModalOpen}
              color={players[currentPlayerIndex].color}
            />
          </div>
        )}
      </div>

      {/* Winner Overlay */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] bg-yellow-400 flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Trophy size={160} className="text-white mb-8 drop-shadow-2xl" />
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-black text-white mb-4 uppercase tracking-tighter">
              ¡GANASTE!
            </h2>
            <p className="text-3xl text-yellow-900 font-bold mb-12">
              {winner.name} ha llegado a la meta.
            </p>
            <button
              onClick={resetGame}
              className="child-button btn-green"
            >
              JUGAR DE NUEVO
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ReadingModal
        isOpen={isModalOpen}
        phrase={currentPhrase}
        onClose={closeModal}
        playerColor={players[currentPlayerIndex]?.color}
      />
    </div>
  );
}
