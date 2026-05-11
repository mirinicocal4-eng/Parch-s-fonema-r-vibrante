import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2 } from 'lucide-react';

import { ReadingItem } from '../types';

interface ReadingModalProps {
  isOpen: boolean;
  item: ReadingItem | null;
  onClose: () => void;
  playerColor?: string;
}

export default function ReadingModal({ isOpen, item, onClose, playerColor = '#4CAF50' }: ReadingModalProps) {
  const [pictoId, setPictoId] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && item) {
      // If the item has a manual pictogramId, use it immediately
      if (item.pictogramId) {
        setPictoId(item.pictogramId);
        setIsLoading(false);
        return;
      }

      // If it's a single word (no spaces), try to fetch automatically
      if (!item.text.includes(' ')) {
        setIsLoading(true);
        const fetchPicto = async () => {
          try {
            const response = await fetch(`https://api.arasaac.org/api/pictograms/es/search/${item.text.toLowerCase()}`);
            const data = await response.json();
            if (data && data.length > 0) {
              setPictoId(data[0]._id);
            } else {
              setPictoId(null);
            }
          } catch (error) {
            console.error("Error fetching pictogram:", error);
            setPictoId(null);
          } finally {
            setIsLoading(false);
          }
        };
        fetchPicto();
      } else {
        setPictoId(null);
        setIsLoading(false);
      }
    } else {
      setPictoId(null);
      setIsLoading(false);
    }
  }, [isOpen, item]);

  const speak = React.useCallback(() => {
    if (!item) return;
    // Cancel any previous speech to avoid overlapping
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.85; // Slightly slower for better clarity
    utterance.pitch = 1.1; // Friendly tone
    window.speechSynthesis.speak(utterance);
  }, [item]);

  const isPhrase = item?.text.includes(' ');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-4xl bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-2xl flex flex-col max-h-[95vh] border-[8px] md:border-[16px]"
            style={{ borderColor: playerColor }}
          >
            {/* Close icon for emergencies */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-gray-300 hover:text-gray-500 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center">
              <div className="flex items-center gap-4 mb-4 md:mb-8">
                <h2 className="text-xs md:text-lg font-bold text-gray-300 uppercase tracking-[0.3em]">Lectura</h2>
                <button 
                  onClick={speak}
                  className="p-2 bg-sky-100 text-sky-600 rounded-full hover:bg-sky-200 transition-colors shadow-sm"
                  title="Escuchar"
                >
                  <Volume2 size={24} />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                {pictoId && (
                  <div className="mb-4 md:mb-6">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-3 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border-4 border-gray-50 shadow-lg"
                    >
                      <img 
                        src={`https://static.arasaac.org/pictograms/${pictoId}/${pictoId}_300.png`} 
                        alt="Pictogram" 
                        className="w-32 h-32 md:w-56 md:h-56 object-contain"
                      />
                    </motion.div>
                  </div>
                )}

                <div className="w-full px-2 md:px-6 relative group">
                  <p className={`
                    ${isPhrase ? 'text-2xl md:text-4xl' : 'text-4xl md:text-7xl'} 
                    font-bold text-gray-800 leading-[1.2] font-school uppercase tracking-tight text-center cursor-pointer hover:text-sky-600 transition-colors
                  `}
                  onClick={speak}
                  >
                    {item?.text}
                  </p>
                  <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Toca para escuchar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer with Button */}
            <div className="p-4 md:p-8 bg-gray-50/50 border-t border-gray-100 flex justify-center">
              <button
                onClick={onClose}
                className="w-full max-w-xl py-4 md:py-6 bg-green-500 hover:bg-green-600 text-white text-2xl md:text-4xl font-black rounded-[1rem] md:rounded-[2rem] transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg"
              >
                ¡LO LEÍ!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
