
import React from 'react';
import { motion } from 'framer-motion';

export const ImageCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ 
        scale: 1.02,
        borderColor: 'rgba(255,255,255,0.4)',
        boxShadow: '0 25px 50px -12px rgba(255, 255, 255, 0.05)',
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      className="col-span-1 md:col-span-3 h-[400px] w-full max-w-5xl mx-auto rounded-2xl overflow-hidden relative group border border-white/20 cursor-pointer"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
          alt="Abstract Texture"
          className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-700 ease-out"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
      
      {/* Hover Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute bottom-8 left-8 right-8 z-10">
        <h3 className="text-2xl font-medium text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Materia Escura</h3>
        <p className="text-white/60 text-sm max-w-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          Explorando texturas táteis que desafiam o vácuo digital. Uma composição visual de alta fidelidade.
        </p>
      </div>
    </motion.div>
  );
};
