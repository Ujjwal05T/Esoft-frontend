'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DeleteAccountOverlay from '../overlays/DeleteAccountOverlay';
import ContactETNAOverlay from '../overlays/ContactETNAOverlay';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, href, onClick, variant = 'default' }) => {
  const content = (
    <div
      className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all hover:bg-[#c62f32] ${
        variant === 'danger' ? 'text-white' : 'text-white'
      }`}
      onClick={onClick}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {icon}
      </div>
      <span
        className="text-[16px] font-medium"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );

  // if (href) {
  //   return <Link href={href}>{content}</Link>;
  // }

  return content;
};

// SVG Icons as components
const PersonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
      fill="white"
    />
    <path
      d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z"
      fill="white"
    />
  </svg>
);

const StaffIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z"
      fill="white"
    />
    <path
      d="M14.08 14.15C11.29 12.29 6.74 12.29 3.93 14.15C2.66 14.99 1.96 16.11 1.96 17.31C1.96 18.51 2.66 19.63 3.92 20.46C5.32 21.4 7.16 21.87 9 21.87C10.84 21.87 12.68 21.4 14.08 20.46C15.34 19.62 16.04 18.51 16.04 17.3C16.03 16.1 15.34 14.98 14.08 14.15Z"
      fill="white"
    />
    <path
      d="M19.9901 7.34001C20.1501 9.28001 18.7701 10.98 16.8601 11.21C16.8501 11.21 16.8501 11.21 16.8401 11.21H16.8101C16.7501 11.21 16.6901 11.21 16.6401 11.23C15.6701 11.28 14.7801 10.97 14.1101 10.4C15.1401 9.48001 15.7301 8.10001 15.6101 6.60001C15.5401 5.79001 15.2601 5.05001 14.8401 4.42001C15.2201 4.23001 15.6601 4.11001 16.1101 4.07001C18.0701 3.90001 19.8201 5.36001 19.9901 7.34001Z"
      fill="white"
    />
    <path
      d="M21.99 16.59C21.91 17.56 21.29 18.4 20.25 18.97C19.25 19.52 17.99 19.78 16.74 19.75C17.46 19.1 17.88 18.29 17.96 17.43C18.06 16.19 17.47 15 16.29 14.05C15.62 13.52 14.84 13.1 13.99 12.79C16.2 12.15 18.98 12.58 20.69 13.96C21.61 14.7 22.08 15.63 21.99 16.59Z"
      fill="white"
    />
  </svg>
);

const ReportIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z"
      stroke="white"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5"
      stroke="white"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 13H12"
      stroke="white"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 17H16"
      stroke="white"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.3 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z"
      stroke="white"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
  </svg>
);

const FAQIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
    <path
      d="M9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9C15 10.3127 14.1616 11.4373 13 11.8425V13"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="17" r="1" fill="white" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15 19.92L8.48 13.4C7.71 12.63 7.71 11.37 8.48 10.6L15 4.08"
      stroke="white"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function MobileSidebar({ isOpen, onClose, user }: MobileSidebarProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  const defaultUser = {
    name: 'Alex',
    email: 'alex1234@gmail.com',
    avatar: undefined,
  };

  const currentUser = user || defaultUser;

  const handleDeleteAccountClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Handle the actual account deletion logic here
    console.log('Account deletion confirmed');
    setIsDeleteDialogOpen(false);
    onClose();
    // TODO: Call API to delete account
  };

  const handleContactETNAClick = () => {
    setIsContactDialogOpen(true);
  };

  const menuItems: MenuItemProps[] = [
    {
      icon: <PersonIcon />,
      label: 'My account',
      href: '/owner/account',
    },
    {
      icon: <StaffIcon />,
      label: 'My staff',
      href: '/owner/staff',
    },
    {
      icon: <ReportIcon />,
      label: 'Generate reports',
      href: '/owner/reports',
    },
    {
      icon: <PhoneIcon />,
      label: 'Contact ETNA',
      onClick: handleContactETNAClick,
    },
    {
      icon: <FAQIcon />,
      label: 'FAQs',
      href: '/faqs',
    },
    {
      icon: <DeleteIcon />,
      label: 'Delete account',
      onClick: handleDeleteAccountClick,
      variant: 'danger',
    },
  ];

  return (
    <>
      {/* Delete Account Confirmation Overlay */}
      <DeleteAccountOverlay
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Contact ETNA Overlay */}
      <ContactETNAOverlay
        isOpen={isContactDialogOpen}
        onClose={() => setIsContactDialogOpen(false)}
      />

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-100 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-[#E5383B] z-101 transform transition-transform duration-300 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with user profile */}
        <div className="flex items-center gap-4 px-4 py-6 pt-12">
          {/* Back Arrow */}
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#c62f32] rounded-full transition-colors"
            aria-label="Close sidebar"
          >
            <BackArrowIcon />
          </button>

          {/* User Avatar */}
          <div className="relative w-[56px] h-[56px] rounded-full overflow-hidden border-2 border-white/30 shrink-0">
            {currentUser.avatar ? (
              <Image
                src={currentUser.avatar}
                alt={currentUser.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/20 flex items-center justify-center">
                <span
                  className="text-white text-[24px] font-bold"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex flex-col">
            <span
              className="text-white text-[18px] font-bold"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {currentUser.name}
            </span>
            <span
              className="text-white/80 text-[13px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {currentUser.email}
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-4">
          <div className="flex flex-col">
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                onClick={item.onClick}
                variant={item.variant}
              />
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
