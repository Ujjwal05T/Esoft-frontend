'use client';

import React, { useEffect, useState } from 'react';

interface ContactETNAOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// WhatsApp Icon
const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.6 6.32C16.12 4.82 14.12 4 12 4C7.58 4 4 7.58 4 12C4 13.46 4.39 14.89 5.12 16.12L4 20L8 18.88C9.2 19.55 10.58 19.9 12 19.9C16.42 19.9 20 16.32 20 11.9C20 9.78 19.18 7.78 17.6 6.32ZM12 18.53C10.71 18.53 9.46 18.2 8.36 17.58L8.08 17.42L5.72 18.08L6.4 15.78L6.22 15.48C5.54 14.34 5.18 13.04 5.18 11.7C5.18 8.23 8.03 5.38 12.01 5.38C13.89 5.38 15.66 6.1 16.99 7.44C18.32 8.78 19.02 10.56 19.02 12.44C19 15.91 16.15 18.76 12.17 18.76L12 18.53ZM15.88 13.71C15.67 13.6 14.61 13.08 14.42 13.01C14.23 12.94 14.09 12.9 13.95 13.12C13.81 13.34 13.39 13.82 13.27 13.96C13.15 14.1 13.02 14.12 12.81 14.01C11.68 13.45 10.94 13.01 10.19 11.71C9.99 11.37 10.39 11.4 10.76 10.66C10.83 10.52 10.79 10.4 10.73 10.29C10.67 10.18 10.23 9.12 10.06 8.68C9.89 8.26 9.72 8.31 9.59 8.31H9.22C9.08 8.31 8.86 8.36 8.67 8.58C8.48 8.8 7.93 9.32 7.93 10.38C7.93 11.44 8.69 12.46 8.8 12.6C8.91 12.74 10.22 14.8 12.18 15.73C13.56 16.34 14.1 16.39 14.79 16.28C15.21 16.22 16.07 15.76 16.24 15.24C16.41 14.72 16.41 14.28 16.35 14.18C16.29 14.08 16.15 14.02 15.93 13.91L15.88 13.71Z"
      fill="#25D366"
    />
  </svg>
);

// Gmail Icon
const GmailIcon = () => (
  <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4L16 14L30 4V20H2V4Z" fill="#EA4335" />
    <path d="M30 4L16 14L2 4" stroke="#FBBC04" strokeWidth="2" />
    <path d="M2 4H30V6L16 16L2 6V4Z" fill="#4285F4" />
    <path d="M2 4L16 14V24L2 14V4Z" fill="#34A853" />
    <path d="M30 4L16 14V24L30 14V4Z" fill="#C5221F" />
    <rect x="2" y="4" width="28" height="16" rx="2" stroke="#EA4335" strokeWidth="0" fill="none" />
    <path d="M2 6V4C2 2.89543 2.89543 2 4 2H28C29.1046 2 30 2.89543 30 4V6L16 16L2 6Z" fill="#EA4335" />
    <path d="M2 4C2 2.89543 2.89543 2 4 2H28C29.1046 2 30 2.89543 30 4V5L16 15L2 5V4Z" fill="#FBBC04" />
    <path d="M16 15L2 5V20C2 21.1046 2.89543 22 4 22H28C29.1046 22 30 21.1046 30 20V5L16 15Z" fill="white" />
    <path d="M2 5L16 15L30 5" stroke="#EA4335" strokeWidth="2" fill="none" />
    <path d="M2 5V20C2 21.1046 2.89543 22 4 22H6V8L16 15L26 8V22H28C29.1046 22 30 21.1046 30 20V5L16 15L2 5Z" fill="#C5221F" fillOpacity="0.1" />
  </svg>
);

// Simplified Gmail Icon
const EmailIcon = () => (
  <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="26" height="20" rx="2" fill="white" stroke="#EA4335" strokeWidth="1.5" />
    <path d="M1 3L14 13L27 3" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1 3L14 13L27 3" fill="none" />
    <path d="M1.5 2.5L14 12L26.5 2.5" stroke="#34A853" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M1 19L10 11" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M27 19L18 11" stroke="#FBBC04" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Phone Icon
const PhoneCallIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.3 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z"
      stroke="#4992FF"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
  </svg>
);

// Close Icon
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface ContactOptionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const ContactOption: React.FC<ContactOptionProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-center gap-3 py-4 px-6 border border-[#E5383B] rounded-[10px] bg-white transition-all hover:bg-red-50 active:scale-[0.98]"
    style={{ fontFamily: "'Inter', sans-serif" }}
  >
    <div className="w-8 h-6 flex items-center justify-center">
      {icon}
    </div>
    <span className="text-[20px] font-normal text-[#373737] leading-[22px]">
      {label}
    </span>
  </button>
);

export default function ContactETNAOverlay({
  isOpen,
  onClose,
}: ContactETNAOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Contact details - can be customized
  const contactDetails = {
    whatsapp: '+917067310291',
    email: 'support@etna.com',
    phone: '+919876543210',
  };

  // Handle visibility and animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
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

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hello, I need assistance.');
    window.open(`https://wa.me/${contactDetails.whatsapp}?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    window.open(`mailto:${contactDetails.email}?subject=Support Request`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${contactDetails.phone}`, '_self');
  };

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
        className="relative bg-white rounded-[16px] shadow-lg overflow-hidden w-full max-w-[340px] p-6"
        style={{
          transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
          transition: 'transform 0.3s ease-out',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-[32px] h-[32px] bg-[#E5383B] rounded-full flex items-center justify-center transition-all hover:bg-[#c62f32] active:scale-95"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        {/* Title */}
        <h2
          className="text-center text-[18px] font-semibold text-black mt-8 mb-6"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Contact ETNA
        </h2>

        {/* Contact Options */}
        <div className="flex flex-col gap-4">
          <ContactOption
            icon={<WhatsAppIcon />}
            label="Whatsapp"
            onClick={handleWhatsApp}
          />
          <ContactOption
            icon={<EmailIcon />}
            label="Email"
            onClick={handleEmail}
          />
          <ContactOption
            icon={<PhoneCallIcon />}
            label="Call"
            onClick={handleCall}
          />
        </div>
      </div>
    </div>
  );
}
