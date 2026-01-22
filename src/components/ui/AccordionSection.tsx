'use client';

import React from 'react';

// Chevron Icon for accordion
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface AccordionSectionProps {
  /** Title displayed in the accordion header */
  title: string;
  /** Whether the accordion is expanded */
  isOpen: boolean;
  /** Callback when accordion is toggled */
  onToggle: () => void;
  /** Content to display when accordion is open */
  children: React.ReactNode;
  /** Optional custom background color for header (default: #e5383b) */
  headerBgColor?: string;
  /** Optional custom text color for header (default: white) */
  headerTextColor?: string;
}

/**
 * AccordionSection Component
 * 
 * A reusable expandable/collapsible section with a colored header.
 * 
 * @example
 * ```tsx
 * <AccordionSection
 *   title="Personal information"
 *   isOpen={isOpen}
 *   onToggle={() => setIsOpen(!isOpen)}
 * >
 *   <p>Content goes here</p>
 * </AccordionSection>
 * ```
 */
export default function AccordionSection({
  title,
  isOpen,
  onToggle,
  children,
  headerBgColor = '#e5383b',
  headerTextColor = 'white',
}: AccordionSectionProps) {
  return (
    <div className="w-full">
      {/* Accordion Header */}
      <button
        onClick={onToggle}
        className="w-full rounded-[8px] px-[16px] py-[14px] flex items-center justify-between transition-colors"
        style={{ backgroundColor: headerBgColor }}
      >
        <span
          className="font-medium text-[15px]"
          style={{ 
            fontFamily: "'Inter', sans-serif",
            color: headerTextColor,
          }}
        >
          {title}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>
      
      {/* Accordion Content */}
      {isOpen && (
        <div 
          className="flex flex-col gap-[16px] pt-[16px]"
          style={{
            animation: 'accordionFadeIn 0.3s ease-out forwards',
          }}
        >
          {children}
        </div>
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes accordionFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
