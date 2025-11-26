
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Palette } from '../types';

interface ArtifactProps {
  palette: Palette;
}

const Artifact: React.FC<ArtifactProps> = ({ palette }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const [hovered, setHover] = useState(false);
  
  // Entrance animation state
  const scaleRef = useRef(0);
  
  // Internal state for smooth transitions
  const targetColor = useMemo(() => new THREE.Color(palette.color), [palette.color]);
  const currentColor = useRef(new THREE.Color(palette.color));

  const handlePointerOver = () => {
    setHover(true);
  };

  const handlePointerOut = () => {
    setHover(false);
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Entrance Animation: Smoothly lerp scale from 0 to 2.2
    if (scaleRef.current < 2.2) {
      scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 2.2, 0.02);
    }

    if (meshRef.current) {
      // Apply entrance scale
      const currentScale = scaleRef.current;
      meshRef.current.scale.set(currentScale, currentScale, currentScale);

      // Rotation Logic: Extremely subtle and slow for "Natural" feel
      // Reduced sensitivity to mouse significantly (0.02) for "heavy water" feel
      const rotationX = hovered ? state.mouse.y * 0.02 : Math.sin(time * 0.05) * 0.02;
      const rotationY = hovered ? state.mouse.x * 0.02 : time * 0.02;
      
      // Slower interpolation (0.005) for heavier feel
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, rotationX, 0.005);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, rotationY, 0.005);
    }

    if (materialRef.current) {
      // Color Transition
      currentColor.current.lerp(targetColor, 0.02);
      materialRef.current.color = currentColor.current;

      // Distortion - Gentle fluid movement
      // Reduced breathing amplitude
      const hoverDistortBoost = hovered ? 0.05 : 0;
      const breathingDistort = palette.distortion + hoverDistortBoost + Math.sin(time * 0.2) * 0.02;
      
      materialRef.current.distort = THREE.MathUtils.lerp(
        materialRef.current.distort, 
        breathingDistort, 
        0.01
      );

      // Speed - Very gentle change
      materialRef.current.speed = THREE.MathUtils.lerp(
        materialRef.current.speed,
        hovered ? palette.speed * 1.05 : palette.speed,
        0.01
      );
      
      // Water Properties Animation
      materialRef.current.roughness = THREE.MathUtils.lerp(materialRef.current.roughness, 0, 0.05);
      materialRef.current.metalness = THREE.MathUtils.lerp(materialRef.current.metalness, 0, 0.05);
      
      // Subtle emissive pulse
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity,
        hovered ? 0.15 : 0.05,
        0.02
      );
    }
  });

  return (
    <Float
      speed={1} 
      rotationIntensity={0.05} 
      floatIntensity={0.2} 
    >
      <Sphere 
        args={[1, 128, 128]} 
        ref={meshRef} 
        onPointerOver={handlePointerOver} 
        onPointerOut={handlePointerOut}
      >
        <MeshDistortMaterial
          ref={materialRef}
          color={palette.color}
          attach="material"
          distort={palette.distortion}
          speed={palette.speed}
          
          // Water / Liquid Properties - Dense Water Simulation
          roughness={0} 
          metalness={0.02} 
          transmission={1}  // Fully transmissive
          thickness={0.5}   // Dense refraction volume
          ior={1.33}        // Index of Refraction for water
          chromaticAberration={0.04} // Prism effect for density
          transparent={true}
          opacity={1}
          
          bumpScale={0.005}
          clearcoat={1}
          clearcoatRoughness={0}
          radius={1}
          
          // Internal Glow (Subtle)
          emissive={palette.color}
          emissiveIntensity={0.05}
        />
      </Sphere>
    </Float>
  );
};

interface Scene3DProps {
  activePalette: Palette;
}

export const Scene3D: React.FC<Scene3DProps> = ({ activePalette }) => {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        
        {/* Environment: High blur for abstract lighting */}
        <Environment preset="city" blur={1} background={false} />
        
        {/* Lighting setup for Water */}
        <ambientLight intensity={0.5} color="#ffffff" />
        
        {/* Rim light/Backlight to show transparency */}
        <spotLight 
          position={[0, 10, -10]} 
          angle={0.5} 
          penumbra={1} 
          intensity={3} 
          color="#ffffff"
        />
        
        {/* Main highlight */}
        <pointLight 
          position={[-10, -5, 10]} 
          intensity={1} 
          color={activePalette.color} 
        />
        
        {/* Specular fill */}
        <pointLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          color="white" 
        />

        <Artifact palette={activePalette} />
      </Canvas>
    </div>
  );
};
