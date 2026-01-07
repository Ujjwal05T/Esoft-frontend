import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ResponsiveContainer component that:
 * - On mobile: Full width (looks exactly as before)
 * - On tablet/desktop: Centered with max-width and padding
 */
export default function ResponsiveContainer({ children, className = '' }: ResponsiveContainerProps) {
  return (
    <div className={`w-full mx-auto ${className}`}>
      {/* Mobile: full width, Tablet: max 768px, Desktop: max 1024px */}
      <div className="w-full max-w-[100vw] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
        {children}
      </div>
    </div>
  );
}
