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

        {/* Visibility Options */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-black tracking-widest uppercase text-zinc-500 italic">Hover Visibility</h3>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'showCards', label: 'Cards Status', icon: <Layers size={18} />, color: 'emerald' },
              { id: 'showTomodachi', label: 'Tomodachi Stats', icon: <Heart size={18} />, color: 'rose' },
              { id: 'showAlarms', label: 'Alarms & Timers', icon: <Bell size={18} />, color: 'amber' },
              { id: 'showFavorites', label: 'Favorited Games', icon: <Star size={18} />, color: 'indigo' },
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => settings.enabled && toggleSetting(option.id as keyof WidgetSettings)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  !settings.enabled 
                    ? 'opacity-50 cursor-not-allowed bg-zinc-900/20 border-white/5 text-zinc-700' 
                    : settings[option.id as keyof WidgetSettings]
                      ? 'bg-zinc-900 border-white/20 text-white' 
                      : 'bg-zinc-900/30 border-white/5 text-zinc-600 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    settings[option.id as keyof WidgetSettings] ? 'bg-[var(--primary-shadow)] text-[var(--primary)]' : 'bg-zinc-950 text-zinc-800'
                  }`}>
                    {option.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">{option.label}</span>
                </div>
                {settings.enabled && (
                  <div className={`w-2 h-2 rounded-full ${settings[option.id as keyof WidgetSettings] ? 'bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]' : 'bg-zinc-800'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-3xl">
          <p className="text-[10px] font-medium text-zinc-500 leading-relaxed uppercase tracking-widest text-center">
            The clock widget is a experimental feature. <br />
            More options coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};
