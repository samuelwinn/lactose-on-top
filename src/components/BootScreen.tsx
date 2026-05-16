import React from 'react';
import { motion } from 'motion/react';
import { obfuscate } from '../constants';
import { useObfuscation } from '../context/ObfuscationContext';

const OceanWave: React.FC<{ 
  delay: number; 
  duration: number; 
  opacity: number; 
  zIndex: number; 
  waveHeight: number;
  horizontalSpeed: number;
  offset?: string;
}> = ({ delay, duration, opacity, zIndex, waveHeight, horizontalSpeed, offset = "0%" }) => (
  <motion.div
    initial={{ y: '105%' }}
    animate={{ 
      y: ['105%', '-15%', '105%'],
    }}
    transition={{ 
      duration: duration, 
      delay: delay,
      times: [0, 0.45, 1],
      ease: "easeInOut",
    }}
    className="absolute inset-x-0 bottom-0 flex flex-col pointer-events-none"
    style={{ height: '120vh', zIndex }}
  >
    <div className="relative w-full shrink-0 overflow-hidden" style={{ height: waveHeight }}>
        <motion.div
          className="w-[300%] h-full absolute top-0 left-0 flex"
          initial={{ x: offset }}
          animate={{ x: ['0%', '-33.33%'] }}
          transition={{ duration: horizontalSpeed, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-1/3 h-full fill-white" style={{ opacity }}>
            <path d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,192C960,203,1056,181,1152,149.3C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-1/3 h-full fill-white" style={{ opacity }}>
            <path d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,192C960,203,1056,181,1152,149.3C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-1/3 h-full fill-white" style={{ opacity }}>
            <path d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,192C960,203,1056,181,1152,149.3C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </motion.div>
    </div>
    <div className="flex-1 bg-white" style={{ opacity }} />
  </motion.div>
);

export const BootScreen: React.FC = () => {
  const { level } = useObfuscation();
  const letters = ['L', 'A', 'C', 'T', 'O', 'S', 'E'];

  return (
    <div className="fixed inset-0 z-[100000] bg-zinc-950 flex items-center justify-center overflow-hidden">
      {/* Layered Oceanic Waves */}
      <OceanWave 
        zIndex={100005} 
        delay={0} 
        duration={3} 
        opacity={1} 
        waveHeight={200} 
        horizontalSpeed={3} 
      />
      <OceanWave 
        zIndex={100004} 
        delay={0.1} 
        duration={3.1} 
        opacity={0.6} 
        waveHeight={300} 
        horizontalSpeed={5} 
        offset="-15%" 
      />
      <OceanWave 
        zIndex={100003} 
        delay={0.2} 
        duration={3.2} 
        opacity={0.3} 
        waveHeight={400} 
        horizontalSpeed={7} 
        offset="-30%" 
      />

      {/* The Logo (Revealed when ocean dries) */}
      <div className="flex gap-2 md:gap-4 relative z-[100001]">
        {letters.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { 
                delay: 1.5 + (index * 0.1),
                duration: 0.8,
                ease: "easeOut"
              } 
            }}
            className="text-5xl md:text-8xl font-black italic tracking-tighter text-white"
            style={{ 
              textShadow: '0 0 40px rgba(255,255,255,0.2)',
            }}
          >
            {obfuscate(char, level)}
          </motion.span>
        ))}
      </div>
      
      {/* Subtle background glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.05, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-white pointer-events-none"
      />
      
      {/* Decorative lines revealed near end */}
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '150px', opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 h-[1px] bg-white/20"
      />
    </div>
  );
};
