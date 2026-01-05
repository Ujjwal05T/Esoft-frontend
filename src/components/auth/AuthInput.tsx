import React from 'react';

interface AuthInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export default function AuthInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  icon,
}: AuthInputProps) {
  return (
    <div className="w-full">
      <label className="block text-[#2b2b2b] text-[14px] font-medium mb-[8px]">
        {label} {required && <span className="text-[#e5383b]">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#99a2b6]">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-[48px] px-[12px] ${icon ? 'pl-[40px]' : ''}
            border rounded-[8px] text-[14px] text-[#2b2b2b]
            placeholder:text-[#99a2b6] focus:outline-none focus:ring-2
            transition-all ${
              error
                ? 'border-[#e5383b] focus:ring-[#e5383b]/20'
                : 'border-[#d4d9e3] focus:ring-[#2294f2]/20 focus:border-[#2294f2]'
            }`}
        />
      </div>
      {error && (
        <p className="text-[#e5383b] text-[12px] mt-[4px] flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M7 0C3.13 0 0 3.13 0 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm1 10H6V6h2v4zm0-5H6V3h2v2z"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
