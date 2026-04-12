import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play, Zap, Users, Info, X } from 'lucide-react';
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
  const [showInstructions, setShowInstructions] = useState(false);

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

  const handleRoll = async (value: number) => {
    const player = players[currentPlayerIndex];
    let currentPos = player.position;
    const targetPos = player.position === -1 ? 0 : Math.min(player.position + value, squares.length - 1);

    // Step-by-step movement animation
    if (currentPos === -1) {
      // Exit home
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex] = { ...player, position: 0 };
      setPlayers(updatedPlayers);
      currentPos = 0;
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    while (currentPos < targetPos) {
      currentPos++;
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex] = { ...player, position: currentPos };
      setPlayers(updatedPlayers);
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Get a non-repeating random text
    let pool = availableTexts.length > 0 ? [...availableTexts] : [...FRASES_RR, ...TRABALENGUAS_RR];
    const randomIndex = Math.floor(Math.random() * pool.length);
    const randomText = pool[randomIndex];
    
    // Remove used text from pool
    pool.splice(randomIndex, 1);
    setAvailableTexts(pool);
    
    setCurrentPhrase(randomText);
    setIsModalOpen(true);

    if (currentPos === squares.length - 1) {
      setWinner({ ...player, position: currentPos });
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
          className="mb-8 relative"
        >
          <button 
            onClick={() => setShowInstructions(true)}
            className="absolute -top-12 -right-4 p-3 bg-white rounded-full shadow-lg text-sky-500 hover:scale-110 transition-transform"
          >
            <Info size={32} />
          </button>
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
        <div className="flex gap-2">
          <button
            onClick={resetGame}
            className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <RotateCcw size={24} className="text-gray-600" />
          </button>
          <button
            onClick={() => setShowInstructions(true)}
            className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <Info size={24} className="text-sky-500" />
          </button>
        </div>

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
        
        {!winner && players.length > 0 && (
          <div className="mt-4">
            <Dice
              onRoll={handleRoll}
              disabled={isModalOpen}
              color={players[currentPlayerIndex]?.color || '#ccc'}
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

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto relative p-8"
            >
              <button 
                onClick={() => setShowInstructions(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={32} />
              </button>

              <h2 className="text-4xl font-black text-sky-600 mb-6 uppercase tracking-tight">¿Cómo jugar?</h2>
              
              <div className="space-y-6 text-gray-700">
                <section>
                  <h3 className="text-xl font-bold text-orange-500 flex items-center gap-2 mb-2">
                    <Trophy size={20} /> OBJETIVO
                  </h3>
                  <p className="text-lg leading-relaxed">
                    Lleva tu ficha a la meta (🏆) leyendo frases con la <b>"rr"</b>. ¡El primero en llegar gana!
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-sky-500 flex items-center gap-2 mb-2">
                    <Play size={20} /> EL TURNO
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-lg">
                    <li>Toca el dado para moverte.</li>
                    <li>Tu ficha saltará de casilla en casilla.</li>
                    <li>Al final, aparecerá una frase para leer.</li>
                    <li>¡Lee en voz alta y pulsa <b>"¡LO LEÍ!"</b> para terminar!</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-green-500 flex items-center gap-2 mb-2">
                    <Zap size={20} /> MODOS
                  </h3>
                  <p className="text-lg">
                    Elige el <b>Tablero Rápido</b> para una partida corta o el <b>Tablero Completo</b> para jugar como en el Parchís de siempre.
                  </p>
                </section>

                <hr className="border-gray-100" />

                <section className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Información Técnica</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Este proyecto puede ser editado en:
                  </p>
                  <a 
                    href="https://ai.studio/build" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sky-600 font-bold hover:underline block mb-4"
                  >
                    Google AI Studio Build 🚀
                  </a>
                  <p className="text-xs text-gray-400 font-mono">
                    Para local: npm install && npm run dev
                  </p>
                </section>
              </div>

              <button
                onClick={() => setShowInstructions(false)}
                className="w-full mt-8 py-4 bg-sky-500 text-white text-2xl font-black rounded-2xl shadow-lg hover:bg-sky-600 transition-colors"
              >
                ¡ENTENDIDO!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
