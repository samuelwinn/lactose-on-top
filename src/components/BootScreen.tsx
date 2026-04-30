import React from 'react';
import { motion } from 'motion/react';
import { obfuscate } from '../constants';
import { useObfuscation } from '../context/ObfuscationContext';

export const BootScreen: React.FC = () => {
  const { level } = useObfuscation();
  const letters = [
    { char: 'L', fromTop: true },
    { char: 'A', fromTop: false },
    { char: 'C', fromTop: true },
    { char: 'T', fromTop: false },
    { char: 'O', fromTop: true },
    { char: 'S', fromTop: false },
    { char: 'E', fromTop: true },
  ];

  return (
    <div className="fixed inset-0 z-[100000] bg-zinc-950 flex items-center justify-center overflow-hidden">
      <div className="flex gap-4 md:gap-8">
        {letters.map((item, index) => (
          <motion.span
            key={index}
            initial={{ y: item.fromTop ? -1000 : 1000, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              transition: { 
                type: "spring", 
                damping: 12, 
                stiffness: 100, 
                delay: index * 0.1 
              } 
            }}
            className="text-6xl md:text-9xl font-black italic tracking-tighter text-white"
            style={{ 
              textShadow: '0 0 40px rgba(255,255,255,0.3)',
              filter: 'drop-shadow(0 0 10px var(--primary))'
            }}
          >
            {obfuscate(item.char, level)}
          </motion.span>
        ))}
      </div>
      
      {/* Background Pulse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-[var(--primary)] pointer-events-none"
      />
      
      {/* Progress Line */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-1 bg-zinc-900 overflow-hidden rounded-full">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-full h-full bg-white"
        />
      </div>
    </div>
  );
};
