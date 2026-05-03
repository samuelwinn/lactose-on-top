import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ShieldAlert, Zap, Calendar, Star, ExternalLink, ChevronRight, Bell, Sparkles, ShoppingBag, Pickaxe, Terminal, Clock, Info, Book, Layers, FileText, PenTool, Headset, Music, LayoutGrid, Gamepad2 } from 'lucide-react';
import { obfuscate } from '../constants';
import { useObfuscation } from '../context/ObfuscationContext';

interface AnnouncementsProps {
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onShowMore?: () => void;
}

export const Announcements: React.FC<AnnouncementsProps> = ({ isModal = false, isOpen = true, onClose, onShowMore }) => {
  const { level } = useObfuscation();
  const updates = [
    {
      title: "ORIGINALS ARE HERE!",
      description: "A new dedicated section in the App Store for games handcrafted by Orcaweesh. Check out our first release: Retro Strike, an intense fighting game with unique character specials!",
      icon: <Sparkles size={18} className="text-emerald-400" />,
    },
    {
      title: "CARDS: SEASONAL SYSTEM",
      description: "A seasonal system is live! Introducing the 'Video Game' set. Your old cards from 'New Genesis' have been fully restored and can be pulled separately. Use the new Vault and Checklist tabs to manage both sets!",
      icon: <Layers size={18} className="text-white" />,
    },
    {
      title: "ARCADE UPDATE",
      description: "Minecraft and FNF have been officially moved to the Arcade area. You can now find all your favorite games in one place!",
      icon: <Gamepad2 size={18} className="text-zinc-400" />,
    },
    {
      title: "OBFUSCATION",
      description: "We've added Homoglyph Obfuscation to keep your content safe from AI filters and prying eyes. It hides text from machine vision while remaining readable to you!",
      icon: <ShieldAlert size={18} className="text-red-400" />,
    },
    {
      title: "BENTO GRID",
      description: "Our new Bento Grid design now scales to fit any screen size perfectly, providing a beautiful edge-to-edge experience on all laptops and monitors.",
      icon: <LayoutGrid size={18} className="text-emerald-400" />,
    },
    {
      title: "UI OVERHAUL",
      description: "Lactose has had a HUGE UI overhaul. I hope you like it!",
      icon: <Sparkles size={18} className="text-amber-400" />,
    },
    {
      title: "DISCORD",
      description: "Be sure to join our official Discord server: https://discord.gg/3XAgBPC3vx",
      link: "https://discord.gg/3XAgBPC3vx",
      icon: <MessageSquare size={18} className="text-blue-400" />,
    }
  ];

  const ModalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950"
      />
      
      <motion.div
        initial={false}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0 }}
        className="relative w-full max-w-[440px] bg-[#1a1d24] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-white shadow-inner">
              <Zap size={20} fill="currentColor" className="text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tighter uppercase italic text-white">{obfuscate('ANNOUNCEMENT', level)}</h2>
          </div>

          <div className="space-y-6 mb-10 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {updates.map((update, index) => (
              <div key={index} className="flex gap-4 group">
                <div className="mt-1 shrink-0">
                  {update.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    {obfuscate(update.title, level)}
                    {update.link && <ExternalLink size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                  </h3>
                  <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">
                    {obfuscate(update.description, level)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onShowMore}
              className="px-5 py-2.5 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 text-sm font-bold rounded-xl transition-all border border-white/5"
            >
              {obfuscate('Show more', level)}
            </button>
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-[#2d333d] hover:bg-[#363d49] text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-black/20"
            >
              {obfuscate('Continue', level)}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const InlineContent = (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-16 h-16 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center mb-4 shadow-2xl">
          <Bell size={32} style={{ color: 'var(--primary)' }} />
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">{obfuscate('UPDATES', level)}</h1>
        <p className="text-zinc-500 text-sm font-medium mt-2">{obfuscate('Latest features and security improvements', level)}</p>
      </div>

      <div className="space-y-6">
        {updates.map((update, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden hover:bg-zinc-900/60 transition-all"
          >
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-950 border border-white/5 rounded-lg">
                    {update.icon}
                  </div>
                  <h3 className="font-bold text-lg text-white tracking-tight">{obfuscate(update.title, level)}</h3>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed pl-1">
                  {obfuscate(update.description, level)}
                  {update.link && (
                    <a href={update.link} target="_blank" rel="noopener noreferrer" className="block mt-2 text-indigo-400 hover:underline flex items-center gap-1">
                      {update.link} <ExternalLink size={12} />
                    </a>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="py-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-white/5 rounded-full text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          <Sparkles size={12} style={{ color: 'var(--primary)' }} />
          {obfuscate('End of feed', level)}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return <AnimatePresence>{isOpen && ModalContent}</AnimatePresence>;
  }

  return InlineContent;
};
