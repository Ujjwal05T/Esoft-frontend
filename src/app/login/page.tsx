'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FloatingInput from '@/components/ui/FloatingInput';
import { sendOtp, verifyOtp } from '@/services/otpAuth';
import { getStoredUser } from '@/services/api';

type LoginStep = 
  | 'enter-mobile'     // Step 1: Enter Mobile Number
  | 'verify-otp';      // Step 2: Verify OTP

// OTP Input Component
interface OTPInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

function OTPInput({ value, onChange }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return; // Only allow digits
    
    const newValue = [...value];
    newValue[index] = digit.slice(-1); // Only take last character
    onChange(newValue);

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newValue = [...value];
    for (let i = 0; i < pastedData.length; i++) {
      newValue[i] = pastedData[i];
    }
    onChange(newValue);
    // Focus last filled input or first empty
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  return (
    <div className="flex gap-3 justify-start">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={`w-[48px] text-black h-[48px] text-center text-[18px] font-medium border rounded-[8px]
            outline-none transition-all duration-200
            ${value[index] ? 'border-[#e5383b]' : 'border-[#d1d5db]'}
            focus:border-[#e5383b]`}
        />
      ))}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<LoginStep>('enter-mobile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Mobile Number
  const [mobileNumber, setMobileNumber] = useState('');

  // Step 2: OTP
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

  // Validation checks
  const isMobileValid = mobileNumber.length >= 10;
  const isOtpComplete = otp.every(digit => digit !== '');

  // Handle Get OTP
  const handleGetOTP = async () => {
    if (!isMobileValid) return;
    setError('');
    setLoading(true);

    try {
      const result = await sendOtp(mobileNumber);
      
      if (!result.success) {
        setError(result.error || 'Failed to send OTP. Please try again.');
        return;
      }
      
      setCurrentStep('verify-otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOTP = async () => {
    if (!isOtpComplete) return;
    setError('');
    setLoading(true);

    try {
      const otpCode = otp.join('');
      const result = await verifyOtp(mobileNumber, otpCode);
      
      if (!result.success) {
        setError(result.error || 'Invalid OTP. Please try again.');
        return;
      }
      
      // Get user info and redirect based on role
      const user = getStoredUser();
      if (user) {
        if (user.role === 'owner') {
          router.push('/owner/dashboard');
        } else if (user.role === 'staff') {
          router.push('/staff/dashboard');
        }
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentStep === 'verify-otp') {
      setCurrentStep('enter-mobile');
      setOtp(['', '', '', '', '', '']);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="text-[#1a1a1a]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-[20px] font-semibold text-[#e5383b]">Login</h1>
        </div>
        <button className="text-[#1a1a1a]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4">
        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Enter Mobile Number */}
        {currentStep === 'enter-mobile' && (
          <div className="flex-1 flex flex-col pt-6">
            <h2 className="text-[22px] font-semibold text-[#e5383b] mb-6">
              Enter Mobile Number
            </h2>

            <FloatingInput
              label="Enter Mobile Number"
              value={mobileNumber}
              onChange={setMobileNumber}
              type="tel"
              required
            />

            <p className="mt-4 text-[14px] text-[#666]">
              We'll send you an OTP to verify your number
            </p>
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {currentStep === 'verify-otp' && (
          <div className="flex-1 flex flex-col pt-8">
            <h2 className="text-[22px] font-semibold text-[#e5383b] mb-6">
              Verify OTP
            </h2>

            <p className="text-[14px] text-[#666] mb-6">
              Enter the 6-digit code sent to {mobileNumber}
            </p>

            <OTPInput value={otp} onChange={setOtp} />

            <button
              onClick={() => handleGetOTP()}
              className="mt-4 text-[#e5383b] text-sm font-medium text-left"
            >
              Resend OTP
            </button>

            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-[12px] text-blue-600">
                💡 <strong>Demo OTP:</strong> Use <strong>111111</strong> to login
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section - Fixed to bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 pb-6 pt-4">
        {/* Action Button */}
        {currentStep === 'enter-mobile' && (
          <button
            onClick={handleGetOTP}
            disabled={!isMobileValid || loading}
            className={`w-full h-[52px] rounded-[8px] text-[16px] font-semibold tracking-wide
              transition-all duration-200
              ${isMobileValid && !loading
                ? 'bg-[#e5383b] text-white'
                : 'bg-[#d1d5db] text-white cursor-not-allowed'}`}
          >
            {loading ? 'SENDING...' : 'GET OTP'}
          </button>
        )}

        {currentStep === 'verify-otp' && (
          <button
            onClick={handleVerifyOTP}
            disabled={!isOtpComplete || loading}
            className={`w-full h-[52px] rounded-[8px] text-[16px] font-semibold tracking-wide
              transition-all duration-200
              ${isOtpComplete && !loading
                ? 'bg-[#e5383b] text-white'
                : 'bg-[#d1d5db] text-white cursor-not-allowed'}`}
          >
            {loading ? 'VERIFYING...' : 'LOGIN'}
          </button>
        )}

        {/* Register Link */}
        <div className="mt-4 text-center">
          <span className="text-[#666] text-[14px]">
            Don't have an account ?{' '}
          </span>
          <Link href="/register" className="text-[#e5383b] text-[14px] font-medium">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
