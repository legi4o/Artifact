
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FeatureCardProps } from '../types';

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, index }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.0, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ 
        y: -12, 
        scale: 1.03, 
        borderColor: 'rgba(255,255,255,0.5)', 
        boxShadow: '0 25px 50px -12px rgba(255, 255, 255, 0.1)',
        transition: { duration: 0.3, ease: "easeOut" } 
      }}
      className="p-8 border border-white/20 bg-white/5 backdrop-blur-md rounded-2xl min-h-[500px] group relative overflow-hidden flex flex-col justify-between transition-colors duration-200 ease-out cursor-pointer"
    >
      {/* Mouse Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-200 group-hover:opacity-100"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`,
        }}
      />

      <div className="relative z-10 mt-4">
        <div className="w-14 h-14 mb-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 font-light text-2xl group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-[0_0_0_0_rgba(255,255,255,0)] group-hover:shadow-[0_0_25px_0_rgba(255,255,255,0.5)]">
          0{index + 1}
        </div>
        <h3 className="text-2xl md:text-3xl font-medium mb-6 tracking-wide text-white group-hover:text-white transition-colors duration-200">{title}</h3>
        <p className="text-white/60 font-light leading-loose group-hover:text-white/90 transition-colors duration-200 text-sm md:text-base pr-4">{description}</p>
      </div>
      
      {/* Visual Decorator at bottom */}
      <div className="w-full h-[1px] bg-white/10 mt-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/50 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
      </div>
    </motion.div>
  );
};
