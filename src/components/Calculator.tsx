import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Delete } from 'lucide-react';
import { WindowHeader } from '../App';
import { obfuscate } from '../constants';
import { useObfuscation } from '../context/ObfuscationContext';

interface CalculatorProps {
  onClose: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const { level } = useObfuscation();
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for some keys to avoid page scrolling or other issues
      if (['/', '*', '-', '+', 'Enter', 'Backspace', 'Escape', '%'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
      if (e.key === '.') handleDecimal();
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('*');
      if (e.key === '/') handleOperator('/');
      if (e.key === 'Enter' || e.key === '=') handleEqual();
      if (e.key === 'Backspace') handleBackspace();
      if (e.key === 'Escape' || e.key.toLowerCase() === 'c') handleClear();
      if (e.key === '%') handlePercent();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, prevValue, operator, waitingForOperand]);

  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      const newValue = performCalculation[operator](currentValue, inputValue);
      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation: Record<string, (a: number, b: number) => number> = {
    '/': (a, b) => a / b,
    '*': (a, b) => a * b,
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
  };

  const handleEqual = () => {
    const inputValue = parseFloat(display);

    if (operator && prevValue !== null) {
      const newValue = performCalculation[operator](prevValue, inputValue);
      setDisplay(String(newValue));
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0e14] text-white overflow-hidden">
      <WindowHeader title="Calculator" onClose={onClose} />
      
      <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full justify-center">
        {/* Display Area */}
        <div className="border-2 border-[#76c7b7] rounded-2xl p-8 mb-6 min-h-[120px] flex items-center justify-end shadow-[0_0_15px_rgba(118,199,183,0.1)]">
          <div className="text-6xl font-light tracking-tight overflow-hidden text-ellipsis whitespace-nowrap w-full text-right font-mono tabular-nums">
            {obfuscate(display, level)}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <button onClick={handleClear} className="h-16 rounded-xl border border-[#76c7b7] bg-[#2d1a1e] text-[#f56565] text-2xl font-bold hover:brightness-125 transition-all active:scale-95">C</button>
          <button onClick={() => handleOperator('/')} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a2d2d] text-[#76c7b7] text-2xl font-bold hover:brightness-125 transition-all active:scale-95">/</button>
          <button onClick={() => handleOperator('*')} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a2d2d] text-[#76c7b7] text-2xl font-bold hover:brightness-125 transition-all active:scale-95">×</button>
          <button onClick={handleBackspace} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a2d2d] text-[#76c7b7] flex items-center justify-center hover:brightness-125 transition-all active:scale-95">
            <Delete size={24} />
          </button>

          {/* Row 2 */}
          <button onClick={() => handleNumber('7')} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a1c23] text-white text-2xl font-bold hover:brightness-125 transition-all active:scale-95">7</button>
          <button onClick={() => handleNumber('8')} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a1c23] text-white text-2xl font-bold hover:brightness-125 transition-all active:scale-95">8</button>
          <button onClick={() => handleNumber('9')} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a1c23] text-white text-2xl font-bold hover:brightness-125 transition-all active:scale-95">9</button>
          <button onClick={() => handleOperator('-')} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a2d2d] text-[#76c7b7] text-2xl font-bold hover:brightness-125 transition-all active:scale-95">-</button>

          {/* Row 3 */}
          <button onClick={() => handleNumber('4')} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a1c23] text-white text-2xl font-bold hover:brightness-125 transition-all active:scale-95">4</button>
          <button onClick={() => handleNumber('5')} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a1c23] text-white text-2xl font-bold hover:brightness-125 transition-all active:scale-95">5</button>
          <button onClick={() => handleNumber('6')} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a1c23] text-white text-2xl font-bold hover:brightness-125 transition-all active:scale-95">6</button>
          <button onClick={() => handleOperator('+')} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a2d2d] text-[#76c7b7] text-2xl font-bold hover:brightness-125 transition-all active:scale-95">+</button>

          {/* Row 4 */}
          <button onClick={() => handleNumber('1')} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a1c23] text-white text-2xl font-bold hover:brightness-125 transition-all active:scale-95">1</button>
          <button onClick={() => handleNumber('2')} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a1c23] text-white text-2xl font-bold hover:brightness-125 transition-all active:scale-95">2</button>
          <button onClick={() => handleNumber('3')} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a1c23] text-white text-2xl font-bold hover:brightness-125 transition-all active:scale-95">3</button>
          <button onClick={handlePercent} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a2d2d] text-[#76c7b7] text-2xl font-bold hover:brightness-125 transition-all active:scale-95">%</button>

          {/* Row 5 */}
          <button onClick={() => handleNumber('0')} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a1c23] text-white text-2xl font-bold hover:brightness-125 transition-all active:scale-95">0</button>
          <button onClick={handleDecimal} className="h-16 rounded-xl border border-[#76c7b7] bg-[#1a1c23] text-white text-2xl font-bold hover:brightness-125 transition-all active:scale-95">.</button>
          <button onClick={handleEqual} className="h-16 col-span-2 rounded-xl bg-[#76c7b7] text-[#0a0e14] text-2xl font-bold hover:brightness-110 transition-all active:scale-95">=</button>
        </div>
      </div>
    </div>
  );
};


