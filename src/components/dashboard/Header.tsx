import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <div className="fixed bg-white h-[70px] left-0 top-0 w-full max-w-[440px] z-50">
      

      {/* Menu Bar */}
      <div className="bg-white flex items-center justify-between px-[16px] py-[10px] w-full">
        <div className="flex gap-[8px] items-center">
          {/* Hamburger Menu */}
          <button className="h-[20px] w-[30px] relative">
            <Image
              src="/assets/icons/hamburger.svg"
              alt="Menu"
              fill
              className="object-contain"
            />
          </button>
          {/* Logo */}
          <div className="flex items-center h-[36px] w-[66px] relative">
            <Image
              src="/assets/logos/etna-logo.svg"
              alt="ETNA SPARES"
              fill
              className="object-contain"
            />
          </div>
        </div>
        {/* Search Icon */}
        <button className="w-[24px] h-[24px] relative">
          <Image
            src="/assets/icons/search.svg"
            alt="Search"
            fill
            className="object-contain"
          />
        </button>
      </div>
    </div>
  );
}
