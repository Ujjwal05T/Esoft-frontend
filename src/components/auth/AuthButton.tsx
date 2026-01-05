import React from 'react';

interface AuthButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export default function AuthButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  icon,
}: AuthButtonProps) {
  const baseStyles = 'h-[48px] px-[24px] rounded-[8px] font-semibold text-[14px] flex items-center justify-center gap-2 transition-all duration-200';

  const variantStyles = {
    primary: 'bg-[#e5383b] text-white hover:bg-[#c62f32] active:bg-[#a82628] disabled:bg-[#d4d9e3] disabled:text-[#99a2b6]',
    secondary: 'bg-[#2294f2] text-white hover:bg-[#1c7acc] active:bg-[#1661a8] disabled:bg-[#d4d9e3] disabled:text-[#99a2b6]',
    outline: 'bg-white border-2 border-[#d4d9e3] text-[#2b2b2b] hover:border-[#e5383b] hover:text-[#e5383b] disabled:border-[#d4d9e3] disabled:text-[#99a2b6]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
