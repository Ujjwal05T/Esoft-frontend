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

export default function Sidebar() {
  const pathname = usePathname();

  // Detect role from pathname
  const getRole = (): 'owner' | 'staff' | 'admin' => {
    if (pathname.startsWith('/owner')) return 'owner';
    if (pathname.startsWith('/admin')) return 'admin';
    return 'staff';
  };

  const role = getRole();

  // Generate nav items based on role
  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      iconSrc: '/assets/icons/home.svg',
      href: `/${role}/dashboard`,
    },
    {
      label: 'Vehicles',
      iconSrc: '/assets/icons/vehicle.svg',
      href: `/${role}/vehicles`,
    },
    (role === 'owner' ? {
      label: 'Orders',
      iconSrc: '/assets/icons/order.svg',
      href: `/${role}/orders`,
    } : undefined),
    {
      label: 'Inquiries',
      iconSrc: '/assets/icons/inquiry.svg',
      href: `/${role}/inquiries`,
    },
  ].filter((item) => item !== undefined);

  return (
    <div className="hidden md:flex fixed left-0 top-0 h-screen w-[240px] lg:w-[280px] bg-white border-r border-[#e5e5e5] flex-col z-50">
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-[#e5e5e5]">
        <div className="flex items-center gap-3">
          <div className="relative h-[40px] w-[73px]">
            <Image
              src="/assets/logos/etna-logo.svg"
              alt="ETNA SPARES"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6">
        <div className="flex flex-col gap-2">
          {navItems.map((item, index) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#e5383b] text-white'
                    : 'text-[#4c4c4c] hover:bg-[#f5f5f5]'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <div className="w-[20px] h-[20px] relative flex-shrink-0">
                  <Image
                    src={item.iconSrc}
                    alt={item.label}
                    fill
                    className="object-contain"
                    style={{
                      filter: isActive ? 'brightness(0) invert(1)' : 'none',
                    }}
                  />
                </div>
                <span className="font-medium text-[15px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section (Optional) */}
      <div className="px-4 py-4 border-t border-[#e5e5e5]">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-[32px] h-[32px] bg-[#e5383b] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-[14px]" style={{ fontFamily: "'Inter', sans-serif" }}>
              U
            </span>
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Inter', sans-serif" }}>
              User
            </p>
            <p className="text-[12px] text-[#828282]" style={{ fontFamily: "'Inter', sans-serif" }}>
              user@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
