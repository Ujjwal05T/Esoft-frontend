'use client';

import React from 'react';
import { SplashProvider } from '../providers/SplashProvider';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SplashProvider duration={3000} showOnMount={true}>
      {children}
    </SplashProvider>
  );
}
