import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Square, Eraser, Trash2, Download, MousePointer2, Circle, Type, Palette } from 'lucide-react';
import { obfuscate } from '../constants';
import { useObfuscation } from '../context/ObfuscationContext';

export const PaintApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { level } = useObfuscation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000'); // Default black
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setCanvasSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (canvasRef.current && canvasSize.width > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Fill white background on initial size
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [canvasSize]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'lactose-paint.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#008000', '#FF6321'
  ];

  return (
    <div className="h-full flex flex-col bg-white text-black font-sans select-none overflow-hidden border-4 border-black box-border">
      {/* Brutalist Toolbar */}
      <div className="flex border-b-4 border-black h-20 overflow-x-auto no-scrollbar bg-[#f0f0f0]">
        {/* Tool Section */}
        <div className="flex items-center px-4 gap-4 border-r-4 border-black shrink-0">
          <ToolButton 
            active={tool === 'brush'} 
            onClick={() => setTool('brush')}
            icon={<MousePointer2 size={24} />}
            label={obfuscate('BRUSH', level)}
          />
          <ToolButton 
            active={tool === 'eraser'} 
            onClick={() => setTool('eraser')}
            icon={<Eraser size={24} />}
            label={obfuscate('ERASER', level)}
          />
        </div>

        {/* Color Section */}
        <div className="flex items-center px-4 gap-2 border-r-4 border-black shrink-0">
          <div className="grid grid-cols-5 gap-1">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => {
                   setColor(c);
                   if (tool === 'eraser') setTool('brush');
                }}
                className={`w-6 h-6 border-2 border-black transition-transform hover:scale-110 ${color === c ? 'scale-125 z-10' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div 
            className="w-12 h-12 border-4 border-black ml-2 shrink-0"
            style={{ backgroundColor: color }}
          />
        </div>

        {/* Size Section */}
        <div className="flex flex-col justify-center px-6 border-r-4 border-black shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest mb-1 italic">{obfuscate('STRENGTH', level)}: {obfuscate(String(brushSize), level)}</span>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-32 h-2 bg-black rounded-none appearance-none cursor-pointer accent-[#00FF00]"
          />
        </div>

        {/* Action Section */}
        <div className="flex items-center px-6 gap-4 shrink-0">
          <ActionButton onClick={clearCanvas} icon={<Trash2 size={20} />} label={obfuscate('PURGE', level)} />
          <ActionButton onClick={downloadImage} icon={<Download size={20} />} label={obfuscate('EXPORT', level)} />
        </div>
      </div>

      {/* Canvas Area */}
      <div ref={containerRef} className="flex-1 bg-zinc-200 p-8 flex items-center justify-center relative overflow-hidden">
        <div className="bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden cursor-crosshair">
          <canvas
            ref={canvasRef}
            width={canvasSize.width - 64}
            height={canvasSize.height - 64}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="touch-none"
          />
        </div>
      </div>
    </div>
  );
};

const ToolButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-14 h-14 border-4 border-black transition-all ${
      active ? 'bg-[#00FF00] -translate-y-1 -translate-x-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-zinc-100'
    }`}
  >
    {icon}
    <span className="text-[8px] font-black mt-0.5">{label}</span>
  </button>
);

const ActionButton: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string }> = ({ onClick, icon, label }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 bg-white border-4 border-black font-black text-xs hover:bg-[#00FF00] transition-colors"
  >
    {icon}
    {label}
  </button>
);
