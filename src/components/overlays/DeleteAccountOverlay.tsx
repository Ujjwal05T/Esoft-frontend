'use client';

import React, { useEffect, useState } from 'react';

interface DeleteAccountOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Delete Icon SVG
const DeleteIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.85 9.14L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.33 16.5H13.66"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 12.5H14.5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function DeleteAccountOverlay({
  isOpen,
  onClose,
  onConfirm,
}: DeleteAccountOverlayProps) {
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

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{
        zIndex: 9999,
        opacity: isAnimating ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Dialog Card */}
      <div
        className="relative bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-[340px]"
        style={{
          transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
          transition: 'transform 0.3s ease-out',
          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.5)',
        }}
      >
        {/* Red Top Border */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#e5383b]" />

        {/* Content */}
        <div className="flex flex-col items-center gap-[18px] px-[14px] py-[16px] pt-[20px]">
          {/* Delete Icon Circle */}
          <div className="w-[48px] h-[48px] bg-[#e5383b] rounded-full flex items-center justify-center">
            <DeleteIcon />
          </div>

          {/* Text Content */}
          <div className="flex flex-col items-center gap-[4px] text-center">
            <h3
              className="text-[16px] font-semibold text-black leading-[22px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Delete Account
            </h3>
            <p
              className="text-[14px] font-medium text-[rgba(60,60,67,0.6)] leading-[22px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Are you sure you want to delete account ?
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-[10px] w-full mt-[6px]">
            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="flex-1 h-[62px] bg-white border border-[#d9d9d9] rounded-[10px] flex items-center justify-center transition-colors hover:bg-gray-50"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span className="text-[16px] font-semibold text-[rgba(60,60,67,0.6)] leading-[22px]">
                Cancel
              </span>
            </button>

            {/* Delete Account Button */}
            <button
              onClick={onConfirm}
              className="flex-1 h-[62px] bg-[#e5383b] rounded-[10px] flex items-center justify-center transition-all hover:bg-[#c62f32] active:scale-[0.98]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span className="text-[16px] font-semibold text-white leading-[22px]">
                Delete Account
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
