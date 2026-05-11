import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

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
    if (isOpen && item && !item.text.includes(' ')) {
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
  }, [isOpen, item]);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border-8"
            style={{ borderColor: playerColor }}
          >
            <div className="p-8 md:p-12 text-center flex flex-col items-center">
              <h2 className="text-2xl font-bold text-gray-400 mb-6 uppercase tracking-widest">¡A LEER!</h2>
              
              <div className="min-h-[200px] md:min-h-[300px] flex items-center justify-center w-full mb-8">
                {isLoading ? (
                  <div className="w-48 h-48 md:w-64 md:h-64 bg-gray-50 animate-pulse rounded-3xl flex items-center justify-center border-4 border-gray-100">
                    <span className="text-gray-300 font-bold uppercase tracking-widest text-xs">Buscando...</span>
                  </div>
                ) : pictoId ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-50 p-4 rounded-3xl border-4 border-gray-100 shadow-inner"
                  >
                    <img 
                      src={`https://static.arasaac.org/pictograms/${pictoId}/${pictoId}_300.png`} 
                      alt="Pictograma" 
                      className="w-48 h-48 md:w-64 md:h-64 object-contain"
                    />
                  </motion.div>
                ) : null}
              </div>

              <p className={`
                ${pictoId ? 'text-5xl md:text-7xl' : 'text-4xl md:text-8xl'} 
                font-bold text-gray-800 leading-tight mb-8 font-school uppercase tracking-tight
              `}>
                {item?.text}
              </p>

              <button
                onClick={onClose}
                className="w-full py-6 bg-green-500 hover:bg-green-600 text-white text-3xl font-black rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                ¡LO LEÍ!
              </button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={32} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
