'use client';

import { useState } from 'react';

interface NavigationOption {
  label: string;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  navigationOptions?: NavigationOption[];
}

export default function FloatingActionButton({ navigationOptions = [] }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Gradient Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 pointer-events-auto"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)'
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="fixed bottom-[210px] left-1/2 -translate-x-1/2 max-w-[440px] w-full z-40 pointer-events-none">
        <div className="relative w-full">
          <div className="absolute right-[16px] pointer-events-auto">
            {/* Navigation Options */}
            {isOpen && navigationOptions.length > 0 && (
              <div className="absolute bottom-[90px] right-0 flex flex-col gap-[12px] mb-[8px]">
                {navigationOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      option.onClick();
                      setIsOpen(false);
                    }}
                    className="bg-white rounded-[19px] px-[14px] py-[7px] shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-[15px] text-black whitespace-nowrap">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Main FAB */}
            <button
              onClick={toggleMenu}
              className="w-[74px] h-[74px] rounded-full  bg-[#e5383b]  shadow-lg flex items-center justify-center transition-transform hover:scale-105"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform"
                style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                <path
                  d="M16 8v16M8 16h16"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
