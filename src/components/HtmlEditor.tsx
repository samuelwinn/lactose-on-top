import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, FileCode, Trash2, Copy, Maximize2, Minimize2, Wand2 } from 'lucide-react';
import { WindowHeader } from '../App';

interface HtmlEditorProps {
  onClose: () => void;
}

export const HtmlEditor: React.FC<HtmlEditorProps> = ({ onClose }) => {
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);

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

  const runCode = () => {
    setOutput(code);
  };

  const handleFullscreen = () => {
    if (outputContainerRef.current) {
      if (!document.fullscreenElement) {
        if (outputContainerRef.current.requestFullscreen) {
          outputContainerRef.current.requestFullscreen();
        } else if ((outputContainerRef.current as any).webkitRequestFullscreen) {
          (outputContainerRef.current as any).webkitRequestFullscreen();
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

  const handleFormat = () => {
    if (!code.trim()) return;
    // Simple formatting (very basic)
    let formatted = code
      .replace(/>\s+</g, '>\n<')
      .replace(/(<[^/][^>]*>)/g, '$1\n')
      .replace(/(<\/([^>]+)>)/g, '\n$1')
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.trim())
      .join('\n');
    
    // Add some indentation (very basic)
    let indent = 0;
    const lines = formatted.split('\n');
    const indentedLines = lines.map(line => {
      if (line.startsWith('</')) indent--;
      const result = '  '.repeat(Math.max(0, indent)) + line;
      if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>') && !line.includes('</')) indent++;
      return result;
    });
    
    setCode(indentedLines.join('\n'));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-zinc-950">
      <WindowHeader title="HTML Editor" onClose={onClose} />
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Editor Side */}
        <div className="flex-1 flex flex-col border-r border-white/5">
          <div className="px-4 py-2 bg-zinc-900/50 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode size={14} className="text-zinc-500" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">Editor</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCode('')}
                className="p-1.5 text-zinc-500 hover:text-red-500 transition-colors"
                title="Clear"
              >
                <Trash2 size={14} />
              </button>
              <button 
                onClick={() => navigator.clipboard.writeText(code)}
                className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                title="Copy"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full bg-zinc-950 text-zinc-300 p-6 font-mono text-sm focus:outline-none resize-none selection:bg-[var(--primary-shadow)]"
            spellCheck={false}
          />
        </div>

        {/* Controls (Middle) */}
        <div className="w-full md:w-48 bg-zinc-900/30 border-r border-white/5 flex flex-col p-4 gap-3">
          <button
            onClick={runCode}
            className="w-full py-4 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            <Play size={16} fill="currentColor" />
            RUN
          </button>
          
          <button
            onClick={handleFormat}
            className="w-full py-3 bg-zinc-800 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
          >
            <Wand2 size={14} />
            Format
          </button>

          <div className="flex-1" />
        </div>

        {/* Output Side */}
        <div className="flex-1 flex flex-col" ref={outputContainerRef}>
          <div className="px-4 py-2 bg-zinc-900/50 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Maximize2 size={14} className="text-zinc-500" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">Output</span>
            </div>
            <button 
              onClick={handleFullscreen}
              className="p-1.5 text-zinc-500 hover:text-white transition-colors"
              title={isFullscreen ? "Minimize" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
          <div className="flex-1 bg-white overflow-hidden relative">
            <iframe
              ref={iframeRef}
              srcDoc={output}
              title="output"
              className="w-full h-full border-none"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
