'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  iconSrc: string;
  href: string;
}

export default function NavigationBar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: 'Home',
      iconSrc: '/assets/icons/home.svg',
      href: '/dashboard',
    },
    {
      label: 'Vehicle',
      iconSrc: '/assets/icons/vehicle.svg',
      href: '/vehicles',
    },
    {
      label: 'Inquiry',
      iconSrc: '/assets/icons/inquiry.svg',
      href: '/inquiries',
    },
  ];

  return (
    <div className="fixed bg-[#e8ebf2] flex gap-[10px] items-start left-0 px-[16px] py-[17px] bottom-0 w-full max-w-[440px] z-50">
      <div className="flex flex-1 gap-[35px] items-center">
        {navItems.map((item, index) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex flex-col h-[83px] items-center justify-center overflow-clip rounded-[16px] w-[75px] ${
                isActive ? 'bg-[#e5383b]' : 'cursor-pointer'
              }`}
            >
              <div className="flex flex-col gap-[8px] items-center px-[8px] py-[24px]">
                <div className="w-[18px] h-[18px] relative">
                  <Image
                    src={item.iconSrc}
                    alt={item.label}
                    fill
                    className="object-contain"
                    style={{
                      filter: isActive ? 'brightness(0) invert(1)' : 'none'
                    }}
                  />
                </div>
                <p
                  className={`font-normal text-[14px] text-center tracking-[-1px] ${
                    isActive ? 'text-white' : 'text-[#2b2b2b]'
                  }`}
                >
                  {item.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      {/* Floating Action Button */}
      <div className="relative w-[78px] h-[78px] shrink-0">
        <div className="absolute inset-[-57.69%]">
          <Image
            src="/assets/icons/fab-circle.svg"
            alt="Add"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[23px] h-[23px] relative">
            <Image
              src="/assets/icons/plus.svg"
              alt="Add"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
