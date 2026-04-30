import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, KeyRound, ArrowRight } from 'lucide-react';
import { obfuscate } from '../constants';
import { useObfuscation } from '../context/ObfuscationContext';

interface PasscodeModalProps {
  mode: 'set' | 'enter';
  correctPasscode?: string | null;
  onComplete: (passcode: string) => void;
  onPanic?: () => void;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({ mode, correctPasscode, onComplete, onPanic }) => {
  const { level } = useObfuscation();
  const [digits, setDigits] = useState<string[]>(['', '', '']);
  const [error, setError] = useState(false);
  const [firstPasscode, setFirstPasscode] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleInput = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setError(false);

    if (value && index < 2) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  useEffect(() => {
    if (digits.every(d => d !== '')) {
      const code = digits.join('');
      
      if (mode === 'enter') {
        if (code === '911' && onPanic) {
          onPanic();
          return;
        }

        if (correctPasscode && code !== correctPasscode) {
          setError(true);
          setTimeout(() => {
            setDigits(['', '', '']);
            setError(false);
            document.getElementById('digit-0')?.focus();
          }, 500);
        } else {
          onComplete(code);
        }
      } else if (mode === 'set') {
        if (code === '911') {
          setError(true);
          setTimeout(() => {
            setDigits(['', '', '']);
            setError(false);
            document.getElementById('digit-0')?.focus();
          }, 500);
          return;
        }

        if (!isConfirming) {
          // First time entering in 'set' mode
          setFirstPasscode(code);
          setIsConfirming(true);
          setDigits(['', '', '']);
          document.getElementById('digit-0')?.focus();
        } else {
          // Confirming in 'set' mode
          if (code === firstPasscode) {
            onComplete(code);
          } else {
            setError(true);
            setTimeout(() => {
              setDigits(['', '', '']);
              setFirstPasscode(null);
              setIsConfirming(false);
              setError(false);
              document.getElementById('digit-0')?.focus();
            }, 500);
          }
        }
      }
    }
  }, [digits, mode, correctPasscode, onComplete, isConfirming, firstPasscode]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/90 backdrop-blur-xl p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0,
          x: error ? [0, -10, 10, -10, 10, 0] : 0
        }}
        transition={{ x: { duration: 0.4 } }}
        className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Background Glow */}
        <div 
          className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[100px] opacity-20"
          style={{ backgroundColor: 'var(--primary)' }}
        />
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-zinc-950 border border-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            {mode === 'set' ? (
              <Shield size={32} style={{ color: 'var(--primary)' }} />
            ) : (
              <Lock size={32} style={{ color: 'var(--primary)' }} />
            )}
          </div>

          <h2 className="text-3xl font-black mb-2 tracking-tighter uppercase italic text-white">
            {mode === 'set' 
              ? (isConfirming ? obfuscate('Confirm Passcode', level) : obfuscate('Create Passcode', level)) 
              : obfuscate('System Locked', level)}
          </h2>
          <p className="text-zinc-500 text-sm mb-10 font-medium">
            {mode === 'set' 
              ? (isConfirming ? obfuscate('Re-enter your 3-digit code.', level) : <>{obfuscate('Set a 3-digit code for this session.', level)} <span className="font-bold text-zinc-400">({obfuscate('911 is reserved', level)})</span></>) 
              : obfuscate('Enter your 3-digit code to continue.', level)}
          </p>

          <div className="flex justify-center gap-4 mb-10">
            {digits.map((digit, i) => (
              <input
                key={i}
                id={`digit-${i}`}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                autoFocus={i === 0}
                className={`w-16 h-20 bg-zinc-950 border-2 rounded-2xl text-3xl font-black text-center focus:outline-none transition-all ${
                  error 
                    ? 'border-red-500 text-red-500' 
                    : digit 
                      ? 'border-white/20 text-white shadow-lg' 
                      : 'border-white/5 text-zinc-700'
                }`}
                style={digit ? { borderColor: 'var(--primary)' } : {}}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            <KeyRound size={12} />
            <span>Secure Session Active</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
