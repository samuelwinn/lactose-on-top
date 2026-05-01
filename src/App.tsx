import React, { useState, useEffect, useMemo } from 'react';
import { GameRunner } from './components/GameRunner';
import { HtmlEditor } from './components/HtmlEditor';
import { Calculator } from './components/Calculator';
import { Announcements } from './components/Announcements';
import { PasscodeModal } from './components/PasscodeModal';
import { Tomodachi } from './components/Tomodachi';
import { ClockApp, Alarm } from './components/ClockApp';
import { WidgetApp } from './components/WidgetApp';
import { AppStore } from './components/AppStore';
import { SuperMushroom } from './components/SuperMushroom';
import { VerseOfTheDay } from './components/VerseOfTheDay';
import { CardsApp } from './components/CardsApp';
import { GameNotesApp } from './components/GameNotesApp';
import { PaintApp } from './components/PaintApp';
import { LoFiApp } from './components/LoFiApp';
import { CloakSplashScreen } from './components/CloakSplashScreen';
import { BootScreen } from './components/BootScreen';
import { normalizeTitle, obfuscate } from './constants';
import { useObfuscation } from './context/ObfuscationContext';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Home as HomeIcon, Search, RotateCcw, Globe, Palette, Heart, Settings, Sparkles, Info, X, Shield, Code2, Calculator as CalculatorIcon, Bell, FileText, ExternalLink, Clock, Pickaxe, ShoppingBag, Terminal as TerminalIcon, Book, Layers, PenTool, Headset, Music, Star } from 'lucide-react';
import { Game, WidgetSettings } from './types';

