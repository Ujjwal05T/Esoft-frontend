'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import {
  getWorkshopsByCity,
  registerStaff,
  verifyStaffPhone,
  resendStaffOtp,
  checkStaffStatus,
  WorkshopListItem,
} from '@/services/api';

type RegistrationStep = 
  | 'basic-info'       // Step 1: Name + City + Workshop Selection
  | 'contact-info'     // Step 2: Email, Phone, Password
  | 'verify-phone'     // Step 3: Phone SMS OTP
  | 'pending-approval' // Step 4: Waiting for owner
  | 'complete';        // Step 5: Done

export default function StaffRegisterPage() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('basic-info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1: Basic Info + Workshop
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    city: '',
  });

  const [workshops, setWorkshops] = useState<WorkshopListItem[]>([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number | ''>('');
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopListItem | null>(null);
  const [loadingWorkshops, setLoadingWorkshops] = useState(false);
  const [citySearched, setCitySearched] = useState(false);

  // Step 2: Contact Info
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  // Step 3: Phone OTP
  const [phoneOtp, setPhoneOtp] = useState('');

  // Fetch workshops when city changes
  const handleCityBlur = async () => {
    if (basicInfo.city.trim() && basicInfo.city.trim().length >= 2) {
      setLoadingWorkshops(true);
      setError('');
      const result = await getWorkshopsByCity(basicInfo.city.trim());
      setLoadingWorkshops(false);
      setCitySearched(true);

      if (result.success && result.data) {
        setWorkshops(result.data);
        setSelectedWorkshopId('');
        setSelectedWorkshop(null);
      } else {
        setWorkshops([]);
      }
    }
  };

  // Handle workshop selection from dropdown
  const handleWorkshopChange = (workshopId: string) => {
    const id = parseInt(workshopId);
    setSelectedWorkshopId(id || '');
    const workshop = workshops.find(w => w.id === id);
    setSelectedWorkshop(workshop || null);
  };

  // Step 1: Validate & Continue to Contact
  const handleBasicInfoNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!basicInfo.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!basicInfo.city.trim()) {
      setError('Please enter your city');
      return;
    }
    if (!selectedWorkshopId) {
      setError('Please select a workshop');
      return;
    }

    setCurrentStep('contact-info');
  };

  // Step 2: Submit Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!contactInfo.email.trim() || !/\S+@\S+\.\S+/.test(contactInfo.email)) {
      setError('Please enter a valid email');
      return;
    }
    if (!contactInfo.phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (contactInfo.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (contactInfo.password !== contactInfo.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await registerStaff({
      name: basicInfo.name,
      city: basicInfo.city,
      workshopOwnerId: selectedWorkshopId as number,
      email: contactInfo.email,
      phoneNumber: contactInfo.phoneNumber,
      password: contactInfo.password,
    });
    setLoading(false);

    if (result.success) {
      setSuccess('Registration successful! Please check your email for OTP.');
      setCurrentStep('verify-phone');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  // Step 3: Verify Phone OTP
  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneOtp.trim() || phoneOtp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    // Use email for verification (temporarily, phone verification coming soon)
    const result = await verifyStaffPhone(contactInfo.email, phoneOtp);
    setLoading(false);

    if (result.success) {
      setSuccess('Verified! Waiting for workshop owner approval.');
      setCurrentStep('pending-approval');
    } else {
      setError(result.error || 'Verification failed');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    // Use email for OTP (temporarily)
    const result = await resendStaffOtp(contactInfo.email);
    setLoading(false);

    if (result.success) {
      setSuccess('OTP sent to your email!');
    } else {
      setError(result.error || 'Failed to resend OTP');
    }
  };

  // Check Status
  const handleCheckStatus = async () => {
    setError('');
    setLoading(true);
    const result = await checkStaffStatus(contactInfo.email);
    setLoading(false);

    if (result.success && result.data) {
      if (result.data.registrationStatus === 'Approved') {
        setSuccess('Your registration has been approved! You can now login.');
        setCurrentStep('complete');
      } else if (result.data.registrationStatus === 'Rejected') {
        setError('Your registration request was rejected by the workshop owner.');
      } else {
        setSuccess('Still waiting for workshop owner approval.');
      }
    } else {
      setError(result.error || 'Failed to check status');
    }
  };

  // Progress indicator - 5 steps
  const steps = [
    { id: 'basic-info', label: 'Details' },
    { id: 'contact-info', label: 'Contact' },
    { id: 'verify-phone', label: 'Verify' },
    { id: 'pending-approval', label: 'Approval' },
    { id: 'complete', label: 'Done' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f5f3f4] to-white flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-[480px] mx-auto">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-block">
            <div className="text-[#e5383b] font-bold text-[40px] leading-tight">ETNA</div>
            <div className="text-[#e5383b] font-bold text-[16px] tracking-wider">SPARES</div>
          </div>
          <p className="text-[#99a2b6] text-[14px] mt-1">Workshop Staff Registration</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6 px-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${index <= currentStepIndex 
                      ? 'bg-[#e5383b] text-white' 
                      : 'bg-[#d4d9e3] text-[#99a2b6]'
                    }`}
                >
                  {index < currentStepIndex ? '✓' : index + 1}
                </div>
                <span className="text-[10px] mt-1 text-[#99a2b6] text-center">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded ${
                    index < currentStepIndex ? 'bg-[#e5383b]' : 'bg-[#d4d9e3]'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-[16px] shadow-lg p-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              {success}
            </div>
          )}

          {/* Step 1: Basic Info + Workshop Selection */}
          {currentStep === 'basic-info' && (
            <>
              <h1 className="text-[24px] font-bold text-[#2b2b2b] mb-1">Join a Workshop</h1>
              <p className="text-[#99a2b6] text-[14px] mb-6">Enter your details and select a workshop</p>

              <form onSubmit={handleBasicInfoNext} className="space-y-4">
                <AuthInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={basicInfo.name}
                  onChange={(v) => setBasicInfo({ ...basicInfo, name: v })}
                  required
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  }
                />
                
                <div>
                  <label className="block text-[#2b2b2b] text-[14px] font-medium mb-[8px]">
                    City <span className="text-[#e5383b]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#99a2b6]">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your city"
                      value={basicInfo.city}
                      onChange={(e) => {
                        setBasicInfo({ ...basicInfo, city: e.target.value });
                        setCitySearched(false);
                      }}
                      onBlur={handleCityBlur}
                      className="w-full h-[48px] px-[12px] pl-[40px] border rounded-[8px] text-[14px] text-[#2b2b2b] placeholder:text-[#99a2b6] focus:outline-none focus:ring-2 border-[#d4d9e3] focus:ring-[#e5383b]/20 focus:border-[#e5383b]"
                    />
                  </div>
                  <p className="text-[#99a2b6] text-[11px] mt-1">
                    Type city and click outside to find workshops
                  </p>
                </div>

                {/* Workshop Dropdown */}
                <div>
                  <label className="block text-[#2b2b2b] text-[14px] font-medium mb-[8px]">
                    Select Workshop <span className="text-[#e5383b]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#99a2b6]">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <select
                      value={selectedWorkshopId}
                      onChange={(e) => handleWorkshopChange(e.target.value)}
                      disabled={loadingWorkshops || workshops.length === 0}
                      className="w-full h-[48px] px-[12px] pl-[40px] pr-[40px] border rounded-[8px] text-[14px] text-[#2b2b2b] focus:outline-none focus:ring-2 border-[#d4d9e3] focus:ring-[#e5383b]/20 focus:border-[#e5383b] appearance-none bg-white disabled:bg-[#f5f3f4] disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {loadingWorkshops 
                          ? 'Loading workshops...' 
                          : !citySearched 
                            ? 'Enter city first'
                            : workshops.length === 0 
                              ? 'No workshops found in this city' 
                              : 'Select a workshop'}
                      </option>
                      {workshops.map((workshop) => (
                        <option key={workshop.id} value={workshop.id}>
                          {workshop.workshopName} - {workshop.ownerName}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#99a2b6] pointer-events-none">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  {selectedWorkshop && (
                    <p className="text-[#99a2b6] text-[12px] mt-2">
                      📍 {selectedWorkshop.address}
                    </p>
                  )}
                </div>

                <AuthButton type="submit" disabled={!selectedWorkshopId}>
                  Continue →
                </AuthButton>
              </form>
            </>
          )}

          {/* Step 2: Contact Info */}
          {currentStep === 'contact-info' && (
            <>
              <h1 className="text-[24px] font-bold text-[#2b2b2b] mb-1">Contact Details</h1>
              <p className="text-[#99a2b6] text-[14px] mb-6">
                Joining: <strong>{selectedWorkshop?.workshopName}</strong>
              </p>

              <form onSubmit={handleRegister} className="space-y-4">
                <AuthInput
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={contactInfo.email}
                  onChange={(v) => setContactInfo({ ...contactInfo, email: v })}
                  required
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  }
                />
                <AuthInput
                  label="Phone Number"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={contactInfo.phoneNumber}
                  onChange={(v) => setContactInfo({ ...contactInfo, phoneNumber: v })}
                  required
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                  }
                />
                <AuthInput
                  label="Password"
                  type="password"
                  placeholder="Create a password (min 6 chars)"
                  value={contactInfo.password}
                  onChange={(v) => setContactInfo({ ...contactInfo, password: v })}
                  required
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                  }
                />
                <AuthInput
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={contactInfo.confirmPassword}
                  onChange={(v) => setContactInfo({ ...contactInfo, confirmPassword: v })}
                  required
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  }
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('basic-info')}
                    className="flex-1 h-[48px] border-2 border-[#d4d9e3] rounded-[8px] text-[#2b2b2b] font-semibold hover:border-[#e5383b] transition-colors"
                  >
                    ← Back
                  </button>
                  <AuthButton type="submit" loading={loading} fullWidth={false}>
                    <span className="px-4">Register</span>
                  </AuthButton>
                </div>
              </form>
            </>
          )}

          {/* Step 3: Verify (Email OTP for now) */}
          {currentStep === 'verify-phone' && (
            <>
              <h1 className="text-[24px] font-bold text-[#2b2b2b] mb-1">Verify Email</h1>
              <p className="text-[#99a2b6] text-[14px] mb-6">
                Enter the OTP sent to {contactInfo.email}
              </p>

              <form onSubmit={handleVerifyPhone} className="space-y-4">
                <AuthInput
                  label="OTP Code"
                  placeholder="Enter 6-digit OTP"
                  value={phoneOtp}
                  onChange={setPhoneOtp}
                  required
                />
                <AuthButton type="submit" loading={loading}>
                  Verify & Continue
                </AuthButton>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full text-[#e5383b] text-sm hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </form>
            </>
          )}

          {/* Step 4: Pending Approval */}
          {currentStep === 'pending-approval' && (
            <>
              <div className="text-center py-4">
                <div className="text-5xl mb-4">⏳</div>
                <h1 className="text-[24px] font-bold text-[#2b2b2b] mb-2">
                  Waiting for Approval
                </h1>
                <p className="text-[#99a2b6] text-[14px] mb-2">
                  Your request to join <strong>{selectedWorkshop?.workshopName}</strong> has been sent.
                </p>
                <p className="text-[#99a2b6] text-[14px] mb-6">
                  The workshop owner will review and approve your request.
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                  <p className="text-red-800 text-sm">
                    📧 You will receive an email and SMS notification once your request is approved or rejected.
                  </p>
                </div>

                <AuthButton onClick={handleCheckStatus} loading={loading}>
                  Check Status
                </AuthButton>
              </div>
            </>
          )}

          {/* Step 5: Complete */}
          {currentStep === 'complete' && (
            <div className="text-center py-6">
              <div className="text-5xl mb-3">🎉</div>
              <h1 className="text-[24px] font-bold text-[#2b2b2b] mb-2">
                Registration Complete!
              </h1>
              <p className="text-[#99a2b6] text-[14px] mb-6">
                You are now part of <strong>{selectedWorkshop?.workshopName}</strong>. Login to access your dashboard.
              </p>
              <Link href="/login">
                <AuthButton>Go to Login</AuthButton>
              </Link>
            </div>
          )}

          {/* Login Link */}
          {(currentStep === 'basic-info' || currentStep === 'contact-info') && (
            <div className="mt-6 text-center">
              <p className="text-[#99a2b6] text-[14px]">
                Already have an account?{' '}
                <Link href="/login" className="text-[#e5383b] font-semibold hover:text-[#c62f32]">
                  Sign In
                </Link>
              </p>
              <p className="text-[#99a2b6] text-[14px] mt-2">
                Want to register as workshop owner?{' '}
                <Link href="/register" className="text-[#e5383b] font-semibold hover:text-[#c62f32]">
                  Register Workshop
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-[#99a2b6] text-[12px]">
            © 2026 ETNA Spares. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
