import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { normalizeTitle } from '../constants';
import { Game } from '../types';
import RetroStrikeGame from './retro-strike/RetroStrikeGame';

interface GameRunnerProps {
  game: Game | null;
  onClose: () => void;
}

const tips = [
  "You can change your theme in SETTINGS",
  "You can find other game sites in OTHER SITES",
  "If you join our Discord server, you'll never miss an update again!",
  "I hope you have a GREAT day",
  "Isn't Orcaweesh the best?"
];

export const GameRunner: React.FC<GameRunnerProps> = ({ game, onClose }) => {
  const [booting, setBooting] = useState(false);
  const [showD3, setShowD3] = useState(false);
  const [isFullyReady, setIsFullyReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTip, setCurrentTip] = useState('');
  const [showRefreshConfirm, setShowRefreshConfirm] = useState(false);
  const [showRefreshFinalConfirm, setShowRefreshFinalConfirm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const gameUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!booting && gameUrl && !error) {
      setShowD3(true);
      const timer = setTimeout(() => {
        setIsFullyReady(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [booting, gameUrl, error]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const loadGame = React.useCallback(async () => {
    if (!game) return;
    
    // For native games, we don't need to fetch anything
    if (game.isNative) {
      setBooting(true);
      setShowD3(false);
      setIsFullyReady(false);
      setError(null);
      setShowRefreshConfirm(false);
      setShowRefreshFinalConfirm(false);

      // Cleanup previous URL
      if (gameUrlRef.current) {
        URL.revokeObjectURL(gameUrlRef.current);
        gameUrlRef.current = null;
        setGameUrl(null);
      }

      setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
      
      // Artificial delay for that "booting" feel
      setTimeout(() => {
        setBooting(false);
        setIsFullyReady(true);
      }, 1000);
      return;
    }

    // For local files, we can just load them directly in the iframe to save memory/time
    if (game.html.startsWith('/') && game.html.endsWith('.html')) {
      gameUrlRef.current = game.html;
      setGameUrl(game.html);
      setBooting(false);
      setIsFullyReady(true);
      return;
    }

    setBooting(true);
    setShowD3(false);
    setIsFullyReady(false);
    setError(null);
    setShowRefreshConfirm(false);
    setShowRefreshFinalConfirm(false);
    
    // Cleanup previous URL
    if (gameUrlRef.current) {
      URL.revokeObjectURL(gameUrlRef.current);
      gameUrlRef.current = null;
      setGameUrl(null);
    }

    setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
    
    try {
      // Fetch game content. If it's a local path (starts with /), skip the proxy.
      const fetchUrl = game.html.startsWith('/') 
        ? game.html 
        : `/api/proxy?url=${encodeURIComponent(game.html)}`;
        
      console.log(`[GameRunner] Fetching: ${fetchUrl}`);
      const response = await fetch(fetchUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[GameRunner] HTTP Error ${response.status}: ${errorText}`);
        throw new Error(errorText || `Failed to load game content (${response.status})`);
      }
      
      const content = await response.text();
      console.log(`[GameRunner] Content loaded, length: ${content.length}`);
      
      let finalContent = content;
      // If the content is just a script (like some UGS files), wrap it
      const safeContent = content || '';
      if (safeContent.trim().startsWith('window.game') || !safeContent.includes('<html')) {
        finalContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: black; }</style>
            </head>
            <body>
              <script>${safeContent}</script>
            </body>
          </html>
        `;
      }

      const blob = new Blob([finalContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      gameUrlRef.current = url;
      setGameUrl(url);
    } catch (err) {
      console.error('[GameRunner] Fatal boot error:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      
      if (message === 'Failed to fetch') {
        setError('Network Error: Could not reach the LACTOSE backend. Please check your internet connection or try again later.');
      } else {
        setError(message);
      }
    } finally {
      setBooting(false);
    }
  }, [game]);

  useEffect(() => {
    if (!game) {
      setGameUrl(null);
      setError(null);
      setShowD3(false);
      setIsFullyReady(false);
      setShowRefreshConfirm(false);
      setShowRefreshFinalConfirm(false);
      return;
    }

    loadGame();
  }, [game, loadGame]);

  const handleRefreshClick = () => {
    setShowRefreshConfirm(true);
  };

  const confirmFirstRefresh = () => {
    setShowRefreshConfirm(false);
    setShowRefreshFinalConfirm(true);
  };

  const confirmFinalRefresh = () => {
    setShowRefreshFinalConfirm(false);
    loadGame();
  };

  const cancelRefresh = () => {
    setShowRefreshConfirm(false);
    setShowRefreshFinalConfirm(false);
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          (containerRef.current as any).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
      }
    }
  };

  if (!game) return null;

  const renderGameContent = () => {
    if (game.isNative) {
      if (game.name === 'Retro Strike') {
        return (
          <div className="w-full h-full bg-black overflow-hidden relative">
            <RetroStrikeGame />
          </div>
        );
      }
      return <div>Native game not found</div>;
    }

    if (error) {
      return (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center p-8 bg-black">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <div className="text-zinc-400 max-w-xs font-mono text-sm">{error}</div>
          <button 
            onClick={loadGame}
            className="mt-6 px-8 py-3 bg-zinc-900 border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold transition-all uppercase tracking-widest"
          >
            Retry Boot
          </button>
        </div>
      );
    }

    return gameUrl && (
      <iframe
        ref={iframeRef}
        className="w-full h-full border-none bg-black"
        title="Game View"
        sandbox="allow-scripts allow-forms allow-popups allow-modals allow-downloads allow-same-origin allow-pointer-lock"
        allow="pointer-lock; fullscreen; autoplay"
        src={gameUrl}
      />
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8"
      >
        <div 
          ref={containerRef}
          className={`relative w-full aspect-video bg-black overflow-hidden flex flex-col transition-all duration-300 ${
            isFullscreen ? 'max-w-none border-none rounded-none' : 'max-w-5xl rounded-lg border border-white/10 shadow-2xl'
          }`}
        >
          {/* Header */}
          {!isFullscreen && (
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div 
                  className={`w-2 h-2 rounded-full ${booting ? 'bg-yellow-500 animate-pulse' : ''}`} 
                  style={!booting ? { backgroundColor: 'var(--primary)' } : {}}
                />
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                  {normalizeTitle(game.name)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleRefreshClick}
                  className="text-zinc-500 hover:text-white transition-colors"
                  title="Refresh Game"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={handleFullscreen}
                  className="text-zinc-500 hover:text-white transition-colors"
                  title={isFullscreen ? "Minimize" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="relative flex-1 bg-black overflow-hidden">
            {renderGameContent()}
            <AnimatePresence>
              {showRefreshConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-md p-8"
                >
                  <div className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <RotateCcw size={32} className="text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-black tracking-tighter uppercase italic mb-4">Confirm Refresh</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                      WARNING: Are you <span className="text-white font-bold">SURE</span> you want to refresh this game? All saved data will be lost.
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={cancelRefresh}
                        className="flex-1 py-4 bg-zinc-950 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all"
                      >
                        No
                      </button>
                      <button
                        onClick={confirmFirstRefresh}
                        className="flex-1 py-4 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                        style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {showRefreshFinalConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-xl p-8"
                >
                  <div className="max-w-md w-full bg-zinc-900 border border-red-500/20 rounded-3xl p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <RotateCcw size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-black tracking-tighter uppercase italic mb-4 text-red-500">Final Warning</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                      WARNING: This is your <span className="text-white font-bold underline">LAST CHANCE</span>. You <span className="text-white font-bold">WON'T</span> be able to recover your save if you refresh.
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={cancelRefresh}
                        className="flex-1 py-4 bg-zinc-950 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all"
                      >
                        No
                      </button>
                      <button
                        onClick={confirmFinalRefresh}
                        className="flex-1 py-4 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {!isFullyReady && !error && (
                <motion.div 
                  key="loader"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black overflow-hidden"
                >
                  <div className="relative flex items-center justify-center text-7xl md:text-8xl font-black italic tracking-tighter">
                    {/* LACTOSE Base */}
                    <div style={{ color: 'var(--primary)' }}>LACT</div>

                    {/* OS Logo (Drops down from top) */}
                    <motion.div
                      initial={{ y: -200, opacity: 0, width: 0 }}
                      animate={showD3 ? { y: 0, opacity: 1, width: 'auto' } : { y: -200, opacity: 0, width: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 100, 
                        damping: 15,
                        opacity: { duration: 0.2 }
                      }}
                      className="overflow-visible flex items-center justify-center whitespace-nowrap px-[0.1em]"
                      style={{ color: 'var(--primary)' }}
                    >
                      OS
                    </motion.div>

                    <div style={{ color: 'var(--primary)' }}>E</div>
                  </div>

                  {/* Status Text */}
                  <div className="mt-12 flex flex-col items-center gap-3">
                    {!showD3 ? (
                      <>
                        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-white"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            style={{ backgroundColor: 'var(--primary)' }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em] animate-pulse">
                          Fetching Assets...
                        </span>
                      </>
                    ) : (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] font-mono text-white uppercase tracking-[0.6em] font-bold"
                        style={{ color: 'var(--primary)' }}
                      >
                        System Ready
                      </motion.span>
                    )}
                  </div>

                  {/* Random Tip Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-12 left-0 right-0 px-8 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.3em]">Pro Tip</span>
                      <p className="text-xs text-zinc-400 font-medium max-w-md leading-relaxed">
                        "{currentTip}"
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
