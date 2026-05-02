import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ExternalLink, Plus } from 'lucide-react';
import { obfuscate } from '../constants';
import { useObfuscation } from '../context/ObfuscationContext';
import { Game } from '../types';

interface AppStoreProps {
  onClose: () => void;
  onSelectApp: (app: Game) => void;
  onInstall?: () => void;
  isInstallable?: boolean;
}

export const AppStore: React.FC<AppStoreProps> = ({ onClose, onSelectApp, onInstall, isInstallable }) => {
  const { level } = useObfuscation();
  const extraApps: Game[] = [
    {
      name: "Font Changer",
      html: "https://drive.google.com/file/d/1sW_O-WmizVGP-2zgdADO-XCFm00q4Gse/view?usp=sharing",
      subtitle: "TATO"
    },
    {
      name: "Scientific Calculator",
      html: "https://drive.google.com/file/d/1nvHF39QcIJIRinF5F01dUVclYy81MqW9/view?usp=sharing",
      subtitle: "TATO"
    },
    { 
      name: "Filerunner", 
      html: "https://drive.google.com/file/d/1u8Y8Caugon0yOEwrhN2W36XZuPFgAgOm/view?usp=sharing",
      subtitle: "Baycoln99"
    }
  ];

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      {/* Header handled by WindowHeader in App.tsx but we can add secondary nav */}
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Top Banner section with Google Form link as requested */}
        <section className="px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-10 shadow-2xl"
            >
              <div className="relative z-10 flex flex-col justify-between h-full gap-10">
                <div className="space-y-4">
                  <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
                    {obfuscate('Have An App You Want To Add?', level)}
                  </h1>
                  <p className="text-white/80 text-sm font-medium leading-relaxed">
                    {obfuscate('Submit your work on this Google Form!', level)}
                  </p>
                </div>
                <div>
                  <a 
                    href="https://forms.gle/mivwiYmei6ARHh886" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
                  >
                    {obfuscate('Submit Work', level)}
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`relative overflow-hidden rounded-[2.5rem] p-10 border border-white/10 shadow-2xl ${isInstallable ? 'bg-emerald-600' : 'bg-zinc-900'}`}
              onClick={onInstall}
            >
              <div className="relative z-10 flex flex-col justify-between h-full gap-8 cursor-pointer">
                <div className="space-y-4">
                  <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
                    {obfuscate('Install LACTOSE App', level)}
                  </h1>
                  <p className="text-white/80 text-sm font-medium leading-relaxed">
                    {isInstallable 
                      ? obfuscate('Your device supports direct installation! Click to install LACTOSE as a standalone app.', level)
                      : obfuscate('Get the full experience on your home screen. Standalone mode, faster loading, and more.', level)
                    }
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-6 py-3 bg-white text-black rounded-xl font-black uppercase tracking-widest text-xs">
                    {isInstallable ? obfuscate('Install Now', level) : obfuscate('How to Install', level)}
                  </div>
                  {isInstallable && <div className="w-3 h-3 bg-white rounded-full animate-ping" />}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="px-8 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xl font-black tracking-tighter uppercase italic">{obfuscate('Disclaimer', level)}</h3>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6">
            <p className="text-zinc-500 text-sm font-medium leading-relaxed italic">
              {obfuscate('"The creator of LACTOSE, Orcaweesh, did not make any of these apps. They might not all work properly, and Orcaweesh can\'t do anything about it."', level)}
            </p>
          </div>
        </section>

        {/* Extra Apps List */}
        <section className="px-8 pb-16">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-xl font-black tracking-tighter uppercase italic">{obfuscate('EXTRA APPS', level)}</h3>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extraApps.map((app, i) => (
              <div 
                key={i} 
                onClick={() => onSelectApp(app)}
                className="flex items-center gap-5 p-5 bg-zinc-900/30 border border-white/5 rounded-[1.5rem] hover:bg-zinc-900/50 transition-all group cursor-pointer"
              >
                <div className="w-14 h-14 bg-zinc-950 border border-white/5 rounded-2xl flex items-center justify-center text-xl font-black group-hover:scale-105 transition-transform" style={{ color: 'var(--primary)' }}>
                  {obfuscate(app.name.charAt(0), level)}
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm tracking-tight">{obfuscate(app.name, level)}</h5>
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{obfuscate(app.subtitle || "Baycoln99", level)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
