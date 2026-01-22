'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FloatingInput from '@/components/ui/FloatingInput';
import { 
  sendRegistrationOtp, 
  verifyRegistrationOtp, 
  submitWorkshopRegistration 
} from '@/services/api';

type RegistrationStep = 
  | 'enter-mobile'     // Step 1: Enter Mobile Number
  | 'verify-otp'       // Step 2: Verify OTP
  | 'workshop-details' // Step 3: Workshop Details
  | 'request-sent';    // Step 4: Success Screen


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

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('enter-mobile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Mobile Number
  const [mobileNumber, setMobileNumber] = useState('');

  // Step 2: OTP
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

  // Step 3: Workshop Details
  const [workshopDetails, setWorkshopDetails] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    aadharNumber: '',
    workshopName: '',
    address: '',
    landmark: '',
    pinCode: '',
    city: '',
  });

  // Validation checks
  const isMobileValid = mobileNumber.length >= 10;
  const isOtpComplete = otp.every(digit => digit !== '');
  const isWorkshopFormValid = 
    workshopDetails.fullName.trim() !== '' &&
    workshopDetails.contactNumber.trim() !== '' &&
    workshopDetails.email.trim() !== '' &&
    workshopDetails.aadharNumber.trim() !== '' &&
    workshopDetails.workshopName.trim() !== '' &&
    workshopDetails.address.trim() !== '' &&
    workshopDetails.pinCode.trim() !== '' &&
    workshopDetails.city.trim() !== '';

  // Handle Get OTP
  const handleGetOTP = async () => {
    if (!isMobileValid) return;
    setError('');
    setLoading(true);

    try {
      const result = await sendRegistrationOtp(mobileNumber);
      
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
      const result = await verifyRegistrationOtp(mobileNumber, otpCode);
      
      if (!result.success) {
        setError(result.error || 'Invalid OTP. Please try again.');
        return;
      }
      
      // Pre-fill contact number from mobile
      setWorkshopDetails(prev => ({ ...prev, contactNumber: mobileNumber }));
      setCurrentStep('workshop-details');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Send Request
  const handleSendRequest = async () => {
    if (!isWorkshopFormValid) return;
    setError('');
    setLoading(true);

    try {
      const result = await submitWorkshopRegistration({
        ownerName: workshopDetails.fullName,
        phoneNumber: workshopDetails.contactNumber,
        email: workshopDetails.email || undefined,
        aadhaarNumber: workshopDetails.aadharNumber,
        workshopName: workshopDetails.workshopName,
        address: workshopDetails.address,
        landmark: workshopDetails.landmark || undefined,
        pinCode: workshopDetails.pinCode,
        city: workshopDetails.city,
      });

      if (!result.success) {
        setError(result.error || 'Failed to submit registration. Please try again.');
        return;
      }
      
      // Show success screen
      setCurrentStep('request-sent');
    } catch (err) {
      setError('Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentStep === 'request-sent') {
      router.push('/login');
    } else if (currentStep === 'verify-otp') {
      setCurrentStep('enter-mobile');
      setOtp(['', '', '', '', '', '']);
    } else if (currentStep === 'workshop-details') {
      setCurrentStep('verify-otp');
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
          <h1 className="text-[20px] font-semibold text-[#e5383b]">Register</h1>
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
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {currentStep === 'verify-otp' && (
          <div className="flex-1 flex flex-col pt-8">
            <h2 className="text-[22px] font-semibold text-[#e5383b] mb-6">
              Verify OTP
            </h2>

            <OTPInput value={otp} onChange={setOtp} />

            <button
              onClick={() => handleGetOTP()}
              className="mt-4 text-[#e5383b] text-sm font-medium text-left"
            >
              Resend OTP
            </button>
          </div>
        )}

        {/* Step 3: Workshop Details */}
        {currentStep === 'workshop-details' && (
          <div className="flex-1 flex flex-col pt-8 pb-24 overflow-y-auto">
            <h2 className="text-[22px] font-semibold text-[#e5383b] mb-6">
              Workshop Details
            </h2>

            <div className="space-y-4">
              <FloatingInput
                label="Full Name (Required)"
                value={workshopDetails.fullName}
                onChange={(v) => setWorkshopDetails(prev => ({ ...prev, fullName: v }))}
                required
              />

              <FloatingInput
                label="Contact Number (Required)"
                value={workshopDetails.contactNumber}
                onChange={(v) => setWorkshopDetails(prev => ({ ...prev, contactNumber: v }))}
                type="tel"
                required
              />

              <FloatingInput
                label="Email (Required)"
                value={workshopDetails.email}
                onChange={(v) => setWorkshopDetails(prev => ({ ...prev, email: v }))}
                required
              />

              <FloatingInput
                label="Aadhar Number (Required)"
                value={workshopDetails.aadharNumber}
                onChange={(v) => setWorkshopDetails(prev => ({ ...prev, aadharNumber: v }))}
                required
              />

              <FloatingInput
                label="Workshop Name (Required)"
                value={workshopDetails.workshopName}
                onChange={(v) => setWorkshopDetails(prev => ({ ...prev, workshopName: v }))}
                required
              />

              <FloatingInput
                label="Address (Required)"
                value={workshopDetails.address}
                onChange={(v) => setWorkshopDetails(prev => ({ ...prev, address: v }))}
                required
              />

              <FloatingInput
                label="Landmark"
                value={workshopDetails.landmark}
                onChange={(v) => setWorkshopDetails(prev => ({ ...prev, landmark: v }))}
              />

              <FloatingInput
                label="PIN Code (Required)"
                value={workshopDetails.pinCode}
                onChange={(v) => setWorkshopDetails(prev => ({ ...prev, pinCode: v }))}
                required
              />

              <FloatingInput
                label="City (Required)"
                value={workshopDetails.city}
                onChange={(v) => setWorkshopDetails(prev => ({ ...prev, city: v }))}
                required
              />
            </div>
          </div>
        )}

        {/* Step 4: Request Sent Success Screen */}
        {currentStep === 'request-sent' && (
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Checkmark Icon */}
            <div className="w-[80px] h-[80px] rounded-full bg-[#e5383b] flex items-center justify-center mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-[28px] font-semibold text-[#e5383b] mb-4">
              Request Sent
            </h2>

            {/* Description */}
            <p className="text-[16px] text-[#e5383b] text-center px-6 leading-relaxed">
              Our Representative will visit your workshop to verify and get you onboarded.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Section - Fixed to bottom (hide on success screen) */}
      {currentStep !== 'request-sent' && (
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
              {loading ? 'VERIFYING...' : 'VERIFY'}
            </button>
          )}

          {currentStep === 'workshop-details' && (
            <button
              onClick={handleSendRequest}
              disabled={!isWorkshopFormValid || loading}
              className={`w-full h-[52px] rounded-[8px] text-[16px] font-semibold tracking-wide
                transition-all duration-200
                ${isWorkshopFormValid && !loading
                  ? 'bg-[#e5383b] text-white'
                  : 'bg-[#d1d5db] text-white cursor-not-allowed'}`}
            >
              {loading ? 'SENDING...' : 'SEND REQUEST'}
            </button>
          )}

          {/* Login Link */}
          <div className="mt-4 text-center">
            <span className="text-[#666] text-[14px]">
              Already have an account ?{' '}
            </span>
            <Link href="/login" className="text-[#e5383b] text-[14px] font-medium">
              Log In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
