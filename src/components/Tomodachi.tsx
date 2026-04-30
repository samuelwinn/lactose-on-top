import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Utensils, Gamepad2, Moon, Sun, RefreshCcw, X, Smile, Frown, Meh, HelpCircle, Info } from 'lucide-react';
import { WindowHeader } from '../App';
import { obfuscate } from '../constants';
import { useObfuscation } from '../context/ObfuscationContext';

interface PetState {
  name: string;
  hunger: number;
  happiness: number;
  energy: number;
  lastUpdate: number;
  isSleeping: boolean;
  age: number;
  lastFeedTime: number;
  lastPlayTime: number;
  lastSleepTime: number;
  sleepStartTime?: number;
}

const INITIAL_STATE: PetState = {
  name: 'Tomo',
  hunger: 80,
  happiness: 80,
  energy: 100,
  lastUpdate: Date.now(),
  isSleeping: false,
  age: 0,
  lastFeedTime: 0,
  lastPlayTime: 0,
  lastSleepTime: 0,
};

export const Tomodachi: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { level } = useObfuscation();
  const [showGuide, setShowGuide] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [pet, setPet] = useState<PetState>(() => {
    const saved = localStorage.getItem('tomodachi_pet');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Calculate decay since last visit
        const now = Date.now();
        const diff = (now - parsed.lastUpdate) / 1000; // seconds
        const decayRate = 0.01; // units per second
        
        return {
          ...parsed,
          hunger: Math.max(0, parsed.hunger - (parsed.isSleeping ? decayRate * 0.5 : decayRate) * diff),
          happiness: Math.max(0, parsed.happiness - decayRate * diff),
          energy: parsed.isSleeping 
            ? Math.min(100, parsed.energy + decayRate * 2 * diff)
            : Math.max(0, parsed.energy - decayRate * diff),
          lastUpdate: now,
        };
      } catch (e) {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  const [message, setMessage] = useState<string>('');

  const savePet = useCallback((newState: PetState) => {
    localStorage.setItem('tomodachi_pet', JSON.stringify({ ...newState, lastUpdate: Date.now() }));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPet(prev => {
        const now = Date.now();
        
        // Auto-wake if energy is full OR sleep duration exceeded (90s)
        const sleepDuration = prev.sleepStartTime ? (now - prev.sleepStartTime) : 0;
        if (prev.isSleeping && (prev.energy >= 100 || sleepDuration >= 90000)) {
          const reason = prev.energy >= 100 ? 'feeling refreshed' : 'the nap is over';
          setMessage(`${prev.name} woke up, ${reason}!`);
          const next = { ...prev, isSleeping: false, energy: Math.min(100, prev.energy), sleepStartTime: undefined };
          savePet(next);
          return next;
        }

        const decayRate = 0.5; // units per tick (every 5s)
        const next = {
          ...prev,
          hunger: Math.max(0, prev.hunger - (prev.isSleeping ? decayRate * 0.2 : decayRate)),
          happiness: Math.max(0, prev.happiness - (prev.isSleeping ? 0 : decayRate)),
          energy: prev.isSleeping 
            ? Math.min(100, prev.energy + decayRate * 3)
            : Math.max(0, prev.energy - decayRate),
          lastUpdate: Date.now(),
        };
        savePet(next);
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [savePet]);

  const handleAction = (action: 'feed' | 'play' | 'sleep') => {
    const now = Date.now();
    const COOLDOWN = 10 * 60 * 1000; // 10 minutes

    if (pet.isSleeping && action !== 'sleep') {
      setMessage(`${pet.name} is sleeping!`);
      return;
    }

    setPet(prev => {
      let next = { ...prev };
      switch (action) {
        case 'feed':
          if (now - prev.lastFeedTime < COOLDOWN) {
            const remaining = Math.ceil((COOLDOWN - (now - prev.lastFeedTime)) / 60000);
            setMessage(`Too soon! Wait ${remaining}m to feed again.`);
            return prev;
          }
          if (prev.hunger >= 100) {
            setMessage(`${prev.name} is full!`);
            return prev;
          }
          next = { ...prev, hunger: Math.min(100, prev.hunger + 20), energy: Math.max(0, prev.energy - 5), lastFeedTime: now };
          setMessage(`You fed ${prev.name}!`);
          break;
        case 'play':
          if (now - prev.lastPlayTime < COOLDOWN) {
            const remaining = Math.ceil((COOLDOWN - (now - prev.lastPlayTime)) / 60000);
            setMessage(`Too soon! Wait ${remaining}m to play again.`);
            return prev;
          }
          if (prev.energy < 10) {
            setMessage(`${prev.name} is too tired to play.`);
            return prev;
          }
          next = { ...prev, happiness: Math.min(100, prev.happiness + 20), energy: Math.max(0, prev.energy - 15), lastPlayTime: now };
          setMessage(`You played with ${prev.name}!`);
          break;
        case 'sleep':
          if (!prev.isSleeping && now - prev.lastSleepTime < COOLDOWN) {
            const remaining = Math.ceil((COOLDOWN - (now - prev.lastSleepTime)) / 60000);
            setMessage(`Too soon! Wait ${remaining}m to sleep again.`);
            return prev;
          }
          next = { 
            ...prev, 
            isSleeping: !prev.isSleeping, 
            sleepStartTime: !prev.isSleeping ? now : undefined,
            lastSleepTime: !prev.isSleeping ? prev.lastSleepTime : now // Update cooldown when waking up
          };
          setMessage(next.isSleeping ? `${prev.name} went to sleep.` : `${prev.name} woke up.`);
          break;
      }
      savePet(next);
      return next;
    });
  };

  const getCooldown = (lastTime: number) => {
    const COOLDOWN = 10 * 60 * 1000;
    const remaining = Math.max(0, COOLDOWN - (currentTime - lastTime));
    if (remaining === 0) return null;
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSleepRemaining = () => {
    if (!pet.isSleeping || !pet.sleepStartTime) return null;
    const LIMIT = 90 * 1000;
    const remaining = Math.max(0, LIMIT - (currentTime - pet.sleepStartTime));
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodIcon = () => {
    if (pet.isSleeping) return <Moon size={64} className="text-blue-400 animate-pulse" />;
    if (pet.hunger < 20 || pet.happiness < 20 || pet.energy < 20) return <Frown size={64} className="text-red-400" />;
    if (pet.hunger < 50 || pet.happiness < 50) return <Meh size={64} className="text-yellow-400" />;
    return <Smile size={64} className="text-green-400" />;
  };

  const getStatusColor = (val: number) => {
    if (val > 70) return 'bg-green-500';
    if (val > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 relative">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Tomodachi</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className={`p-2 rounded-lg transition-all ${showGuide ? 'bg-[var(--primary)] text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            title="How to Play"
          >
            <HelpCircle size={16} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Main Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-[var(--primary)] rounded-full blur-3xl" />
          </div>

          {/* Pet Container */}
          <motion.div 
            className={`relative w-64 h-64 bg-zinc-900 rounded-[3rem] border-4 border-white/10 flex items-center justify-center shadow-2xl transition-all duration-500 ${pet.isSleeping ? 'brightness-50' : ''}`}
            animate={{ 
              y: pet.isSleeping ? 0 : [0, -10, 0],
              scale: pet.isSleeping ? 0.95 : 1
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            {getMoodIcon()}
            
            {/* Floating particles when happy */}
            {pet.happiness > 80 && !pet.isSleeping && (
              <motion.div 
                className="absolute -top-4 -right-4 text-pink-500"
                animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart size={24} fill="currentColor" />
              </motion.div>
            )}
          </motion.div>

          {/* Name and Message */}
          <div className="mt-8 text-center">
            {isRenaming ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter name..."
                  className="bg-zinc-900 border border-[var(--primary)] rounded-xl px-4 py-2 text-white text-sm focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (newName.trim()) {
                        setPet(prev => {
                          const next = { ...prev, name: newName.trim() };
                          savePet(next);
                          return next;
                        });
                        setIsRenaming(false);
                        setMessage(`Pet renamed to ${newName.trim()}!`);
                      }
                    } else if (e.key === 'Escape') {
                      setIsRenaming(false);
                    }
                  }}
                />
                <button 
                  onClick={() => setIsRenaming(false)}
                  className="p-2 text-zinc-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <h2 
                className="text-2xl font-black tracking-tighter uppercase italic text-white mb-2 cursor-pointer hover:text-[var(--primary)] transition-colors flex items-center justify-center gap-2 group"
                onClick={() => {
                  setNewName(pet.name);
                  setIsRenaming(true);
                }}
                title="Click to rename"
              >
                {obfuscate(pet.name, level)}
                <RefreshCcw size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h2>
            )}
            <AnimatePresence mode="wait">
              <motion.p 
                key={message}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-zinc-500 text-sm font-medium h-5"
              >
                {obfuscate(message, level)}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Stats Grid */}
          <div className="mt-12 w-full max-w-md grid grid-cols-3 gap-4">
            {[
              { label: 'Hunger', val: pet.hunger, icon: <Utensils size={14} /> },
              { label: 'Happy', val: pet.happiness, icon: <Gamepad2 size={14} /> },
              { label: 'Energy', val: pet.energy, icon: <Sun size={14} /> },
            ].map(stat => (
              <div key={stat.label} className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-zinc-500">
                  {stat.icon}
                  <span className="text-[10px] font-bold uppercase tracking-widest">{obfuscate(stat.label, level)}</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${getStatusColor(stat.val)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-6">
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => handleAction('feed')}
                className="w-14 h-14 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:scale-110 transition-all shadow-lg relative overflow-hidden"
                title="Feed"
              >
                <Utensils size={24} />
                {getCooldown(pet.lastFeedTime) && (
                  <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[1px] flex items-center justify-center" />
                )}
              </button>
              <span className="text-[10px] font-mono text-zinc-500 h-3">
                {getCooldown(pet.lastFeedTime) || 'READY'}
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => handleAction('play')}
                className="w-14 h-14 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:scale-110 transition-all shadow-lg relative overflow-hidden"
                title="Play"
              >
                <Gamepad2 size={24} />
                {getCooldown(pet.lastPlayTime) && (
                  <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[1px] flex items-center justify-center" />
                )}
              </button>
              <span className="text-[10px] font-mono text-zinc-500 h-3">
                {getCooldown(pet.lastPlayTime) || 'READY'}
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => handleAction('sleep')}
                className={`w-14 h-14 border rounded-2xl flex items-center justify-center transition-all shadow-lg hover:scale-110 relative overflow-hidden ${
                  pet.isSleeping 
                    ? 'bg-blue-500/20 border-blue-500 text-blue-500' 
                    : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
                title={pet.isSleeping ? 'Wake Up' : 'Sleep'}
              >
                {pet.isSleeping ? <Sun size={24} /> : <Moon size={24} />}
                {!pet.isSleeping && getCooldown(pet.lastSleepTime) && (
                  <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[1px] flex items-center justify-center" />
                )}
              </button>
              <span className="text-[10px] font-mono text-zinc-500 h-3">
                {pet.isSleeping ? getSleepRemaining() : (getCooldown(pet.lastSleepTime) || 'READY')}
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('Reset your pet?')) {
                    setPet(INITIAL_STATE);
                    savePet(INITIAL_STATE);
                    setMessage('A new Tomo has arrived!');
                  }
                }}
                className="w-14 h-14 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-600 hover:text-red-500 hover:bg-zinc-800 transition-all"
                title="Reset"
              >
                <RefreshCcw size={20} />
              </button>
              <span className="text-[10px] font-mono text-zinc-700 h-3">RESET</span>
            </div>
          </div>
        </div>

        {/* Guide Sidebar */}
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 bg-zinc-900 border-l border-white/10 p-8 overflow-y-auto custom-scrollbar shadow-2xl z-20"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white">
                  <Info size={20} />
                </div>
                <h3 className="text-lg font-black tracking-tighter uppercase italic">How to Play</h3>
              </div>

              <div className="space-y-8">
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">The Basics</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Tomo is your virtual pet. Keep it alive by managing its stats. Stats decay over time, even when you're not here!
                  </p>
                </section>

                <section className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Stats</h4>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Utensils size={14} className="text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-bold text-white uppercase">Hunger</div>
                        <p className="text-[10px] text-zinc-500 leading-tight">Feed Tomo to keep this high. Low hunger makes Tomo sad.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Gamepad2 size={14} className="text-pink-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-bold text-white uppercase">Happiness</div>
                        <p className="text-[10px] text-zinc-500 leading-tight">Play with Tomo to increase happiness. Costs some energy!</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Sun size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-bold text-white uppercase">Energy</div>
                        <p className="text-[10px] text-zinc-500 leading-tight">Decreases while awake. Use the Sleep button to recharge.</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Activities & Cooldowns</h4>
                  <div className="bg-zinc-950/50 border border-white/5 rounded-2xl p-4 space-y-2">
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      • <span className="text-white font-bold">Feed & Play</span>: Once every 10 minutes.
                    </p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      • <span className="text-white font-bold">Sleep</span>: Max 1.5 minutes per session. Cooldown of 10 minutes after waking up.
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Sleep Mode</h4>
                  <div className="bg-zinc-950/50 border border-white/5 rounded-2xl p-4">
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      While sleeping, Tomo recovers energy <span className="text-white font-bold">3x faster</span>. Hunger decays <span className="text-white font-bold">80% slower</span>, and happiness stays frozen. Tomo wakes up automatically when fully rested or after 90 seconds!
                    </p>
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Pro Tip</h4>
                  <p className="text-[10px] text-zinc-500 italic leading-relaxed">
                    Check back every few hours to make sure Tomo is doing okay. If stats hit zero, Tomo will be very unhappy!
                  </p>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

