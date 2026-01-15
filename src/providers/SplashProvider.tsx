'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import SplashScreen from '../components/SplashScreen';

interface SplashContextType {
  showSplash: () => void;
  hideSplash: () => void;
  isSplashVisible: boolean;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

interface SplashProviderProps {
  children: React.ReactNode;
  /** Duration in milliseconds before the splash screen auto-hides */
  duration?: number;
  /** Whether to show splash screen on initial load */
  showOnMount?: boolean;
}

export function SplashProvider({
  children,
  duration = 3000,
  showOnMount = true,
}: SplashProviderProps) {
  // Always show splash on mount/refresh when showOnMount is true
  const [isVisible, setIsVisible] = useState(showOnMount);
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleFinish = useCallback(() => {
    setIsVisible(false);
    setHasCompleted(true);
  }, []);

  const showSplash = useCallback(() => {
    setIsVisible(true);
    setHasCompleted(false);
  }, []);

  const hideSplash = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <SplashContext.Provider value={{ showSplash, hideSplash, isSplashVisible: isVisible }}>
      {showOnMount && !hasCompleted && (
        <SplashScreen 
          isVisible={isVisible} 
          duration={duration} 
          onFinish={handleFinish} 
        />
      )}
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash() {
  const context = useContext(SplashContext);
  if (context === undefined) {
    throw new Error('useSplash must be used within a SplashProvider');
  }
  return context;
}
