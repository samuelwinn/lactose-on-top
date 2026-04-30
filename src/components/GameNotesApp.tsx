import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Square, Info, Settings, FileText, ChevronRight } from 'lucide-react';

interface Tab {
  id: string;
  name: string;
  content: string;
  isActive: boolean;
}

export const GameNotesApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const saved = localStorage.getItem('game_notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to load notes:', e);
      }
    }
    return [{ id: '1', name: 'untitled', content: '', isActive: true }];
  });
  const [lineCount, setLineCount] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const activeTab = tabs.find(t => t.isActive) || tabs[0];
  const [lastValidContent, setLastValidContent] = useState(activeTab.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    localStorage.setItem('game_notes', JSON.stringify(tabs));
    setIsSaving(true);
    const timer = setTimeout(() => setIsSaving(false), 800);
    return () => clearTimeout(timer);
  }, [tabs]);

  useEffect(() => {
    setLastValidContent(activeTab.content);
  }, [activeTab.id]);

  useEffect(() => {
    if (measureRef.current) {
      const measure = measureRef.current;
      const contentHeight = measure.scrollHeight;
      // 16px is pt-4. 22px is line height.
      const visualLines = Math.max(1, Math.ceil((contentHeight - 16) / 22));
      
      if (visualLines > 25) {
        setTabs(prev => prev.map(t => t.isActive ? { ...t, content: lastValidContent } : t));
        setError('Maximum of 25 lines allowed');
        setTimeout(() => setError(null), 2000);
      } else {
        setLastValidContent(activeTab.content);
        setLineCount(visualLines);
      }
    }
  }, [activeTab.content, lastValidContent]);

  const updateContent = (content: string) => {
    setTabs(prev => prev.map(t => t.isActive ? { ...t, content } : t));
  };

  const handleTabClick = (id: string) => {
    setTabs(prev => prev.map(t => ({ ...t, isActive: t.id === id })));
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    if (activeTab.id === id) {
      newTabs[0].isActive = true;
    }
    setTabs(newTabs);
  };

  const addTab = () => {
    if (tabs.length >= 8) {
      setError('Maximum of 8 tabs allowed');
      setTimeout(() => setError(null), 3000);
      return;
    }
    const newId = Math.random().toString(36).substr(2, 9);
    setTabs(prev => [
      ...prev.map(t => ({ ...t, isActive: false })),
      { id: newId, name: 'untitled', content: '', isActive: true }
    ]);
  };

  const navigateNext = () => {
    const currentIndex = tabs.findIndex(t => t.isActive);
    const nextIndex = (currentIndex + 1) % tabs.length;
    handleTabClick(tabs[nextIndex].id);
  };

  const navigatePrev = () => {
    const currentIndex = tabs.findIndex(t => t.isActive);
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    handleTabClick(tabs[prevIndex].id);
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setTempName(currentName);
  };

  const saveName = () => {
    if (editingId) {
      setTabs(prev => prev.map(t => t.id === editingId ? { ...t, name: tempName || 'untitled' } : t));
      setEditingId(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#282c34] text-[#abb2bf] font-mono select-none overflow-hidden">
      {/* Tab Bar */}
      <div className="flex items-center bg-[#21252b] h-10 px-2 gap-1 overflow-x-auto no-scrollbar pt-1">
        <div className="flex items-center gap-[2px]">
          <button 
            onClick={navigatePrev}
            className="p-1 px-[2px] hover:bg-white/5 rounded transition-colors"
          >
             <ChevronRight size={14} className="opacity-50 rotate-180" />
          </button>
          <button 
            onClick={navigateNext}
            className="p-1 px-[2px] hover:bg-white/5 rounded transition-colors"
          >
             <ChevronRight size={14} className="opacity-50" />
          </button>
        </div>
        
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            onDoubleClick={() => startEditing(tab.id, tab.name)}
            className={`group relative flex items-center min-w-[120px] max-w-[200px] h-8 px-4 rounded-t-lg transition-all cursor-pointer ${
              tab.isActive 
                ? 'bg-[#282c34] text-white shadow-[0_-2px_0_var(--primary)]' 
                : 'bg-[#21252b] hover:bg-[#2c313a] text-zinc-500'
            }`}
          >
            {editingId === tab.id ? (
              <input
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveName();
                  if (e.key === 'Escape') setEditingId(null);
                }}
                className="bg-zinc-800 text-white text-[11px] outline-none px-1 rounded w-full"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-[11px] truncate flex-1">{tab.name}</span>
            )}
            <button
              onClick={(e) => closeTab(e, tab.id)}
              className="ml-2 opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded transition-all"
            >
              <X size={10} />
            </button>
          </div>
        ))}
        
        <button
          onClick={addTab}
          className="flex items-center justify-center w-8 h-8 hover:bg-white/5 rounded-lg transition-colors text-zinc-600 hover:text-white"
        >
          <span className="text-xl">+</span>
        </button>

        <div className="flex-1" />
        
        <button className="p-2 hover:bg-white/5 rounded text-zinc-600">
           <span className="text-[10px] transform rotate-90 inline-block font-bold">▼</span>
        </button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden relative">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-zinc-900 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-2xl"
              style={{ color: 'var(--primary)' }}
            >
              <Info size={14} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gutter */}
        <div className="w-12 bg-[#282c34] border-r border-white/5 flex flex-col items-end pt-4 pb-12 pr-3 text-zinc-600 text-sm select-none leading-[22px]">
          {Array.from({ length: Math.min(25, lineCount) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area Container */}
        <div className="flex-1 relative overflow-hidden">
          {/* Hidden Measure Div */}
          <div 
            ref={measureRef}
            className="absolute top-0 left-0 w-full invisible pointer-events-none whitespace-pre-wrap break-words text-sm leading-[22px] px-4 pt-4"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {activeTab.content + (activeTab.content.endsWith('\n') ? '\u00A0' : '')}
          </div>
          
          <textarea
            ref={textareaRef}
            value={activeTab.content}
            onChange={(e) => updateContent(e.target.value)}
            spellCheck={false}
            className="absolute inset-0 w-full h-full bg-transparent p-0 pt-4 px-4 outline-none resize-none text-sm leading-[22px] caret-white selection:bg-white/10 no-scrollbar overflow-hidden"
            style={{ fontFamily: 'var(--font-mono)' }}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const start = e.currentTarget.selectionStart;
                const end = e.currentTarget.selectionEnd;
                const value = e.currentTarget.value;
                e.currentTarget.value = value.substring(0, start) + '    ' + value.substring(end);
                e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
                updateContent(e.currentTarget.value);
              }
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="h-6 bg-[#21252b] border-t border-white/5 flex items-center justify-end px-4 gap-6 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
        <AnimatePresence>
          {isSaving && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-emerald-500/80 mr-auto"
            >
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              Saving to Storage...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
