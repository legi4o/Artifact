
import React, { useEffect } from 'react';
import Lenis from 'lenis';

export const SmoothScroll: React.FC = () => {
  useEffect(() => {
    // Inicialização do Lenis com a "física" do Vortex
    const lenis = new Lenis({
      duration: 1.2, // Quanto maior, mais "pesada" a rolagem
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Essa curva matemática cria a suavidade premium
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false, // Recomendado false para mobile manter o toque natural
      touchMultiplier: 1.5,
    });

    // Loop de animação necessário para o Lenis funcionar
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Limpeza ao desmontar
    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
};
