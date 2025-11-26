
import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, animate } from 'framer-motion';
import { Scene3D } from './components/Scene3D';
import { Button } from './components/Button';
import { AnimatedText } from './components/AnimatedText';
import { FeatureCard } from './components/FeatureCard';
import { PaletteSelector } from './components/PaletteSelector';
import { ImageCard } from './components/ImageCard';
import { SmoothScroll } from './components/SmoothScroll';
import { Palette } from './types';
import { Download } from 'lucide-react';

// Updated palettes for Water/Liquid look - softer colors
const PALETTES: Palette[] = [
  { id: 'aether', name: 'Aqua', color: '#aaddff', distortion: 0.5, speed: 2, roughness: 0, metalness: 0 },
  { id: 'onyx', name: 'Ink', color: '#1a1a2e', distortion: 0.4, speed: 1.5, roughness: 0, metalness: 0 },
  { id: 'gold', name: 'Nectar', color: '#ffcc00', distortion: 0.6, speed: 3, roughness: 0, metalness: 0 },
  { id: 'neon', name: 'Plasma', color: '#00ffcc', distortion: 0.7, speed: 4, roughness: 0, metalness: 0 },
];

const AnimatedCounter = () => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(1) + "%");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(count, 99.9, { 
        duration: 3.5, 
        ease: [0.22, 1, 0.36, 1] 
      });
      return controls.stop;
    }
  }, [isInView]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const smoothScroll = useSpring(scrollYProgress, { mass: 0.1, stiffness: 100, damping: 20 });
  
  const [activePalette, setActivePalette] = useState<Palette>(PALETTES[0]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <div className="bg-premium-black min-h-screen w-full relative selection:bg-white selection:text-black font-sans pb-10">
      
      {/* Smooth Scrolling Engine */}
      <SmoothScroll />

      {/* Navigation - Absolute & Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-8 flex justify-between items-center mix-blend-difference pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
          className="text-white font-bold text-xl tracking-[0.2em] uppercase"
        >
          Aether
        </motion.div>
        
        <div className="flex items-center gap-8 pointer-events-auto">
          {deferredPrompt && (
            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleInstallClick}
              className="flex items-center gap-2 text-white text-xs tracking-widest uppercase hover:text-white/70 transition-colors hover-line mr-4"
            >
              <Download size={12} />
              <span>Instalar App</span>
            </motion.button>
          )}

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1, delay: 0.3 }}
          >
             <button className="text-white text-xs tracking-widest uppercase hover:text-white/70 transition-colors hover-line">Menu</button>
          </motion.div>
        </div>
      </nav>

      {/* --- SECTION 1: HERO --- */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Scene3D activePalette={activePalette} />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-8 md:px-24 flex flex-col items-center text-center pointer-events-none">
           <div className="overflow-hidden mb-4">
             <motion.h2 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="text-white/60 text-xs md:text-sm tracking-[0.4em] uppercase font-light"
             >
              A Próxima Evolução
             </motion.h2>
           </div>
           
           <div className="overflow-hidden mb-8">
            <motion.h1 
              initial={{ y: "120%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-9xl font-semibold tracking-tighter text-white mix-blend-overlay"
            >
              ARTIFACT
            </motion.h1>
           </div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 1 }}
             className="pointer-events-auto flex flex-col items-center gap-12"
           >
             <Button variant="secondary">Explorar o Vazio</Button>
           </motion.div>
        </div>

        {/* Palette Selector - Floating at bottom */}
        <motion.div 
          className="absolute bottom-24 z-20 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <PaletteSelector 
            palettes={PALETTES} 
            activePalette={activePalette} 
            onSelect={setActivePalette} 
          />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* --- SECTION 2: VISUAL PRESENTATION --- */}
      <section className="relative w-full pt-40 pb-20 bg-premium-black z-20 rounded-t-3xl border-t border-white/5">
        <div className="container mx-auto px-8 md:px-24">
          
          {/* Side-by-Side Intro Layout */}
          {/* Using flex-row on desktop to put text and circle next to each other */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24 mb-80">
             
             {/* Text Content - Aligned Left on Desktop */}
             <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/2">
               <AnimatedText 
                text="Redefinindo a"
                className="text-lg md:text-xl text-white/50 mb-2 tracking-[0.2em] uppercase font-light"
               />
               <AnimatedText 
                text="Percepção Digital."
                className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-8 pb-4" 
                delay={0.1}
               />
               <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="text-lg text-white/60 font-light leading-loose max-w-lg"
               >
                 Uma aula magna em interação sem peso. O Artefato não é apenas um objeto; é uma entidade viva que responde à sua presença, borrando a linha entre o digital e o físico.
               </motion.p>
             </div>
             
             {/* 99.9% Circle Element - Aligned Right/Center on Desktop */}
             <div className="flex justify-center md:w-1/2">
                <motion.div 
                  style={{ y }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  className="w-64 h-64 md:w-80 md:h-80 aspect-square rounded-full border border-white/10 relative flex items-center justify-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-full animate-pulse" />
                    <div className="text-center relative z-10 flex flex-col items-center justify-center">
                      <span className="block text-5xl md:text-7xl font-thin text-white/40 mb-2 transition-colors duration-300 hover:text-white tabular-nums">
                        <AnimatedCounter />
                      </span>
                      <span className="text-sm uppercase tracking-widest text-white/40 block">Pureza</span>
                    </div>
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                </motion.div>
             </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <FeatureCard 
              index={0}
              title="Dinâmica de Fluidos"
              description="Motor de física em tempo real renderizando comportamentos de metal líquido a 120fps."
            />
            <FeatureCard 
              index={1}
              title="Computação Espacial"
              description="Interações imersivas que se adaptam à rotação do objeto e à velocidade do cursor."
            />
             <FeatureCard 
              index={2}
              title="Refração de Luz"
              description="Simulação de iluminação Ray-traced calculando cáusticas e reflexos internos instantaneamente."
            />
          </div>
            
          {/* New Full Width Image Card with Spacing */}
          <div className="mt-24">
            <ImageCard />
          </div>

          {/* Minimalist Footer - Compacted */}
          <div className="w-full mt-20 border-t border-white/5 pt-8 flex flex-col items-center justify-center text-center">
            <div className="w-6 h-6 rounded-full border border-white/20 bg-white/5 mb-4" />
            <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase">
              © 2024 Todos os direitos reservados.
            </p>
             <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase mt-1">
              Criado por Matheus Araújo
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default App;