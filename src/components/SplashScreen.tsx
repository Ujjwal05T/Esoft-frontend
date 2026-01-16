'use client';

import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  /** Duration in milliseconds before the splash screen fades out */
  duration?: number;
  /** Callback when splash screen finishes */
  onFinish?: () => void;
  /** Whether to show the splash screen */
  isVisible?: boolean;
}

export default function SplashScreen({
  duration = 1000, // 3 seconds total
  onFinish,
  isVisible = true,
}: SplashScreenProps) {
  const [isShowing, setIsShowing] = useState(isVisible);
  const [isFading, setIsFading] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setIsShowing(false);
      return;
    }

    setIsShowing(true);
    
    // Show logo immediately with fade effect
    const logoTimer = setTimeout(() => {
      setIsLogoVisible(true);
    }, 200);

    // Start fading out after duration - fade animation duration (logo visible for ~1.8s before fade starts)
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, duration - 800);

    // Hide completely after duration
    const hideTimer = setTimeout(() => {
      setIsShowing(false);
      onFinish?.();
    }, duration);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, isVisible, onFinish]);

  if (!isShowing) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5383B',
        zIndex: 99999,
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      {/* Logo with fade-in effect */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logos/etna-logo-white.svg"
        alt="ETNA SPARES"
        width={160}
        height={90}
        style={{
          display: 'block',
          opacity: isLogoVisible ? 1 : 0,
          transform: isLogoVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
      />
    </div>
  );
}
