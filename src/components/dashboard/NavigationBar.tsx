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

type UserRole = 'staff' | 'admin' | 'owner';

interface NavigationBarProps {
  role?: UserRole;
}

export default function NavigationBar({ role = 'staff' }: NavigationBarProps) {
  const pathname = usePathname();

  // Define navigation items based on role
  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        label: 'Home',
        iconSrc: '/assets/icons/home.svg',
        href: role === 'staff' ? '/staff/dashboard' : `/${role}/dashboard`,
      },
      {
        label: 'Vehicle',
        iconSrc: '/assets/icons/vehicle.svg',
        href: role === 'staff' ? '/staff/vehicles' : `/${role}/vehicles`,
      },
    ];

    // Add Orders for admin/owner roles (3rd position)
    if (role === 'admin' || role === 'owner') {
      baseItems.push({
        label: 'Orders',
        iconSrc: '/assets/icons/order.svg',
        href: `/${role}/orders`,
      });
    }

    // Add Inquiry for all roles
    baseItems.push({
      label: 'Inquiry',
      iconSrc: '/assets/icons/inquiry.svg',
      href: role === 'staff' ? '/staff/inquiries' : `/${role}/inquiries`,
    });

    return baseItems;
  };

  const navItems = getNavItems();
  const itemCount = navItems.length;
  

  return (
    <div 
      className="md:hidden fixed bg-[#e8ebf2] flex gap-[6px] items-start bottom-0 z-50 
                 w-full max-w-[500px] 
                 left-1/2 -translate-x-1/2
                 px-[10px] sm:px-[16px] py-[6px] "
    >
      <div className="flex flex-1 items-center justify-between">
        {navItems.map((item, index) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex flex-col h-[70px] sm:h-[83px] items-center justify-center overflow-clip rounded-[16px] flex-1 max-w-[85px] ${
                isActive ? 'bg-[#e5383b]' : 'cursor-pointer'
              }`}
            >
              <div className="flex flex-col gap-[6px] sm:gap-[8px] items-center px-[4px] sm:px-[8px] py-[16px] sm:py-[20px]">
                <div className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] relative">
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
                  className={`font-normal text-[12px] sm:text-[14px] text-center whitespace-nowrap ${
                    isActive ? 'text-white' : 'text-[#2b2b2b]'
                  }`}
                >
                  {item.label}
                </p>
              </div>
            </Link>
          );
        })}
        {/* Floating Action Button - Links to AI Assistant */}
        <Link href="/ai-assistant" className="relative w-[60px] h-[60px] sm:w-[78px] sm:h-[78px] shrink-0 ml-[8px]">
          <div className="absolute inset-[-57.69%]">
            <Image
              src="/assets/icons/fab-circle.svg"
              alt="AI Assistant"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[18px] h-[18px] sm:w-[23px] sm:h-[23px] relative">
              <Image
                src="/assets/icons/plus.svg"
                alt="AI Assistant"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
