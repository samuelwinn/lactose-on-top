import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, AlarmClock, StopCircle, Play, Pause, RotateCcw, Plus, Trash2, Bell, X, Check } from 'lucide-react';
import { WindowHeader } from '../App';

export interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

interface ClockAppProps {
  onClose: () => void;
  alarms: Alarm[];
  setAlarms: (alarms: Alarm[]) => void;
  timerRemaining: number;
  setTimerRemaining: (seconds: number | ((prev: number) => number)) => void;
  timerRunning: boolean;
  setTimerRunning: (running: boolean) => void;
  timerTotal: number;
  setTimerTotal: (total: number) => void;
  swTime: number;
  setSwTime: (time: number | ((prev: number) => number)) => void;
  swRunning: boolean;
  setSwRunning: (running: boolean) => void;
  isRinging: boolean;
  setIsRinging: (ringing: boolean) => void;
  activeAlarmLabel: string;
  setActiveAlarmLabel: (label: string) => void;
}

export const ClockApp: React.FC<ClockAppProps> = ({ 
  onClose, 
  alarms, 
  setAlarms, 
  timerRemaining, 
  setTimerRemaining, 
  timerRunning, 
  setTimerRunning, 
  timerTotal, 
  setTimerTotal,
  swTime,
  setSwTime,
  swRunning,
  setSwRunning,
  isRinging,
  setIsRinging,
  activeAlarmLabel,
  setActiveAlarmLabel
}) => {
  const [activeTab, setActiveTab] = useState<'stopwatch' | 'timer' | 'alarm'>('stopwatch');

  // swTime and swRunning are now passed as props, logic handled in App.tsx

  // Timer UI State
  const [timerInput, setTimerInput] = useState({ h: 0, m: 0, s: 0 });

  // Alarm UI State
  const [showAddAlarm, setShowAddAlarm] = useState(false);
  const [newAlarm, setNewAlarm] = useState({ time: '08:00', label: 'Alarm' });

  const formatSwTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    const totalSeconds = timerInput.h * 3600 + timerInput.m * 60 + timerInput.s;
    if (totalSeconds > 0) {
      setTimerRemaining(totalSeconds);
      setTimerTotal(totalSeconds);
      setTimerRunning(true);
    }
  };

  const formatTimerTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addAlarm = () => {
    const alarm: Alarm = {
      id: Math.random().toString(36).substr(2, 9),
      time: newAlarm.time,
      label: newAlarm.label || 'Alarm',
      enabled: true
    };
    setAlarms([...alarms, alarm]);
    setShowAddAlarm(false);
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-zinc-900/30">
        {[
          { id: 'stopwatch', icon: <StopCircle size={16} />, label: 'Stopwatch' },
          { id: 'timer', icon: <Timer size={16} />, label: 'Timer' },
          { id: 'alarm', icon: <AlarmClock size={16} />, label: 'Alarm' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${
              activeTab === tab.id 
                ? 'text-white border-[var(--primary)] bg-white/5' 
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'stopwatch' && (
            <motion.div
              key="stopwatch"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full flex flex-col items-center justify-center space-y-12"
            >
              <div className="text-7xl md:text-9xl font-black tracking-tighter tabular-nums font-mono text-white">
                {formatSwTime(swTime)}
              </div>
              
              <div className="flex items-center gap-6">
                <button
                  onClick={() => {
                    setSwTime(0);
                    setSwRunning(false);
                  }}
                  className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                >
                  <RotateCcw size={24} />
                </button>
                <button
                  onClick={() => setSwRunning(!swRunning)}
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {swRunning ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
                </button>
                <div className="w-16" /> {/* Spacer for symmetry */}
              </div>
            </motion.div>
          )}

          {activeTab === 'timer' && (
            <motion.div
              key="timer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full flex flex-col items-center justify-center space-y-12"
            >
              {!timerRunning && timerRemaining === 0 ? (
                <div className="flex items-center gap-4">
                  {[
                    { label: 'H', key: 'h', max: 23 },
                    { label: 'M', key: 'm', max: 59 },
                    { label: 'S', key: 's', max: 59 }
                  ].map(unit => (
                    <div key={unit.label} className="flex flex-col items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max={unit.max}
                        value={timerInput[unit.key as keyof typeof timerInput]}
                        onChange={(e) => setTimerInput({ ...timerInput, [unit.key]: Math.min(unit.max, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-24 h-24 bg-zinc-900 border border-white/10 rounded-2xl text-4xl font-black text-center focus:outline-none focus:border-[var(--primary)] transition-all"
                      />
                      <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">{unit.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-zinc-900"
                    />
                    <motion.circle
                      cx="128"
                      cy="128"
                      r="120"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="753.98"
                      animate={{ strokeDashoffset: 753.98 * (1 - timerRemaining / timerTotal) }}
                      className="text-[var(--primary)]"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-black font-mono tabular-nums">
                    {formatTimerTime(timerRemaining)}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6">
                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerRemaining(0);
                  }}
                  className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                >
                  <RotateCcw size={24} />
                </button>
                <button
                  onClick={() => {
                    if (timerRunning) setTimerRunning(false);
                    else if (timerRemaining > 0) setTimerRunning(true);
                    else startTimer();
                  }}
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {timerRunning ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
                </button>
                <div className="w-16" />
              </div>
            </motion.div>
          )}

          {activeTab === 'alarm' && (
            <motion.div
              key="alarm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto w-full space-y-6"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black tracking-tighter uppercase italic">Alarms</h3>
                <button
                  onClick={() => setShowAddAlarm(true)}
                  className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-[var(--primary)] hover:bg-zinc-800 transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {alarms.length === 0 ? (
                  <div className="text-center py-12 bg-zinc-900/30 border border-dashed border-white/5 rounded-3xl">
                    <Bell size={40} className="mx-auto text-zinc-700 mb-4" />
                    <p className="text-zinc-500 text-sm">No alarms set</p>
                  </div>
                ) : (
                  alarms.map(alarm => (
                    <div key={alarm.id} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 flex items-center justify-between group">
                      <div className="space-y-1">
                        <div className="text-3xl font-black font-mono tabular-nums text-white">
                          {alarm.time}
                        </div>
                        <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                          {alarm.label}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => deleteAlarm(alarm.id)}
                          className="p-2 text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={() => toggleAlarm(alarm.id)}
                          className={`relative w-12 h-6 rounded-full transition-all flex items-center px-1 ${
                            alarm.enabled ? 'bg-[var(--primary)]' : 'bg-zinc-800'
                          }`}
                        >
                          <motion.div
                            animate={{ x: alarm.enabled ? 24 : 0 }}
                            className="w-4 h-4 bg-white rounded-full shadow-lg"
                          />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Alarm Modal */}
              <AnimatePresence>
                {showAddAlarm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowAddAlarm(false)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
                    >
                      <h4 className="text-xl font-black tracking-tighter uppercase italic mb-6">New Alarm</h4>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Time</label>
                          <input
                            type="time"
                            value={newAlarm.time}
                            onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
                            className="w-full bg-zinc-950 border border-white/5 rounded-xl p-4 text-2xl font-black font-mono text-white focus:outline-none focus:border-[var(--primary)]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Label</label>
                          <input
                            type="text"
                            value={newAlarm.label}
                            onChange={(e) => setNewAlarm({ ...newAlarm, label: e.target.value })}
                            placeholder="Alarm Label"
                            className="w-full bg-zinc-950 border border-white/5 rounded-xl p-4 text-sm font-bold text-white focus:outline-none focus:border-[var(--primary)]"
                          />
                        </div>
                        <div className="flex gap-4 pt-4">
                          <button
                            onClick={() => setShowAddAlarm(false)}
                            className="flex-1 py-4 bg-zinc-800 rounded-xl font-bold text-zinc-400 hover:bg-zinc-700 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={addAlarm}
                            className="flex-1 py-4 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                            style={{ backgroundColor: 'var(--primary)' }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
