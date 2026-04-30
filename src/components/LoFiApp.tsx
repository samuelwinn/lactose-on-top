import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, CassetteTape, Radio, Disc3 } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const LOFI_TRACKS: Track[] = [
  {
    title: "Chill Study Beats",
    artist: "Lactose Studio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Representative placeholder
    cover: "https://picsum.photos/seed/lofi1/300/300"
  },
  {
    title: "Midnight Coffee",
    artist: "Orcaweesh",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/lofi2/300/300"
  },
  {
    title: "Purple Skies",
    artist: "Lactose Studio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/lofi3/300/300"
  },
  {
    title: "Rainy Window",
    artist: "Lactose Studio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover: "https://picsum.photos/seed/lofi4/300/300"
  },
  {
    title: "Suburban Sunset",
    artist: "Synth Waves",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    cover: "https://picsum.photos/seed/lofi5/300/300"
  },
  {
    title: "Urban Nightwalk",
    artist: "Lactose Studio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    cover: "https://picsum.photos/seed/lofi6/300/300"
  },
  {
    title: "Jazzy Morning",
    artist: "Orcaweesh",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    cover: "https://picsum.photos/seed/lofi7/300/300"
  },
  {
    title: "Retro Cassette",
    artist: "Tape Hiss",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    cover: "https://picsum.photos/seed/lofi8/300/300"
  },
  {
    title: "Static Dreams",
    artist: "Lactose Studio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    cover: "https://picsum.photos/seed/lofi9/300/300"
  },
  {
    title: "Endless Summer",
    artist: "Synth Waves",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    cover: "https://picsum.photos/seed/lofi10/300/300"
  }
];

export const LoFiApp: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = LOFI_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(console.error);
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % LOFI_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + LOFI_TRACKS.length) % LOFI_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="h-full bg-[#E6E6E6] flex items-center justify-center p-8 font-mono select-none">
      <div className="w-full max-w-md bg-[#151619] rounded-[32px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-white/5 relative">
        {/* Hardware Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full border border-white/10 ${isPlaying ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-zinc-800'}`} />
          </div>
          <Disc3 className={`text-zinc-700 ${isPlaying ? 'animate-spin' : ''}`} size={20} />
        </div>

        {/* Display Area */}
        <div className="px-8 py-4">
          <div className="aspect-square w-full rounded-2xl overflow-hidden border-4 border-[#25262b] shadow-inner relative group">
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">{currentTrack.title}</h3>
            </div>
          </div>
        </div>

        {/* Transport Controls */}
        <div className="px-8 py-8 space-y-8 text-[#FFFFFF]">
          {/* Progress Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black text-zinc-500 italic uppercase">
              <span>Frequency</span>
              <span className="tabular-nums">{Math.floor(progress)}%</span>
            </div>
            <div className="relative h-1 bg-zinc-800 rounded-full overflow-hidden">
               <motion.div 
                 className="absolute inset-y-0 left-0 bg-white" 
                 animate={{ width: `${progress}%` }}
                 transition={{ duration: 0.1 }}
               />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={prevTrack}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-all active:scale-95"
              >
                <SkipBack size={20} />
              </button>
              <button 
                onClick={togglePlay}
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white text-black hover:bg-[#00FF00] transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
              </button>
              <button 
                onClick={nextTrack}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-all active:scale-95"
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-4 px-4 h-12 bg-zinc-900 rounded-xl border border-white/5">
              <Volume2 size={16} className="text-zinc-500" />
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-white"
              />
            </div>
          </div>
        </div>

        {/* Hardware Feet/Decoration */}
        <div className="px-8 pb-8 flex justify-center gap-12">
           <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
           <div className="flex flex-col items-center gap-1">
             <div className="w-48 h-1 bg-zinc-800/50 rounded-full" />
             <div className="w-32 h-0.5 bg-zinc-800/30 rounded-full" />
           </div>
           <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
        </div>

        <audio 
          ref={audioRef} 
          src={currentTrack.url} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={nextTrack}
        />
      </div>

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
    </div>
  );
};
