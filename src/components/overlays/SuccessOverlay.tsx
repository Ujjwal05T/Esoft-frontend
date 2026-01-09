'use client';

import React, { useEffect, useState } from 'react';

interface SuccessOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  autoCloseDelay?: number; // in milliseconds
}

export default function SuccessOverlay({
  isOpen,
  onClose,
  message = 'REQUEST SENT',
  autoCloseDelay = 2000,
}: SuccessOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle visibility and animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to trigger animation
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto close after delay
  useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDelay, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 9999,
        opacity: isAnimating ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      {/* Full screen red background */}
      <div
        className="absolute inset-0 bg-[#e5383b] flex flex-col items-center justify-center"
        style={{
          transform: isAnimating ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Checkmark Icon with animation */}
        <div
          className="mb-[24px]"
          style={{
            transform: isAnimating ? 'scale(1)' : 'scale(0)',
            opacity: isAnimating ? 1 : 0,
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s, opacity 0.5s ease-out 0.2s',
          }}
        >
          <div className="w-[61px] h-[61px] bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 16L14 22L24 10"
                stroke="#e5383b"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Message Text */}
        <p
          className="text-white text-[20px] font-medium tracking-[1px] text-center"
          style={{
            fontFamily: "'Inter', sans-serif",
            transform: isAnimating ? 'translateY(0)' : 'translateY(10px)',
            opacity: isAnimating ? 1 : 0,
            transition: 'transform 0.4s ease-out 0.3s, opacity 0.4s ease-out 0.3s',
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
