
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '', delay = 0 }) => {
  return (
    // Added pb-2 to allow descenders (g, p, ç) to be visible without getting cut off
    <div className={`overflow-hidden pb-2 -mb-2 ${className}`}>
      <motion.div
        initial={{ y: "110%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {text}
      </motion.div>
    </div>
  );
};
