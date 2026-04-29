import React, { useState, useRef, useEffect } from 'react';
import { MousePointer2, Move, Square, Crosshair } from 'lucide-react';
import { motion } from 'motion/react';

interface SelectionCanvasProps {
  image: string;
  onSelectionChange: (area: { x: number; y: number; w: number; h: number }) => void;
  id?: string;
}

export default function SelectionCanvas({ image, onSelectionChange, id }: SelectionCanvasProps) {
  const [selection, setSelection] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const getRelativeCoords = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current || !imgRef.current) return { x: 0, y: 0 };
    const rect = imgRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getRelativeCoords(e);
    setStartPos(coords);
    setIsDrawing(true);
    setSelection({ x: coords.x, y: coords.y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const coords = getRelativeCoords(e);
    
    const x = Math.min(coords.x, startPos.x);
    const y = Math.min(coords.y, startPos.y);
    const w = Math.abs(coords.x - startPos.x);
    const h = Math.abs(coords.y - startPos.y);

    setSelection({ x, y, w, h });
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (selection && imgRef.current) {
      // Normalize to pixel values if we want absolute, 
      // but for prompt building, percentages or relative is often better.
      // Let's pass the selection as is.
      onSelectionChange(selection);
    }
  };

  // Provide initial selection if none
  useEffect(() => {
    if (!selection && imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      if (rect.width > 0) {
        const initial = { x: rect.width * 0.25, y: rect.height * 0.25, w: rect.width * 0.5, h: rect.height * 0.5 };
        setSelection(initial);
        onSelectionChange(initial);
      }
    }
  }, [image]);

  return (
    <div className="flex flex-col gap-3" id={id}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">2. Select Placement Area</label>
        <div className="flex gap-2">
           <div className="flex items-center gap-1 text-[10px] bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">
             <Crosshair size={10} /> Drag to select
           </div>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="relative bg-neutral-900 rounded-2xl overflow-hidden cursor-crosshair h-[400px] flex items-center justify-center border shadow-inner select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img 
          ref={imgRef}
          src={image} 
          className="max-w-full max-h-full object-contain pointer-events-none"
          alt="Mockup for selection"
        />
        
        {selection && (
          <div 
            className="absolute border-2 border-primary bg-primary/10 transition-[border-color,background-color]"
            style={{
              left: `${selection.x + (imgRef.current?.offsetLeft || 0)}px`,
              top: `${selection.y + (imgRef.current?.offsetTop || 0)}px`,
              width: `${selection.w}px`,
              height: `${selection.h}px`,
              borderColor: 'var(--color-primary, #3b82f6)',
              boxShadow: '0 0 0 4000px rgba(0,0,0,0.4)',
            }}
          >
            {/* Corner Handles */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-primary rounded-full group-hover:scale-125 transition-transform" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-primary rounded-full group-hover:scale-125 transition-transform" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-primary rounded-full group-hover:scale-125 transition-transform" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-primary rounded-full group-hover:scale-125 transition-transform" />
            
            {/* Label */}
            <div className="absolute -top-7 left-0 bg-primary text-white text-[10px] px-2 py-1 rounded whitespace-nowrap font-bold shadow-sm">
              LOGO AREA
            </div>
          </div>
        )}
      </div>
      <p className="text-[11px] text-neutral-400 italic">
        * Drag your mouse over the product where you want the logo to appear.
      </p>
    </div>
  );
}
