import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '' }) => {
  const isPrimary = variant === 'primary';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative group overflow-hidden px-10 py-4 rounded-full text-xs font-semibold tracking-widest uppercase
        flex items-center gap-3 justify-center
        ${isPrimary 
          ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
          : 'bg-transparent border border-white/20 text-white backdrop-blur-md'}
        ${className}
      `}
    >
      {/* Background Shine Effect */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${isPrimary ? 'bg-gray-100' : 'bg-white/10'}`} />
      
      {/* Text Content */}
      <span className="relative z-10">{children}</span>
      
      {isPrimary && (
        <motion.span 
          initial={{ x: 0, opacity: 0.5 }}
          whileHover={{ x: 3, opacity: 1 }}
          className="relative z-10"
        >
          <ArrowRight size={14} />
        </motion.span>
      )}
      
      {/* Subtle Glow on Hover for Primary */}
      {isPrimary && (
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-xl bg-white pointer-events-none" />
      )}
    </motion.button>
  );
};