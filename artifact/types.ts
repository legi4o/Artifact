import React from 'react';

export interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  index: number;
}

export interface Palette {
  name: string;
  id: string;
  color: string;
  distortion: number;
  speed: number;
  roughness: number;
  metalness: number;
}
