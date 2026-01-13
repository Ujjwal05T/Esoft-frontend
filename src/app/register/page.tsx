'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import {
  registerOwner,
  verifyEmail,
  resendOtp,
  initiateETNAVerification,
  completeETNAVerification,
  uploadOwnerPhoto,
  uploadWorkshopPhoto,
  completePhotoUpload,
} from '@/services/api';

type RegistrationStep = 
  | 'personal-info'      // Step 1a: Personal details
  | 'workshop-info'      // Step 1b: Workshop details
  | 'verify-email'       // Step 2: Email OTP
  | 'pending-etna'       // Step 3a: Wait for ETNA
  | 'etna-verification'  // Step 3b: ETNA OTPs
  | 'photo-upload'       // Step 4: Photos
  | 'complete';          // Done

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('personal-info');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1a: Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    ownerName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  // Step 1b: Workshop Info
  const [workshopInfo, setWorkshopInfo] = useState({
    workshopName: '',
    address: '',
    city: '',
    tradeLicense: '',
  });

  // Step 2: Email OTP
  const [emailOtp, setEmailOtp] = useState('');

  // Step 3: ETNA Verification
  const [etnaData, setEtnaData] = useState({
    etnaMemberName: '',
    etnaMemberPhone: '',
    etnaOtp: '',
    ownerOtp: '',
  });

  // Step 4: Photo Upload
  const [ownerPhoto, setOwnerPhoto] = useState<File | null>(null);
  const [workshopPhoto, setWorkshopPhoto] = useState<File | null>(null);
  const [ownerPhotoPreview, setOwnerPhotoPreview] = useState('');
  const [workshopPhotoPreview, setWorkshopPhotoPreview] = useState('');

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Handle file selection
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'owner' | 'workshop'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'owner') {
          setOwnerPhoto(file);
          setOwnerPhotoPreview(reader.result as string);
        } else {
          setWorkshopPhoto(file);
          setWorkshopPhotoPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 1a: Validate & Continue to Workshop Info
  const handlePersonalInfoNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!personalInfo.ownerName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!personalInfo.email.trim() || !/\S+@\S+\.\S+/.test(personalInfo.email)) {
      setError('Please enter a valid email');
      return;
    }
    if (!personalInfo.phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (personalInfo.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (personalInfo.password !== personalInfo.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setCurrentStep('workshop-info');
  };

  // Step 1b: Submit Registration
  const handleWorkshopInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!workshopInfo.workshopName.trim()) {
      setError('Please enter workshop name');
      return;
    }
    if (!workshopInfo.address.trim()) {
      setError('Please enter workshop address');
      return;
    }
    if (!workshopInfo.city.trim()) {
      setError('Please enter city');
      return;
    }
    if (!workshopInfo.tradeLicense.trim()) {
      setError('Please enter trade license');
      return;
    }
    if (!agreedToTerms) {
      setError('Please agree to the Terms and Conditions');
      return;
    }

    setLoading(true);
    const result = await registerOwner({
      ownerName: personalInfo.ownerName,
      email: personalInfo.email,
      phoneNumber: personalInfo.phoneNumber,
      password: personalInfo.password,
      workshopName: workshopInfo.workshopName,
      address: workshopInfo.address,
      city: workshopInfo.city,
      tradeLicense: workshopInfo.tradeLicense,
    });
    setLoading(false);

    if (result.success) {
      setEmail(personalInfo.email);
      setSuccess('Registration successful! Please check your email for OTP.');
      setCurrentStep('verify-email');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  // Step 2: Verify Email OTP
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    const result = await verifyEmail({ email, otp: emailOtp });
    setLoading(false);

    if (result.success) {
      setSuccess('Email verified! Awaiting ETNA team verification.');
      setCurrentStep('pending-etna');
    } else {
      setError(result.error || 'Verification failed');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    const result = await resendOtp(email);
    setLoading(false);

    if (result.success) {
      setSuccess('OTP sent successfully!');
    } else {
      setError(result.error || 'Failed to resend OTP');
    }
  };

  // Step 3a: Initiate ETNA Verification
  const handleInitiateETNA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    const result = await initiateETNAVerification({
      ownerEmail: email,
      etnaMemberName: etnaData.etnaMemberName,
      etnaMemberPhone: etnaData.etnaMemberPhone,
    });
    setLoading(false);

    if (result.success) {
      setSuccess('OTP sent to your email. ETNA OTP: 111111');
      setCurrentStep('etna-verification');
    } else {
      setError(result.error || 'Failed to initiate verification');
    }
  };

  // Step 3b: Complete ETNA Verification
  const handleCompleteETNA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    const result = await completeETNAVerification({
      ownerEmail: email,
      etnaMemberName: etnaData.etnaMemberName,
      etnaMemberPhone: etnaData.etnaMemberPhone,
      etnaOtp: etnaData.etnaOtp,
      ownerOtp: etnaData.ownerOtp,
    });
    setLoading(false);

    if (result.success) {
      setSuccess('ETNA verification complete! Please upload photos.');
      setCurrentStep('photo-upload');
    } else {
      setError(result.error || 'Verification failed');
    }
  };

  // Step 4: Upload Photos and Complete
  const handleUploadPhotos = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ownerPhoto || !workshopPhoto) {
      setError('Please upload both photos');
      return;
    }

    setLoading(true);

    const ownerResult = await uploadOwnerPhoto(email, ownerPhoto);
    if (!ownerResult.success) {
      setLoading(false);
      setError(ownerResult.error || 'Failed to upload owner photo');
      return;
    }

    const workshopResult = await uploadWorkshopPhoto(email, workshopPhoto);
    if (!workshopResult.success) {
      setLoading(false);
      setError(workshopResult.error || 'Failed to upload workshop photo');
      return;
    }

    const completeResult = await completePhotoUpload(email);
    setLoading(false);

    if (completeResult.success) {
      setSuccess('Registration complete! Your account is now active.');
      setCurrentStep('complete');
    } else {
      setError(completeResult.error || 'Failed to complete registration');
    }
  };

  // Progress indicator - Updated with sub-steps
  const steps = [
    { id: 'personal-info', label: 'Personal' },
    { id: 'workshop-info', label: 'Workshop' },
    { id: 'verify-email', label: 'Email' },
    { id: 'pending-etna', label: 'ETNA' },
    { id: 'photo-upload', label: 'Photos' },
    { id: 'complete', label: 'Done' },
  ];

  const currentStepIndex = steps.findIndex(
    (s) => s.id === currentStep || (currentStep === 'etna-verification' && s.id === 'pending-etna')
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f3f4] to-white flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-[480px] mx-auto">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-block">
            <div className="text-[#e5383b] font-bold text-[40px] leading-tight">ETNA</div>
            <div className="text-[#e5383b] font-bold text-[16px] tracking-wider">SPARES</div>
          </div>
          <p className="text-[#99a2b6] text-[14px] mt-1">Workshop Owner Registration</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6 px-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                    ${index <= currentStepIndex 
                      ? 'bg-[#e5383b] text-white' 
                      : 'bg-[#d4d9e3] text-[#99a2b6]'
                    }`}
                >
                  {index < currentStepIndex ? '✓' : index + 1}
                </div>
                <span className="text-[9px] mt-1 text-[#99a2b6] text-center">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 rounded ${
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

          {/* Step 1a: Personal Information */}
          {currentStep === 'personal-info' && (
            <>
              <h1 className="text-[24px] font-bold text-[#2b2b2b] mb-1">Personal Information</h1>
              <p className="text-[#99a2b6] text-[14px] mb-6">Step 1 of 2 - Tell us about yourself</p>

              <form onSubmit={handlePersonalInfoNext} className="space-y-4">
                <AuthInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={personalInfo.ownerName}
                  onChange={(v) => setPersonalInfo({ ...personalInfo, ownerName: v })}
                  required
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  }
                />
                <AuthInput
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={personalInfo.email}
                  onChange={(v) => setPersonalInfo({ ...personalInfo, email: v })}
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
                  value={personalInfo.phoneNumber}
                  onChange={(v) => setPersonalInfo({ ...personalInfo, phoneNumber: v })}
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
                  value={personalInfo.password}
                  onChange={(v) => setPersonalInfo({ ...personalInfo, password: v })}
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
                  value={personalInfo.confirmPassword}
                  onChange={(v) => setPersonalInfo({ ...personalInfo, confirmPassword: v })}
                  required
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  }
                />

                <AuthButton type="submit">
                  Continue →
                </AuthButton>
              </form>
            </>
          )}

          {/* Step 1b: Workshop Information */}
          {currentStep === 'workshop-info' && (
            <>
              <h1 className="text-[24px] font-bold text-[#2b2b2b] mb-1">Workshop Details</h1>
              <p className="text-[#99a2b6] text-[14px] mb-6">Step 2 of 2 - Tell us about your workshop</p>

              <form onSubmit={handleWorkshopInfoSubmit} className="space-y-4">
                <AuthInput
                  label="Workshop Name"
                  placeholder="Enter workshop name"
                  value={workshopInfo.workshopName}
                  onChange={(v) => setWorkshopInfo({ ...workshopInfo, workshopName: v })}
                  required
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                    </svg>
                  }
                />
                <AuthInput
                  label="Address"
                  placeholder="Enter workshop address"
                  value={workshopInfo.address}
                  onChange={(v) => setWorkshopInfo({ ...workshopInfo, address: v })}
                  required
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                  }
                />
                <AuthInput
                  label="City"
                  placeholder="Enter city"
                  value={workshopInfo.city}
                  onChange={(v) => setWorkshopInfo({ ...workshopInfo, city: v })}
                  required
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                    </svg>
                  }
                />
                <AuthInput
                  label="Trade License Number"
                  placeholder="Enter trade license"
                  value={workshopInfo.tradeLicense}
                  onChange={(v) => setWorkshopInfo({ ...workshopInfo, tradeLicense: v })}
                  required
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                    </svg>
                  }
                />

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-1 rounded border-[#d4d9e3] text-[#e5383b]"
                  />
                  <label htmlFor="terms" className="text-[#2b2b2b] text-[14px]">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#2294f2] font-medium">
                      Terms and Conditions
                    </Link>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('personal-info')}
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

          {/* Step 2: Email Verification */}
          {currentStep === 'verify-email' && (
            <>
              <h1 className="text-[24px] font-bold text-[#2b2b2b] mb-1">Verify Email</h1>
              <p className="text-[#99a2b6] text-[14px] mb-6">
                Enter the OTP sent to {email}
              </p>

              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <AuthInput
                  label="OTP Code"
                  placeholder="Enter 6-digit OTP"
                  value={emailOtp}
                  onChange={setEmailOtp}
                  required
                />
                <AuthButton type="submit" loading={loading}>
                  Verify Email
                </AuthButton>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full text-[#2294f2] text-sm hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </form>
            </>
          )}

          {/* Step 3a: Pending ETNA Verification */}
          {currentStep === 'pending-etna' && (
            <>
              <h1 className="text-[24px] font-bold text-[#2b2b2b] mb-1">ETNA Verification</h1>
              <p className="text-[#99a2b6] text-[14px] mb-6">
                An ETNA team member will visit your workshop
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  📍 Please wait for the ETNA team to visit your workshop. Once they arrive, enter their details below.
                </p>
              </div>

              <form onSubmit={handleInitiateETNA} className="space-y-4">
                <AuthInput
                  label="ETNA Member Name"
                  placeholder="Enter ETNA team member name"
                  value={etnaData.etnaMemberName}
                  onChange={(v) => setEtnaData({ ...etnaData, etnaMemberName: v })}
                  required
                />
                <AuthInput
                  label="ETNA Member Phone"
                  placeholder="Enter ETNA team member phone"
                  value={etnaData.etnaMemberPhone}
                  onChange={(v) => setEtnaData({ ...etnaData, etnaMemberPhone: v })}
                  required
                />
                <AuthButton type="submit" loading={loading}>
                  Start Verification
                </AuthButton>
              </form>
            </>
          )}

          {/* Step 3b: ETNA OTP Verification */}
          {currentStep === 'etna-verification' && (
            <>
              <h1 className="text-[24px] font-bold text-[#2b2b2b] mb-1">Complete Verification</h1>
              <p className="text-[#99a2b6] text-[14px] mb-6">
                Enter both OTPs to complete verification
              </p>

              <form onSubmit={handleCompleteETNA} className="space-y-4">
                <AuthInput
                  label="ETNA Team OTP"
                  placeholder="Enter ETNA OTP (111111)"
                  value={etnaData.etnaOtp}
                  onChange={(v) => setEtnaData({ ...etnaData, etnaOtp: v })}
                  required
                />
                <AuthInput
                  label="Your Email OTP"
                  placeholder="Enter OTP from your email"
                  value={etnaData.ownerOtp}
                  onChange={(v) => setEtnaData({ ...etnaData, ownerOtp: v })}
                  required
                />
                <AuthButton type="submit" loading={loading}>
                  Complete Verification
                </AuthButton>
              </form>
            </>
          )}

          {/* Step 4: Photo Upload */}
          {currentStep === 'photo-upload' && (
            <>
              <h1 className="text-[24px] font-bold text-[#2b2b2b] mb-1">Upload Photos</h1>
              <p className="text-[#99a2b6] text-[14px] mb-6">
                Upload photos of yourself and your workshop
              </p>

              <form onSubmit={handleUploadPhotos} className="space-y-5">
                {/* Owner Photo */}
                <div>
                  <label className="block text-[#2b2b2b] text-[14px] font-medium mb-2">
                    Your Photo <span className="text-[#e5383b]">*</span>
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-[#e5383b] transition-colors
                      ${ownerPhotoPreview ? 'border-green-400' : 'border-[#d4d9e3]'}`}
                    onClick={() => document.getElementById('owner-photo')?.click()}
                  >
                    {ownerPhotoPreview ? (
                      <img
                        src={ownerPhotoPreview}
                        alt="Owner preview"
                        className="w-24 h-24 object-cover rounded-lg mx-auto"
                      />
                    ) : (
                      <div className="py-3">
                        <div className="text-3xl mb-1">📷</div>
                        <p className="text-[#99a2b6] text-sm">Click to upload</p>
                      </div>
                    )}
                  </div>
                  <input
                    id="owner-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, 'owner')}
                  />
                </div>

                {/* Workshop Photo */}
                <div>
                  <label className="block text-[#2b2b2b] text-[14px] font-medium mb-2">
                    Workshop Photo <span className="text-[#e5383b]">*</span>
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-[#e5383b] transition-colors
                      ${workshopPhotoPreview ? 'border-green-400' : 'border-[#d4d9e3]'}`}
                    onClick={() => document.getElementById('workshop-photo')?.click()}
                  >
                    {workshopPhotoPreview ? (
                      <img
                        src={workshopPhotoPreview}
                        alt="Workshop preview"
                        className="w-24 h-24 object-cover rounded-lg mx-auto"
                      />
                    ) : (
                      <div className="py-3">
                        <div className="text-3xl mb-1">🏭</div>
                        <p className="text-[#99a2b6] text-sm">Click to upload</p>
                      </div>
                    )}
                  </div>
                  <input
                    id="workshop-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, 'workshop')}
                  />
                </div>

                <AuthButton type="submit" loading={loading}>
                  Complete Registration
                </AuthButton>
              </form>
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
                Your account is now active. You can login to access your dashboard.
              </p>
              <Link href="/login">
                <AuthButton>Go to Login</AuthButton>
              </Link>
            </div>
          )}

          {/* Login Link */}
          {(currentStep === 'personal-info' || currentStep === 'workshop-info') && (
            <div className="mt-6 text-center">
              <p className="text-[#99a2b6] text-[14px]">
                Already have an account?{' '}
                <Link href="/login" className="text-[#e5383b] font-semibold hover:text-[#c62f32]">
                  Sign In
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
