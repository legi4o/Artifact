import React from 'react';
import { motion } from 'framer-motion';
import { Palette } from '../types';

interface PaletteSelectorProps {
  palettes: Palette[];
  activePalette: Palette;
  onSelect: (palette: Palette) => void;
}

export const PaletteSelector: React.FC<PaletteSelectorProps> = ({ palettes, activePalette, onSelect }) => {
  
  const handleSelect = (p: Palette) => {
    if (p.id !== activePalette.id) {
      onSelect(p);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Material</span>
      <div className="flex items-center gap-4 p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors duration-300">
        {palettes.map((p) => (
          <motion.button
            key={p.id}
            onClick={() => handleSelect(p)}
            className="relative w-8 h-8 rounded-full flex items-center justify-center outline-none"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Active Indicator Ring */}
            {activePalette.id === p.id && (
              <motion.div
                layoutId="activeRing"
                className="absolute inset-[-4px] rounded-full border border-white/60"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            
            {/* Color Preview */}
            <div 
              className="w-full h-full rounded-full shadow-inner ring-1 ring-white/10"
              style={{ backgroundColor: p.color }}
            />
            
            {/* Tooltip on Hover */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none text-[10px] tracking-wider uppercase text-white bg-black/80 px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap">
              {p.name}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};