'use client';

import React, { useState } from 'react';

interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: 'text' | 'tel' | 'number';
}

export default function FloatingInput({ 
  label, 
  value, 
  onChange, 
  required = false, 
  type = 'text' 
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const showFloatingLabel = isFocused || hasValue;

  return (
    <div className="relative w-full">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full h-[56px] px-4 border rounded-[4px] text-[16px] text-[#1a1a1a] bg-white
          outline-none transition-all duration-200
          ${hasValue || isFocused ? 'border-[#e5383b]' : 'border-[#9ca3af]'}`}
        placeholder={!showFloatingLabel ? label : ''}
        style={{ paddingTop: showFloatingLabel ? '1px' : '0' }}
      />
      {showFloatingLabel && (
        <label
          className="absolute left-3 px-1 bg-white text-[12px] text-[#666] transition-all duration-200"
          style={{ top: '-8px' }}
        >
          {label}{required && hasValue ? '*' : ''}
        </label>
      )}
    </div>
  );
}
