import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ShieldAlert, Zap, Calendar, Star, ExternalLink, ChevronRight, Bell, Sparkles, ShoppingBag, Pickaxe, Terminal, Clock, Info, Book, Layers, FileText, PenTool, Headset, Music, LayoutGrid, Gamepad2, AlertTriangle, AlertCircle } from 'lucide-react';
import { obfuscate } from '../constants';
import { useObfuscation } from '../context/ObfuscationContext';
import Markdown from 'react-markdown';

interface AnnouncementsProps {
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onShowMore?: () => void;
}

export const Announcements: React.FC<AnnouncementsProps> = ({ isModal = false, isOpen = true, onClose, onShowMore }) => {
  const { level } = useObfuscation();
  const [hasReachedBottom, setHasReachedBottom] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen || !bottomRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasReachedBottom(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [isOpen]);
  
  const announcementText = `
# Important Announcement Regarding Lactose

**Attention Community Members,**

Please read this update carefully regarding the future of Lactose.

Effective immediately, Lactose will receive one final update. This update is dedicated to fixing the current system and ensuring that all three existing links are fully operational once again.

Following this release, development will officially conclude.

### What You Need to Know

*   **The Final Fix:** Work is underway to get all three links working properly. They will remain active for the foreseeable future once fixed.
*   **No New Links:** There will be no new links or additional mirrors generated after this update.
*   **End of Development:** No further feature updates, content additions, or patches will be released.

### Moving to Discord

While official updates are coming to an end, the community isn't going anywhere! We are shifting our focus toward our community hub.

The Discord server will remain fully active. Moving forward, the server will be used as our primary space to share games, hang out, and swap content.

We sincerely apologize to anyone who was hoping for long-term updates and ongoing development. Thank you all for your incredible support, your patience, and for being a part of this journey.

### Official Links
*   **lactoze.com**
*   **student-education.com**
*   **laclife.org**

See you over on Discord!

**Published: May 16, 2026 - Orcaweesh**
`;

  const ModalContent = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black/95 backdrop-blur-3xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-black"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="relative w-full h-full flex flex-col overflow-hidden"
      >
        {/* Animated Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse z-50" />

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-20 lg:px-40"
        >
          <div className="max-w-4xl mx-auto py-12 md:py-20">
            <div className="flex items-center gap-6 mb-16">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 shadow-xl shadow-red-500/10 border border-red-500/20 shrink-0">
                <AlertTriangle size={32} />
              </div>
              <div>
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-red-500/80 mb-2 block">CRITICAL NOTICE</span>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white leading-none">{obfuscate('LAST UPDATE', level)}</h2>
              </div>
            </div>

            <div className="prose prose-invert prose-zinc max-w-none">
              <div className="markdown-body announcement-markdown">
                  <Markdown>{announcementText}</Markdown>
              </div>
            </div>


            
            {/* Target for intersection observer */}
            <div ref={bottomRef} className="h-4 mt-20" />
          </div>
        </div>

        <div className="p-8 md:p-12 md:px-20 lg:px-40 bg-black/80 backdrop-blur-xl border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 z-50">
          <div className="flex flex-col gap-2">
             <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${hasReachedBottom ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest italic">
                  {hasReachedBottom ? 'End of Message Reached' : 'Please scroll to the bottom to acknowledge'}
                </span>
             </div>
             <p className="text-[10px] text-zinc-600 font-medium tracking-wider uppercase">Lactose Final Optimization • May 16, 2026</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <a 
              href="https://discord.gg/3XAgBPC3vx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-3 px-10 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-white/10"
            >
              <MessageSquare size={16} />
              {obfuscate('Discord', level)}
            </a>
            <button
              disabled={!hasReachedBottom}
              onClick={onClose}
              className={`flex-1 md:flex-none px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl relative overflow-hidden group
                ${hasReachedBottom 
                  ? 'bg-white text-black hover:scale-105 active:scale-95' 
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                }`}
            >
              {obfuscate('Acknowledge', level)}
              {!hasReachedBottom && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const InlineContent = (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <div className="flex flex-col items-center text-center mb-16 px-4">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative">
            <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
            <AlertCircle size={40} className="text-red-500 relative z-10" />
        </div>
        <span className="text-xs font-black uppercase tracking-[0.4em] text-red-500 mb-2">Final Official Broadcast</span>
        <h1 className="text-5xl font-black tracking-tighter uppercase italic">{obfuscate('LAST UPDATE', level)}</h1>
        <div className="w-24 h-1 bg-red-500/50 rounded-full mt-4" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-8 md:p-16 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[120px] rounded-full" />
        
        <div className="relative z-10 prose prose-invert prose-zinc max-w-none">
          <div className="markdown-body announcement-markdown inline-mode">
            <Markdown>{announcementText}</Markdown>
          </div>
        </div>


      </motion.div>

      <div className="py-20 text-center opacity-30">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900/50 border border-white/5 rounded-full text-xs font-mono text-zinc-500 uppercase tracking-widest">
          {obfuscate('LACTOSE • 2024-2026', level)}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return <AnimatePresence>{isOpen && ModalContent}</AnimatePresence>;
  }

  return InlineContent;
};
