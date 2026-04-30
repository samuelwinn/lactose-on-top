import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ExternalLink, Plus } from 'lucide-react';
import { obfuscate } from '../constants';
import { useObfuscation } from '../context/ObfuscationContext';
import { Game } from '../types';

interface AppStoreProps {
  onClose: () => void;
  onSelectApp: (app: Game) => void;
}

export const AppStore: React.FC<AppStoreProps> = ({ onClose, onSelectApp }) => {
  const { level } = useObfuscation();
  const extraApps: Game[] = [
    {
      name: "WIDGET",
      html: "internal",
      subtitle: "LACTOSE System"
    },
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-10 shadow-2xl"
          >
            {/* Shapes */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-black/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="text-center md:text-left space-y-4 max-w-lg">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                  {obfuscate('Have An App You Want To Add?', level)}
                </h1>
                <p className="text-white/80 text-sm font-medium leading-relaxed">
                  {obfuscate('Submit your work on this Google Form!', level)}
                </p>
                <div className="pt-4">
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

              <div className="hidden md:flex items-center justify-center">
                <div className="relative">
                  <div className="w-48 h-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3rem] flex items-center justify-center shadow-2xl transform rotate-12">
                    <ShoppingBag size={80} className="text-white" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-pink-500 rounded-3xl flex items-center justify-center text-white shadow-xl transform -rotate-12 animate-bounce">
                    <Plus size={32} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Disclaimer Section */}
        <section className="px-8 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xl font-black tracking-tighter uppercase italic">Disclaimer</h3>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6">
            <p className="text-zinc-500 text-sm font-medium leading-relaxed italic">
              "The creator of LACTOSE, Orcaweesh, did not make any of these apps. They might not all work properly, and Orcaweesh can't do anything about it."
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
