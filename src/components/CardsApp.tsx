import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Sparkles, Clock, Trophy, Package, Search, AlertCircle, Loader2, Coins, X } from 'lucide-react';
import { ALL_CARDS, RARITIES, Card, Rarity } from '../constants/cards';
// No Firebase usage needed for local-only app

interface UserData {
  collection: Record<string, number>;
  lastPackOpened: number | null;
  username: string;
}

export const CardsApp: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pulling, setPulling] = useState(false);
  const [newCards, setNewCards] = useState<Card[]>([]);
  const [view, setView] = useState<'shop' | 'collection'>('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRarity, setFilterRarity] = useState<Rarity | 'All'>('All');
  const [cooldown, setCooldown] = useState<number>(0);
  const [showPackOpener, setShowPackOpener] = useState(false);
  const [showCardList, setShowCardList] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('tcg_data_v2');
    if (saved) {
      setUserData(JSON.parse(saved));
    } else {
      setUserData({
        collection: {},
        lastPackOpened: null,
        username: 'Card Master'
      });
    }
    setLoading(false);
  }, []);

  // Save to LocalStorage
  const saveToLocal = (data: UserData) => {
    localStorage.setItem('tcg_data_v2', JSON.stringify(data));
    setUserData(data);
  };

  const calculateCooldown = useCallback(() => {
    if (!userData?.lastPackOpened) {
      setCooldown(0);
      return;
    }
    const last = userData.lastPackOpened;
    const now = Date.now();
    const diff = now - last;
    const cooldownMs = 30 * 60 * 1000; // 30 minutes
    const remaining = Math.max(0, cooldownMs - diff);
    setCooldown(remaining);
  }, [userData]);

  useEffect(() => {
    const interval = setInterval(calculateCooldown, 1000);
    calculateCooldown();
    return () => clearInterval(interval);
  }, [calculateCooldown]);

  const getRandomCard = (): Card => {
    const r = Math.random();
    let rarity: Rarity = 'Common';
    
    // Thresholds based on cumulative chances:
    // Ultra Mythic: 0.001
    // Mythic: 0.001 + 0.009 = 0.010
    // Legendary: 0.010 + 0.0198 = 0.0298
    // Epic: 0.0298 + 0.040 = 0.0698
    // Rare: 0.0698 + 0.0795 = 0.1493
    // Uncommon: 0.1493 + 0.25 = 0.3993
    // Common: remainder (up to 1.0)

    if (r < 0.001) rarity = 'Ultra Mythic';
    else if (r < 0.010) rarity = 'Mythic';
    else if (r < 0.0298) rarity = 'Legendary';
    else if (r < 0.0698) rarity = 'Epic';
    else if (r < 0.1493) rarity = 'Rare';
    else if (r < 0.3993) rarity = 'Uncommon';
    else rarity = 'Common';

    const possibleCards = ALL_CARDS.filter(c => c.rarity === rarity);
    return possibleCards[Math.floor(Math.random() * possibleCards.length)];
  };

  const openPack = async () => {
    if (cooldown > 0 || pulling) return;

    setPulling(true);
    const pulledCards = [getRandomCard(), getRandomCard()];
    setNewCards(pulledCards);
    setShowPackOpener(true);

    const newCollection = { ...userData?.collection };
    pulledCards.forEach(card => {
      newCollection[card.id] = (newCollection[card.id] || 0) + 1;
    });

    const newUserData: UserData = {
      collection: newCollection,
      lastPackOpened: Date.now(),
      username: userData?.username || 'Card Master'
    };

    saveToLocal(newUserData);
    setPulling(false);
  };

  const filteredCollection = ALL_CARDS.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = filterRarity === 'All' || card.rarity === filterRarity;
    const isOwned = (userData?.collection[card.id] || 0) > 0;
    return matchesSearch && matchesRarity && isOwned;
  });

  const CardItem: React.FC<{ card: Card; count?: number; isNew?: boolean }> = ({ card, count }) => (
    <div
      className={`relative group aspect-[2/3] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2`}
      style={{ 
        boxShadow: `0 10px 30px -5px ${RARITIES[card.rarity].glow.split('shadow-')[1].replace('/', '')}`,
        border: `1px solid ${card.rarity === 'Ultra Mythic' ? '#fff' : 'rgba(255,255,255,0.1)'}`
      }}
    >
      {/* Dynamic Background */}
      <div className={`absolute inset-0 ${RARITIES[card.rarity].bg} opacity-90`} />
      
      {/* Shimmer/Holo Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity bg-gradient-to-tr from-white/0 via-white/50 to-white/0 -translate-x-full group-hover:translate-x-full duration-1000 pointer-events-none" />

      {/* Content */}
      <div className="relative h-full p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-black uppercase tracking-tighter opacity-50 text-white">LACTOSE TCG</span>
          {count !== undefined && (
            <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white">
              x{count}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 items-center text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 mb-2">
             <Trophy size={24} style={{ color: card.color }} />
          </div>
          <h3 className="font-black text-sm uppercase tracking-tighter leading-tight text-white">{card.name}</h3>
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: card.color }}>{card.rarity}</span>
        </div>

        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full w-full"
            style={{ backgroundColor: card.color }}
          />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-950">
        <Loader2 className="animate-spin text-white opacity-20" size={48} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-zinc-950 overflow-hidden font-sans">
      {/* Header */}
      <div className="shrink-0 p-6 border-b border-white/5 flex items-center justify-between bg-zinc-950/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12 group">
            <Layers className="text-white group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">CARDS</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-xl">
          <button
            onClick={() => setView('shop')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${view === 'shop' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            Packs
          </button>
          <button
            onClick={() => setView('collection')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${view === 'collection' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            Vault
          </button>
        </div>

        <button
          onClick={() => setShowCardList(true)}
          className="ml-4 p-3 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl border border-white/5 transition-all flex items-center gap-2"
          title="Full Card List"
        >
          <Search size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Checklist</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {view === 'shop' ? (
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 text-center">
            <button
              onClick={openPack}
              disabled={cooldown > 0 || pulling}
              className={`relative group px-12 py-6 rounded-3xl font-black uppercase tracking-[0.2em] transition-all overflow-hidden ${
                cooldown > 0 || pulling 
                ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed' 
                : 'bg-white text-black hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]'
              }`}
            >
              <div className="relative z-10 flex items-center gap-3">
                {pulling ? <Loader2 className="animate-spin" /> : (cooldown > 0 ? <Clock size={20} /> : <Sparkles size={20} />)}
                {pulling ? 'SCANNING...' : (cooldown > 0 ? `LOCKED (${Math.ceil(cooldown / 1000)}s)` : 'GENERATE PACK')}
              </div>
            </button>
            
            {cooldown > 0 && (
              <p className="mt-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-12">
                Server stabilizing... Next pull available in {Math.ceil(cooldown / 1000)} seconds
              </p>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left ${cooldown <= 0 ? 'mt-12' : ''}`}>
              <div className="md:col-span-2 bg-red-950/20 p-6 rounded-2xl border border-red-500/20 space-y-4">
                <div className="flex items-center gap-3 text-red-400">
                  <AlertCircle size={20} />
                  <h3 className="font-black uppercase tracking-tighter text-white">System Reset Notice</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  I'm sorry if you had a good card, but, I reset everyone's cards, as for some reason, everyone had an Ultra Mythic card. I made it harder to get better cards.
                </p>
              </div>
              <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-[var(--primary)]">
                  <Sparkles size={20} />
                  <h3 className="font-black uppercase tracking-tighter">Getting Started</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Welcome to NEW GENESIS. Periodically, you are granted access to a fresh data-stream containing two random entities. Your goal is to catalog the entire New Genesis set before it leaves.
                </p>
              </div>
              <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-amber-500">
                  <Trophy size={20} />
                  <h3 className="font-black uppercase tracking-tighter">Rarity Tiers</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Entities range from <span className="text-zinc-300">Common</span> to <span className="text-white">Ultra Mythic</span>. Higher rarity cards have distinct energy signatures (glows) and are significantly harder to find.
                </p>
              </div>
              <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-blue-400">
                  <Clock size={20} />
                  <h3 className="font-black uppercase tracking-tighter">The Cooldown</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Cooldown: A thirty-minute interval is required between pack openings.
                </p>
              </div>
              <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-emerald-400">
                  <Package size={20} />
                  <h3 className="font-black uppercase tracking-tighter">The Vault</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  All extracted entities are safely stored in your local Vault. You can search, filter, and track duplicates of your unique collection.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input
                  type="text"
                  placeholder="SEARCH VAULT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white/10 transition-colors placeholder:text-zinc-700 font-bold uppercase tracking-widest"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                <button
                  onClick={() => setFilterRarity('All')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filterRarity === 'All' ? 'bg-white text-black' : 'bg-white/5 text-zinc-500 hover:text-white'}`}
                >
                  All
                </button>
                {Object.keys(RARITIES).map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilterRarity(r as Rarity)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filterRarity === r ? 'bg-white text-black' : 'bg-white/5 text-zinc-500 hover:text-white'}`}
                    style={{ color: filterRarity === r ? undefined : RARITIES[r as Rarity].color }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {filteredCollection.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                <AlertCircle size={48} className="opacity-20 mb-4" />
                <p className="font-bold uppercase tracking-widest text-sm">No data matching your query found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredCollection.map(card => (
                  <CardItem key={card.id} card={card} count={userData?.collection[card.id]} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pack Opener Modal */}
      <AnimatePresence>
        {showPackOpener && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-3xl" onClick={() => setShowPackOpener(false)} />
            
            <div className="relative w-full max-w-2xl flex flex-col items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 w-full">
                {newCards.map((card, idx) => (
                  <div key={`${card.id}-${idx}`} className="flex flex-col items-center gap-6">
                    <CardItem card={card} isNew />
                    <div className="text-center">
                      <h3 className="text-lg font-black uppercase italic tracking-tighter" style={{ color: card.color }}>{card.rarity}</h3>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">{card.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowPackOpener(false)}
                className="px-12 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                DISMISS DATA
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Rail */}
      <div className="shrink-0 px-6 py-2 border-t border-white/5 bg-zinc-950/50 flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-zinc-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Unique: {Object.keys(userData?.collection || {}).length} / {ALL_CARDS.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Coins size={14} className="text-zinc-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Total Cards: {Object.values(userData?.collection || {}).reduce((a, b) => a + b, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Card List / Rarity Modal */}
      <AnimatePresence>
        {showCardList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-xl" onClick={() => setShowCardList(false)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-[32px] overflow-hidden flex flex-col max-h-[85vh] shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <Layers className="text-black" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-white leading-none">DATABASE_ACCESS</h2>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">Full Entity Manifest</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCardList(false)}
                  className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-12">
                {/* Rarity System */}
                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 flex items-center gap-2 italic">
                    <span className="w-8 h-[1px] bg-zinc-800" />
                    RARITY SYSTEM
                    <span className="flex-1 h-[1px] bg-zinc-800" />
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(RARITIES).map(([name, data]) => (
                      <div key={name} className="p-4 bg-zinc-950/50 border border-white/5 rounded-2xl flex flex-col items-center text-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: data.color }}>{name}</span>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-2xl font-black tracking-tighter text-white">{(data.chance * 100).toFixed(2)}%</span>
                          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{data.dropRate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Card Checklist */}
                <section className="space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 flex items-center gap-2 italic">
                    <span className="w-8 h-[1px] bg-zinc-800" />
                    EXTRACTED DATASET
                    <span className="flex-1 h-[1px] bg-zinc-800" />
                  </h3>
                  
                  <div className="space-y-10">
                    {(Object.keys(RARITIES) as Rarity[]).map(rarity => {
                      const cardsOfRarity = ALL_CARDS.filter(c => c.rarity === rarity);
                      if (cardsOfRarity.length === 0) return null;
                      
                      return (
                        <div key={rarity} className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: RARITIES[rarity].color }} />
                            <h4 className="font-black text-sm uppercase tracking-widest" style={{ color: RARITIES[rarity].color }}>
                              {rarity} ({cardsOfRarity.length})
                            </h4>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                            {cardsOfRarity.map(card => {
                              const isOwned = (userData?.collection[card.id] || 0) > 0;
                              return (
                                <div key={card.id} className="flex items-center justify-between text-[11px] py-1 border-b border-white/[0.02]">
                                  <span className={`font-bold transition-colors ${isOwned ? 'text-zinc-200' : 'text-zinc-600'}`}>
                                    {card.name}
                                  </span>
                                  <div className={`w-2 h-2 rounded-full ${isOwned ? 'bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-zinc-800'}`} />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/5 bg-zinc-900/50 flex justify-center">
                <button
                  onClick={() => setShowCardList(false)}
                  className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  RETURN TO INTERFACE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
