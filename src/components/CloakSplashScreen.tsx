import React from 'react';
import { motion } from 'motion/react';
import { Search, GraduationCap, Layout, Gamepad2, PenTool, MoreHorizontal, BookOpen, Quote, ChevronDown } from 'lucide-react';

export const CloakSplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto font-sans text-[#4a4a4a]">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00B4CC] rounded-lg flex items-center justify-center text-white">
            <GraduationCap size={20} />
          </div>
          <span className="text-xl font-bold text-[#00B4CC]">Education.com</span>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search 'addition worksheets'"
              className="w-full h-10 pl-4 pr-10 rounded-full border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:border-[#00B4CC]"
              readOnly
            />
            <Search className="absolute right-3 top-2.5 text-zinc-400" size={18} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm font-semibold text-zinc-600 hover:text-zinc-900">Log In</button>
          <button className="px-4 py-2 bg-[#00B4CC] text-white rounded-full text-sm font-bold shadow-sm">Sign Up</button>
        </div>
      </header>

      {/* Nav Menu */}
      <nav className="max-w-7xl mx-auto px-4 py-2 hidden lg:flex items-center justify-between text-[11px] font-bold text-zinc-500 border-b border-zinc-50 uppercase tracking-wide">
        <div className="flex items-center gap-1 cursor-default">Subjects <ChevronDown size={12} className="opacity-50" /></div>
        <div className="flex items-center gap-1 cursor-default">Grades <ChevronDown size={12} className="opacity-50" /></div>
        <div className="flex items-center gap-1 cursor-default">Worksheets <ChevronDown size={12} className="opacity-50" /></div>
        <div className="flex items-center gap-1 cursor-default">Games <ChevronDown size={12} className="opacity-50" /></div>
        <div className="flex items-center gap-1 cursor-default">Build a Worksheet <ChevronDown size={12} className="opacity-50" /></div>
        <div className="flex items-center gap-1 cursor-default">More Resources <ChevronDown size={12} className="opacity-50" /></div>
        <div className="flex items-center gap-1 cursor-default text-[#E91E63]">🐷 Roly Recommends <ChevronDown size={12} className="opacity-50" /></div>
        <div className="flex items-center gap-1 cursor-default text-[#00B4CC]">🧮 Math Month</div>
      </nav>

      {/* Login Banner */}
      <div className="bg-[#FFE5D9] py-2 text-center text-xs font-medium text-zinc-600">
        Did you receive a login code from your child's teacher? <button className="text-[#00B4CC] underline">Enter it here.</button>
      </div>

      {/* Hero Section */}
      <section className="bg-[#D6F2FE] relative overflow-hidden h-[460px] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between w-full relative z-10">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-[#455A64] leading-tight">
              Where learning blooms
            </h1>
            <p className="text-lg text-[#546E7A] max-w-md">
              Explore 38,000+ teacher-created worksheets, hands-on activities, and learning games that build real skills!
            </p>
            <button className="px-10 py-4 bg-[#6373BA] text-white rounded-full text-lg font-bold shadow-lg hover:bg-[#5361A0] transition-colors">
              Join for free
            </button>
          </div>

          <div className="md:w-1/2 relative h-[300px] flex items-center justify-center">
            {/* Visual representation of the illustrations */}
            <div className="relative w-full h-full">
              {/* Tree proxy */}
              <div className="absolute right-0 bottom-0 w-48 h-64 bg-pink-100/50 rounded-full blur-2xl" />
              <div className="absolute right-10 bottom-20 w-32 h-32 text-pink-300">
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
                   🌸 🌳
                </motion.div>
              </div>
              
              {/* Characters proxy using icons and shapes */}
              <div className="absolute bottom-10 left-20 w-32 h-32 bg-[#FFD54F] rounded-full flex items-center justify-center border-4 border-white shadow-xl rotate-12">
                 🐱
              </div>
              <div className="absolute bottom-16 right-32 w-28 h-28 bg-[#9575CD] rounded-[40px] flex items-center justify-center border-4 border-white shadow-xl -rotate-6">
                 🤖
              </div>
            </div>
          </div>
        </div>

        {/* Rolling Hills at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-[#96C93D]" style={{ borderRadius: '100% 100% 0 0 / 100% 100% 0 0', transform: 'scale(1.5, 1) translateY(50%)' }} />
      </section>

      {/* Library Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-4xl font-bold text-[#455A64]">Our learning library</h2>
          <p className="text-[#546E7A] text-lg">
            With thousands of digital and printable resources, find the best resource for your student.
          </p>
          <div className="pt-8 flex justify-center">
            <button className="px-12 py-3 bg-[#6373BA] text-white rounded-full font-bold shadow-md">
              Dive right in
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Curve decoration */}
      <div className="h-24 bg-zinc-50" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
    </div>
  );
};
