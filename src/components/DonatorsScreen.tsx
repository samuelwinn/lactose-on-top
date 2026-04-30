import React from 'react';
import { motion } from 'motion/react';
import { Heart, ChevronRight } from 'lucide-react';

interface DonatorsScreenProps {
  onContinue: () => void;
}

export const DonatorsScreen: React.FC<DonatorsScreenProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 text-white font-sans overflow-hidden">
      <motion.div
        initial={false}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg p-12 text-center"
      >
        <div className="mb-12 relative inline-block">
          <div className="absolute inset-0 bg-[var(--primary)] blur-3xl opacity-20 animate-pulse" />
          <div className="relative w-24 h-24 bg-zinc-900 border border-white/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl">
            <Heart size={48} className="text-[var(--primary)]" fill="currentColor" />
          </div>
        </div>

        <div className="space-y-6 mb-12">
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
            DONATORS
          </h1>
          <div className="h-1 w-20 bg-[var(--primary)] mx-auto rounded-full" />
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.2em]">
            Special thanks to
          </p>
          <div className="text-3xl font-bold tracking-tight text-white mt-2">
            Cameron Pieples
          </div>
        </div>

        <button
          onClick={onContinue}
          className="group relative inline-flex items-center gap-3 px-10 py-4 bg-white text-black font-black uppercase text-sm rounded-2xl hover:bg-[var(--primary)] hover:text-white transition-all overflow-hidden shadow-2xl active:scale-95"
        >
          <span className="relative z-10">Continue</span>
          <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>

        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--primary)] rounded-full blur-[120px] opacity-10 pointer-events-none" />
      </motion.div>
    </div>
  );
};
