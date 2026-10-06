import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Toast({ message, isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 16, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 12, x: '-50%' }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#141414]/95 text-white text-[13px] font-light shadow-2xl border border-white/10 backdrop-blur-md pointer-events-none"
        >
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#A670FF]/20 text-[#A670FF]">
            <Check size={11} strokeWidth={3} />
          </span>
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
