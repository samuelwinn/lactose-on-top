import React from 'react';
import { motion } from 'motion/react';
import { Clock, Layers, Heart, Bell, Star, Power } from 'lucide-react';
import { WidgetSettings } from '../types';

interface WidgetAppProps {
  settings: WidgetSettings;
  onUpdateSettings: (settings: WidgetSettings) => void;
}

export const WidgetApp: React.FC<WidgetAppProps> = ({ settings, onUpdateSettings }) => {
  const toggleSetting = (key: keyof WidgetSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl mx-auto w-full space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[var(--primary)] border border-white/10">
              <Clock size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic">Widget Settings</h2>
              <p className="text-zinc-500 text-sm font-medium">Customize your desktop clock widget experience.</p>
            </div>
          </div>
        </div>

        {/* Master Toggle */}
        <div 
          onClick={() => toggleSetting('enabled')}
          className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between ${
            settings.enabled 
              ? 'bg-[var(--primary-shadow)] border-[var(--primary)] text-white' 
              : 'bg-zinc-900/50 border-white/5 text-zinc-500'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${settings.enabled ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-600'}`}>
              <Power size={20} />
            </div>
            <div>
              <div className="font-black uppercase tracking-widest text-sm">Clock Widget</div>
              <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                {settings.enabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.enabled ? 'bg-white' : 'bg-zinc-800'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.enabled ? 'right-1 bg-black' : 'left-1 bg-zinc-600'}`} />
          </div>
        </div>

        {/* Info */}
        <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-3xl">
          <p className="text-[10px] font-medium text-zinc-500 leading-relaxed uppercase tracking-widest text-center">
            The clock widget shows the current time in the bottom right corner of your screen.
          </p>
        </div>
      </div>
    </div>
  );
};