const GameCard: React.FC<{
  game: Game;
  isFavorite: boolean;
  onSelect: (game: Game) => void;
  onToggleFavorite: (e: React.MouseEvent, gameName: string) => void;
  hideFavorite?: boolean;
  obfuscationLevel: number;
}> = ({ game, isFavorite, onSelect, onToggleFavorite, hideFavorite, obfuscationLevel }) => (
  <div
    onClick={() => onSelect(game)}
    className="group relative flex items-center gap-4 p-4 bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 rounded-2xl transition-all text-left overflow-hidden cursor-pointer"
    style={{ borderLeft: '4px solid var(--primary)' }}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(game);
      }
    }}
  >
    <div 
      className="w-12 h-12 flex-shrink-0 bg-zinc-950 rounded-xl flex items-center justify-center text-xl font-black border border-white/5 group-hover:scale-110 transition-transform"
      style={{ color: 'var(--primary)' }}
    >
      {obfuscate(game.name?.charAt(0).toUpperCase() || '?', obfuscationLevel)}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-bold truncate transition-colors group-hover:opacity-80" style={{ color: 'var(--primary)' }}>
        {obfuscate(normalizeTitle(game.name || 'Unknown Game'), obfuscationLevel)}
      </div>
      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
        {obfuscate(game.html?.includes('.html') ? 'HTML5' : 'JS', obfuscationLevel)} • {obfuscate('READY', obfuscationLevel)}
      </div>
    </div>
    <div className="flex items-center gap-2 absolute right-4 transition-all">
      {!hideFavorite && (
        <button
          onClick={(e) => onToggleFavorite(e, game.name || '')}
          className={`p-2 rounded-lg transition-all hover:bg-white/5 ${isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <Heart 
            size={16} 
            fill={isFavorite ? 'var(--primary)' : 'none'} 
            style={{ color: 'var(--primary)' }} 
          />
        </button>
      )}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Gamepad2 size={16} style={{ color: 'var(--primary)' }} />
      </div>
    </div>
  </div>
);

const DesktopIcon: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  hasWallpaper: boolean;
  obfuscationLevel: number;
}> = ({ icon, label, onClick, hasWallpaper, obfuscationLevel }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 group w-20"
  >
    <div className={`w-16 h-16 backdrop-blur-md border rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all shadow-lg ${
      hasWallpaper 
        ? 'bg-black border-white/20 text-white group-hover:bg-zinc-900' 
        : 'bg-[var(--primary-shadow)] border-white/10 text-[var(--primary)] group-hover:bg-zinc-800'
    }`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors text-center leading-tight ${
      hasWallpaper ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'text-zinc-500'
    }`}>
      {obfuscate(label, obfuscationLevel)}
    </span>
  </button>
);

export const WindowHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => {
  const { level } = useObfuscation();
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">{obfuscate(title, level)}</span>
      </div>
      <button 
        onClick={onClose}
        className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const BentoCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hasWallpaper: boolean;
}> = ({ children, className = '', onClick, hasWallpaper }) => (
  <motion.div
    whileHover={{ scale: onClick ? 1.01 : 1 }}
    whileTap={{ scale: onClick ? 0.99 : 1 }}
    onClick={onClick}
    className={`relative overflow-hidden border p-6 flex flex-col justify-between transition-all rounded-[2rem] ${
      onClick ? 'cursor-pointer' : ''
    } ${
      hasWallpaper 
        ? 'bg-black/40 backdrop-blur-2xl border-white/20 text-white shadow-2xl' 
        : 'bg-zinc-950/50 backdrop-blur-xl border-white/10 text-white shadow-xl'
    } ${className}`}
  >
    {children}
  </motion.div>
);

export default function App() {
  const { level: textObfuscationLevel, setLevel: setTextObfuscationLevel } = useObfuscation();
  const [sessionStartTime] = useState(new Date());
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: string }[]>([]);
  const [view, setView] = useState<'desktop' | 'games' | 'othersites' | 'theme' | 'security' | 'about' | 'html' | 'calculator' | 'announcements' | 'tomodachi' | 'clock' | 'appstore' | 'terminal' | 'verse' | 'cards' | 'gamenotes' | 'paint' | 'lofi' | 'widget'>('desktop');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialDecoy, setIsInitialDecoy] = useState(true);
  const [isBooting, setIsBooting] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Game[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [theme, setTheme] = useState<string>('default');
  const [wallpaper, setWallpaper] = useState<string | null>(localStorage.getItem('wallpaper'));
  const [panicKey, setPanicKey] = useState<string>(localStorage.getItem('panicKey') || '');
  const [panicUrl, setPanicUrl] = useState<string>(localStorage.getItem('panicUrl') || 'https://google.com');
  const [panicEnabled, setPanicEnabled] = useState<boolean>(localStorage.getItem('panicEnabled') !== 'false');
  const [cloak, setCloak] = useState<string>(localStorage.getItem('cloak') || 'none');
  const [closeProtection, setCloseProtection] = useState<boolean>(localStorage.getItem('closeProtection') === 'true');
  const [passcodeEnabled, setPasscodeEnabled] = useState<boolean>(localStorage.getItem('passcodeEnabled') === 'true');
  const [sessionPasscode, setSessionPasscode] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isSettingPasscode, setIsSettingPasscode] = useState<boolean>(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDisclaimerDismissed, setIsDisclaimerDismissed] = useState(false);

  const [widgetSettings, setWidgetSettings] = useState<WidgetSettings>(() => {
    const saved = localStorage.getItem('widget_settings');
    return saved ? JSON.parse(saved) : {
      enabled: true
    };
  });

  useEffect(() => {
    localStorage.setItem('widget_settings', JSON.stringify(widgetSettings));
  }, [widgetSettings]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    // Initial check
    handleFullscreenChange();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Global Clock State
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('clock_alarms');
    return saved ? JSON.parse(saved) : [];
  });
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerTotal, setTimerTotal] = useState(0);
  const [isRinging, setIsRinging] = useState(false);
  const [activeAlarmLabel, setActiveAlarmLabel] = useState('');

  // Apps Status Sync
  const [cardsCooldown, setCardsCooldown] = useState(0);
  const [petStats, setPetStats] = useState<{ hunger: number; happiness: number; energy: number; name: string } | null>(null);

  useEffect(() => {
    const syncApps = () => {
      // Cards Sync
      const cardsData = localStorage.getItem('tcg_data_v2');
      if (cardsData) {
        const parsed = JSON.parse(cardsData);
        if (parsed.lastPackOpened) {
          const now = Date.now();
          const diff = now - parsed.lastPackOpened;
          const cooldownMs = 30 * 60 * 1000;
          setCardsCooldown(Math.max(0, cooldownMs - diff));
        } else {
          setCardsCooldown(0);
        }
      }

      // Tomodachi Sync
      const petData = localStorage.getItem('tomodachi_pet');
      if (petData) {
        const parsed = JSON.parse(petData);
        // Basic decay calculation for preview
        const now = Date.now();
        const diff = (now - parsed.lastUpdate) / 1000;
        const decayRate = 0.01;
        setPetStats({
          name: parsed.name,
          hunger: Math.max(0, parsed.hunger - (parsed.isSleeping ? decayRate * 0.5 : decayRate) * diff),
          happiness: Math.max(0, parsed.happiness - decayRate * diff),
          energy: parsed.isSleeping 
            ? Math.min(100, parsed.energy + decayRate * 2 * diff)
            : Math.max(0, parsed.energy - decayRate * diff)
        });
      }
    };

    const interval = setInterval(syncApps, 1000);
    syncApps();
    return () => clearInterval(interval);
  }, []);

  // Global Stopwatch Logic moved here
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (swRunning) {
      interval = setInterval(() => {
        setSwTime(prev => prev + 10);
      }, 10);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [swRunning]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (closeProtection) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [closeProtection]);


  useEffect(() => {
    if (passcodeEnabled && !sessionPasscode) {
      setIsSettingPasscode(true);
    }
  }, [passcodeEnabled]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && passcodeEnabled && sessionPasscode) {
        setIsLocked(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [passcodeEnabled, sessionPasscode]);
  const [isListeningForKey, setIsListeningForKey] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Global Audio Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRinging) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      interval = setInterval(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }, 400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRinging]);

  // Global Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            setIsRinging(true);
            setActiveAlarmLabel('Timer Finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerRemaining]);

  // Global Alarm Logic
  useEffect(() => {
    localStorage.setItem('clock_alarms', JSON.stringify(alarms));
    
    const checkAlarms = setInterval(() => {
      const now = new Date();
      const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.time === currentTimeStr && now.getSeconds() === 0) {
          setIsRinging(true);
          setActiveAlarmLabel(alarm.label);
        }
      });
    }, 1000);

    return () => clearInterval(checkAlarms);
  }, [alarms]);

  useEffect(() => {
    // Virtual Page View for AdSense
    try {
      if ((window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({
          google_ad_client: "ca-pub-3801003718731203",
          enable_page_level_ads: true,
          tag_partner: "pro-tag-partner"
        });
      }
    } catch (e) {
      console.error('AdSense virtual page view error:', e);
    }
  }, [view, selectedGame]);

  useEffect(() => {
    const updateFavicon = (href: string) => {
      // Remove all existing favicons
      const existingIcons = document.querySelectorAll('link[rel*="icon"]');
      existingIcons.forEach(icon => icon.parentNode?.removeChild(icon));

      // Create new favicon
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/x-icon';
      link.href = href;
      document.getElementsByTagName('head')[0].appendChild(link);
    };

    const cloaks: Record<string, { title: string; icon: string }> = {
      'slides': {
        title: 'Google Slides',
        icon: 'https://ssl.gstatic.com/docs/presentations/images/favicon5.ico'
      },
      'wikipedia': {
        title: 'Wikipedia, the free encyclopedia',
        icon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico'
      },
      'canvas': {
        title: 'Dashboard',
        icon: 'https://canvas.instructure.com/favicon.ico'
      },
      'docs': {
        title: 'Google Docs',
        icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
      },
      'drive': {
        title: 'My Drive - Google Drive',
        icon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png'
      },
      'classroom': {
        title: 'Classes',
        icon: 'https://ssl.gstatic.com/classroom/favicon.png'
      },
      'khan': {
        title: 'Khan Academy',
        icon: 'https://www.khanacademy.org/favicon.ico'
      },
      'kahoot': {
        title: 'Kahoot!',
        icon: 'https://kahoot.it/favicon.ico'
      },
      'schoology': {
        title: 'Home | Schoology',
        icon: 'https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico'
      }
    };

    if (cloak !== 'none' && cloaks[cloak]) {
      document.title = cloaks[cloak].title;
      updateFavicon(cloaks[cloak].icon);
    } else {
      document.title = 'LACTOSE';
      updateFavicon('/favicon.png');
    }
  }, [cloak]);

  const handleGameSelect = (game: Game) => {
    if (game.name === 'WIDGET') {
      setView('widget');
      return;
    }
    setSelectedGame(game);
    setRecentlyPlayed(prev => {
      const current = Array.isArray(prev) ? prev : [];
      const next = [game, ...current.filter(g => g?.name !== game.name)].slice(0, 10);
      localStorage.setItem('recentlyPlayed', JSON.stringify(next));
      return next;
    });
  };

  const toggleFavorite = (e: React.MouseEvent, gameName: string) => {
    e.stopPropagation();
    if (!gameName) return;
    setFavorites(prev => {
      const current = Array.isArray(prev) ? prev : [];
      const next = current.includes(gameName) 
        ? current.filter(name => name !== gameName)
        : [...current, gameName];
      localStorage.setItem('favorites', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'default';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const saved = localStorage.getItem('recentlyPlayed');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentlyPlayed(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error('Failed to load recently played games:', e);
        setRecentlyPlayed([]);
      }
    }

    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error('Failed to load favorites:', e);
        setFavorites([]);
      }
    }

    const fetchGames = async () => {
      try {
        setLoading(true);
        const [gamesRes, minecraftRes, fnfRes] = await Promise.all([
          fetch('/games.json'),
          fetch('/minecraft.json'),
          fetch('/fnf.json')
        ]);

        if (!gamesRes.ok) throw new Error(`Failed to fetch arcade games: ${gamesRes.statusText}`);
        if (!minecraftRes.ok) throw new Error(`Failed to fetch minecraft games: ${minecraftRes.statusText}`);
        if (!fnfRes.ok) throw new Error(`Failed to fetch fnf games: ${fnfRes.statusText}`);

        const [gamesData, minecraftData, fnfData] = await Promise.all([
          gamesRes.json(),
          minecraftRes.json(),
          fnfRes.json()
        ]);

        const combined = [...gamesData, ...minecraftData, ...fnfData];
        setGames(combined.sort((a, b) => normalizeTitle(a.name || '').localeCompare(normalizeTitle(b.name || ''))));
      } catch (error) {
        console.error('Failed to fetch games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialDecoy(false);
      // Start boot screen after decoy splash
      setTimeout(() => {
        setIsBooting(false);
        setShowAnnouncementModal(true);
      }, 3000);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const triggerPanic = () => {
    if (panicEnabled) {
      window.location.href = panicUrl.startsWith('http') ? panicUrl : `https://${panicUrl}`;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isListeningForKey && view === 'security') {
        e.preventDefault();
        setPanicKey(e.key);
        localStorage.setItem('panicKey', e.key);
        setIsListeningForKey(false);
        return;
      }

      if (panicEnabled && panicKey && e.key === panicKey) {
        triggerPanic();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicKey, panicUrl, panicEnabled, isListeningForKey, view]);

  const filteredGames = useMemo(() => {
    return games.filter(game => 
      game.name && game.name.toLowerCase().includes((searchQuery || '').toLowerCase())
    ).sort((a, b) => normalizeTitle(a.name || '').localeCompare(normalizeTitle(b.name || '')));
  }, [games, searchQuery]);

  const favoritedGames = useMemo(() => {
    return filteredGames.filter(game => game.name && (favorites || []).includes(game.name));
  }, [filteredGames, favorites]);

  const otherGames = useMemo(() => {
    return filteredGames.filter(game => game.name && !(favorites || []).includes(game.name));
  }, [filteredGames, favorites]);

  const otherSites = useMemo(() => {
    return [
      { name: 'Geo-FS', url: 'https://geo-fs.com', domain: 'geo-fs.com' },
    ].sort((a, b) => a.name.localeCompare(b.name) || a.domain.localeCompare(b.domain));
  }, []);

  const addNotification = (message: string, type: string = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isInitialDecoy ? (
          <motion.div
            key="cloak-splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999]"
          >
            <CloakSplashScreen />
          </motion.div>
        ) : isBooting ? (
          <motion.div
            key="boot-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[99998]"
          >
            <BootScreen />
          </motion.div>
        ) : showAnnouncementModal ? (
          <motion.div
            key="announcements-modal"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            className="fixed inset-0 z-[99996]"
          >
            <Announcements 
              isModal={true} 
              isOpen={true} 
              onClose={() => setShowAnnouncementModal(false)}
              onShowMore={() => {
                setShowAnnouncementModal(false);
                setView('announcements');
              }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {!isInitialDecoy && !isBooting && !showAnnouncementModal && (
          <motion.div 
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0 }}
            className="min-h-screen bg-zinc-950 text-white font-sans overflow-hidden" 
            style={{ '--selection-bg': 'var(--primary-shadow)' } as React.CSSProperties}
          >
      {/* Floating Clock */}
      {widgetSettings.enabled && (
        <div className="fixed bottom-6 right-8 z-50">
          <div className="px-4 py-2 bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-[10px] font-mono font-bold text-zinc-400 tabular-nums hover:text-white transition-colors">
            {currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="fixed top-24 right-8 z-[100] w-72 p-4 bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex items-start gap-4"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-xs">
              <Sparkles size={14} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{obfuscate('System Notification', textObfuscationLevel)}</div>
              <div className="text-xs font-medium leading-relaxed">{obfuscate(n.message, textObfuscationLevel)}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <main className={`${view === 'desktop' ? 'h-screen overflow-hidden' : 'fixed inset-4 bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-40'}`}>
        <AnimatePresence mode="wait">
          {view === 'desktop' ? (
            <motion.div 
              key="desktop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`relative h-full w-full pt-4 px-8 pb-8 flex flex-col ${
                wallpaper 
                  ? 'bg-cover bg-center bg-no-repeat' 
                  : 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[var(--primary-shadow)] via-zinc-950 to-zinc-950'
              }`}
              style={wallpaper ? { backgroundImage: `url(${wallpaper})` } : {}}
            >
              {/* Bento Grid Layout */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar py-8 relative z-10 flex flex-col justify-center min-h-0">
                <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 px-4 md:px-12">
                  {/* Clock & Date Card */}
                  <BentoCard 
                    className="lg:col-span-2 min-h-[220px]" 
                    hasWallpaper={!!wallpaper}
                    onClick={() => setView('clock')}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-white/5 rounded-2xl">
                          <Clock size={24} style={{ color: 'var(--primary)' }} />
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">{obfuscate('Clock', textObfuscationLevel)}</div>
                      </div>
                      <div>
                        <div className="text-6xl md:text-7xl font-black tracking-tighter tabular-nums mb-2 leading-none">
                          {currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </div>
                        <div className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em]">
                          {obfuscate(currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }), textObfuscationLevel)}
                        </div>
                      </div>
                    </div>
                  </BentoCard>                  {/* Arcade Quick Launch */}
                  <BentoCard 
                    className="min-h-[220px]" 
                    hasWallpaper={!!wallpaper}
                    onClick={() => setView('games')}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div className="p-3 bg-white/5 w-fit rounded-2xl">
                        <Gamepad2 size={24} style={{ color: 'var(--primary)' }} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-1">{obfuscate('Arcade', textObfuscationLevel)}</h3>
                      </div>
                      <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                        <Gamepad2 size={120} />
                      </div>
                    </div>
                  </BentoCard>

                  {/* Card Pack Countdown */}
                  <BentoCard 
                    className="min-h-[220px]" 
                    hasWallpaper={!!wallpaper}
                    onClick={() => setView('cards')}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-white/5 rounded-2xl">
                          <Layers size={24} style={{ color: 'var(--primary)' }} />
                        </div>
                        {cardsCooldown === 0 ? (
                          <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{obfuscate('Ready', textObfuscationLevel)}</div>
                        ) : (
                          <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{obfuscate('Cooling', textObfuscationLevel)}</div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">{obfuscate('Packs', textObfuscationLevel)}</h3>
                        {cardsCooldown > 0 ? (
                          <div>
                            <div className="text-2xl font-mono font-black tabular-nums tracking-tighter">
                              {Math.floor(cardsCooldown / 60000)}:{String(Math.floor((cardsCooldown % 60000) / 1000)).padStart(2, '0')}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">{obfuscate('Until Next Pack', textObfuscationLevel)}</div>
                          </div>
                        ) : (
                          <p className="text-[10px] text-zinc-500 italic uppercase">{obfuscate('Your daily pack is waiting.', textObfuscationLevel)}</p>
                        )}
                      </div>
                    </div>
                  </BentoCard>

                  {/* Recents/Favorites Sidebar-like Column */}
                  <BentoCard 
                    className="lg:row-span-2 min-h-[300px]" 
                    hasWallpaper={!!wallpaper}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black uppercase italic tracking-tighter">{obfuscate('Recents', textObfuscationLevel)}</h3>
                        <RotateCcw size={14} className="text-zinc-600" />
                      </div>
                      <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
                        {recentlyPlayed.length > 0 ? (
                          recentlyPlayed.slice(0, 5).map((game, i) => (
                            <div 
                              key={`${game.name}-${i}`}
                              onClick={() => {
                                setSelectedGame(game);
                                setView('games');
                              }}
                              className="group/item flex items-center gap-3 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-xs font-black" style={{ color: 'var(--primary)' }}>
                                {game.name?.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[11px] font-bold truncate uppercase tracking-tight">{game.name}</div>
                                <div className="text-[9px] text-zinc-500 font-mono">READY</div>
                              </div>
                              <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <Gamepad2 size={14} style={{ color: 'var(--primary)' }} />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-[10px] text-zinc-600 italic py-4">No recent activity</div>
                        )}
                      </div>
                    </div>
                  </BentoCard>

                  {/* Updates Card */}
                  <BentoCard 
                    className="lg:col-span-2 min-h-[160px]" 
                    hasWallpaper={!!wallpaper}
                    onClick={() => setView('announcements')}
                  >
                    <div className="flex items-center gap-6 h-full">
                      <div className="hidden sm:flex p-6 bg-white/5 rounded-[2rem] items-center justify-center">
                        <Bell size={40} style={{ color: 'var(--primary)' }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Updates</span>
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter mb-1">New Features Added</h3>
                        <p className="text-[10px] text-zinc-500 leading-relaxed max-w-md italic">Check the updates log for the latest bypass methods and game additions.</p>
                      </div>
                    </div>
                  </BentoCard>

                  {/* App Store */}
                  <BentoCard 
                    className="min-h-[160px]" 
                    hasWallpaper={!!wallpaper}
                    onClick={() => setView('appstore')}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div className="p-3 bg-zinc-950/50 w-fit rounded-2xl">
                        <ShoppingBag size={24} style={{ color: 'var(--primary)' }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black uppercase italic tracking-tighter mb-1">{obfuscate('App Store', textObfuscationLevel)}</h3>
                      </div>
                    </div>
                  </BentoCard>

                  {/* All Apps Bento Card */}
                  <BentoCard 
                    className="lg:col-span-3 min-h-[160px]" 
                    hasWallpaper={!!wallpaper}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[10px] font-black uppercase italic tracking-widest text-zinc-600">{obfuscate('Applications', textObfuscationLevel)}</h3>
                      </div>
                      <div className="flex flex-wrap gap-x-2 gap-y-4 p-2 overflow-y-auto no-scrollbar content-start">
                        {[
                          { icon: <Code2 size={14} />, label: "HTML", view: 'html' },
                          { icon: <Palette size={14} />, label: "Theme", view: 'theme' },
                          { icon: <CalculatorIcon size={14} />, label: "Calculator", view: 'calculator' },
                          { icon: <TerminalIcon size={14} />, label: "Mushroom", view: 'terminal' },
                          { icon: <Book size={14} />, label: "Verse", view: 'verse' },
                          { icon: <FileText size={14} />, label: "Game Notes", view: 'gamenotes' },
                          { icon: <PenTool size={14} />, label: "Paint", view: 'paint' },
                          { icon: <Headset size={14} />, label: "Lo-Fi", view: 'lofi' },
                          { icon: <Layers size={14} />, label: "Widgets", view: 'widget' },
                          { icon: <Shield size={14} />, label: "Security", view: 'security' },
                          { icon: <Globe size={14} />, label: "Other Sites", view: 'othersites' }
                        ].map((item, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setView(item.view as any)}
                            className="flex flex-col items-center gap-1 w-[52px] group"
                          >
                            <div 
                              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-white/10 group-hover:border-[var(--primary)] group-hover:border-opacity-50"
                              style={{ color: 'var(--primary)' }}
                            >
                              {item.icon}
                            </div>
                            <span className="text-[7px] font-black uppercase tracking-tighter text-zinc-500 group-hover:text-white truncate w-full text-center px-0.5">
                              {obfuscate(item.label, textObfuscationLevel)}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </BentoCard>
                </div>
              </div>
            </motion.div>
          ) : view === 'clock' ? (
            <motion.div 
              key="clock"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="h-full flex flex-col overflow-hidden"
            >
              <WindowHeader title="Clock" onClose={() => setView('desktop')} />
              <ClockApp 
                onClose={() => setView('desktop')}
                alarms={alarms}
                setAlarms={setAlarms}
                timerRemaining={timerRemaining}
                setTimerRemaining={setTimerRemaining}
                timerRunning={timerRunning}
                setTimerRunning={setTimerRunning}
                timerTotal={timerTotal}
                setTimerTotal={setTimerTotal}
                swTime={swTime}
                setSwTime={setSwTime}
                swRunning={swRunning}
                setSwRunning={setSwRunning}
                isRinging={isRinging}
                setIsRinging={setIsRinging}
                activeAlarmLabel={activeAlarmLabel}
                setActiveAlarmLabel={setActiveAlarmLabel}
              />
            </motion.div>
          ) : view === 'tomodachi' ? (
            <motion.div 
              key="tomodachi"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="h-full flex flex-col overflow-hidden"
            >
              <Tomodachi onClose={() => setView('desktop')} />
            </motion.div>
          ) : view === 'announcements' ? (
            <motion.div 
              key="announcements"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="h-full flex flex-col overflow-hidden"
            >
              <WindowHeader title="Updates" onClose={() => setView('desktop')} />
              <div className="flex-1 overflow-y-auto">
                <Announcements isModal={false} />
              </div>
            </motion.div>
          ) : view === 'games' ? (
            <motion.div 
              key="games"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="h-full flex flex-col overflow-hidden"
            >
              <WindowHeader title="Arcade" onClose={() => setView('desktop')} />
              <div className="flex-1 overflow-y-auto no-scrollbar p-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
                <div>
                  <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-2">ARCADE</h1>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      if (games.length > 0) {
                        const random = games[Math.floor(Math.random() * games.length)];
                        handleGameSelect(random);
                      }
                    }}
                    className="hidden sm:flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"
                  >
                    <RotateCcw size={14} />
                    RANDOM
                  </button>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                      type="text"
                      placeholder="Search database..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-colors text-sm"
                      style={{ borderBottom: '2px solid var(--primary)' }}
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                  <div 
                    className="w-12 h-12 border-4 rounded-full animate-spin" 
                    style={{ borderColor: 'rgba(255,255,255,0.05)', borderTopColor: 'var(--primary)' }}
                  />
                  <div className="text-zinc-500 font-mono text-sm tracking-widest animate-pulse">CONNECTING TO DATABASE...</div>
                </div>
              ) : (
                <div className="space-y-12">
                  {favoritedGames.length > 0 && (
                    <section>
                      <div className="flex items-center gap-4 mb-8">
                        <Heart size={20} style={{ color: 'var(--primary)' }} />
                        <h3 className="text-xl font-black tracking-tighter uppercase italic">Favorites</h3>
                        <div className="h-px flex-1 bg-white/5" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favoritedGames.map((game) => (
                          <GameCard 
                            key={game.name} 
                            game={game} 
                            isFavorite={true} 
                            onSelect={handleGameSelect} 
                            onToggleFavorite={toggleFavorite} 
                            obfuscationLevel={textObfuscationLevel}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  <section>
                    {favoritedGames.length > 0 && (
                      <div className="flex items-center gap-4 mb-8">
                        <Gamepad2 size={20} style={{ color: 'var(--primary)' }} />
                        <h3 className="text-xl font-black tracking-tighter uppercase italic">All Games</h3>
                        <div className="h-px flex-1 bg-white/5" />
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {otherGames.map((game) => (
                        <GameCard 
                          key={game.name} 
                          game={game} 
                          isFavorite={favorites.includes(game.name || '')} 
                          onSelect={handleGameSelect} 
                          onToggleFavorite={toggleFavorite} 
                          obfuscationLevel={textObfuscationLevel}
                        />
                      ))}
                    </div>
                  </section>

                  {filteredGames.length === 0 && (
                    <div className="text-zinc-600 italic py-20 text-center col-span-full">
                      <div className="text-4xl mb-4">∅</div>
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : view === 'html' ? (
            <motion.div 
              key="html"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="h-full flex flex-col overflow-hidden"
            >
              <HtmlEditor onClose={() => setView('desktop')} />
            </motion.div>
        ) : view === 'calculator' ? (
            <motion.div 
              key="calculator"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="h-full flex flex-col overflow-hidden"
            >
              <Calculator onClose={() => setView('desktop')} />
            </motion.div>
        ) : view === 'othersites' ? (
            <motion.div 
              key="othersites"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="h-full flex flex-col overflow-hidden"
            >
              <WindowHeader title="Other Sites" onClose={() => setView('desktop')} />
              <div className="flex-1 overflow-y-auto p-8">
                <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase italic text-center">Other Sites</h2>
              <p className="text-zinc-500 max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
                <span className="font-bold mr-1" style={{ color: 'var(--primary)' }}>DISCLAIMER:</span>
                These sites are specifically unblocked for the Carmel Clay Schools District. Some of these games might not work for schools outside of that district. Maybe if we grow larger, we can also focus on schools outside of the Carmel Clay Schools District.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                {otherSites.map((site, index) => (
                  <a 
                    key={`${site.name}-${index}`}
                    href={site.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-4 p-6 bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 rounded-2xl transition-all text-left w-full max-w-xs"
                  >
                    <div 
                      className="w-12 h-12 flex-shrink-0 bg-zinc-950 rounded-xl flex items-center justify-center text-xl font-black border border-white/5 group-hover:scale-110 transition-transform"
                      style={{ color: 'var(--primary)' }}
                    >
                      {site.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xl font-bold transition-colors group-hover:opacity-80" style={{ color: 'var(--primary)' }}>{site.name}</div>
                      <div className="text-xs font-mono text-zinc-600 uppercase tracking-widest">{site.domain}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        ) : view === 'theme' ? (
            <motion.div 
              key="theme"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="h-full flex flex-col overflow-hidden"
            >
              <WindowHeader title="Theme" onClose={() => setView('desktop')} />
              <div className="flex-1 overflow-y-auto p-8">
                <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">Theme</h2>
                <p className="text-zinc-500 max-w-2xl mx-auto text-sm">
                  Customize your experience with different color palettes.
                </p>
              </div>

              <div className="space-y-12">
                {/* Themes Section */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <Palette size={20} style={{ color: 'var(--primary)' }} />
                    <h3 className="text-xl font-black tracking-tighter uppercase italic">Themes</h3>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {[
                      { id: 'default', name: 'Emerald Green', color: '#059669' },
                      { id: 'blue', name: 'Midnight Blue', color: '#2563eb' },
                      { id: 'green', name: 'Classic Red', color: '#dc2626' },
                      { id: 'amber', name: 'Amber Sunset', color: '#d97706' },
                      { id: 'purple', name: 'Amethyst Purple', color: '#9333ea' },
                      { id: 'pink', name: 'Neon Pink', color: '#db2777' },
                      { id: 'cyan', name: 'Cyber Cyan', color: '#0891b2' },
                      { id: 'orange', name: 'Burnt Orange', color: '#ea580c' },
                      { id: 'lime', name: 'Electric Lime', color: '#65a30d' },
                      { id: 'slate', name: 'Steel Slate', color: '#475569' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          document.documentElement.setAttribute('data-theme', t.id);
                          localStorage.setItem('theme', t.id);
                        }}
                        className={`group relative p-6 rounded-2xl border transition-all text-center ${
                          theme === t.id 
                            ? 'bg-zinc-800 border-white/20' 
                            : 'bg-zinc-900/50 border-white/5 hover:bg-zinc-800'
                        }`}
                      >
                        <div 
                          className="w-12 h-12 mx-auto mb-4 rounded-full shadow-lg transition-transform group-hover:scale-110"
                          style={{ backgroundColor: t.color }}
                        />
                        <div className={`font-bold text-xs ${theme === t.id ? 'text-white' : 'text-zinc-400'}`}>
                          {t.name}
                        </div>
                        {theme === t.id && (
                          <div 
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
                            style={{ backgroundColor: 'var(--primary)' }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Wallpaper Section */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <Heart size={20} style={{ color: 'var(--primary)' }} />
                    <h3 className="text-xl font-black tracking-tighter uppercase italic">Wallpaper</h3>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-full sm:w-48 h-32 rounded-2xl border border-white/10 overflow-hidden bg-zinc-950 flex items-center justify-center relative group">
                        {wallpaper ? (
                          <img 
                            src={wallpaper} 
                            alt="Custom Wallpaper" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Default</div>
                        )}
                      </div>
                      <div className="flex-1 space-y-4 w-full">
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          Upload a custom image to personalize your desktop background. Supported formats: JPG, PNG, WebP.
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <label className="flex-1 sm:flex-none px-6 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer text-center" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const base64String = reader.result as string;
                                    setWallpaper(base64String);
                                    localStorage.setItem('wallpaper', base64String);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            Upload Image
                          </label>
                          <button 
                            onClick={() => {
                              setWallpaper(null);
                              localStorage.removeItem('wallpaper');
                            }}
                            className="flex-1 sm:flex-none px-6 py-3 bg-zinc-800 border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-700 transition-all text-zinc-400"
                          >
                            Reset Background
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        ) : view === 'security' ? (
            <motion.div 
              key="security"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="h-full flex flex-col overflow-hidden"
            >
              <WindowHeader title="Security" onClose={() => setView('desktop')} />
              <div className="flex-1 overflow-y-auto p-8">
                <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">Security</h2>
                <p className="text-zinc-500 max-w-2xl mx-auto text-sm">
                  {obfuscate('Configure safety features and stealth modes.', textObfuscationLevel)}
                </p>
              </div>

              <div className="space-y-12">
                {/* Panic Key Section */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <RotateCcw size={20} style={{ color: 'var(--primary)' }} />
                    <h3 className="text-xl font-black tracking-tighter uppercase italic">Panic Key</h3>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Status</h4>
                        <p className="text-[10px] text-zinc-500 italic">Toggle the panic functionality on or off.</p>
                      </div>
                      <div className="flex items-center gap-3 bg-zinc-950 px-4 py-2 rounded-full border border-white/5">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${panicEnabled ? 'text-white' : 'text-zinc-500'}`}>
                          {panicEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <button
                          onClick={() => {
                            const next = !panicEnabled;
                            setPanicEnabled(next);
                            localStorage.setItem('panicEnabled', String(next));
                          }}
                          className={`relative w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${
                            panicEnabled ? 'bg-zinc-700' : 'bg-zinc-950 border border-white/5'
                          }`}
                          style={panicEnabled ? { backgroundColor: 'var(--primary)' } : {}}
                        >
                          <motion.div 
                            animate={{ x: panicEnabled ? 20 : 0 }}
                            className="w-4 h-4 bg-white rounded-full shadow-lg"
                          />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest">Trigger Key</label>
                        <button
                          onClick={() => setIsListeningForKey(true)}
                          className={`w-full p-4 rounded-xl border font-mono text-sm transition-all ${
                            isListeningForKey 
                              ? 'bg-zinc-800 border-white/20 animate-pulse text-white' 
                              : 'bg-zinc-950 border-white/5 text-zinc-400 hover:border-white/10'
                          }`}
                          style={isListeningForKey ? { borderColor: 'var(--primary)' } : {}}
                        >
                          {isListeningForKey ? 'Press any key...' : panicKey || 'Not Set'}
                        </button>
                        <p className="text-[10px] text-zinc-600 leading-relaxed italic">
                          <span className="font-bold mr-1" style={{ color: 'var(--primary)' }}>DISCLAIMER:</span>
                          Select a key you won't accidentally press during gameplay (like a function key or a rarely used symbol).
                        </p>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest">Redirect URL</label>
                        <input
                          type="text"
                          value={panicUrl}
                          onChange={(e) => {
                            setPanicUrl(e.target.value);
                            localStorage.setItem('panicUrl', e.target.value);
                          }}
                          placeholder="e.g. google.com"
                          className="w-full p-4 bg-zinc-950 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-white/10 transition-all"
                          style={{ borderBottom: '2px solid var(--primary)' }}
                        />
                        <p className="text-[10px] text-zinc-600 italic">
                          This is the site you'll be whisked away to when the panic key is pressed.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Text Obfuscation Section */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <Sparkles size={20} style={{ color: 'var(--primary)' }} />
                    <h3 className="text-xl font-black tracking-tighter uppercase italic">Filter Bypass</h3>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Homoglyph Obfuscation</h4>
                        <p className="text-[10px] text-zinc-500 italic mb-2">Replace characters with lookalikes to bypass screen monitoring and AI filters.</p>
                      </div>
                      <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-white/5">
                        {[
                          { l: 1, n: 'None' },
                          { l: 2, n: 'Normal (Default)' },
                          { l: 3, n: 'High' }
                        ].map((level) => (
                          <button
                            key={level.l}
                            onClick={() => {
                              setTextObfuscationLevel(level.l);
                              localStorage.setItem('textObfuscationLevel', String(level.l));
                            }}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                              textObfuscationLevel === level.l 
                                ? 'bg-white text-black shadow-lg' 
                                : 'text-zinc-500 hover:text-white'
                            }`}
                          >
                            {level.n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Close Protection Section */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <X size={20} style={{ color: 'var(--primary)' }} />
                    <h3 className="text-xl font-black tracking-tighter uppercase italic">Close Protection</h3>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">{obfuscate('Tab Lockout', textObfuscationLevel)}</h4>
                        <p className="text-[10px] text-zinc-500 italic mb-2">Prevent teachers or anyone from closing the tab easily.</p>
                        <p className="text-[10px] text-zinc-500 italic max-w-md">
                          When enabled, the browser will ask "Are you sure you want to leave?" when anyone tries to close this tab.
                          <span className="text-[var(--primary)] font-bold ml-1">Note: Browsers limit how many times this can show to prevent malicious loops, but this provides the maximum stealth protection.</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3 bg-zinc-950 px-4 py-2 rounded-full border border-white/5">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${closeProtection ? 'text-white' : 'text-zinc-500'}`}>
                          {closeProtection ? 'Enabled' : 'Disabled'}
                        </span>
                        <button
                          onClick={() => {
                            const next = !closeProtection;
                            setCloseProtection(next);
                            localStorage.setItem('closeProtection', String(next));
                          }}
                          className={`relative w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${
                            closeProtection ? 'bg-zinc-700' : 'bg-zinc-950 border border-white/5'
                          }`}
                          style={closeProtection ? { backgroundColor: 'var(--primary)' } : {}}
                        >
                          <motion.div 
                            animate={{ x: closeProtection ? 20 : 0 }}
                            className="w-4 h-4 bg-white rounded-full shadow-lg"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Passcode Section */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <Shield size={20} style={{ color: 'var(--primary)' }} />
                    <h3 className="text-xl font-black tracking-tighter uppercase italic">Passcode Lock</h3>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Session Passcode</h4>
                        <p className="text-[10px] text-zinc-500 italic mb-2">Require a 3-digit code when returning to the tab.</p>
                        <p className="text-[10px] text-zinc-500 italic max-w-md">
                          If enabled, when a teacher asks to see your tab, enter the passcode 911 to access your Panic Key tab. (Panic Key must be enabled to function.)
                        </p>
                      </div>
                      <div className="flex items-center gap-3 bg-zinc-950 px-4 py-2 rounded-full border border-white/5">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${passcodeEnabled ? 'text-white' : 'text-zinc-500'}`}>
                          {passcodeEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <button
                          onClick={() => {
                            const next = !passcodeEnabled;
                            setPasscodeEnabled(next);
                            localStorage.setItem('passcodeEnabled', String(next));
                            if (!next) {
                              setSessionPasscode(null);
                              setIsLocked(false);
                              setIsSettingPasscode(false);
                            }
                          }}
                          className={`relative w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${
                            passcodeEnabled ? 'bg-zinc-700' : 'bg-zinc-950 border border-white/5'
                          }`}
                          style={passcodeEnabled ? { backgroundColor: 'var(--primary)' } : {}}
                        >
                          <motion.div 
                            animate={{ x: passcodeEnabled ? 20 : 0 }}
                            className="w-4 h-4 bg-white rounded-full shadow-lg"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Cloak Section */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <Globe size={20} style={{ color: 'var(--primary)' }} />
                    <h3 className="text-xl font-black tracking-tighter uppercase italic">Cloak</h3>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="font-bold text-white">Stealth Mode</h4>
                        <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
                          When enabled, the site's tab title and icon will change to look like a common educational site. This helps the site blend in more easily.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                          { id: 'none', name: 'None', icon: '🚫' },
                          { id: 'slides', name: 'Slides', icon: '📊' },
                          { id: 'wikipedia', name: 'Wikipedia', icon: '📖' },
                          { id: 'canvas', name: 'Canvas', icon: '🎨' },
                          { id: 'docs', name: 'Docs', icon: '📄' },
                          { id: 'drive', name: 'Drive', icon: '📁' },
                          { id: 'classroom', name: 'Classroom', icon: '🏫' },
                          { id: 'khan', name: 'Khan Academy', icon: '🌿' },
                          { id: 'kahoot', name: 'Kahoot', icon: '💜' },
                          { id: 'schoology', name: 'Schoology', icon: '🎓' },
                        ].map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setCloak(c.id);
                              localStorage.setItem('cloak', c.id);
                            }}
                            className={`group relative p-4 rounded-2xl border transition-all text-center flex flex-col items-center gap-2 ${
                              cloak === c.id 
                                ? 'bg-zinc-800 border-white/20' 
                                : 'bg-zinc-950 border-white/5 hover:bg-zinc-900'
                            }`}
                          >
                            <div className="text-2xl">{c.icon}</div>
                            <div className={`font-bold text-[10px] uppercase tracking-widest ${cloak === c.id ? 'text-white' : 'text-zinc-500'}`}>
                              {c.name}
                            </div>
                            {cloak === c.id && (
                              <div 
                                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                                style={{ backgroundColor: 'var(--primary)' }}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        ) : view === 'appstore' ? (
          <motion.div 
            key="appstore"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="h-full flex flex-col overflow-hidden"
          >
            <WindowHeader title="App Store" onClose={() => setView('desktop')} />
            <AppStore onClose={() => setView('desktop')} onSelectApp={handleGameSelect} />
          </motion.div>
        ) : view === 'terminal' ? (
          <motion.div 
            key="terminal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="h-full flex flex-col overflow-hidden"
          >
            <WindowHeader title="Super Mushroom" onClose={() => setView('desktop')} />
            <SuperMushroom 
              onClose={() => setView('desktop')} 
              onOpenApp={(v: any) => setView(v)}
              sessionStartTime={sessionStartTime}
              onAlert={(msg) => addNotification(msg, 'warning')}
            />
          </motion.div>
        ) : view === 'verse' ? (
          <motion.div 
            key="verse"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="h-full flex flex-col overflow-hidden"
          >
            <VerseOfTheDay onClose={() => setView('desktop')} />
          </motion.div>
        ) : view === 'cards' ? (
          <motion.div 
            key="cards"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="h-full flex flex-col overflow-hidden"
          >
            <WindowHeader title="CARDS" onClose={() => setView('desktop')} />
            <CardsApp />
          </motion.div>
        ) : view === 'gamenotes' ? (
          <motion.div 
            key="gamenotes"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="h-full flex flex-col overflow-hidden"
          >
            <WindowHeader title="Game Notes" onClose={() => setView('desktop')} />
            <div className="flex-1 overflow-hidden">
              <GameNotesApp onClose={() => setView('desktop')} />
            </div>
          </motion.div>
        ) : view === 'paint' ? (
          <motion.div 
            key="paint"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="h-full flex flex-col overflow-hidden"
          >
            <WindowHeader title="Paint" onClose={() => setView('desktop')} />
            <div className="flex-1 overflow-hidden">
              <PaintApp onClose={() => setView('desktop')} />
            </div>
          </motion.div>
        ) : view === 'widget' ? (
          <motion.div 
            key="widget"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="h-full flex flex-col overflow-hidden"
          >
            <WindowHeader title="Widget Settings" onClose={() => setView('desktop')} />
            <WidgetApp settings={widgetSettings} onUpdateSettings={setWidgetSettings} />
          </motion.div>
        ) : view === 'lofi' ? (
          <motion.div 
            key="lofi"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="h-full flex flex-col overflow-hidden"
          >
            <WindowHeader title="LO-FI" onClose={() => setView('desktop')} />
            <div className="flex-1 overflow-hidden">
              <LoFiApp />
            </div>
          </motion.div>
        ) : (
            <motion.div 
              key="about"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="h-full flex flex-col overflow-hidden"
            >
              <WindowHeader title="About" onClose={() => setView('desktop')} />
              <div className="flex-1 overflow-y-auto p-8">
                <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase italic" style={{ color: 'var(--primary)' }}>About LACTOSE</h2>
                <p className="text-zinc-500 max-w-2xl mx-auto text-sm leading-relaxed">
                  Everything you need to know about the project and the man behind the curtain.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { label: "Creator", value: "Orcaweesh" },
                  { label: "Co-Creator", value: "None, Orcaweesh is a lonely man" },
                  { 
                    label: "What is LACTOSE?", 
                    value: "LACTOSE is an operating system made of arcade games. It was originally called D3, which stands for \"Demo 3\". OS means operating system, and together they make LACTOSE." 
                  },
                  { 
                    label: "Discord Server", 
                    value: "https://discord.gg/3XAgBPC3vx. Come join the Discord Server so don't miss anything. (Let's see who's the first to join...)",
                    isLink: true,
                    link: "https://discord.gg/3XAgBPC3vx"
                  },
                  { 
                    label: "OTHER SITES", 
                    value: "Other sites is for people who for some reason don't like LACTOSE. I just put sites I find and add them (be sure to read the disclaimer first)" 
                  },
                  { 
                    label: "ARCADE", 
                    value: "The ARCADE currently is powered by UGS, which is basically just a bunch of HTML files in one thing. If you think I'm done adding games though, you're wrong (I hope)" 
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8">
                      <div className="md:w-48 flex-shrink-0">
                        <span className="text-xs font-mono uppercase tracking-widest opacity-50 block mb-1">Label</span>
                        <h3 className="text-lg font-black tracking-tighter uppercase italic group-hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
                          {item.label}
                        </h3>
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-mono uppercase tracking-widest opacity-50 block mb-1">Information</span>
                        {item.isLink ? (
                          <p className="text-zinc-400 text-sm leading-relaxed">
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors" style={{ color: 'var(--primary)' }}>
                              {item.link}
                            </a>
                            {item.value.replace(item.link, '')}
                          </p>
                        ) : (
                          <p className="text-zinc-400 text-sm leading-relaxed">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </main>

      {/* Game Runner Overlay */}
      <GameRunner 
        game={selectedGame} 
        onClose={() => setSelectedGame(null)} 
      />


      {/* Global Alarm Alert */}
      <AnimatePresence>
        {isRinging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-8 z-[100] max-w-sm mx-auto bg-[var(--primary)] text-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 text-center border border-white/20"
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
              <Bell size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Alarm</h3>
              <p className="text-white/80 font-bold">{activeAlarmLabel}</p>
            </div>
            <button
              onClick={() => setIsRinging(false)}
              className="w-full py-4 bg-white text-[var(--primary)] rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-lg"
            >
              Stop Alarm
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingPasscode && (
          <PasscodeModal 
            mode="set" 
            onComplete={(code) => {
              setSessionPasscode(code);
              setIsSettingPasscode(false);
            }} 
          />
        )}
        {isLocked && (
          <PasscodeModal 
            mode="enter" 
            correctPasscode={sessionPasscode}
            onComplete={() => setIsLocked(false)} 
            onPanic={triggerPanic}
          />
        )}
      </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
