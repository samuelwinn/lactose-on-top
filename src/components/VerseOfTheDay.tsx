import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, RefreshCcw, Quote, Heart, Calendar, Trash2 } from 'lucide-react';
import { WindowHeader } from '../App';
import { GoogleGenAI } from "@google/genai";

interface VerseData {
  id: string;
  verse: string;
  reference: string;
}

interface FavoriteVerse extends VerseData {
  favoritedAt: string;
}

const decodeHTMLEntities = (text: string) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

export const VerseOfTheDay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [verseData, setVerseData] = useState<VerseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<FavoriteVerse[]>(() => {
    const saved = localStorage.getItem('verse_favorites');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved) as FavoriteVerse[];
      // Migrate and clean on load to prevent first-render key issues
      let changed = false;
      const seenIds = new Set<string>();
      
      const cleaned = parsed.reduce((acc: FavoriteVerse[], f) => {
        const decodedVerse = decodeHTMLEntities(f.verse || "");
        // Remove ANY number of outer quotes and normalize whitespace
        const cleanedVerse = decodedVerse.replace(/^["'“‘]+|["'”’]+$/g, '').trim().replace(/\s+/g, ' ');
        const cleanedRef = decodeHTMLEntities(f.reference || "Daily Verse").trim();
        
        // Content-based deduplication (prevent identical verses from appearing twice)
        // We deduplicate by VERSE text only, as the user wants identical quotes merged
        const existingIdx = acc.findIndex(item => item.verse.toLowerCase() === cleanedVerse.toLowerCase());
        
        if (existingIdx !== -1) {
          changed = true;
          const existing = acc[existingIdx];
          // If current has a better reference (not "Daily Verse"), update the existing one
          const isGeneric = (ref: string) => ref.toUpperCase() === "DAILY VERSE" || ref === "Verse of the Day" || ref === "";
          if (isGeneric(existing.reference) && !isGeneric(cleanedRef)) {
            acc[existingIdx] = { ...existing, reference: cleanedRef };
          }
          return acc;
        }

        // Ensure every item has a unique ID
        let id = f.id;
        if (!id || seenIds.has(id)) {
          id = crypto.randomUUID();
          changed = true;
        }
        seenIds.add(id);

        if (cleanedVerse !== f.verse || cleanedRef !== f.reference) {
          changed = true;
        }

        acc.push({ ...f, id, verse: cleanedVerse, reference: cleanedRef });
        return acc;
      }, []);

      if (changed) {
        localStorage.setItem('verse_favorites', JSON.stringify(cleaned));
      }
      return cleaned;
    } catch (e) {
      console.error("Failed to parse favorites:", e);
      return [];
    }
  });

  const fetchVerse = async () => {
    setLoading(true);
    setError(null);
    
    let verse = "";
    let reference = "";
    let html = "";

    // TIER 1: Network-based scraping & APIs (Primary source: verseoftheday.com)
    try {
      const response = await fetch(`/api/proxy?url=${encodeURIComponent('https://www.verseoftheday.com/')}`, {
        signal: AbortSignal.timeout(5000)
      });
      if (response.ok) {
        html = await response.text();
        
        // Try specific selectors with more robust regex
        const verseMatch = html.match(/<div[^>]*?\b(?:class|id)=["'][^"']*(?:verse|b-verse)[^"']*["'][^>]*?>([\s\S]*?)<\/div>/i) ||
                           html.match(/<blockquote[^>]*?>([\s\S]*?)<\/blockquote>/i);
        const refMatch = html.match(/<div[^>]*?\b(?:class|id)=["'][^"']*(?:reference|b-reference)[^"']*["'][^>]*?>([\s\S]*?)<\/div>/i);
        
        if (verseMatch) verse = decodeHTMLEntities(verseMatch[1].replace(/<[^>]*>/g, '').trim());
        if (refMatch) reference = decodeHTMLEntities(refMatch[1].replace(/<[^>]*>/g, '').trim());
        
        // Alternative: Try OG tags (very reliable for this site)
        if (!verse) {
          const ogDescription = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                              html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
          if (ogDescription) {
            verse = decodeHTMLEntities(ogDescription[1]);
            reference = "Daily Verse";
          }
        }
      }
    } catch (e) {
      console.warn("Primary scrape failed:", e);
    }

    // TIER 1.5: Gemini Search (Targeted specifically to verseoftheday.com)
    // Use this if we can't scrape the site directly but want to stay true to the user's preferred source
    if (!verse) {
      console.log("Tier 1 scrape failed, trying Tier 1.5 (Gemini Search)...");
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `What is the "Verse of the Day" on verseoftheday.com for today, ${new Date().toDateString()}? 
                    Use Google Search to find the exact text and reference currently shown on their homepage.
                    Return as JSON: {"verse": "the verse text", "reference": "the book/chapter/verse"}.`,
          config: { 
            responseMimeType: "application/json",
            tools: [{ googleSearch: {} }] 
          }
        });
        const parsed = JSON.parse(result.text);
        if (parsed.verse) {
          verse = parsed.verse;
          reference = parsed.reference || "Verse of the Day";
        }
      } catch (e) {
        console.warn("Tier 1.5 Gemini Search failed:", e);
      }
    }

    // TIER 2: Secondary API Fallback (OurManna - backup source)
    if (!verse) {
      try {
        const fallbackRes = await fetch(`/api/proxy?url=${encodeURIComponent('https://beta.ourmanna.com/api/v1/get/?format=json&order=daily')}`, {
          signal: AbortSignal.timeout(5000)
        });
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          if (data?.verse?.details) {
            verse = data.verse.details.text;
            reference = data.verse.details.reference;
          }
        }
      } catch (e) {
        console.warn("Secondary API fallback failed:", e);
      }
    }

    // TIER 3: AI-Assisted Extraction (from HTML)
    if (!verse && html) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Extract the Bible verse from this HTML. Return JSON: {"verse": "text", "reference": "ref"}. HTML: ${html.substring(0, 5000)}`,
          config: { responseMimeType: "application/json" }
        });
        const parsed = JSON.parse(result.text);
        if (parsed.verse) {
          verse = parsed.verse;
          reference = parsed.reference || "Daily Verse";
        }
      } catch (e) {
        console.warn("AI extraction failed:", e);
      }
    }

    // TIER 4: Ultimate AI Generation (No external dependencies)
    if (!verse) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Provide an encouraging Bible verse for ${new Date().toLocaleDateString()}. Return JSON: {"verse": "string", "reference": "string"}.`,
          config: { responseMimeType: "application/json" }
        });
        const parsed = JSON.parse(result.text);
        if (parsed.verse) {
          verse = parsed.verse;
          reference = parsed.reference || "Daily Wisdom";
        }
      } catch (e) {
        console.error("All tiers failed:", e);
      }
    }

    if (verse) {
      // Remove any leading/trailing quotes that might be coming from the source
      // And decode any remaining entities
      const decoded = decodeHTMLEntities(verse);
      const cleanedVerse = decoded.replace(/^["'“‘]+|["'”’]+$/g, '').trim().replace(/\s+/g, ' ');
      const cleanedRef = decodeHTMLEntities(reference || "Daily Verse").trim();
      
      setVerseData({
        id: crypto.randomUUID(),
        verse: cleanedVerse,
        reference: cleanedRef
      });
    } else {
      setError('System could not retrieve verse. Please try again later.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVerse();
  }, []);

  const handleFavorite = () => {
    if (!verseData) return;
    
    // Check if already favorited
    if (favorites.some(f => f.verse === verseData.verse)) return;

    const newFavorite: FavoriteVerse = {
      ...verseData,
      favoritedAt: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updated = [...favorites, newFavorite];
    setFavorites(updated);
    localStorage.setItem('verse_favorites', JSON.stringify(updated));
  };

  const isFavorited = verseData ? favorites.find(f => f.verse === verseData.verse) : null;

  return (
    <div className="h-full flex flex-col bg-zinc-950 overflow-hidden">
      <WindowHeader title="Verse of the Day" onClose={onClose} />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-16">
          {/* Main Verse Section */}
          <div className="min-h-[400px] flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-white/5 rounded-full" />
                  <motion.div 
                    className="absolute inset-0 border-4 border-transparent border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ borderTopColor: 'var(--primary)' }}
                  />
                </div>
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">
                  Seeking Wisdom...
                </p>
              </div>
            ) : error ? (
              <div className="text-center space-y-6 bg-zinc-900/30 border border-white/5 rounded-3xl p-12 w-full">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Book size={32} className="text-red-500" />
                </div>
                <p className="text-zinc-400 font-medium">{error}</p>
                <button 
                  onClick={fetchVerse}
                  className="px-8 py-3 bg-zinc-900 border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold transition-all uppercase tracking-widest flex items-center gap-2 mx-auto"
                >
                  <RefreshCcw size={14} />
                  Try Again
                </button>
              </div>
            ) : verseData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-12"
              >
                <div className="relative">
                  <Quote 
                    size={80} 
                    className="absolute -top-10 -left-10 text-white/5 pointer-events-none" 
                    style={{ color: 'var(--primary-shadow)' }}
                  />
                  
                  <div className="relative z-10 space-y-8 text-center md:text-left">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight italic">
                      "{verseData.verse}"
                    </h2>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-8 border-t border-white/5">
                      <div className="flex items-center gap-4 justify-center md:justify-start">
                        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                          <Book size={20} style={{ color: 'var(--primary)' }} />
                        </div>
                        <div className="text-left">
                          <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Source</div>
                          <div className="text-lg font-black tracking-tighter uppercase italic">{verseData.reference}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center md:items-end gap-3">
                        {isFavorited && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-[9px] font-mono text-zinc-500 uppercase tracking-widest border border-white/5">
                            <Calendar size={10} />
                            Saved {isFavorited.favoritedAt}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={handleFavorite}
                            disabled={!!isFavorited}
                            className={`p-4 rounded-2xl transition-all shadow-xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${
                              isFavorited 
                                ? 'bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed' 
                                : 'bg-white text-black hover:bg-zinc-200 border border-transparent'
                            }`}
                          >
                            <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                            {isFavorited ? 'Saved to Heart' : 'Favorite'}
                          </button>
                          <button 
                            onClick={fetchVerse}
                            className="p-4 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"
                          >
                            <RefreshCcw size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Favorites Section */}
          <div className="space-y-8 pt-16 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center">
                  <Heart size={20} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tighter uppercase italic">Saved Wisdom</h3>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none">Your heart collection ({favorites.length})</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {favorites.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 bg-zinc-900/20 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center px-6"
                  >
                    <Book size={24} className="text-zinc-700 mb-4" />
                    <p className="text-zinc-600 text-sm italic">"Your saved verses will appear here. Build your collection of light."</p>
                  </motion.div>
                ) : (
                  favorites.slice().reverse().map((fav, index) => (
                    <motion.div
                      key={fav.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                      className="p-6 bg-zinc-900/40 border border-white/5 rounded-2xl hover:bg-zinc-900/60 transition-all group"
                    >
                      <div className="space-y-4">
                        <p className="text-zinc-300 font-medium leading-relaxed italic">"{fav.verse}"</p>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black tracking-tighter uppercase italic text-zinc-500">{fav.reference}</span>
                          </div>
                          <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                            <Calendar size={10} />
                            {fav.favoritedAt}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
