import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ReadingModalProps {
  isOpen: boolean;
  phrase: string;
  onClose: () => void;
  playerColor: string;
}

export default function ReadingModal({ isOpen, phrase, onClose, playerColor }: ReadingModalProps) {
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
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-400 mb-6 uppercase tracking-widest">¡A LEER!</h2>
              
              <p className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mb-8 font-sans">
                {phrase}
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
