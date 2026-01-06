'use client';

import React from 'react';
import NavigationBar from '@/components/dashboard/NavigationBar';

// Rocket Icon for Coming Soon
const RocketIcon = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2.5C12 2.5 7.5 7 7.5 13.5C7.5 17.5 5 19.5 5 19.5C5 19.5 8 19.5 9.5 21.5L12 18.5L14.5 21.5C16 19.5 19 19.5 19 19.5C19 19.5 16.5 17.5 16.5 13.5C16.5 7 12 2.5 12 2.5Z"
      stroke="#e5383b"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8C12 8 11 9 11 10.5C11 12 12 13 12 13C12 13 13 12 13 10.5C13 9 12 8 12 8Z"
      stroke="#e5383b"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 16C8.5 16 9.5 14.5 9.5 13.5"
      stroke="#e5383b"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.5 16C15.5 16 14.5 14.5 14.5 13.5"
      stroke="#e5383b"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Motion lines */}
    <path d="M4 8L2 10" stroke="#e5383b" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
    <path d="M20 8L22 10" stroke="#e5383b" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
    <path d="M5 5L3 6" stroke="#e5383b" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
    <path d="M19 5L21 6" stroke="#e5383b" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
  </svg>
);

export default function InquiriesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 mb-[80px]">
        
        {/* Animated Icon Container */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-[#e5383b] opacity-5 rounded-full blur-2xl transform scale-150"></div>
          <RocketIcon />
        </div>

        {/* Title */}
        <h1 
          className="text-[32px] font-bold text-[#1a1a1a] mb-3 text-center tracking-tight"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Something New is<br />
          <span className="text-[#e5383b]">Coming Soon!</span>
        </h1>

        {/* Description */}
        <p 
          className="text-[16px] text-[#828282] text-center max-w-[280px] leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          We are currently working on this feature to bring you a better experience.
        </p>

        {/* Notify Button (Optional visual element) */}
        <div className="mt-10">
          <button 
            className="px-8 py-3 bg-[#f8f8f8] text-[#4c4c4c] font-semibold rounded-full border border-[#f0f0f0] text-[14px] hover:bg-[#f0f0f0] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Notify Me When Ready
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <NavigationBar />
    </div>
  );
}